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
            const input = Buffer.from("gajindergajindergajindergajindergajindergajindergajindergajinder", "utf8");
            expect(Buffer.from(sha256.default.digest64(input)).toString("hex")).to.be.equal("be39380ff1d0261e6f37dafe4278b662ef611f1cb2f7c0a18348b2d7eb14cf6e")
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
