import {describe, it, expect} from "vitest";
import {Buffer} from "buffer";
import {expect} from "chai";
import * as sha256 from "../../src/index.js";

describe("as-sha256", function () {
  describe("digest()", function () {
    const digestTestCases = [
      {
        input: "",
        expected: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
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

    for (const {input, expected} of digestTestCases) {
      const name = input === "" ? "empty string" : input;
      it(`digest: ${name}`, function () {
        const output = sha256.digest(Buffer.from(input, "utf-8"));
        expect(Buffer.from(output).toString("hex")).to.be.equal(expected);
      });
    }
  });

  describe("digest64()", function () {
    it("gajindergajindergajindergajindergajindergajindergajindergajinder", function () {
      const input1 = "gajindergajindergajindergajinder";
      const input2 = "gajindergajindergajindergajinder";
      const input = Buffer.from(input1 + input2, "utf8");
      const output = sha256.digest64(input);
      const expectedOutput = new Uint8Array([
        190, 57, 56, 15, 241, 208, 38, 30, 111, 55, 218, 254, 66, 120, 182, 98, 239, 97, 31, 28, 178, 247, 192, 161,
        131, 72, 178, 215, 235, 20, 207, 110,
      ]);
      expect(output).to.be.deep.equal(expectedOutput, "incorrect digest64 result");
    });
  });

  it("digest and digest64 output matches", function () {
    const input = Buffer.from("harkamalharkamalharkamalharkamalharkamalharkamalharkamalharkamal", "utf8");
    const output = Buffer.from(sha256.digest(input)).toString("hex");
    const output64 = Buffer.from(sha256.digest64(input)).toString("hex");
    expect(output).to.be.equal(output64);
  });

  it("1024 digest test", function () {
    const inputStr = "12345678".repeat(128);
    const input = Buffer.from(inputStr, "utf8");
    expect(input.length).to.be.equal(1024);

    const output = Buffer.from(sha256.digest(input)).toString("hex");
    expect(output).to.be.equal("54c7cb8a82d68145fd5f5da4103f5a66f422dbea23d9fc9f40f59b1dcf5403a9");
  });

  it("digest64HashObject", function () {
    const input1 = sha256.byteArrayToHashObject(Buffer.from("gajindergajindergajindergajinder", "utf-8"), 0);
    const input2 = sha256.byteArrayToHashObject(Buffer.from("gajindergajindergajindergajinder", "utf-8"), 0);

    const outputObj = sha256.digest64HashObjects(input1, input2);
    const output = new Uint8Array(32);
    sha256.hashObjectToByteArray(outputObj, output, 0);

    expect(Buffer.from(output).toString("hex")).to.be.equal(
      "be39380ff1d0261e6f37dafe4278b662ef611f1cb2f7c0a18348b2d7eb14cf6e"
    );
  });

  it("digest64HashObject and digest64 output matches", function () {
    const input1 = "gajindergajindergajindergajinder";
    const input2 = "gajindergajindergajindergajinder";
    const output = sha256.digest64(Buffer.from(input1 + input2, "utf8"));

    const inputObj1 = sha256.byteArrayToHashObject(Buffer.from(input1, "utf8"), 0);
    const inputObj2 = sha256.byteArrayToHashObject(Buffer.from(input2, "utf8"), 0);
    const outputObj = sha256.digest64HashObjects(inputObj1, inputObj2);
    const outputByteArray = new Uint8Array(32);
    sha256.hashObjectToByteArray(outputObj, outputByteArray, 0);

    expect(Buffer.from(output).toString("hex")).to.be.equal(Buffer.from(outputByteArray).toString("hex"));
  });

  it("digest2Bytes32 matches digest64", function () {
    const input1 = Buffer.alloc(32, "*");
    const input2 = Buffer.alloc(32, "*");
    const digestBytes32 = sha256.digest2Bytes32(input1, input2);
    expect(digestBytes32).to.be.deep.equal(
      sha256.digest64(Buffer.of(...input1, ...input2)),
      "incorrect digest2Bytes32 result"
    );
  });
});

describe("sha256.hashObjectToByteArray and sha256.byteArrayToHashObject", function () {
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
      const obj = sha256.byteArrayToHashObject(byteArr, 0);
      const newByteArr = new Uint8Array(32);
      sha256.hashObjectToByteArray(obj, newByteArr, 0);
      expect(newByteArr).to.be.deep.equal(byteArr, "failed test case" + i);
    });
  }
});
