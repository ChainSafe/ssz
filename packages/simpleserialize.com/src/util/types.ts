import {
  Type,
  UintNumberType,
  UintBigintType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  VectorBasicType,
  VectorCompositeType,
} from "@chainsafe/ssz";
import {ssz} from "@lodestar/types";

let {
  phase0,
  altair,
  bellatrix,
  capella,
  deneb,
  allForks,
  allForksBlinded,
  allForksBlobs,
  allForksExecution,
  allForksLightClient,
  ...primitive
} = ssz;

phase0 = patchSszTypes(phase0);
altair = patchSszTypes(altair);
bellatrix = patchSszTypes(bellatrix);
capella = patchSszTypes(capella);
primitive = patchSszTypes(primitive);

export const forks = {
  phase0: {...phase0, ...primitive},
  altair: {...phase0, ...altair, ...primitive},
  bellatrix: {...phase0, ...altair, ...bellatrix, ...primitive},
  capella: {...phase0, ...altair, ...bellatrix, ...capella, ...primitive},
} as Record<string, Record<string, Type<unknown>>>;

export type ForkName = keyof typeof forks;

export function typeNames<T>(types: Record<string, Type<T>>): string[] {
  return Object.keys(types).sort();
}

/**
 * Patch SSZ types to support the full uint64 range on the website
 */
function patchSszTypes<T extends Record<keyof T, Type<unknown>>>(sszTypes: T): T {
  const types = {...sszTypes};
  for (const key of Object.keys(types) as (keyof typeof types)[]) {
    types[key] = replaceUintTypeWithUintBigintType(types[key]);
  }
  return types;
}

function replaceUintTypeWithUintBigintType<T extends Type<unknown>>(type: T): T {
  if (type instanceof UintNumberType && type.byteLength === 8) {
    return new UintBigintType(type.byteLength) as unknown as T;
  }

  // For Container iterate and replace all sub properties
  if (type instanceof ContainerType) {
    const fields = {...type.fields};
    for (const key of Object.keys(fields) as (keyof typeof fields)[]) {
      fields[key] = replaceUintTypeWithUintBigintType(fields[key]);
    }
    return new ContainerType(fields, type.opts) as unknown as T;
  }

  // For List or vectors replace the subType
  if (type instanceof ListBasicType) {
    return new ListBasicType(replaceUintTypeWithUintBigintType(type.elementType), type.limit) as unknown as T;
  }
  if (type instanceof VectorBasicType) {
    return new VectorBasicType(replaceUintTypeWithUintBigintType(type.elementType), type.length) as unknown as T;
  }
  if (type instanceof ListCompositeType) {
    return new ListCompositeType(replaceUintTypeWithUintBigintType(type.elementType), type.limit) as unknown as T;
  }
  if (type instanceof VectorCompositeType) {
    return new VectorCompositeType(replaceUintTypeWithUintBigintType(type.elementType), type.length) as unknown as T;
  }

  return type;
}
