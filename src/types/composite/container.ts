import {ObjectLike} from "../../interface";
import {CompositeType} from "./abstract";
import {isTypeOf} from "../basic";
import {Type} from "../type";
import {ContainerStructuralHandler, ContainerTreeHandler, ContainerByteArrayHandler} from "../../backings";

export interface IContainerOptions<T extends ObjectLike> {
  fields: Record<keyof T, Type<unknown>>;
}

export const CONTAINER_TYPE = Symbol.for("ssz/ContainerType");

export function isContainerType<T extends ObjectLike = ObjectLike>(type: unknown): type is ContainerType<T> {
  return isTypeOf(type, CONTAINER_TYPE);
}

export class ContainerType<T extends ObjectLike = ObjectLike> extends CompositeType<T> {
  // ES6 ensures key order is chronological
  fields: Record<string, Type<unknown>>;
  constructor(options: IContainerOptions<T>) {
    super();
    this.fields = {...options.fields};
    this.structural = new ContainerStructuralHandler(this);
    this.tree = new ContainerTreeHandler(this);
    this.byteArray = new ContainerByteArrayHandler(this);
    this._typeSymbols.add(CONTAINER_TYPE);
  }
  isVariableSize(): boolean {
    return Object.values(this.fields as Record<string, Type<unknown>>).some((fieldType) => fieldType.isVariableSize());
  }
  chunkCount(): number {
    return Object.keys(this.fields).length;
  }
}
