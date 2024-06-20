import { ListCompositeType } from "../../../src/type/listComposite";
import { Node } from "@chainsafe/persistent-merkle-tree";
import { ListCompositeTreeViewDU } from "../../../src/viewDU/listComposite";
import { ValidatorNodeStructType } from "./validator";
import { ListValidatorTreeViewDU } from "./viewDU/listValidator";

export class ListValidatorType extends ListCompositeType<ValidatorNodeStructType> {
  constructor(limit: number) {
    super(new ValidatorNodeStructType(), limit);
  }

  getViewDU(node: Node, cache?: unknown): ListCompositeTreeViewDU<ValidatorNodeStructType> {
    return new ListValidatorTreeViewDU(this, node, cache as any);
  }
}