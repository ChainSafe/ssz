import {SerializedList, toHexString} from "../../../../src/index.ts";
import {TypeTestValid, runTypeTestValid} from "../runTypeTestValid.ts";
import {TypePair, createRng, randomItems, smallLimitPairs, transactionsPairs} from "./pairs.ts";

/**
 * Run the generic valid type tests against the SerializedList types, with test vectors (serialized, json, root)
 * produced by the equivalent `Uint8Array[]` list types.
 */
for (const {oldType, newType} of [...transactionsPairs, ...smallLimitPairs]) {
  const maxBytes = oldType.elementType.limitBytes;
  const rng = createRng(1);
  const cases: {id: string; items: Uint8Array[]}[] = [
    {id: "empty", items: []},
    {id: "1 empty element", items: [new Uint8Array(0)]},
    {id: "2 empty elements", items: [new Uint8Array(0), new Uint8Array(0)]},
    {id: "1 element", items: [Uint8Array.from([1, 2, 3])]},
    {id: "3 small elements", items: randomItems(rng, 3, "small", maxBytes)},
    {id: "4 mixed elements", items: randomItems(rng, 4, "mixed", maxBytes)},
  ];
  if (oldType.limit > 4) {
    cases.push(
      {id: "5 mixed elements", items: randomItems(rng, 5, "mixed", maxBytes)},
      {id: "21 small elements", items: randomItems(rng, 21, "small", maxBytes)},
      {id: "22 mixed elements", items: randomItems(rng, 22, "mixed", maxBytes)}
    );
  } else {
    cases.push({id: "max elements of max size", items: randomItems(rng, oldType.limit, "max", maxBytes)});
  }

  runTypeTestValid({
    type: newType,
    typeName: `${newType.constructor.name} - ${newType.typeName}`,
    defaultValue: SerializedList.empty(),
    minSize: oldType.minSize,
    maxSize: oldType.maxSize,
    values: cases.map(({id, items}) => toTestCase(oldType, id, items)),
  });
}

function toTestCase(oldType: TypePair["oldType"], id: string, items: Uint8Array[]): TypeTestValid {
  return {
    id,
    serialized: toHexString(oldType.serialize(items)),
    json: oldType.toJson(items),
    root: toHexString(oldType.hashTreeRoot(items)),
  };
}
