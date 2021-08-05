const sha256 = require("../src");
const {expect} = require("chai");

describe("sha256", function () {

    describe("digest function", function () {

        it('abc', function () {
            const input = Buffer.from("abc", "utf8");
            expect(Buffer.from(sha256.default.digest(input)).toString("hex")).to.be.equal("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
        });

        it('empty string', function () {
            const input = Buffer.from("", "utf8");
            expect(Buffer.from(sha256.default.digest(input)).toString("hex")).to.be.equal("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
        });

        it('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', function () {
            const input = Buffer.from("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq", "utf8");
            expect(Buffer.from(sha256.default.digest(input)).toString("hex")).to.be.equal("248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1")
        });

        it('abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu', function () {
            const input = Buffer.from("abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu", "utf8");
            expect(Buffer.from(sha256.default.digest(input)).toString("hex")).to.be.equal("cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1")
        });

        it('gajindergajindergajindergajindergajindergajindergajindergajinder', function () {
            const input1 = "gajindergajindergajindergajinder";
            const input2 = "gajindergajindergajindergajinder";
            const input = Buffer.from(input1 + input2, "utf8");
            const output = sha256.default.digest64(input);
            const expectedOutput = new Uint8Array([
              190, 57,  56,  15, 241, 208,  38,  30,
              111, 55, 218, 254,  66, 120, 182,  98,
              239, 97,  31,  28, 178, 247, 192, 161,
              131, 72, 178, 215, 235,  20, 207, 110
            ]);
            expect(output).to.be.deep.equal(expectedOutput, "incorrect digest64 result");
            expect(Buffer.from(output).toString("hex")).to.be.equal("be39380ff1d0261e6f37dafe4278b662ef611f1cb2f7c0a18348b2d7eb14cf6e")
            // digestTwoHashObjects should be the same to digest64
            const buffer1 = Buffer.from(input1, "utf-8");
            const buffer2 = Buffer.from(input2, "utf-8");
            const obj1 = sha256.byteArrayToHashObject(buffer1);
            const obj2 = sha256.byteArrayToHashObject(buffer2);
            const obj = sha256.default.digestTwoHashObjects(obj1, obj2);
            const output2 = new Uint8Array(32);
            sha256.hashObjectToByteArray(obj, output2, 0);
            for (let i = 0; i < 32; i++) {
              expect(output2[i]).to.be.equal(output[i], "failed at index" + i);
            }
            expect(output2).to.be.deep.equal(expectedOutput, "incorrect digestTwoHashObjects result");
        });

        it('harkamalharkamalharkamalharkamalharkamalharkamalharkamalharkamal', function () {
            const input = Buffer.from("harkamalharkamalharkamalharkamalharkamalharkamalharkamalharkamal", "utf8");
            const output = Buffer.from(sha256.default.digest(input)).toString("hex");
            const output64 = Buffer.from(sha256.default.digest64(input)).toString("hex")
            expect(output).to.be.equal(output64)
        });

        it('1024 digest test', function () {
            let input = "12345678";
            input=`${input}${input}${input}${input}${input}${input}${input}${input}`;//64 length
            input=`${input}${input}${input}${input}${input}${input}${input}${input}`;//512 length
            input=`${input}${input}`;//1024 length
            input=Buffer.from(input,"utf8");
            expect(input.length).to.be.equal(1024)

            const output = Buffer.from(sha256.default.digest(input)).toString("hex");
            expect(output).to.be.equal("54c7cb8a82d68145fd5f5da4103f5a66f422dbea23d9fc9f40f59b1dcf5403a9");
        });
    })

});

describe("sha256.hashObjectToByteArray and sha256.byteArrayToHashObject", function () {
  const tcs = [
    new Uint8Array([
      190, 57,  56,  15, 241, 208,  38,  30,
      111, 55, 218, 254,  66, 120, 182,  98,
      239, 97,  31,  28, 178, 247, 192, 161,
      131, 72, 178, 215, 235,  20, 207, 110,
    ]),
    new Uint8Array([
      255, 255,  255,  255, 255, 255,  255, 255,
      255, 255,  255,  255, 255, 255,  255, 255,
      255, 255,  255,  255, 255, 255,  255, 255,
      255, 255,  255,  255, 255, 255,  255, 255,
    ]),
    new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
    ]),
  ];
  for (const [i, byteArr] of tcs.entries()) {
    it("test case " + i, function () {
      const obj = sha256.byteArrayToHashObject(byteArr);
      const newByteArr = new Uint8Array(32);
      sha256.hashObjectToByteArray(obj, newByteArr, 0);
      expect(newByteArr).to.be.deep.equal(byteArr, "failed test case" + i);
    });
  }
});
