import { QueryBuilderConfiguration, SelectQuery } from "../../types";
import { transformZohoColumnToCamelCase } from "../../utils";

type SelectClauseBuilderConfig = Pick<
  QueryBuilderConfiguration,
  "automaticColumnAliasing"
> & {
  groupByClauseExists?: boolean;
};

export type SelectClauseBuilderArgs = {
  columns: SelectQuery["columns"];
  from: SelectQuery["from"];
  config?: SelectClauseBuilderConfig;
};

export const selectClauseBuilder = ({
  columns,
  from,
  config,
}: SelectClauseBuilderArgs): string[] => {
  if (columns.length === 0) {
    throw new Error("Columns to select are required.");
  }

  const selectQueryParts = [];

  const stringifiedColumns = columns.map((column) => {
    const isAliasedColumn = typeof column === "object";

    const columnName = isAliasedColumn ? column.column : column;
    let alias = isAliasedColumn ? column.alias?.trim() : undefined;

    if (config?.automaticColumnAliasing === "camelCase" && !alias) {
      alias = transformZohoColumnToCamelCase(columnName);
    }

    if (alias && alias !== columnName) {
      return `${columnName} as ${alias}`;
    }

    return columnName;
  });

  if (
    stringifiedColumns.find((column) => column.startsWith("id as")) &&
    !config?.groupByClauseExists
  ) {
    throw new Error(
      "The id column cannot be aliased in queries without a group by clause."
    );
  }

  let idColumn = stringifiedColumns.find(
    (stringifiedColumn) =>
      stringifiedColumn.startsWith("id") || stringifiedColumn.endsWith("as id")
  );

  if (!idColumn) {
    idColumn = "id";
  }

  const columnsToBatch = stringifiedColumns;
  const columnBatches = [];

  while (columnsToBatch.length > 0) {
    const shouldAddIdColumn =
      !columnsToBatch.slice(0, 50).includes(idColumn) &&
      !config?.groupByClauseExists;

    if (shouldAddIdColumn) {
      const batch = columnsToBatch.splice(0, 49);
      columnBatches.push(["id", ...batch]);
      continue;
    }

    const batch = columnsToBatch.splice(0, 50);
    columnBatches.push(batch);
  }

  for (const batch of columnBatches) {
    selectQueryParts.push(`select ${batch.join(", ")} from ${from}`);
  }

  return selectQueryParts;
};
