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
        })
    })

});
