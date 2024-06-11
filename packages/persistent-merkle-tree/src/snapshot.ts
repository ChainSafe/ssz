import {
    DEPOSIT_CONTRACT_TREE_DEPTH,
    Hash32,
    Root,
    uint64,
    BLSPubkey,
    Bytes32,
    Gwei,
    BLSSignature,
    DepositData,
    Eth1Data,
    sha256,
    toLeBytes,
    zerohashes
} from './utils';

// import { getEth1DataForBlocks }  from '../../eth1/utils/eth1Data';
// import { ExecutionBlock } from '../../execution/engine/mock';


 type Uint64 = number;


class DepositTreeSnapshot {
    finalized: Hash32[];
    depositRoot: Hash32;
    depositCount: Uint64;
    executionBlockHash: Hash32;
    executionBlockHeight: Uint64;

    constructor(finalized: Hash32[], depositRoot: Hash32, depositCount: Uint64, executionBlockHash: Hash32, executionBlockHeight: Uint64) {
        this.finalized = finalized;
        this.depositRoot = depositRoot;
        this.depositCount = depositCount;
        this.executionBlockHash = executionBlockHash;
        this.executionBlockHeight = executionBlockHeight;
    }

    calculateRoot(): Buffer {
        let size = this.depositCount;
        let index = this.finalized.length;
        let root = zerohashes[0];
        for (let level = 0; level < DEPOSIT_CONTRACT_TREE_DEPTH; level++) {
            if ((size & 1) === 1) {
                index -= 1;
                root = sha256(Buffer.concat([this.finalized[index], root]));
            } else {
                root = sha256(Buffer.concat([root, zerohashes[level]]));
            }
            size >>= 1;
        }
        return sha256(Buffer.concat([root, Buffer.from(size.toString())]));
    }
    

    static fromTreeParts(finalized: Hash32[], depositCount: Uint64, executionBlock: [Hash32, Uint64]): DepositTreeSnapshot {
        const snapshot = new DepositTreeSnapshot(finalized, zerohashes[0], depositCount, executionBlock[0], executionBlock[1]);
        snapshot.depositRoot = snapshot.calculateRoot();
        return snapshot;
    }
}

export class DepositTree {
    tree: MerkleTree;
    mixInLength: number;
    finalizedExecutionBlock: [Hash32, Uint64] | null;

    constructor(tree: MerkleTree, mixInLength: number, finalizedExecutionBlock: [Hash32, Uint64] | null) {
        this.tree = tree;
        this.mixInLength = mixInLength;
        this.finalizedExecutionBlock = finalizedExecutionBlock;
    }

    static new(): DepositTree {
        const merkle = MerkleTree.create([], DEPOSIT_CONTRACT_TREE_DEPTH);
        return new DepositTree(merkle, 0, null);
    }

    getSnapshot(): DepositTreeSnapshot {
        if (this.finalizedExecutionBlock === null) {
            throw new Error("Finalized execution block is not set");
        }
        const finalized: Hash32[] = [];
        const depositCount = this.tree.getFinalized(finalized);
        return DepositTreeSnapshot.fromTreeParts(finalized, depositCount, this.finalizedExecutionBlock);
    }

    static fromSnapshot(snapshot: DepositTreeSnapshot): DepositTree {
        if (snapshot.depositRoot !== snapshot.calculateRoot()) {
            throw new Error("Invalid snapshot: calculated root does not match");
        }
        const finalizedExecutionBlock: [Hash32, Uint64] = [snapshot.executionBlockHash, snapshot.executionBlockHeight];
        const tree = MerkleTree.fromSnapshotParts(snapshot.finalized, snapshot.depositCount, DEPOSIT_CONTRACT_TREE_DEPTH);
        return new DepositTree(tree, snapshot.depositCount, finalizedExecutionBlock);
    }

    finalize(eth1Data: Eth1Data, executionBlockHeight: Uint64) {
        this.finalizedExecutionBlock = [eth1Data.block_hash, executionBlockHeight];
        this.tree.finalize(eth1Data.deposit_count, DEPOSIT_CONTRACT_TREE_DEPTH);
    }

    getProof(index: number): [Hash32, Hash32[]] {
        if (this.mixInLength <= 0) {
            throw new Error("Mix-in length must be greater than zero");
        }
        if (index <= this.tree.getFinalized([]) - 1) {
            throw new Error("Index must be greater than finalized deposit index");
        }
        const [leaf, proof] = this.tree.generateProof(index, DEPOSIT_CONTRACT_TREE_DEPTH);
        proof.push(toLeBytes(this.mixInLength));
        return [leaf, proof];
    }

    getRoot(): Hash32 {
        return sha256(Buffer.concat([this.tree.getRoot(),toLeBytes(this.mixInLength)]));
    }

    pushLeaf(leaf: Hash32) {
        this.mixInLength += 1;
        this.tree = this.tree.pushLeaf(leaf, DEPOSIT_CONTRACT_TREE_DEPTH);
    }
}

abstract class MerkleTree {
    abstract getRoot(): Hash32;
    abstract isFull(): boolean;
    abstract pushLeaf(leaf: Hash32, level: number): MerkleTree;
    abstract finalize(depositsToFinalize: number, level: number): MerkleTree;
    abstract getFinalized(result: Hash32[]): number;

    static create(leaves: Hash32[], depth: number): MerkleTree {
        if (leaves.length === 0) {
            return new Zero(depth);
        }
        if (depth === 0) {
            return new Leaf(leaves[0]);
        }
        const split = Math.min(2 ** (depth - 1), leaves.length);
        const left = MerkleTree.create(leaves.slice(0, split), depth - 1);
        const right = MerkleTree.create(leaves.slice(split), depth - 1);
        return new Node(left, right);
    }

    static fromSnapshotParts(finalized: Hash32[], deposits: number, level: number): MerkleTree {
        if (finalized.length === 0 || deposits === 0) {
            return new Zero(level);
        }
        if (deposits === 2 ** level) {
            return new Finalized(deposits, finalized[0]);
        }
        const leftSubtree = 2 ** (level - 1);
        if (deposits <= leftSubtree) {
            const left = MerkleTree.fromSnapshotParts(finalized, deposits, level - 1);
            const right = new Zero(level - 1);
            return new Node(left, right);
        } else {
            const left = new Finalized(leftSubtree, finalized[0]);
            const right = MerkleTree.fromSnapshotParts(finalized.slice(1), deposits - leftSubtree, level - 1);
            return new Node(left, right);
        }
    }

    generateProof(index: number, depth: number): [Hash32, Hash32[]] {
        const proof: Hash32[] = [];
        let node: MerkleTree = this;
        while (depth > 0) {
            const ithBit = (index >> (depth - 1)) & 0x1;
            if (node instanceof Node) {
                if (ithBit === 1) {
                    proof.push(node.left.getRoot());
                    node = node.right;
                } else {
                    proof.push(node.right.getRoot());
                    node = node.left;
                }
            } else {
                throw new Error("Expected node to be an instance of Node");
            }
            depth -= 1;
        }
        proof.reverse();
        return [node.getRoot(), proof];
    }
    
}

class Finalized extends MerkleTree {
    depositCount: number;
    hash: Hash32;

    constructor(depositCount: number, hash: Hash32) {
        super();
        this.depositCount = depositCount;
        this.hash = hash;
    }

    getRoot(): Hash32 {
        return this.hash;
    }

    isFull(): boolean {
        return true;
    }

    pushLeaf(leaf: Hash32, level: number): MerkleTree {
        // Since this tree is already finalized, pushing a leaf is not applicable.
        // You can either throw an error or return this instance.
        throw new Error("Cannot push leaf to a finalized tree.");
    }

    finalize(depositsToFinalize: number, level: number): MerkleTree {
        return this;
    }

    getFinalized(result: Hash32[]): number {
        result.push(this.hash);
        return this.depositCount;
    }
}


class Leaf extends MerkleTree {
    hash: Hash32;

    constructor(hash: Hash32) {
        super();
        this.hash = hash;
    }

    getRoot(): Hash32 {
        return this.hash;
    }

    isFull(): boolean {
        return true;
    }

    pushLeaf(leaf: Hash32, level: number): MerkleTree {
        // Since this is a leaf node, pushing another leaf is not applicable.
        // You can either throw an error or return this instance.
        throw new Error("Cannot push leaf to a leaf node.");
    }

    finalize(depositsToFinalize: number, level: number): MerkleTree {
        return new Finalized(1, this.hash);
    }

    getFinalized(result: Hash32[]): number {
        return 0;
    }
}


class Node extends MerkleTree {
    left: MerkleTree;
    right: MerkleTree;

    constructor(left: MerkleTree, right: MerkleTree) {
        super();
        this.left = left;
        this.right = right;
    }

    getRoot(): Hash32 {
        return sha256(Buffer.concat([this.left.getRoot() , this.right.getRoot()]));
    }

    isFull(): boolean {
        return this.right.isFull();
    }

    pushLeaf(leaf: Hash32, level: number): MerkleTree {
        if (!this.left.isFull()) {
            this.left = this.left.pushLeaf(leaf, level - 1);
        } else {
            this.right = this.right.pushLeaf(leaf, level - 1);
        }
        return this;
    }

    finalize(depositsToFinalize: number, level: number): MerkleTree {
        const deposits = 2 ** level;
        if (deposits <= depositsToFinalize) {
            return new Finalized(deposits, this.getRoot());
        }
        this.left = this.left.finalize(depositsToFinalize, level - 1);
        if (depositsToFinalize > deposits / 2) {
            const remaining = depositsToFinalize - deposits / 2;
            this.right = this.right.finalize(remaining, level - 1);
        }
        return this;
    }

    getFinalized(result: Hash32[]): number {
        return this.left.getFinalized(result) + this.right.getFinalized(result);
    }
}

class Zero extends MerkleTree {
    n: number;

    constructor(n: number) {
        super();
        this.n = n;
    }

    getRoot(): Hash32 {
        if (this.n === DEPOSIT_CONTRACT_TREE_DEPTH) {
            return sha256(Buffer.concat([zerohashes[this.n - 1], zerohashes[this.n - 1]]));
        }
        return zerohashes[this.n];
    }

    isFull(): boolean {
        return false;
    }

    pushLeaf(leaf: Hash32, level: number): MerkleTree {
        return MerkleTree.create([leaf], level);
    }

    finalize(depositsToFinalize: number, level: number): MerkleTree {
        return this;
    }

    getFinalized(result: Hash32[]): number {
        return 0;
    }
}
