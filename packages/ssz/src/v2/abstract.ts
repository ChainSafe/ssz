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
  /** if fixedLen === null has variable length. Otherwise is fixed len of value `fixedLen` */
  abstract readonly fixedLen: number | null;
  abstract readonly minLen: number;
  abstract readonly maxLen: number;

  abstract getView(tree: Tree, inMutableMode: boolean): any;

  getGindexBitStringAtChunkIndex(index: number): GindexBitstring {
    return toGindexBitstring(this.depth, index);
  }

  abstract struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): V;
  abstract struct_serializeToBytes(output: Uint8Array, offset: number, struct: V): number;
  abstract tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Tree;
  abstract tree_serializeToBytes(output: Uint8Array, offset: number, tree: Tree): number;
}

export abstract class BasicType<V> extends Type<V> {
  readonly isBasic = true;
  readonly depth = 0;
  readonly chunkCount = 1;
  abstract readonly byteLength: number;
  abstract readonly itemsPerChunk: number;

  // TODO: Consider just returning `Type<V>`, to make the API consistent in Container ViewOfFields
  getView(): never {
    throw Error("Basic types do not return views");
  }

  abstract getValueFromNode(leafNode: LeafNode): V;
  abstract setValueToNode(leafNode: LeafNode, value: V): void;
  abstract getValueFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract setValueToPackedNode(leafNode: LeafNode, index: number, value: V): void;
  /** Basic types are always fixed size, no need for `end` param */
  abstract struct_deserializeFromBytes(data: Uint8Array, start: number): V;
  abstract struct_serializeToBytes(data: Uint8Array, start: number, value: V): number;
}

export abstract class CompositeType<V> extends Type<V> {
  readonly isBasic = false;
}
