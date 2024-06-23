import { HashObject, byteArrayToHashObject, hashObjectToByteArray } from "@chainsafe/as-sha256";
import { BranchNodeStruct } from "../../../../src/branchNodeStruct";
import { ContainerTypeGeneric } from "../../../../src/view/container";
import { TreeViewDU } from "../../../../src/viewDU/abstract";
import { ValidatorType } from "../validator";
import {
  Node,
  BranchNode,
  HashComputationGroup,
} from "@chainsafe/persistent-merkle-tree";
import { ByteViews } from "../../../../src/type/abstract";
type Validator = {
  pubkey: Uint8Array;
  withdrawalCredentials: Uint8Array;
  effectiveBalance: number;
  slashed: boolean;
  activationEligibilityEpoch: number;
  activationEpoch: number;
  exitEpoch: number;
  withdrawableEpoch: number;
};

const numFields = 8;
const NUMBER_2_POW_32 = 2 ** 32;
/*
 * Below constants are respective to their ssz type in `ValidatorType`.
 */
const UINT32_SIZE = 4;
const CHUNK_SIZE = 32;

/**
 * A specific ViewDU for validator designed to be efficient to batch hash and efficient to create tree
 * because it uses prepopulated nodes to do that.
 */
export class ValidatorTreeViewDU extends TreeViewDU<ContainerTypeGeneric<typeof ValidatorType>> {
  protected valueChanged: Validator | null = null;
  protected _rootNode: BranchNodeStruct<Validator>;

  constructor(readonly type: ContainerTypeGeneric<typeof ValidatorType>, node: Node) {
    super();
    this._rootNode = node as BranchNodeStruct<Validator>;
  }

  get node(): Node {
    return this._rootNode;
  }

  get cache(): void {
    return;
  }

  commit(hashComps: HashComputationGroup | null = null): void {
    if (this.valueChanged !== null) {
      // TODO - batch: throw error when testing, should be committed by parent
      const value = this.valueChanged;
      this.valueChanged = null;
      this._rootNode = this.type.value_toTree(value) as BranchNodeStruct<Validator>;
    }

    if (hashComps !== null) {
      this._rootNode.getHashComputations(hashComps);
    }
  }

  get pubkey(): Uint8Array {
    return (this.valueChanged || this._rootNode.value).pubkey;
  }

  set pubkey(value: Uint8Array) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.pubkey = value;
  }

  get withdrawalCredentials(): Uint8Array {
    return (this.valueChanged || this._rootNode.value).withdrawalCredentials;
  }

  set withdrawalCredentials(value: Uint8Array) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.withdrawalCredentials = value;
  }

  get effectiveBalance(): number {
    return (this.valueChanged || this._rootNode.value).effectiveBalance;
  }

  set effectiveBalance(value: number) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.effectiveBalance = value;
  }

  get slashed(): boolean {
    return (this.valueChanged || this._rootNode.value).slashed;
  }

  set slashed(value: boolean) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.slashed = value;
  }

  get activationEligibilityEpoch(): number {
    return (this.valueChanged || this._rootNode.value).activationEligibilityEpoch;
  }

  set activationEligibilityEpoch(value: number) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.activationEligibilityEpoch = value;
  }

  get activationEpoch(): number {
    return (this.valueChanged || this._rootNode.value).activationEpoch;
  }

  set activationEpoch(value: number) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.activationEpoch = value;
  }

  get exitEpoch(): number {
    return (this.valueChanged || this._rootNode.value).exitEpoch;
  }

  set exitEpoch(value: number) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.exitEpoch = value;
  }

  get withdrawableEpoch(): number {
    return (this.valueChanged || this._rootNode.value).withdrawableEpoch;
  }

  set withdrawableEpoch(value: number) {
    if (this.valueChanged === null) {
      this.valueChanged = this.type.clone(this._rootNode.value);
    }

    this.valueChanged.withdrawableEpoch = value;
  }

  /**
   * This is called by parent to populate nodes with valueChanged.
   * Parent will then hash the nodes to get the root hash, then call commitToHashObject to update the root hash.
   * Note that node[0] should be a branch node due to pubkey of 48 bytes.
   */
  valueToTree(nodes: Node[]): void {
    if (nodes.length !== numFields) {
      throw new Error(`Expected ${numFields} fields, got ${nodes.length}`);
    }

    // in case pushing a new validator to array, valueChanged could be null
    const value = this.valueChanged ?? this._rootNode.value;
    validatorToTree(nodes, value);
  }

  /**
   * Write to level3 and level4 bytes to compute merkle root. Note that this is to compute
   * merkle root and it's different from serialization (which is more compressed).
   * pub0 + pub1 are at level4, they will be hashed to 1st chunked of level 3
   * then use 8 chunks of level 3 to compute the root hash.
   *           reserved     withdr     eff        sla        actElig    act        exit       with
   * level 3 |----------|----------|----------|----------|----------|----------|----------|----------|
   *
   *            pub0       pub1
   * level4  |----------|----------|
   *
   */
  valueToMerkleBytes(level3: ByteViews, level4: Uint8Array): void {
    if (level3.uint8Array.byteLength !== 8 * CHUNK_SIZE) {
      throw Error(`Expected level3 to be 8 * CHUNK_SIZE bytes, got ${level3.uint8Array.byteLength}`);
    }
    if (level4.length !== 2 * CHUNK_SIZE) {
      throw Error(`Expected level4 to be 2 * CHUNK_SIZE bytes, got ${level4.length}`);
    }
    // in case pushing a new validator to array, valueChanged could be null
    const value = this.valueChanged ?? this._rootNode.value;
    validatorToMerkleBytes(level3, level4, value);
  }

  /**
   * The HashObject is computed by parent so that we don't need to create a tree from scratch.
   */
  commitToHashObject(ho: HashObject): void {
    const oldRoot = this._rootNode;
    // in case pushing a new validator to array, valueChanged could be null
    const value = this.valueChanged ?? this._rootNode.value;
    this._rootNode = new BranchNodeStruct(oldRoot["valueToNode"], value);
    this._rootNode.applyHash(ho);
    this.valueChanged = null;
  }

  protected clearCache(): void {
    this.valueChanged = null;
  }

  get name(): string {
    return this.type.typeName;
  }
}

  /**
   * Write to level3 and level4 bytes to compute merkle root. Note that this is to compute
   * merkle root and it's different from serialization (which is more compressed).
   * pub0 + pub1 are at level4, they will be hashed to 1st chunked of level 3
   * then use 8 chunks of level 3 to compute the root hash.
   *           reserved     withdr     eff        sla        actElig    act        exit       with
   * level 3 |----------|----------|----------|----------|----------|----------|----------|----------|
   *
   *            pub0       pub1
   * level4  |----------|----------|
   *
   */
export function validatorToMerkleBytes(level3: ByteViews, level4: Uint8Array, value: Validator): void {
  const { pubkey, withdrawalCredentials, effectiveBalance, slashed, activationEligibilityEpoch, activationEpoch, exitEpoch, withdrawableEpoch } = value;
  const { uint8Array: outputLevel3, dataView } = level3;

  // pubkey = 48 bytes which is 2 * CHUNK_SIZE
  level4.set(pubkey, 0);
  let offset = CHUNK_SIZE;
  outputLevel3.set(withdrawalCredentials, offset);
  offset += CHUNK_SIZE;
  // effectiveBalance is UintNum64
  dataView.setUint32(offset, effectiveBalance & 0xffffffff, true);
  dataView.setUint32(offset + 4, (effectiveBalance / NUMBER_2_POW_32) & 0xffffffff, true);

  offset += CHUNK_SIZE;
  // output[offset] = validator.slashed ? 1 : 0;
  dataView.setUint32(offset, slashed ? 1 : 0, true);
  offset += CHUNK_SIZE;
  writeEpochInf(dataView, offset, activationEligibilityEpoch);
  offset += CHUNK_SIZE;
  writeEpochInf(dataView, offset, activationEpoch);
  offset += CHUNK_SIZE;
  writeEpochInf(dataView, offset, exitEpoch);
  offset += CHUNK_SIZE;
  writeEpochInf(dataView, offset, withdrawableEpoch);
}

/**
 * Fast way to write value to tree. Input nodes are at level 3 as below:
 * level
 * 0                                            validator root
 *                               /                                         \
 * 1                        10                                                11
 *                   /                 \                                 /             \
 * 2            20                          21                     22                    23
 *           /       \                  /       \             /       \             /         \
 * 3      pub         with         eff         sla        act         act         exit        with
 *      /     \
 * 4 pub0      pub1
 *
 * After this function all nodes at level 4 and level 3 (except for pubkey) are populated
 * We can then use HashComputation to compute the root hash in batch at state.validators ViewDU
 * // TODO - batch: is it more performant to convert to Uint8Array and hash in batch?
 */
export function validatorToTree(nodes: Node[], value: Validator): void {
  const { pubkey, withdrawalCredentials, effectiveBalance, slashed, activationEligibilityEpoch, activationEpoch, exitEpoch, withdrawableEpoch } = value;

  // pubkey 48 bytes = pub0 + pub1
  const node0 = nodes[0];
  if (node0.isLeaf()) {
    throw Error("Expected pubkeyNode to be a BranchNode");
  }
  const pubkeyNode = node0 as BranchNode;
  pubkeyNode.left.applyHash(byteArrayToHashObject(pubkey.subarray(0, 32)));
  pubkeyNode.right.applyHash(byteArrayToHashObject(pubkey.subarray(32, 48)));
  // withdrawalCredentials
  nodes[1].applyHash(byteArrayToHashObject(withdrawalCredentials));
  // effectiveBalance, 8 bytes = h0 + h1
  writeEpochInfToNode(effectiveBalance, nodes[2]);
  // slashed
  nodes[3].h0 = slashed ? 1 : 0;
  // activationEligibilityEpoch, 8 bytes = h0 + h1
  writeEpochInfToNode(activationEligibilityEpoch, nodes[4]);
  // activationEpoch, 8 bytes = h0 + h1
  writeEpochInfToNode(activationEpoch, nodes[5]);
  // exitEpoch, 8 bytes = h0 + h1
  writeEpochInfToNode(exitEpoch, nodes[6]);
  // withdrawableEpoch, 8 bytes = h0 + h1
  writeEpochInfToNode(withdrawableEpoch, nodes[7]);
}

/**
 * An epoch is a 64-bit number, split into two 32-bit numbers and populate to h0 and h1.
 */
function writeEpochInfToNode(epoch: number, node: Node): void {
  if (epoch === Infinity) {
    node.h0 = 0xffffffff;
    node.h1 = 0xffffffff;
  } else {
    node.h0 = epoch & 0xffffffff;
    node.h1 = (epoch / NUMBER_2_POW_32) & 0xffffffff;
  }
}

/**
 * Write an epoch to DataView at offset.
 */
function writeEpochInf(dataView: DataView, offset: number, value: number): void {
  if (value === Infinity) {
    dataView.setUint32(offset, 0xffffffff, true);
    offset += UINT32_SIZE;
    dataView.setUint32(offset, 0xffffffff, true);
    offset += UINT32_SIZE;
  } else {
    dataView.setUint32(offset, value & 0xffffffff, true);
    offset += UINT32_SIZE;
    dataView.setUint32(offset, (value / NUMBER_2_POW_32) & 0xffffffff, true);
    offset += UINT32_SIZE;
  }
}