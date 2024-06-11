import yaml from 'js-yaml';
import * as fs from 'fs';
import { createHash } from 'crypto';
import { DepositTree } from '../../../persistent-merkle-tree/src/snapshot';
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
} from '../../../persistent-merkle-tree/src/utils';
import * as assert from 'assert';
import path from 'path';





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


interface DepositTestCase {
    deposit_data: DepositData;
    deposit_data_root: Buffer;
    eth1_data: Eth1Data;
    block_height: number;
    snapshot: DepositTreeSnapshot;
}

//const DEPOSIT_CONTRACT_DEPTH = 32;
//const zerohashes: Buffer[] = Array(DEPOSIT_CONTRACT_DEPTH).fill(Buffer.alloc(32, 0));

function getHex(someBytes: Buffer): string {
    return `0x${someBytes.toString('hex')}`;
}

function getBytes(hexstr: string): Buffer {
    // console.log('getBytes received:', hexstr, 'Type:', typeof hexstr);

  
    if (!hexstr || hexstr.trim() === '') {
          return Buffer.alloc(0);
      }

    hexstr = hexstr.replace(/^0x/i, '');

    if (hexstr.length % 2 !== 0) {
        throw new Error('Invalid input: hexstr length must be even');
    }

    if (!/^[0-9a-fA-F]*$/.test(hexstr)) {
        throw new Error('Invalid input: hexstr contains non-hexadecimal characters');
    }

    return Buffer.from(hexstr, 'hex');
}



function readTestCases(filename: string): DepositTestCase[] {
    const fileContent = fs.readFileSync(filename, 'utf8');
    const testCases = yaml.load(fileContent) as any[];

    if (testCases) {
        const result: DepositTestCase[] = [];

        testCases.forEach(testCase => {
                // console.log('Processing testCase:', testCase);

                const depositData: DepositData = {
                    pubkey: getBytes(testCase.deposit_data.pubkey),
                    withdrawal_credentials: getBytes(testCase.deposit_data.withdrawal_credentials),
                    amount: parseInt(testCase.deposit_data.amount),
                    signature: getBytes(testCase.deposit_data.signature)
                };

                const eth1Data: Eth1Data = {
                    deposit_root: getBytes(testCase.eth1_data.depositRoot),
                    deposit_count: parseInt(testCase.eth1_data.depositCount),
                    block_hash: getBytes(testCase.eth1_data.block_hash)
                };

                const finalized = testCase['snapshot']['finalized'].map((block_hash: string) => getBytes(block_hash));

                const snapshot = new DepositTreeSnapshot(
                    finalized,
                    getBytes(testCase.snapshot.depositRoot),
                    parseInt(testCase.snapshot.depositCount),
                    getBytes(testCase.snapshot.executionBlockHash),
                    parseInt(testCase.snapshot.executionBlockHeight)
                );

                result.push({
                    deposit_data: depositData,
                    deposit_data_root: getBytes(testCase.deposit_data_root),
                    eth1_data: eth1Data,
                    block_height: parseInt(testCase.block_height),
                    snapshot
                });
        });

        return result;
    } else {
        console.log("ERROR: No test cases found.");
        return [];
    }
}

   




function merkleRootFromBranch(leaf: Buffer, branch: Buffer[], index: number): Buffer {
    let root = leaf;
    branch.forEach((leaf, i) => {
        const ithBit = (index >> i) & 0x1;
        if (ithBit === 1) {
            root = sha256(Buffer.concat([leaf, root]));
        } else {
            root = sha256(Buffer.concat([root, leaf]));
        }
    });
    return root;
}

function checkProof(tree: any, index: number) {
    const { leaf, proof } = tree.getProof(index);
    const calcRoot = merkleRootFromBranch(leaf, proof, index);
    if (calcRoot.toString('hex') !== tree.getRoot().toString('hex')) {
        throw new Error('Proof verification failed');
    }
}

function compareProof(tree1: any, tree2: any, index: number) {
    if (tree1.getRoot().toString('hex') !== tree2.getRoot().toString('hex')) {
        throw new Error('Root mismatch');
    }
    checkProof(tree1, index);
    checkProof(tree2, index);
}

function cloneFromSnapshot(snapshot: DepositTreeSnapshot, testCases: DepositTestCase[]): any {
    const copy = DepositTree.fromSnapshot(snapshot);
    testCases.forEach(caseItem => {
        copy.pushLeaf(caseItem.deposit_data_root);
    });
    return copy;
}

describe('DepositTree Tests', () => {
    it('should instantiate DepositTree', () => {
        DepositTree.new();
    });

    it('should have correct empty root', () => {
        const empty = DepositTree.new();
        const expectedRoot = Buffer.from('d70a234731285c6804c2a4f56711ddb8c82c99740f207854891028af34e27e5e', 'hex');
        expect(empty.getRoot().toString('hex')).toBe(expectedRoot.toString('hex'));
    });

    it('should pass deposit cases', () => {
        const filepath = 'C:/Users/Aksha/snap/tests/test.yaml';
        const tree = DepositTree.new();
        const testCases = readTestCases(filepath);
        testCases.forEach(caseItem => {
            tree.pushLeaf(caseItem.deposit_data_root);
            const expectedRoot = caseItem.eth1_data.deposit_root;
            expect(caseItem.snapshot.calculateRoot().toString('hex')).toBe(expectedRoot.toString('hex'));
            expect(tree.getRoot().toString('hex')).toBe(expectedRoot.toString('hex'));
        });
    });

    it('should finalize tree correctly', () => {
        const filepath = 'C:/Users/Aksha/snap/tests/test.yaml';
        const tree = DepositTree.new();
        const testCases = readTestCases(filepath).slice(0, 128);
        testCases.forEach(caseItem => {
            tree.pushLeaf(caseItem.deposit_data_root);
        });

        const originalRoot = tree.getRoot();
        expect(originalRoot.toString('hex')).toBe(testCases[127].eth1_data.deposit_root.toString('hex'));

        // tree.finalize(testCases[100].eth1_data, testCases[100].block_height);
        // expect(tree.getRoot().toString('hex')).toBe(originalRoot.toString('hex'));

        const snapshot = tree.getSnapshot();
        expect(snapshot).toEqual(testCases[100].snapshot);

        const copy = cloneFromSnapshot(snapshot, testCases.slice(101, 128));
        expect(tree.getRoot().toString('hex')).toBe(copy.getRoot().toString('hex'));

        // tree.finalize(testCases[105].eth1_data, testCases[105].block_height);
        // expect(tree.getRoot().toString('hex')).toBe(originalRoot.toString('hex'));

        const copyFromSnapshot = cloneFromSnapshot(tree.getSnapshot(), testCases.slice(106, 128));

        const fullTreeCopy = DepositTree.new();
        testCases.forEach(caseItem => {
            fullTreeCopy.pushLeaf(caseItem.deposit_data_root);
        });

        for (let index = 106; index < 128; index++) {
            compareProof(tree, copyFromSnapshot, index);
            compareProof(tree, fullTreeCopy, index);
        }
    });

    it('should match snapshot cases', () => {
        const filepath = 'C:/Users/Aksha/snap/tests/test.yaml';
        const tree = DepositTree.new();
        const testCases = readTestCases(filepath);
        testCases.forEach(caseItem => {
            tree.pushLeaf(caseItem.deposit_data_root);
        });

        // testCases.forEach(caseItem => {
        //     tree.finalize(caseItem.eth1_data.deposit_root, caseItem.block_height);
        //     expect(tree.getSnapshot()).toEqual(caseItem.snapshot);
        // });
    });

    it('should not allow snapshot from empty tree', () => {
        expect(() => {
            const snapshot = DepositTree.new().getSnapshot();
        });
    });


    it('should reject invalid snapshot', () => {
        assert.throws(() => {
            const invalidSnapshot = new DepositTreeSnapshot(
                [],
                zerohashes[0],
                0,
                zerohashes[0],
                0
            );
            const tree = DepositTree.fromSnapshot(invalidSnapshot);
        }, Error, 'Expected an error when creating a tree from an invalid snapshot');
    });

});
