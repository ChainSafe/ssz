import {MutableVector} from "@chainsafe/persistent-ts";
import {VALIDATOR_REGISTRY_LIMIT} from "@chainsafe/lodestar-params";
import {ArrayBasicTreeView} from "../../../src/v2/arrayTreeView";
import {ListBasicType} from "../../../src/v2/listBasic";
import {UintNumberType} from "../../../src/v2/uint";

const vc = 250_000;
const attesterShare = 32;
const attesterIndices: number[] = [];
const statusArr: number[] = [];

const uint8Type = new UintNumberType(1);
const epochStatusesType = new ListBasicType(uint8Type, VALIDATOR_REGISTRY_LIMIT);

for (let i = 0; i < vc; i += Math.floor(2 * attesterShare * Math.random())) {
  attesterIndices.push(i);
}
for (let i = 0; i < vc; i++) {
  statusArr.push(0x03);
}
console.log("attesterIndices.length", attesterIndices.length);

const epochStatuses = epochStatusesType.toTreeViewFromStruct(statusArr);
// Populate read cache
epochStatuses.getAll();

const res = epochStatuses.get(4);
console.log({res});
