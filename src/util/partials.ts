import {ArrayType, ListType, Type, isBooleanType, isUintType, isBitListType, isBitVectorType, isContainerType, isVectorType, isByteVectorType, isListType} from "@chainsafe/ssz";
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
    // || isType(type) Type.byteList
    || isByteVectorType(type));
}

export function getRootNode<T>(data: any, type: Type<T>): Node<T> {
  return {
    type,
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

const getDepth = (count: number) => count == 0 ? 0 : new BN(count - 1).bitLength();

export function getChildNodes<T>(node: Node<T>): Array<Node<T>> {
  if(isBottomType(node.type)) {
      return [];
  } else if(isListType(node.type) || isVectorType(node.type)) {
    // dynamic length lists will have a limit that determines the depth in the future.
    // Just fake it to be 32 for now.
    let depth = 32;
    if (isVectorType(node.type)) {
      depth = getDepth(node.type.length)
    }
    let elementsPerChunk = 1;
    const elemType = (node.type as ListType).elementType;
    if (isUintType(elemType)) {
      elementsPerChunk = 32 / elemType.byteLength;
    } else if (isBooleanType(elemType)) {
      elementsPerChunk = 32;
    }
    return node.data.map((e: any, i: number): Node<T> => ({
      type: (node.type as ArrayType).elementType,
      data: e,
      key: i,
      genIndex: childIndex(node.genIndex, i, depth, elementsPerChunk),
    }));
  }
  if (isContainerType(node.type)) {
    const depth = getDepth(node.type.fields.length);
    return node.type.fields.map(([fieldName, fieldType], i): Node<T> => ({
      type: fieldType,
      data: node.data[fieldName],
      key: fieldName,
      genIndex: childIndex(node.genIndex, i, depth, 1),
    }));
  } else {
    return [];
  }
}
