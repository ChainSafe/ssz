import {GindexBitstring, LeafNode, Node, toGindexBitstring} from "@chainsafe/persistent-merkle-tree";

/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/no-explicit-any */

export interface TreeView {
  toMutable(): void;
  commit(): void;
}

export type ValueOf<T extends Type<any>> = T["defaultValue"];
// type ElV<Type extends ListBasicType<any>> = Type extends ListBasicType<infer ElType> ? V<ElType> :never

export type ViewOf<T extends Type<any>> = T["isBasic"] extends true ? T["defaultValue"] : ReturnType<T["getView"]>;
export type ViewOfComposite<T extends CompositeType<any>> = ReturnType<T["getView"]>;

export abstract class Type<V> {
  abstract defaultValue: V;
  abstract isBasic: boolean;
  abstract depth: number;
  /** if fixedLen === null has variable length. Otherwise is fixed len of value `fixedLen` */
  abstract readonly fixedLen: number | null;
  abstract readonly minLen: number;
  abstract readonly maxLen: number;

  abstract getView(node: Node, inMutableMode: boolean): unknown;

  getGindexBitStringAtChunkIndex(index: number): GindexBitstring {
    return toGindexBitstring(this.depth, index);
  }

  abstract struct_deserializeFromBytes(data: Uint8Array, start: number, end: number): V;
  abstract struct_serializeToBytes(output: Uint8Array, offset: number, struct: V): number;
  abstract tree_deserializeFromBytes(data: Uint8Array, start: number, end: number): Node;
  abstract tree_serializeToBytes(output: Uint8Array, offset: number, node: Node): number;
}

export abstract class BasicType<V> extends Type<V> {
  readonly isBasic = true;
  readonly depth = 0;
  readonly chunkCount = 1;
  abstract readonly byteLength: number;
  abstract readonly itemsPerChunk: number;

  // TODO: Consider just returning `Type<V>`, to make the API consistent in Container ViewOfFields
  getView(): unknown {
    throw Error("Basic types do not return views");
  }

  abstract getValueFromNode(leafNode: LeafNode): V;
  abstract setValueToNode(leafNode: LeafNode, value: V): void;
  abstract getValueFromPackedNode(leafNode: LeafNode, index: number): V;
  abstract setValueToPackedNode(leafNode: LeafNode, index: number, value: V): void;
}

export abstract class CompositeType<V> extends Type<V> {
  readonly isBasic = false;

  abstract getView(node: Node, inMutableMode: boolean): unknown;
}
