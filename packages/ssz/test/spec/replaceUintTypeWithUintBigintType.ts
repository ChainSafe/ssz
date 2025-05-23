// #######################################
// # MUST NOT IMPORT FROM @chainsafe/ssz #
// #######################################
import {
  ContainerNodeStructType,
  ContainerType,
  ListBasicType,
  ListCompositeType,
  Type,
  UintBigintType,
  UintNumberType,
  VectorBasicType,
  VectorCompositeType,
} from "../../src/index.ts";

/**
 * Transform the type to something that is safe to deserialize
 *
 * This mainly entails making sure all numbers are bignumbers
 */
export function replaceUintTypeWithUintBigintType<T extends Type<any>>(type: T): T {
  if (type instanceof UintNumberType && type.byteLength === 8) {
    return new UintBigintType(type.byteLength) as unknown as T;
  }

  // For Container iterate and replace all sub properties
  if (type instanceof ContainerType) {
    const fields = {...type.fields};
    for (const key of Object.keys(fields) as (keyof typeof fields)[]) {
      fields[key] = replaceUintTypeWithUintBigintType(fields[key]);
    }

    if (type instanceof ContainerNodeStructType) {
      return new ContainerNodeStructType(fields, type.opts) as unknown as T;
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
