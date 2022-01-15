/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
, @typescript-eslint/no-explicit-any */

// #######################################
// # MUST NOT IMPORT FROM @chainsafe/ssz #
// #######################################
import {Type, UintNumberType, UintBigintType, ContainerType, ListBasicType, VectorBasicType} from "../../src";

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
    return new ContainerType(fields) as unknown as T;
  }

  // For List or vectors replace the subType
  if (type instanceof ListBasicType) {
    return new ListBasicType(replaceUintTypeWithUintBigintType(type.elementType), type.limit) as unknown as T;
  }

  if (type instanceof VectorBasicType) {
    return new VectorBasicType(replaceUintTypeWithUintBigintType(type.elementType), type.length) as unknown as T;
  }

  return type;
}
