import {Node} from "@chainsafe/persistent-merkle-tree";
import {ListCompositeType} from "../../../src/type/listComposite.ts";
import {ListCompositeTreeViewDU} from "../../../src/viewDU/listComposite.ts";
import {ValidatorNodeStructType} from "./validator.ts";
import {ListValidatorTreeViewDU} from "./viewDU/listValidator.ts";

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
