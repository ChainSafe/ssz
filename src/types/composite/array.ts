import {ArrayLike} from "../../interface";
import {Type} from "../type";
import {BasicType} from "../basic";
import {CompositeType} from "./abstract";

export interface IArrayOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementType: Type<any>;
}

export abstract class BasicArrayType<T extends ArrayLike<unknown>> extends CompositeType<T> {
  elementType: BasicType<unknown>;
  constructor(options: IArrayOptions) {
    super();
    this.elementType = options.elementType as BasicType<T>;
  }
}

export abstract class CompositeArrayType<T extends ArrayLike<unknown>> extends CompositeType<T> {
  elementType: CompositeType<Record<string, unknown>>;
  constructor(options: IArrayOptions) {
    super();
    this.elementType = (options.elementType as unknown) as CompositeType<Record<string, unknown>>;
  }
}
