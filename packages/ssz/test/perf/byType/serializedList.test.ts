import {bench, describe} from "@chainsafe/benchmark";
import {
  ByteListType,
  ListCompositeType,
  ProgressiveByteListType,
  ProgressiveListCompositeType,
  ProgressiveSerializedListType,
  SerializedListType,
} from "../../../src/index.ts";

const MAX_BYTES_PER_TRANSACTION = 2 ** 30;
const MAX_TRANSACTIONS_PER_PAYLOAD = 2 ** 20;
// Same as lodestar bellatrix and gloas types
const Transaction = new ByteListType(MAX_BYTES_PER_TRANSACTION);
const ProgressiveTransaction = new ProgressiveByteListType({typeName: "Transaction", limit: MAX_BYTES_PER_TRANSACTION});

const pairs = [
  {
    id: "List",
    oldType: new ListCompositeType(Transaction, MAX_TRANSACTIONS_PER_PAYLOAD),
    newType: new SerializedListType(Transaction, MAX_TRANSACTIONS_PER_PAYLOAD),
  },
  {
    id: "ProgressiveList",
    oldType: new ProgressiveListCompositeType(ProgressiveTransaction, {limit: MAX_TRANSACTIONS_PER_PAYLOAD}),
    newType: new ProgressiveSerializedListType(ProgressiveTransaction, {limit: MAX_TRANSACTIONS_PER_PAYLOAD}),
  },
];

const cases = [
  // Typical mainnet payload
  {id: "300 txs of 500 bytes", count: 300, txSize: 500},
  // Max count of empty transactions, as in a DoS attempt
  {id: `${MAX_TRANSACTIONS_PER_PAYLOAD} empty txs`, count: MAX_TRANSACTIONS_PER_PAYLOAD, txSize: 0},
];

for (const {id, oldType, newType} of pairs) {
  for (const {id: caseId, count, txSize} of cases) {
    describe(`${id} Transactions - ${caseId}`, () => {
      const items = Array.from({length: count}, (_, i) => new Uint8Array(txSize).fill(i & 0xff));
      const serialized = oldType.serialize(items);
      const oldValue = oldType.deserialize(serialized);
      const newValue = newType.deserialize(serialized);

      bench(`${id} ${caseId} Uint8Array[] deserialize`, () => {
        oldType.deserialize(serialized);
      });

      bench(`${id} ${caseId} SerializedList deserialize`, () => {
        newType.deserialize(serialized);
      });

      bench(`${id} ${caseId} Uint8Array[] serialize`, () => {
        oldType.serialize(oldValue);
      });

      bench(`${id} ${caseId} SerializedList serialize`, () => {
        newType.serialize(newValue);
      });

      bench(`${id} ${caseId} Uint8Array[] hashTreeRoot`, () => {
        oldType.hashTreeRoot(oldValue);
      });

      bench(`${id} ${caseId} SerializedList hashTreeRoot`, () => {
        newType.hashTreeRoot(newValue);
      });
    });
  }
}
