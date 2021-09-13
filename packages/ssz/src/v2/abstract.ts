import {GindexBitstring, LeafNode, toGindexBitstring, Tree} from "@chainsafe/persistent-merkle-tree";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export interface TreeView {
  toMutable(): void;
  commit(): void;
}

export type ValueOf<T extends Type<any>> = T["defaultValue"];
// type ElV<Type extends ListBasicType<any>> = Type extends ListBasicType<infer ElType> ? V<ElType> :never

export abstract class Type<V> {
  abstract defaultValue: V;
  abstract isBasic: boolean;
  abstract depth: number;

  abstract getView(tree: Tree, inMutableMode: boolean): any;

  getGindexBitStringAtChunkIndex(index: number): GindexBitstring {
    return toGindexBitstring(this.depth, index);
  }
}

export abstract class BasicType<V> extends Type<V> {
  readonly isBasic = true;
  readonly depth = 0;
  readonly chunkCount = 1;
  readonly byteLength: number;
  readonly itemsPerChunk: number;

  // TODO: Consider just returning `Type<V>`, to make the API consistent in Container ViewOfFields
  getView(): never {
    throw Error("Basic types do not return views");
  }

  abstract getValueFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract getValueFromNode(leafNode: LeafNode): V;
  abstract setValueToNode(leafNode: LeafNode, index: number, value: V): void;
}

export abstract class CompositeType<V> extends Type<V> {
  readonly isBasic = false;
}
