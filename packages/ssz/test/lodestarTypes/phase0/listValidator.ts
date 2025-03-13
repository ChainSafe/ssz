import {Node} from "@chainsafe/persistent-merkle-tree";
import {ListCompositeType} from "../../../src/type/listComposite.js";
import {ListCompositeTreeViewDU} from "../../../src/viewDU/listComposite.js";
import {ValidatorNodeStructType} from "./validator.js";
import {ListValidatorTreeViewDU} from "./viewDU/listValidator.js";

/**
 * Model ssz type for a list of validators in ethereum consensus layer.
 * This defines ListValidatorTreeViewDU to work with validators in batch.
 */
export class ListValidatorType extends ListCompositeType<ValidatorNodeStructType> {
  constructor(limit: number) {
    super(new ValidatorNodeStructType(), limit);
  }

  getViewDU(node: Node, cache?: unknown): ListCompositeTreeViewDU<ValidatorNodeStructType> {
    return new ListValidatorTreeViewDU(this, node, cache as any);
  }
}
