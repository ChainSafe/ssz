import {BranchNode, HashComputation, HashComputationGroup, LeafNode, Node, arrayAtIndex, executeHashComputations, getHashComputations, setNodesAtDepth} from "@chainsafe/persistent-merkle-tree";
import { ListCompositeType } from "../../../../src/type/listComposite";
import { ArrayCompositeTreeViewDUCache } from "../../../../src/viewDU/arrayComposite";
import { ListCompositeTreeViewDU } from "../../../../src/viewDU/listComposite";
import { ValidatorNodeStructType } from "../validator";
import { ValidatorTreeViewDU } from "./validator";

/**
 * Best SIMD implementation is in 512 bits = 64 bytes
 * If not, hashtree will make a loop inside
 * Given sha256 operates on a block of 4 bytes, we can hash 16 inputs at once
 * Each input is 64 bytes
 * TODO - batch: is 8 better?
 */
const PARALLEL_FACTOR = 16;

export class ListValidatorTreeViewDU extends ListCompositeTreeViewDU<ValidatorNodeStructType> {
  private batchHashComputations: Array<HashComputation[]>;
  private singleHashComputations: Array<HashComputation[]>;
  private batchHashRootNodes: Array<Node>;
  private singleHashRootNode: Node;
  private batchLevel3Nodes: Array<Node[]>;
  private singleLevel3Nodes: Node[];

  constructor(
    readonly type: ListCompositeType<ValidatorNodeStructType>,
    protected _rootNode: Node,
    cache?: ArrayCompositeTreeViewDUCache
  ) {
    super(type, _rootNode, cache);

    this.batchHashComputations = [];
    this.singleHashComputations = [];
    this.batchHashRootNodes = [];
    this.batchLevel3Nodes = [];
    this.singleLevel3Nodes = [];
    for (let i = 0; i < PARALLEL_FACTOR; i++) {
      // level 3, validator.pubkey
      const pubkey0 = LeafNode.fromZero();
      const pubkey1 = LeafNode.fromZero();
      const pubkey = new BranchNode(pubkey0, pubkey1);
      let hc: HashComputation = {src0: pubkey0, src1: pubkey1, dest: pubkey};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 3).push(hc);
        this.singleLevel3Nodes.push(pubkey);
      }
      arrayAtIndex(this.batchHashComputations, 3).push(hc);
      arrayAtIndex(this.batchLevel3Nodes, i).push(pubkey);

      // level 2
      const withdrawalCredential = LeafNode.fromZero();
      const node20 = new BranchNode(pubkey, withdrawalCredential);
      hc = {src0: pubkey, src1: withdrawalCredential, dest: node20};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 2).push(hc);
        this.singleLevel3Nodes.push(withdrawalCredential);
      }
      arrayAtIndex(this.batchHashComputations, 2).push(hc);
      arrayAtIndex(this.batchLevel3Nodes, i).push(withdrawalCredential);
      // effectiveBalance, slashed
      const effectiveBalance = LeafNode.fromZero();
      const slashed = LeafNode.fromZero();
      const node21 = new BranchNode(effectiveBalance, slashed);
      hc = {src0: effectiveBalance, src1: slashed, dest: node21};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 2).push(hc);
        this.singleLevel3Nodes.push(effectiveBalance);
        this.singleLevel3Nodes.push(slashed);
      }
      arrayAtIndex(this.batchHashComputations, 2).push(hc);
      arrayAtIndex(this.batchLevel3Nodes, i).push(effectiveBalance);
      arrayAtIndex(this.batchLevel3Nodes, i).push(slashed);
      // activationEligibilityEpoch, activationEpoch
      const activationEligibilityEpoch = LeafNode.fromZero();
      const activationEpoch = LeafNode.fromZero();
      const node22 = new BranchNode(activationEligibilityEpoch, activationEpoch);
      hc = {src0: activationEligibilityEpoch, src1: activationEpoch, dest: node22};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 2).push(hc);
        this.singleLevel3Nodes.push(activationEligibilityEpoch);
        this.singleLevel3Nodes.push(activationEpoch);
      }
      arrayAtIndex(this.batchHashComputations, 2).push(hc);
      arrayAtIndex(this.batchLevel3Nodes, i).push(activationEligibilityEpoch);
      arrayAtIndex(this.batchLevel3Nodes, i).push(activationEpoch);
      // exitEpoch, withdrawableEpoch
      const exitEpoch = LeafNode.fromZero();
      const withdrawableEpoch = LeafNode.fromZero();
      const node23 = new BranchNode(exitEpoch, withdrawableEpoch);
      hc = {src0: exitEpoch, src1: withdrawableEpoch, dest: node23};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 2).push(hc);
        this.singleLevel3Nodes.push(exitEpoch);
        this.singleLevel3Nodes.push(withdrawableEpoch);
      }
      arrayAtIndex(this.batchHashComputations, 2).push(hc);
      arrayAtIndex(this.batchLevel3Nodes, i).push(exitEpoch);
      arrayAtIndex(this.batchLevel3Nodes, i).push(withdrawableEpoch);

      // level 1
      const node10 = new BranchNode(node20, node21);
      hc = {src0: node20, src1: node21, dest: node10};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 1).push(hc);
      }
      arrayAtIndex(this.batchHashComputations, 1).push(hc);
      const node11 = new BranchNode(node22, node23);
      hc = {src0: node22, src1: node23, dest: node11};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 1).push(hc);
      }
      arrayAtIndex(this.batchHashComputations, 1).push(hc);

      // level 0
      const node00 = new BranchNode(node10, node11);
      hc = {src0: node10, src1: node11, dest: node00};
      if (i === 0) {
        arrayAtIndex(this.singleHashComputations, 0).push(hc);
        // this.singleHashRootNode = node00;
      }
      arrayAtIndex(this.batchHashComputations, 0).push(hc);
      this.batchHashRootNodes.push(node00);
    }

    this.singleHashRootNode = this.batchHashRootNodes[0];
  }

  commit(hashComps: HashComputationGroup | null = null): void {
    const isOldRootHashed = this._rootNode.h0 !== null;
    if (this.viewsChanged.size === 0) {
      if (!isOldRootHashed && hashComps !== null) {
        getHashComputations(this._rootNode, hashComps.offset, hashComps.byLevel);
      }
      return;
    }

    // TODO - batch: remove this type cast
    const viewsChanged = Array.from(this.viewsChanged.values()) as ValidatorTreeViewDU[];
    const endBatch = viewsChanged.length - (viewsChanged.length % PARALLEL_FACTOR);
    // nodesChanged is sorted by index
    const nodesChanged: {index: number; node: Node}[] = [];
    // commit every 16 validators in batch
    for (let i = 0; i < endBatch; i++) {
      const indexInBatch = i % PARALLEL_FACTOR;
      viewsChanged[i].valueToTree(this.batchLevel3Nodes[indexInBatch]);
      if (indexInBatch === PARALLEL_FACTOR - 1) {
        executeHashComputations(this.batchHashComputations);
        // commit all validators in this batch
        for (let j = PARALLEL_FACTOR - 1; j >= 0; j--) {
          viewsChanged[i - j].commitToHashObject(this.batchHashRootNodes[PARALLEL_FACTOR - 1 - j]);
          nodesChanged.push({index: i - j, node: viewsChanged[i - j].node});
        }
      }
    }

    // commit the remaining validators one by one
    for (let i = endBatch; i < viewsChanged.length; i++) {
      viewsChanged[i].valueToTree(this.singleLevel3Nodes);
      executeHashComputations(this.singleHashComputations);
      viewsChanged[i].commitToHashObject(this.singleHashRootNode);
      nodesChanged.push({index: i, node: viewsChanged[i].node});
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
      getHashComputations(this._rootNode, hashComps.offset, hashComps.byLevel);
    }

    this.viewsChanged.clear();
    this.dirtyLength = false;
  }
}
