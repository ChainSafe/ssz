const sha = require("./lib");

console.log(sha);

const f=sha.default("h")

let hex = Buffer.from(f).toString('hex');
console.log(hex)
