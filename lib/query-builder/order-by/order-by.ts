import { SelectQuery } from "../../types";

export type OrderByClauseBuilderArgs = {
  orderBy: SelectQuery["orderBy"];
};

export const orderByClauseBuilder = ({
  orderBy,
}: OrderByClauseBuilderArgs): string => {
  if (!orderBy) return "";

  if (!orderBy.length) {
    throw new Error("Order by clause cannot be empty");
  }

  if (orderBy.length > 10) {
    throw new Error("Order by clause cannot contain more than 10 columns");
  }

  const orderByColumns = orderBy.map(({ column, direction }) => {
    return `${column} ${direction}`;
  });

  return `order by ${orderByColumns.join(", ")}`;
};
