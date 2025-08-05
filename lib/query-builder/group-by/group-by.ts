import { SelectQuery } from "../../types";

export type GroupByClauseBuilderArgs = {
  groupBy: SelectQuery["groupBy"];
};

export const groupByClauseBuilder = ({
  groupBy,
}: GroupByClauseBuilderArgs): string => {
  if (!groupBy) return "";

  if (!groupBy.length) {
    throw new Error("Group by clause cannot be empty");
  }

  if (groupBy.length > 4) {
    throw new Error("Group by clause cannot contain more than 4 columns");
  }

  return `group by ${groupBy.join(", ")}`;
};
