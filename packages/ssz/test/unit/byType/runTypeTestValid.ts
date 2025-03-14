import {describe, expect, it } from "vitest";
import {TreeViewDU, UnionType, toHexString } from "../../../src/index.js";
import {Type} from "../../../src/type/abstract.js";
import {isCompositeType} from "../../../src/type/composite.js";
import {runValidSszTest, toJsonOrString} from "../../spec/runValidTest.js";
import {runProofTestOnAllJsonPaths} from "./runTypeProofTest.js";



export type TypeTestValid = {
  id?: string;
  serialized: string;
  json: unknown;
  root: string | null;
};

/**
 * Generate various tests for a given type and and array of VALID values. Tests:
 * - [x] .clone()
 * - [x] .defaultValue()
 * - [x] .deserialize()
 * - [x] .serialize()
 * - [x] .equals()
 * - [x] .hashTreeRoot()
 * - [x] .fromJson()
 * - [x] .toJson()
 * - [ ] .createProof()
 *
 * Example of a full test:
 * ```ts
 * runTypeTestValid({
 *   typeName: "boolean",
 *   type: booleanType,
 *   defaultValue: false,
 *   values: [{
 *     id: "true",
 *     serialized: "0x01",
 *     json: true,
 *     root: "0x0100000000000000000000000000000000000000000000000000000000000000",
 *   }],
 * });
 * ```
 *
 * Example of a short test:
 * ```ts
 * runTypeTestValid({
 *   typeName: "NumberUintType(2)",
 *   type: new NumberUintType({byteLength: 2}),
 *   values: [
 *     {value: 2 ** 8, serialized: "0x0001"},
 *   ],
 * });
 *
 * ```
 */
export function runTypeTestValid<T>({
  type,
  typeName,
  defaultValue,
  minSize,
  maxSize,
  values,
  notEqualValues,
}: {
  type: Type<T>;
  typeName?: string;
  defaultValue?: T;
  minSize?: number;
  maxSize?: number;
  values: TypeTestValid[];
  notEqualValues?: {id: string; a: T; b: T}[];
}): void {
  describe(`${typeName ?? type.typeName} valid`, () => {
    if (defaultValue !== undefined) {
      it("defaultValue", () => {
        expect(toJsonOrString(type.toJson(type.defaultValue()))).to.deep.equal(
          toJsonOrString(type.toJson(defaultValue))
        );
      });
    }

    if (minSize !== undefined) {
      it("minSize", () => {
        expect(type.minSize).to.equal(minSize);
      });
    }

    if (maxSize !== undefined) {
      it("maxSize", () => {
        expect(type.maxSize).to.equal(maxSize);
      });
    }

    for (let i = 0; i < values.length; i++) {
      const testCase = values[i];

      it(`${typeName ?? type.typeName} value ${i} - ${testCase.id ?? testCase.serialized}`, () => {
        let rootHex: string;
        if (typeof testCase.root === "string") {
          rootHex = testCase.root;
        } else {
          if (type.isBasic) {
            rootHex = testCase.serialized.padEnd(32 * 2 + 2, "0");
          } else {
            throw Error("Must set root");
          }
        }

        const {node, json} = runValidSszTest(type, {
          root: rootHex,
          serialized: testCase.serialized,
          jsonValue: testCase.json,
        });

        // Test proofs functionality for all JSON paths
        if (
          isCompositeType(type) &&
          // Proofs not implemented for UnionType
          !(type instanceof UnionType)
        ) {
          runProofTestOnAllJsonPaths({type, node, json, rootHex});

          // Test tree_getLeafGindices()
          // TODO: Assert result
          type.tree_getLeafGindices(BigInt(0), node);

          // View-ViewDU conversions
          const viewDU = type.getViewDU(node);
          const view = type.toViewFromViewDU(viewDU);
          const viewDU2 = type.toViewDUFromView(view);
          expect(toHexString(type.commitView(view).root)).equals(rootHex, "Wrong recovered View");
          expect(toHexString(type.commitViewDU(viewDU2).root)).equals(rootHex, "Wrong recovered ViewDU");

          // Cache manipulation
          const viewDUCache = type.cacheOfViewDU(viewDU);
          type.getViewDU(node, viewDUCache);

          if (viewDU instanceof TreeViewDU) {
            // Clone without cache
            const clonedNoCache = viewDU.clone(true);
            expect(clonedNoCache.cache).deep.equals(viewDUCache, "Cloned cache should be empty");
          }
        }
      });
    }

    if (notEqualValues) {
      for (const {id, a, b} of notEqualValues) {
        it(`Not equal values: ${id}`, () => {
          expect(type.equals(a, b)).to.equal(false);
        });
      }
    }
  });
}
