import {HashComputationGroup, Node, digestNLevelUnsafe, setNodesAtDepth} from "@chainsafe/persistent-merkle-tree";
import { ListCompositeType } from "../../../../src/type/listComposite";
import { ArrayCompositeTreeViewDUCache } from "../../../../src/viewDU/arrayComposite";
import { ListCompositeTreeViewDU } from "../../../../src/viewDU/listComposite";
import { ValidatorNodeStructType } from "../validator";
import { ValidatorTreeViewDU } from "./validator";
import { ByteViews } from "../../../../src";

/**
 * hashtree has a MAX_SIZE of 1024 bytes = 32 chunks
 * Given a level3 of validators have 8 chunks, we can hash 4 validators at a time
 */
const PARALLEL_FACTOR = 4;
/**
 * Allocate memory once for batch hash validators.
 */
// each level 3 of validator has 8 chunks, each chunk has 32 bytes
const batchLevel3Bytes = new Uint8Array(PARALLEL_FACTOR * 8 * 32);
const level3ByteViewsArr: ByteViews[] = [];
for (let i = 0; i < PARALLEL_FACTOR; i++) {
  const uint8Array = batchLevel3Bytes.subarray(i * 8 * 32, (i + 1) * 8 * 32);
  const dataView = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
  level3ByteViewsArr.push({uint8Array, dataView});
}
// each level 4 of validator has 2 chunks for pubkey, each chunk has 32 bytes
const batchLevel4Bytes = new Uint8Array(PARALLEL_FACTOR * 2 * 32);
const level4BytesArr: Uint8Array[] = [];
for (let i = 0; i < PARALLEL_FACTOR; i++) {
  level4BytesArr.push(batchLevel4Bytes.subarray(i * 2 * 32, (i + 1) * 2 * 32));
}

export class ListValidatorTreeViewDU extends ListCompositeTreeViewDU<ValidatorNodeStructType> {
  constructor(
    readonly type: ListCompositeType<ValidatorNodeStructType>,
    protected _rootNode: Node,
    cache?: ArrayCompositeTreeViewDUCache
  ) {
    super(type, _rootNode, cache);
  }

  commit(hashComps: HashComputationGroup | null = null): void {
    const isOldRootHashed = this._rootNode.h0 !== null;
    if (this.viewsChanged.size === 0) {
      if (!isOldRootHashed && hashComps !== null) {
        // not possible to get HashComputations due to BranchNodeStruct
        this._rootNode.root;
      }
      return;
    }

    // TODO - batch: remove this type cast
    const indicesChanged = Array.from(this.viewsChanged.keys()).sort((a, b) => a - b);
    const endBatch = indicesChanged.length - (indicesChanged.length % PARALLEL_FACTOR);
    // nodesChanged is sorted by index
    const nodesChanged: {index: number; node: Node}[] = [];
    // commit every 16 validators in batch
    for (let i = 0; i < endBatch; i++) {
      const indexInBatch = i % PARALLEL_FACTOR;
      const viewIndex = indicesChanged[i];
      const viewChanged = this.viewsChanged.get(viewIndex) as ValidatorTreeViewDU;
      viewChanged.valueToMerkleBytes(level3ByteViewsArr[indexInBatch], level4BytesArr[indexInBatch]);

      if (indexInBatch === PARALLEL_FACTOR - 1) {
        // hash level 4
        const pubkeyRoots = digestNLevelUnsafe(batchLevel4Bytes, 1);
        if (pubkeyRoots.length !== PARALLEL_FACTOR * 32) {
          throw new Error(`Invalid pubkeyRoots length, expect ${PARALLEL_FACTOR * 32}, got ${pubkeyRoots.length}`);
        }
        for (let j = 0; j < PARALLEL_FACTOR; j++) {
          level3ByteViewsArr[j].uint8Array.set(pubkeyRoots.subarray(j * 32, (j + 1) * 32), 0);
        }
        const validatorRoots = digestNLevelUnsafe(batchLevel3Bytes, 3);
        if (validatorRoots.length !== PARALLEL_FACTOR * 32) {
          throw new Error(`Invalid validatorRoots length, expect ${PARALLEL_FACTOR * 32}, got ${validatorRoots.length}`);
        }
        // commit all validators in this batch
        for (let j = PARALLEL_FACTOR - 1; j >= 0; j--) {
          const viewIndex = indicesChanged[i - j];
          const indexInBatch = (i - j) % PARALLEL_FACTOR;
          const validatorRoot = validatorRoots.subarray(indexInBatch * 32, (indexInBatch + 1) * 32);
          const viewChanged = this.viewsChanged.get(viewIndex) as ValidatorTreeViewDU;
          viewChanged.commitToRoot(validatorRoot);
          nodesChanged.push({index: viewIndex, node: viewChanged.node});
          // Set new node in nodes array to ensure data represented in the tree and fast nodes access is equal
          this.nodes[viewIndex] = viewChanged.node;
        }
      }
    }

    // commit the remaining validators, we can do in batch too but don't want to create new Uint8Array views
    // it's not much different to commit one by one
    for (let i = endBatch; i < indicesChanged.length; i++) {
      const viewIndex = indicesChanged[i];
      const viewChanged = this.viewsChanged.get(viewIndex) as ValidatorTreeViewDU;
      viewChanged.commit();
      nodesChanged.push({index: viewIndex, node: viewChanged.node});
      // Set new node in nodes array to ensure data represented in the tree and fast nodes access is equal
      this.nodes[viewIndex] = viewChanged.node;
    }

    // do the remaining commit step the same to parent (ArrayCompositeTreeViewDU)
    const indexes = nodesChanged.map((entry) => entry.index);
    const nodes = nodesChanged.map((entry) => entry.node);
    const chunksNode = this.type.tree_getChunksNode(this._rootNode);
    const hashCompsThis =
      hashComps != null && isOldRootHashed
        ? {
            byLevel: hashComps.byLevel,
            offset: hashComps.offset + this.type.tree_chunksNodeOffset(),
          }
        : null;
    const newChunksNode = setNodesAtDepth(chunksNode, this.type.chunkDepth, indexes, nodes, hashCompsThis);

    this._rootNode = this.type.tree_setChunksNode(
      this._rootNode,
      newChunksNode,
      this.dirtyLength ? this._length : null,
      hashComps
    );

    if (!isOldRootHashed && hashComps !== null) {
      // should never happen, handle just in case
      // not possible to get HashComputations due to BranchNodeStruct
      this._rootNode.root;
    }

    this.viewsChanged.clear();
    this.dirtyLength = false;
  }
}
