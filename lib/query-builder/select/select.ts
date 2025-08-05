import { SelectQuery } from "../../types";

export type SelectClauseBuilderArgs = {
  columns: SelectQuery["columns"];
  from: SelectQuery["from"];
  groupByClauseExists?: boolean;
};

export const selectClauseBuilder = ({
  columns,
  from,
  groupByClauseExists,
}: SelectClauseBuilderArgs): string[] => {
  if (columns.length === 0) {
    throw new Error("Columns to select are required.");
  }

  const selectQueryParts = [];

  const stringifiedColumns = columns.map((column) => {
    if (typeof column === "string") {
      return column;
    }

    const alias = column.alias?.trim();

    if (!alias) {
      return column.column;
    }

    return `${column.column} as ${alias}`;
  });

  if (
    stringifiedColumns.find((column) => column.startsWith("id as")) &&
    !groupByClauseExists
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
      !columnsToBatch.slice(0, 50).includes(idColumn) && !groupByClauseExists;

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
