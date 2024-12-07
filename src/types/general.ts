import {
    EventLog,
  } from "../../generated/src/Types.gen";
  
  export type Event<Params extends object = {}> = EventLog<Params>;
  
  export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
//   export type Address = string;
  export type Address = `0x${string}`;
  
  export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
      ? RecursivePartial<U>[]
      : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
  };
  