import {LeafNode, Tree} from "@chainsafe/persistent-merkle-tree";
import {BasicType, CompositeType, TreeView, Type, ValueOf} from "./abstract";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

type ValueOfFields<Fields extends Record<string, Type<any>>> = {[K in keyof Fields]: ValueOf<Fields[K]>};

type ViewOfFields<Fields extends Record<string, Type<any>>> = {
  [K in keyof Fields]: Fields[K]["isBasic"] extends true ? Fields[K]["defaultValue"] : ReturnType<Fields[K]["getView"]>;
};

export class ContainerType<Fields extends Record<string, Type<any>>> extends Type<ValueOfFields<Fields>> {
  // Immutable characteristics
  readonly itemsPerChunk = 1;
  readonly isBasic = false;
  readonly depth: number;
  readonly maxChunkCount: number;

  constructor(readonly fields: Fields) {
    super();

    // TODO Check that itemsPerChunk is an integer
    this.itemsPerChunk = 1;
    this.maxChunkCount = Object.keys(fields).length;
    // TODO: Review math
    this.depth = 1 + Math.ceil(Math.log2(this.maxChunkCount));
  }

  get defaultValue(): ValueOfFields<Fields> {
    const obj = {} as ValueOfFields<Fields>;
    for (const [key, type] of Object.entries(this.fields)) {
      obj[key as keyof ValueOfFields<Fields>] = type.defaultValue as unknown;
    }
    return obj;
  }

  getView(tree: Tree): ViewOfFields<Fields> {
    return getContainerTreeView<Fields>(this, tree, false);
  }
}

export class ContainerTreeView<Fields extends Record<string, Type<any>>> implements TreeView {
  private readonly fieldViews: ViewOfFields<Fields>;
  private readonly fieldBasicLeafNodes: {[K in keyof Fields]: LeafNode};
  private readonly dirtyNodes = new Set<string>();

  constructor(protected type: ContainerType<Fields>, protected tree: Tree, private inMutableMode = false) {}

  toMutable(): void {
    this.inMutableMode = true;
  }

  commit(): void {
    if (this.dirtyNodes.size === 0) {
      return;
    }

    // TODO: Use fast setNodes() method
    for (const key of this.dirtyNodes) {
      const gindex = this.type.getGindexBitStringAtChunkIndex(index);
      this.tree.setNode(gindex, this.fieldBasicLeafNodes[key]);
    }

    for (const [key, view] of Object.entries(this.fieldViews)) {
      (view as TreeView).commit();
    }

    this.inMutableMode = false;
  }
}

function getContainerTreeView<Fields extends Record<string, Type<any>>>(
  type: ContainerType<Fields>,
  tree: Tree,
  inMutableMode: boolean
): ViewOfFields<Fields> {
  const view = new ContainerTreeView(type, tree, inMutableMode);

  const propertyDescriptors: PropertyDescriptorMap = {};
  for (const [key, keyType] of Object.entries(type.fields)) {
    const gindex = type.getGindexBitStringAtChunkIndex(i);
    if (keyType.isBasic) {
      propertyDescriptors[key] = {
        configurable: false,
        enumerable: true,
        get: function () {
          const leafNode = tree.getNode(gindex) as LeafNode;
          return (keyType as BasicType<any>).getValueFromNode(leafNode) as unknown;
        },
        set: function (value) {
          const leafNode = tree.getNode(gindex) as LeafNode;
          (keyType as BasicType<any>).setValueToNode(leafNode, 0, value);
        },
      };
    } else {
      propertyDescriptors[key] = {
        configurable: false,
        enumerable: true,
        get: function () {
          // In current ssz it returns a Tree with its hook
          const keyTree = tree.getSubtree(gindex);
          return (keyType as CompositeType<any>).getView(keyTree, view["inMutableMode"]) as unknown;
        },
        set: function (value) {},
      };
    }
  }

  return Object.create(view, propertyDescriptors) as {[K in keyof Fields]: ValueOf<Fields[K]>};
}
