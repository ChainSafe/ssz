import {ListType, Type, isBooleanType, isUintType, isBitListType, isBitVectorType, isContainerType, isVectorType, isByteVectorType, isListType} from "@chainsafe/ssz";
import BN from "bn.js";

// binary string
type GenIndex = string

export type Node<T> = {
  type: Type<T>;
  data: any;
  key: string | number;
  genIndex: GenIndex;
}

export function isBottomType<T>(type: Type<T>) {
  return (isUintType(type)
    || isBooleanType(type)
    || isBitListType(type)
    || isBitVectorType(type)
    || isByteVectorType(type));
}

export function getRootNode<T>(data: any, type: Type<T>): Node<T> {
  return {
    type: {_typeSymbols: type._typeSymbols, fields: type.fields, depth: type.tree.depth()},
    data: data,
    key: "root",
    genIndex: "1",
  }
}

const childIndex = (parentIndex: GenIndex, listIndex: number, depth: number, elementsPerChunk: number): GenIndex => {
  let genIndex = parentIndex;
  const chunkIndex = Math.floor(listIndex / elementsPerChunk);
  for (let i = depth-1; i >= 0; i--) {
    if ((chunkIndex & (1 << i)) !== 0) {
      genIndex += "1";
    } else {
      genIndex += "0";
    }
  }
  return genIndex;
};

export function getChildNodes<T>(node: Node<T>): Array<Node<T>> {
  const { type, data, genIndex, depth } = node;
  if(isBottomType(type)) {
      return [];
  } else if(isListType(type) || isVectorType(type)) {
    let elementsPerChunk = 1;
    const elemType = (type as ListType).elementType;
    if (isUintType(elemType)) {
      elementsPerChunk = 32 / elemType.byteLength;
    } else if (isBooleanType(elemType)) {
      elementsPerChunk = 32;
    }
    return data.map((e: any, i: number): Node<T> => ({
      type: (type as ArrayType).elementType,
      data: e,
      key: i,
      genIndex: childIndex(genIndex, i, depth, elementsPerChunk),
    }));
  }
  if (isContainerType(type)) {
    // const depth = type.tree.depth();
    const { fields } = type;
    return Object.keys(fields).map((i): Node<T> => ({
      // type: fieldType,
      data: data[i],
      key: i,
      // genIndex: childIndex(genIndex, i, depth, 1),
    }));
  } else {
    return [];
  }
}
