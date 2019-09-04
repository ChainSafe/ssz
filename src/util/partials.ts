import {ArrayType, FullSSZType, ListType, Type} from "@chainsafe/ssz";
import BN from "bn.js";

// binary string
type GenIndex = string

export type Node = {
    type: FullSSZType;
    data: any;
    key: string | number;
    genIndex: GenIndex;
}

export function isBottomType(typ: FullSSZType) {
    return (typ.type == Type.uint
        || typ.type == Type.bool
        || typ.type == Type.bitList
        || typ.type == Type.bitVector
        || typ.type == Type.byteList
        || typ.type == Type.byteVector);
}

export function getRootNode(data: any, typ: FullSSZType): Node {
    return {
        type: typ,
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

export function getChildNodes(node: Node): Array<Node> {
    switch (node.type.type) {
        case Type.uint:
        case Type.bool:
        case Type.bitList:
        case Type.bitVector:
        case Type.byteList:
        case Type.byteVector:
            return [];
        case Type.list:
        case Type.vector: {
            // dynamic length lists will have a limit that determines the depth in the future.
            // Just fake it to be 32 for now.
            let depth = 32;
            if (node.type.type == Type.vector) {
                depth = getDepth(node.type.length)
            }
            let elementsPerChunk = 1;
            const elemType = (node.type as ListType).elementType;
            if (elemType.type == Type.uint) {
                elementsPerChunk = 32 / elemType.byteLength;
            } else if (elemType.type == Type.bool) {
                elementsPerChunk = 32;
            }
            return node.data.map((e: any, i: number): Node => ({
                type: (node.type as ArrayType).elementType,
                data: e,
                key: i,
                genIndex: childIndex(node.genIndex, i, depth, elementsPerChunk),
            }));
        }
        case Type.container: {
            const depth = getDepth(node.type.fields.length);
            return node.type.fields.map(([fieldName, fieldType], i): Node => ({
                type: fieldType,
                data: node.data[fieldName],
                key: fieldName,
                genIndex: childIndex(node.genIndex, i, depth, 1),
            }));
        }
    }
}
