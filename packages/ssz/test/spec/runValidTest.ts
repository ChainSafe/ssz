import {expect} from "chai";
import {Node} from "@chainsafe/persistent-merkle-tree";
import {CompositeType, toHexString, Type} from "../../src";
import {ValidTestCaseData} from "./testRunner";

/* eslint-disable no-console */

export function runValidSszTest(type: Type<unknown>, testData: ValidTestCaseData): void {
  const testDataSerialized = toHexString(testData.serialized);
  const testDataRoot = toHexString(testData.root);

  if (process.env.DEBUG) {
    console.log("serialized", Buffer.from(testData.serialized).toString("hex"));
  }

  function assertBytes(bytes: Uint8Array, msg: string): void {
    expect(toHexString(bytes)).to.equal(testDataSerialized, `Wrong serialized - ${msg}`);
  }

  function assertValue(value: unknown, msg: string): void {
    expect(type.toJson(value)).to.deep.equal(testData.jsonValue, `Wrong value - ${msg}`);
  }

  function assertRoot(root: Uint8Array, msg: string): void {
    expect(toHexString(root)).to.equal(testDataRoot, `Wrong root - ${msg}`);
  }

  function assertNode(node: Node, msg: string): void {
    expect(toHexString(node.root)).to.equal(testDataRoot, `Wrong node - ${msg}`);
  }

  // JSON -> value - fromJson()
  const testDataValue = wrapErr(() => type.fromJson(testData.jsonValue), "type.fromJson()");

  // value -> bytes - serialize()
  const serialized = wrapErr(() => type.serialize(testDataValue), "type.serialize()");
  assertBytes(serialized, "type.serialize()");

  {
    // bytes -> value - deserialize()
    const value = wrapErr(() => type.deserialize(copy(testData.serialized)), "type.deserialize()");
    assertValue(value, "type.deserialize()");
  }

  {
    // hashTreeRoot()
    const root = wrapErr(() => type.hashTreeRoot(testDataValue), "type.hashTreeRoot()");
    assertRoot(root, "type.hashTreeRoot()");
  }

  // value -> tree - value_toTree()
  const node = wrapErr(() => type.value_toTree(testDataValue), "type.value_toTree()");
  assertNode(node, "type.value_toTree()");

  {
    // tree -> value -
    const value = wrapErr(() => type.tree_toValue(node), "type.tree_toValue()");
    assertValue(value, "type.tree_toValue()");
  }

  {
    // tree -> bytes
    const output = new Uint8Array(type.tree_serializedSize(node));
    type.tree_serializeToBytes(output, 0, node);
    assertBytes(output, "type.tree_serializeToBytes");
  }

  {
    // bytes -> tree
    const node = type.tree_deserializeFromBytes(copy(testData.serialized), 0, testData.serialized.length);
    assertNode(node, "type.tree_deserializeFromBytes()");
  }

  if (!type.isBasic) {
    const compositeType = type as CompositeType<unknown, unknown, unknown>;

    const view = compositeType.deserializeToView(copy(testData.serialized));
    assertNode(compositeType.commitView(view), "deserializeToView");

    const viewDU = compositeType.deserializeToViewDU(copy(testData.serialized));
    assertNode(compositeType.commitViewDU(viewDU), "deserializeToViewDU");
  }
}

function copy(buf: Uint8Array): Uint8Array {
  const copy = new Uint8Array(buf.length);
  copy.set(buf);
  return copy;
}

function wrapErr<T>(fn: () => T, prefix: string): T {
  try {
    return fn();
  } catch (e) {
    (e as Error).message = `${prefix}: ${(e as Error).message}`;
    throw e;
  }
}
