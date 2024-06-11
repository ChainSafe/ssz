// utils.ts
import * as crypto from 'crypto';

const DEPOSIT_CONTRACT_TREE_DEPTH = 32;

type Hash32 = Buffer;
type Root = Buffer;
type uint64 = number;
type BLSPubkey = Buffer;
type Bytes32 = Buffer;
type Gwei = uint64;
type BLSSignature = Buffer;

interface DepositData {
    pubkey: BLSPubkey;
    withdrawal_credentials: Bytes32;
    amount: Gwei;
    signature: BLSSignature;
}

interface Eth1Data {
    deposit_root: Root;
    deposit_count: uint64;
    block_hash: Hash32;
}

function sha256(x: Buffer): Hash32 {
    return crypto.createHash('sha256').update(x).digest();
}

function toLeBytes(i: number): Buffer {
    const buffer = Buffer.alloc(32);
    buffer.writeBigUInt64LE(BigInt(i), 0);
    return buffer;
}

const zerohashes: Hash32[] = [Buffer.alloc(32, 0)];
for (let i = 1; i < DEPOSIT_CONTRACT_TREE_DEPTH; i++) {
    zerohashes.push(sha256(Buffer.concat([zerohashes[i - 1], zerohashes[i - 1]])));
}

export {
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
};
