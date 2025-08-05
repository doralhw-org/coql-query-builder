export type GroupByClauseArgs<ModuleType = Record<string, unknown>> =
  (keyof ModuleType & string)[];
