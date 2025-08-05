import { FlattenKeys } from "./utils";

export type SelectClauseArgs<ModuleType = Record<string, unknown>> =
  SelectColumn<ModuleType>[];

export type SelectColumn<ModuleType = Record<string, unknown>> =
  | {
      column: FlattenKeys<ModuleType>;
      alias: string;
    }
  | FlattenKeys<ModuleType>;
