import {describe, it, expect} from "vitest";

describe("DataView", () => {
  it("Test results of multiple sets", () => {
    const arrayBuffer = new ArrayBuffer(8);
    const uint8Array = new Uint8Array(arrayBuffer);
    const dataView = new DataView(arrayBuffer);

    function assertBytes(hex: string, msg: string): void {
      expect(Buffer.from(uint8Array).toString("hex")).to.equal(hex, msg);
    }

    assertBytes("0000000000000000", "Empty before anything");

    dataView.setInt32(0, 0xaabb, true);
    assertBytes("bbaa000000000000", "After setInt32 0xaabb little endian");
    dataView.setInt32(0, 0, true);

    dataView.setInt32(0, 0xaabb, false);
    assertBytes("0000aabb00000000", "After setInt32 0xaabb big endian");
    dataView.setInt32(0, 0, false);

    dataView.setInt32(0, 0xffffffff, true);
    assertBytes("ffffffff00000000", "After setInt32 0xffffffff little endian");
    dataView.setInt32(0, 0, true);

    dataView.setInt32(0, 0xffffffff, false);
    assertBytes("ffffffff00000000", "After setInt32 0xffffffff big endian");
    dataView.setInt32(0, 0, false);

    dataView.setUint32(0, 0xaabb, false);
    assertBytes("0000aabb00000000", "After setUint32 big endian");
    dataView.setUint32(0, 0, false);

    dataView.setFloat32(0, 0xaabb, false);
    assertBytes("472abb0000000000", "After setFloat32 big endian");
    dataView.setFloat32(0, 0, false);

    dataView.setBigInt64(0, BigInt(Number.MAX_SAFE_INTEGER));
    assertBytes("001fffffffffffff", "After setBigInt64 MAX_SAFE_INTEGER big endian");
    dataView.setBigInt64(0, BigInt(0));

    dataView.setBigUint64(0, BigInt(Number.MAX_SAFE_INTEGER));
    assertBytes("001fffffffffffff", "After setBigUint64 MAX_SAFE_INTEGER big endian");
    dataView.setBigUint64(0, BigInt(0));
  });
});
