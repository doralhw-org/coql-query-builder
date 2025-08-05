export type OrderByClauseArgs<ModuleType = Record<string, unknown>> =
  OrderByItem<ModuleType>[];

export type OrderByItem<ModuleType = Record<string, unknown>> = {
  column: keyof ModuleType & string;
  direction: "asc" | "desc";
};
