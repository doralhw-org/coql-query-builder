import { QueryBuilderConfiguration, SelectQuery } from "../types";
import { groupByClauseBuilder } from "./group-by/group-by";
import { limitClauseBuilder, paginationClauseBuilder } from "./limit/limit";
import { orderByClauseBuilder } from "./order-by/order-by";
import { selectClauseBuilder } from "./select/select";
import { whereClauseBuilder } from "./where/where";

export const queryBuilder = (
  query: SelectQuery,
  config?: QueryBuilderConfiguration
): string[] => {
  const groupByClause = groupByClauseBuilder({
    groupBy: query.groupBy,
  });

  const selectClauses = selectClauseBuilder({
    columns: query.columns,
    from: query.from,
    config: {
      groupByClauseExists: Boolean(groupByClause),
      automaticColumnAliasing: config?.automaticColumnAliasing ?? "none",
    },
  });

  const whereClauses = whereClauseBuilder({
    where: query.where,
  });

  const orderByClause = orderByClauseBuilder({
    orderBy: query.orderBy,
  });

  const limitClause = limitClauseBuilder({
    limit: query.limit,
  });

  const paginationClause = paginationClauseBuilder({
    pagination: query.pagination,
  });

  if (query.pagination && query.limit) {
    throw new Error(
      "Cannot provide both pagination and limit as they conflict with each other"
    );
  }

  if ((query.pagination || query.limit) && whereClauses.length > 1) {
    throw new Error(
      "Cannot provide pagination or limit when using multiple where clauses, reduce the amount of elements in your IN conditions"
    );
  }

  if (groupByClause && (whereClauses.length > 1 || selectClauses.length > 1)) {
    throw new Error(
      "Cannot provide a group by clause when using multiple where clauses or select clauses, reduce the amount of selected columns or elements in your IN conditions"
    );
  }

  const otherClauses = [
    groupByClause,
    orderByClause,
    limitClause,
    paginationClause,
  ].filter(Boolean);

  const queries = [];

  for (const selectClause of selectClauses) {
    for (const whereClause of whereClauses) {
      const query = `${selectClause} ${whereClause} ${otherClauses.join(" ")}`;

      queries.push(query.trim());
    }
  }

  return queries;
};
