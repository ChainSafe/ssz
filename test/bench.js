const Benchmark = require('benchmark');

const sha256 = require('../lib');

const suite = new Benchmark.Suite;

const randomBuffer = (length) => Buffer.from(Array.from({length}, () => Math.round(Math.random() * 255)));

(async function() {

  await sha256.initSha256();
  suite
    .add('input length 32', () => sha256.default(randomBuffer(32)))
    .add('input length 64', () => sha256.default(randomBuffer(64)))
    .add('input length 128', () => sha256.default(randomBuffer(128)))
    .add('input length 256', () => sha256.default(randomBuffer(256)))
    .add('input length 512', () => sha256.default(randomBuffer(512)))

    .on('setup', async function (event) {
    })
    .on('cycle', function (event) {
      console.log(String(event.target));
    }).run({async: true});
})()

