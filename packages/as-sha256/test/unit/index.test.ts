import {describe, it, expect} from "vitest";
import {createHash, randomBytes} from "crypto";
import {Buffer} from "buffer";
import {AssemblyScriptSha256Hasher, byteArrayToHashObject, hashObjectToByteArray} from "../../src/index.js";

describe("hashObjectToByteArray and byteArrayToHashObject", function () {
  const tcs = [
    new Uint8Array([
      190, 57, 56, 15, 241, 208, 38, 30, 111, 55, 218, 254, 66, 120, 182, 98, 239, 97, 31, 28, 178, 247, 192, 161, 131,
      72, 178, 215, 235, 20, 207, 110,
    ]),
    new Uint8Array([
      255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
      255, 255, 255, 255, 255, 255, 255, 255, 255,
    ]),
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  ];
  for (const [i, byteArr] of tcs.entries()) {
    it("test case " + i, function () {
      const obj = byteArrayToHashObject(byteArr, 0);
      const newByteArr = new Uint8Array(32);
      hashObjectToByteArray(obj, newByteArr, 0);
      expect(newByteArr).to.be.deep.equal(byteArr, "failed test case" + i);
    });
  }
});

describe("as-sha256 non-SIMD enabled methods", function () {
  let sha256: AssemblyScriptSha256Hasher;
  before(async function () {
    sha256 = await AssemblyScriptSha256Hasher.initialize();
  });

  describe("digest()", function () {
    const digestTestCases = [
      {
        input: "",
        expectedInputLength: 0,
        expected: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      {
        input: "12345678".repeat(128),
        expectedInputLength: 1024,
        expected: "54c7cb8a82d68145fd5f5da4103f5a66f422dbea23d9fc9f40f59b1dcf5403a9",
      },
      {
        input: "abc",
        expected: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
      },
      {
        input: "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
        expected: "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
      },
      {
        input:
          "abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",
        expected: "cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1",
      },
    ];

    for (const {input, expectedInputLength, expected} of digestTestCases) {
      const name = input === "" ? "empty string" : input;
      const trimmed = name.length > 97 ? `${name.substring(0, 100)}...` : name;
      it(trimmed, function () {
        const inputBuffer = Buffer.from(input, "utf8");
        if (expectedInputLength) {
          expect(inputBuffer.length).to.be.equal(expectedInputLength, "Invalid input buffer length");
        }
        const output = sha256.digest(inputBuffer);
        expect(Buffer.from(output).toString("hex")).to.be.equal(expected, "Invalid digest");
      });
    }
  });

  it("digest64()", function () {
    const input = Buffer.alloc(64, "lodestar");
    const output = Buffer.from(sha256.digest64(input)).toString("hex");
    const expected = createHash("sha256").update(input).digest("hex");
    expect(output).to.equal(expected);
  });

  it("digest() and digest64() output matches", function () {
    const input = Buffer.from("harkamalharkamalharkamalharkamalharkamalharkamalharkamalharkamal", "utf8");
    const output = Buffer.from(sha256.digest(input)).toString("hex");
    const output64 = Buffer.from(sha256.digest64(input)).toString("hex");
    expect(output).to.be.equal(output64);
  });

  it("digest2Bytes32()", function () {
    const input1 = randomBytes(32);
    const input2 = randomBytes(32);
    const output = Buffer.from(sha256.digest2Bytes32(input1, input2)).toString("hex");
    const expectedOutput = createHash("sha256")
      .update(Buffer.of(...input1, ...input2))
      .digest("hex");
    expect(output).to.equal(expectedOutput);
  });

  it("digest2Bytes32() matches digest64()", function () {
    const input1 = Buffer.alloc(32, "*");
    const input2 = Buffer.alloc(32, "*");
    const digestBytes32 = sha256.digest2Bytes32(input1, input2);
    expect(digestBytes32).to.be.deep.equal(
      sha256.digest64(Buffer.of(...input1, ...input2)),
      "incorrect digest2Bytes32 result"
    );
  });

  it("digest64HashObject()", function () {
    const input1 = randomBytes(32);
    const obj1 = byteArrayToHashObject(input1, 0);
    const input2 = randomBytes(32);
    const obj2 = byteArrayToHashObject(input2, 0);

    const outputObj = sha256.digest64HashObjects(obj1, obj2);
    const outputArray = new Uint8Array(32);
    hashObjectToByteArray(outputObj, outputArray, 0);
    const output = Buffer.from(outputArray).toString("hex");

    const expectedOutput = createHash("sha256")
      .update(Buffer.of(...input1, ...input2))
      .digest("hex");

    expect(output).to.equal(expectedOutput);
  });

  it("digest64HashObject() and digest2Bytes32() output matches", function () {
    const input1 = Buffer.from("gajindergajindergajindergajinder", "utf8");
    const input2 = Buffer.from("gajindergajindergajindergajinder", "utf8");
    const output = sha256.digest2Bytes32(input1, input2);

    const inputObj1 = byteArrayToHashObject(input1, 0);
    const inputObj2 = byteArrayToHashObject(input2, 0);
    const outputObj = sha256.digest64HashObjects(inputObj1, inputObj2);
    const outputByteArray = new Uint8Array(32);
    hashObjectToByteArray(outputObj, outputByteArray, 0);

    expect(Buffer.from(output).toString("hex")).to.be.equal(Buffer.from(outputByteArray).toString("hex"));
  });
});
