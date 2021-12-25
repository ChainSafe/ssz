import {itBench} from "@dapplion/benchmark";
import {packedRootsBytesToLeafNodes, packedRootsBytesToLeafNodesDV} from "../../src/packedNode";

describe("packedRootsBytesToLeafNodes", () => {
  const bytes = 4 * 1000;

  for (let offset = 0; offset < 4; offset++) {
    const start = offset;
    const end = start + bytes;

    const data = new Uint8Array(bytes + offset);
    data.set(Buffer.alloc(bytes, 0xdd));

    // itBench("packedRootsBytesToLeafNodes offset 2 len 128", () => {
    //   packedRootsBytesToLeafNodes(data, start, end);
    // });

    itBench(`packedRootsBytesToLeafNodesDV bytes ${bytes} offset ${offset} `, () => {
      packedRootsBytesToLeafNodesDV(data, start, end);
    });
  }
});
