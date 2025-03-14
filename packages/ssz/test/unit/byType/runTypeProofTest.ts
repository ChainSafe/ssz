import {Node} from "@chainsafe/persistent-merkle-tree";
import {expect} from "vitest";
import {
  BitArray,
  ContainerType,
  JsonPath,
  OptionalType,
  ProfileType,
  StableContainerType,
  Type,
  fromHexString,
} from "../../../src/index.js";
import {CompositeTypeAny, isCompositeType} from "../../../src/type/composite.js";
import {ArrayBasicTreeView} from "../../../src/view/arrayBasic.js";
import {RootHex} from "../../lodestarTypes/index.js";
import {wrapErr} from "../../utils/error.js";

export function runProofTestOnAllJsonPaths({
  type,
  node,
  json,
  rootHex,
}: {
  type: CompositeTypeAny;
  node: Node;
  json: unknown;
  rootHex: RootHex;
}): void {
  const root = fromHexString(rootHex);
  const jsonPaths = getJsonPathsFromValue(json);

  for (const jsonPath of jsonPaths) {
    if (process.env.ONLY_JSON_PATH && !jsonPath.includes(process.env.ONLY_JSON_PATH)) {
      continue;
    }

    wrapErr(
      () => {
        if (type.tree_createProofGindexes(node, [jsonPath]).length === 0) {
          return;
        }

        const proof = type.tree_createProof(node, [jsonPath]);
        const viewFromProof = type.createFromProof(proof, root);

        const typeLeaf = getJsonPathType(type, jsonPath);
        const viewLeafFromProof = getJsonPathView(type, viewFromProof, jsonPath);
        const jsonLeaf = getJsonPathValue(type, json, jsonPath);

        const jsonLeafFromProof =
          viewLeafFromProof == null
            ? viewLeafFromProof
            : typeLeaf.toJson(
                isCompositeType(typeLeaf) ? typeLeaf.toValueFromView(viewLeafFromProof) : viewLeafFromProof
              );

        expect(jsonLeafFromProof).to.deep.equal(jsonLeaf, "Wrong value fromProof");

        // TODO: Ensure the value is the same
        viewFromProof;
      },
      `Proof JSON path ${JSON.stringify(jsonPath)}`
    );
  }
}

/**
 * Programatically derive all possible JSON paths from an SSZ value in JSON format.
 * Used to test roundtrip proof generation for all types defined in the unit tests.
 */
function getJsonPathsFromValue(value: unknown, parentPath: JsonPath = [], jsonPaths: JsonPath[] = []): JsonPath[] {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      // Array
      for (let i = 0; i < value.length; i++) {
        const jsonPath = [...parentPath, i];
        getJsonPathsFromValue(value[i], jsonPath, jsonPaths);
      }
    }

    // BitArray and ByteVector
    else if (value instanceof Uint8Array || value instanceof BitArray) {
      // Ignore
    }

    // Container value
    else {
      for (const key of Object.keys(value)) {
        const jsonPath = [...parentPath, key];
        getJsonPathsFromValue(value[key as keyof typeof value], jsonPath, jsonPaths);
      }
    }
  }

  if (parentPath.length > 0) {
    jsonPaths.push(parentPath);
  }

  return jsonPaths;
}

/**
 * Returns the end type of a JSON path
 */
function getJsonPathType(type: CompositeTypeAny, jsonPath: JsonPath): Type<unknown> {
  for (const jsonProp of jsonPath) {
    type = type.getPropertyType(jsonProp) as CompositeTypeAny;
  }
  return type;
}

/**
 * Returns the end view of a CompositeType view or BasicType value of a JSON path.
 * Requires the type to coerce jsonProp to a fieldName.
 * JSON paths may be in JSON notation or fieldName notation
 */
function getJsonPathView(type: Type<unknown>, view: unknown, jsonPath: JsonPath): unknown {
  for (const jsonProp of jsonPath) {
    if (type instanceof OptionalType) {
      type = type.elementType;
    }
    if (typeof jsonProp === "number") {
      view = (view as ArrayBasicTreeView<any>).get(jsonProp);
    } else if (typeof jsonProp === "string") {
      if (type instanceof ContainerType || type instanceof StableContainerType || type instanceof ProfileType) {
        // Coerce jsonProp to a fieldName. JSON paths may be in JSON notation or fieldName notation
        const fieldName =
          // biome-ignore lint/complexity/useLiteralKeys: The key `jsonKeyToFieldName` is protected field
          (type as ContainerType<Record<string, Type<unknown>>>)["jsonKeyToFieldName"][jsonProp] ?? jsonProp;
        view = (view as Record<string, unknown>)[fieldName as string];
      } else {
        throw Error(`type ${type.typeName} is not a ContainerType - jsonProp '${jsonProp}'`);
      }
    } else {
      throw Error(`jsonProp type '${jsonProp}' not supported`);
    }

    type = (type as CompositeTypeAny).getPropertyType(jsonProp);
  }

  return view;
}

/**
 * Returns the end JSON value of a JSON value of a JSON path.
 * Requires the type to coerce jsonProp to a fieldName.
 * JSON paths may be in JSON notation or fieldName notation
 */
function getJsonPathValue(type: Type<unknown>, json: unknown, jsonPath: JsonPath): unknown {
  for (const jsonProp of jsonPath) {
    if (type instanceof OptionalType) {
      type = type.elementType;
    }
    if (typeof jsonProp === "number") {
      json = (json as unknown[])[jsonProp];
    } else if (typeof jsonProp === "string") {
      if (type instanceof ContainerType || type instanceof StableContainerType || type instanceof ProfileType) {
        // biome-ignore lint/complexity/useLiteralKeys: The key `jsonKeyToFieldName` is protected field
        if ((type as ContainerType<Record<string, Type<unknown>>>)["jsonKeyToFieldName"][jsonProp] === undefined) {
          throw Error(`Unknown jsonProp ${jsonProp} for type ${type.typeName}`);
        }

        // TODO: Coerce jsonProp to a jsonKey. JSON paths may be in JSON notation or fieldName notation
        const jsonKey = jsonProp;
        json = (json as Record<string, unknown>)[jsonKey];
      } else {
        throw Error(`type ${type.typeName} is not a ContainerType - jsonProp '${jsonProp}'`);
      }
    } else {
      throw Error(`jsonProp type '${jsonProp}' not supported`);
    }

    type = (type as CompositeTypeAny).getPropertyType(jsonProp);
  }

  return json;
}
