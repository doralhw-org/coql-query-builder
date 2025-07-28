import { SelectQuery } from "../../types";

export type LimitClauseBuilderArgs = {
  limit: SelectQuery["limit"];
};

export const limitClauseBuilder = ({
  limit: limitClauseArgs,
}: LimitClauseBuilderArgs): string => {
  if (!limitClauseArgs) return "";

  const { limit, offset } = limitClauseArgs;

  if (limit <= 0) {
    throw new Error("Limit cannot be less than 1");
  }

  if (limit > 2000) {
    throw new Error("Limit cannot be greater than 2000");
  }

  if (limit + (offset ?? 0) > 100000) {
    throw new Error("Sum of limit and offset cannot be greater than 100000");
  }

  const limitClauseElements = [`limit ${limit}`];

  if (offset) {
    limitClauseElements.push(`offset ${offset}`);
  }

  return limitClauseElements.join(" ");
};

export type PaginationClauseBuilderArgs = {
  pagination: SelectQuery["pagination"];
};

export const paginationClauseBuilder = ({
  pagination,
}: PaginationClauseBuilderArgs): string => {
  if (!pagination) return "";

  return limitClauseBuilder({
    limit: {
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
    },
  });
};
