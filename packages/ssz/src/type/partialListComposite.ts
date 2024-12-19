import {fromSnapshot, zeroNode} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, CompositeView, CompositeViewDU} from "./composite.js";
import {ListCompositeOpts, ListCompositeType} from "./listComposite.js";
import {PartialListCompositeTreeViewDU} from "../viewDU/partialListComposite.js";
import {Snapshot} from "../util/types.js";
import {byteArrayEquals} from "../util/byteArray.js";
import {zeroSnapshot} from "../util/snapshot.js";
import {addLengthNode} from "./arrayBasic.js";

/**
 * Similar to ListCompositeType, this is mainly used to create a PartialListCompositeTreeViewDU from a snapshot.
 * The ViewDU created is a partial tree created from a snapshot, not a full tree.
 * Note that this class only inherits minimal methods as defined in ArrayType of ../view/arrayBasic.ts
 * It'll throw errors for all other methods, most of the usage is in the ViewDU class.
 */
export class PartialListCompositeType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ElementType extends CompositeType<any, CompositeView<ElementType>, CompositeViewDU<ElementType>>
> extends ListCompositeType<ElementType> {
  constructor(readonly elementType: ElementType, readonly limit: number, opts?: ListCompositeOpts) {
    super(elementType, limit, opts);

    // only inherit methods in ArrayType of ../view/arrayBasic.ts
    const inheritedMethods = [
      "tree_getLength",
      "tree_setLength",
      "tree_getChunksNode",
      "tree_chunksNodeOffset",
      "tree_setChunksNode",
    ];
    const methodNames = Object.getOwnPropertyNames(ListCompositeType.prototype).filter(
      (prop) =>
        prop !== "constructor" &&
        typeof (this as unknown as Record<string, unknown>)[prop] === "function" &&
        !inheritedMethods.includes(prop)
    );

    // throw errors for all remaining methods
    for (const methodName of methodNames) {
      (this as unknown as Record<string, unknown>)[methodName] = () => {
        throw new Error(`Method ${methodName} is not implemented for PartialListCompositeType`);
      };
    }
  }

  /**
   * Create a PartialListCompositeTreeViewDU from a snapshot.
   */
  toPartialViewDU(snapshot: Snapshot): PartialListCompositeTreeViewDU<ElementType> {
    const chunksNode = fromSnapshot(snapshot, this.chunkDepth);
    const rootNode = addLengthNode(chunksNode, snapshot.count);

    if (!byteArrayEquals(rootNode.root, snapshot.root)) {
      throw new Error(`Snapshot root is incorrect, expected ${snapshot.root}, got ${rootNode.root}`);
    }

    return new PartialListCompositeTreeViewDU(this, rootNode, snapshot);
  }

  /**
   * Creates a PartialListCompositeTreeViewDU from a zero snapshot.
   */
  defaultPartialViewDU(): PartialListCompositeTreeViewDU<ElementType> {
    const rootNode = addLengthNode(zeroNode(this.chunkDepth), 0);

    return new PartialListCompositeTreeViewDU(this, rootNode, zeroSnapshot(this.chunkDepth));
  }
}
