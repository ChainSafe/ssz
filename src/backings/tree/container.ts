/* eslint-disable @typescript-eslint/no-unused-vars */
import {Node, Tree, subtreeFillToContents, zeroNode, Gindex, LeafNode} from "@chainsafe/persistent-merkle-tree";

import {ObjectLike} from "../../interface";
import {ContainerType, CompositeType} from "../../types";
import {isTreeBacked, TreeHandler, PropOfTreeBacked, ITreeBacked} from "./abstract";

export class ContainerTreeHandler<T extends Record<string, unknown>> extends TreeHandler<T> {
  _type: ContainerType<T>;
  _defaultNode: Node;
  constructor(type: ContainerType<T>) {
    super();
    this._type = type;
  }
  defaultNode(): Node {
    if (!this._defaultNode) {
      this._defaultNode = subtreeFillToContents(
        Object.values(this._type.fields).map((fieldType) => {
          if (fieldType.isBasic()) {
            return zeroNode(0);
          }
          if (fieldType.isComposite()) {
            return fieldType.tree.defaultNode();
          }
        }),
        this.depth()
      );
    }
    return this._defaultNode;
  }
  defaultBacking(): Tree {
    return new Tree(this.defaultNode());
  }
  fromStructural(value: T): Tree {
    return new Tree(
      subtreeFillToContents(
        Object.entries(this._type.fields).map(([fieldName, fieldType]) => {
          if (fieldType.isBasic()) {
            const chunk = new Uint8Array(32);
            fieldType.toBytes(value[fieldName], chunk, 0);
            return new LeafNode(chunk);
          } else {
            if (isTreeBacked(value[fieldName] as ObjectLike)) {
              return (value[fieldName] as ITreeBacked<T>).tree().rootNode;
            } else {
              return (fieldType as CompositeType).tree.fromStructural(value[fieldName] as ObjectLike).rootNode;
            }
          }
        }),
        this.depth()
      )
    );
  }
  size(target: Tree): number {
    let s = 0;
    Object.values(this._type.fields).forEach((fieldType, i) => {
      if (fieldType.isVariableSize() && fieldType.isComposite()) {
        s += fieldType.tree.size(this.getSubtreeAtChunk(target, i)) + 4;
      } else {
        s += fieldType.size(null);
      }
    });
    return s;
  }
  fromBytes(data: Uint8Array, start: number, end: number): Tree {
    const target = this.defaultBacking();
    const offsets = this._type.byteArray.getVariableOffsets(
      new Uint8Array(data.buffer, data.byteOffset + start, end - start)
    );
    Object.values(this._type.fields).forEach((fieldType, i) => {
      const [currentOffset, nextOffset] = offsets[i];
      if (fieldType.isBasic()) {
        // view of the chunk, shared buffer from `data`
        const dataChunk = new Uint8Array(
          data.buffer,
          data.byteOffset + start + currentOffset,
          nextOffset - currentOffset
        );
        const chunk = new Uint8Array(32);
        // copy chunk into new memory
        chunk.set(dataChunk);
        this.setRootAtChunk(target, i, chunk);
      }
      if (fieldType.isComposite()) {
        this.setSubtreeAtChunk(target, i, fieldType.tree.fromBytes(data, start + currentOffset, start + nextOffset));
      }
    });
    return target;
  }
  toBytes(target: Tree, output: Uint8Array, offset: number): number {
    let variableIndex =
      offset +
      Object.values(this._type.fields).reduce(
        (total, fieldType) => total + (fieldType.isVariableSize() ? 4 : fieldType.size(null)),
        0
      );
    const fixedSection = new DataView(output.buffer, output.byteOffset + offset);
    let fixedIndex = offset;
    let i = 0;
    const fieldTypes = Object.values(this._type.fields);
    for (const node of target.iterateNodesAtDepth(this.depth(), i, fieldTypes.length)) {
      const fieldType = fieldTypes[i];
      if (fieldType.isBasic()) {
        const s = fieldType.size();
        output.set(node.root.slice(0, s), fixedIndex);
        fixedIndex += s;
      }
      if (fieldType.isComposite()) {
        if (fieldType.isVariableSize()) {
          // write offset
          fixedSection.setUint32(fixedIndex - offset, variableIndex - offset, true);
          fixedIndex += 4;
          // write serialized element to variable section
          variableIndex = fieldType.tree.toBytes(new Tree(node), output, variableIndex);
        } else {
          fixedIndex = fieldType.tree.toBytes(new Tree(node), output, fixedIndex);
        }
      }
      i++;
    }
    return variableIndex;
  }
  gindexOfProperty(target: Tree, prop: PropertyKey): Gindex {
    const chunkIndex = Object.keys(this._type.fields).findIndex((fieldName) => fieldName === prop);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    return this.gindexOfChunk(target, chunkIndex);
  }
  getProperty<V extends keyof T>(target: Tree, property: V): PropOfTreeBacked<T, V> {
    const chunkIndex = Object.keys(this._type.fields).findIndex((fieldName) => fieldName === property);
    if (chunkIndex === -1) {
      return undefined;
    }
    const fieldType = this._type.fields[property as string];
    if (fieldType.isBasic()) {
      const chunk = this.getRootAtChunk(target, chunkIndex);
      return fieldType.fromBytes(chunk, 0) as PropOfTreeBacked<T, V>;
    }
    if (fieldType.isComposite()) {
      return fieldType.tree.asTreeBacked(this.getSubtreeAtChunk(target, chunkIndex)) as PropOfTreeBacked<T, V>;
    }
  }
  set(target: Tree, property: keyof T, value: T[keyof T]): boolean {
    const chunkIndex = Object.keys(this._type.fields).findIndex((fieldName) => fieldName === property);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    const chunkGindex = this.gindexOfChunk(target, chunkIndex);
    const fieldType = this._type.fields[property as string];
    if (fieldType.isBasic()) {
      const chunk = new Uint8Array(32);
      fieldType.toBytes(value, chunk, 0);
      target.setRoot(chunkGindex, chunk);
      return true;
    }
    if (fieldType.isComposite()) {
      if (isTreeBacked(value)) {
        target.setSubtree(chunkGindex, value.tree());
      } else {
        target.setSubtree(chunkGindex, fieldType.tree.fromStructural(value as ObjectLike));
      }
      return true;
    }
  }
  deleteProperty(target: Tree, property: keyof T): boolean {
    const chunkIndex = Object.keys(this._type.fields).findIndex((fieldName) => fieldName === property);
    if (chunkIndex === -1) {
      throw new Error("Invalid container field name");
    }
    const fieldType = this._type.fields[property as string];
    if (fieldType.isBasic()) {
      return this.set(target, property, fieldType.defaultValue() as PropOfTreeBacked<T, keyof T>);
    }
    if (fieldType.isComposite()) {
      return this.set(target, property, fieldType.tree.defaultValue() as PropOfTreeBacked<T, keyof T>);
    }
  }
  ownKeys(target: Tree): string[] {
    return Object.keys(this._type.fields);
  }
  getOwnPropertyDescriptor(target: Tree, property: keyof T): PropertyDescriptor {
    if (this._type.fields[property as string]) {
      return {
        configurable: true,
        enumerable: true,
        writable: true,
      };
    } else {
      return undefined;
    }
  }
  readOnlyEntries(target: Tree): [string, T[keyof T]][] {
    const entries: [string, T[keyof T]][] = [];
    const fields = Object.entries(this._type.fields);
    let i = 0;
    for (const node of target.iterateNodesAtDepth(this.depth(), 0, fields.length)) {
      const [fieldName, fieldType] = fields[i];
      if (fieldType.isBasic()) {
        const s = fieldType.size();
        entries.push([fieldName, fieldType.fromBytes(node.root.slice(0, s), 0)] as [string, T[keyof T]]);
      }
      if (fieldType.isComposite()) {
        entries.push([fieldName, fieldType.tree.asTreeBacked(new Tree(node))] as [string, T[keyof T]]);
      }
      i++;
    }
    return entries;
  }
}
