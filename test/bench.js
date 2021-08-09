const Benchmark = require('benchmark');

const sha256 = require('../lib');

const suite = new Benchmark.Suite;

const randomBuffer = (length) => Buffer.from(Array.from({length}, () => Math.round(Math.random() * 255)));
const randomBuffer32 = randomBuffer(32);
const randomBuffer64 = randomBuffer(64);
const randomBuffer128 = randomBuffer(128);
const randomBuffer256 = randomBuffer(256);
const randomBuffer512 = randomBuffer(512);
const randomBuffer1024 = randomBuffer(1024);
suite
  .add('input length 32', () => sha256.default.digest(randomBuffer32))
  .add('input length 64', () => sha256.default.digest(randomBuffer64))
  .add('input digest-64', () => sha256.default.digest64(randomBuffer64))
  .add('input length 128', () => sha256.default.digest(randomBuffer128))
  .add('input length 256', () => sha256.default.digest(randomBuffer256))
  .add('input length 512', () => sha256.default.digest(randomBuffer512))
  .add('input length 1024', () => sha256.default.digest(randomBuffer1024))
  .on('cycle', function (event) {
    console.log(String(event.target));
  }).run();

