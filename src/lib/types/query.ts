import { GroupByClauseArgs } from "./group-by";
import { LimitClauseArgs, PaginationClauseArgs } from "./limit";
import { OrderByClauseArgs } from "./order-by";
import { SelectClauseArgs } from "./select";
import { WhereClauseArgs } from "./where";

/**
 * Represents a query to select data from Zoho CRM
 *
 * @property columns - The columns to select
 * @property from - The table to select from
 * @property where - The where clause
 * @property groupBy - The group by clause
 * @property orderBy - The order by clause
 * @property limit - The limit clause, cannot be used if there if the pagination attribute is set.
 * @property pagination - An abstraction of the limit clause, cannot be used if there is a limit attribute set.
 *
 * @example
 * const query = {
 *      columns: ["id", "name", "age"],
 *      from: "Users",
 *      where: [
 *        { equals: [{ column: "name" }, { value: "John" }] },
 *        {
 *          between: {
 *            column: "age",
 *            valueRange: [20, 100],
 *          },
 *        },
 *        {
 *          in: {
 *            column: "id",
 *            valueSet: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
 *          },
 *        },
 *        {
 *          like: {
 *            column: "name",
 *            pattern: "John%",
 *          },
 *        },
 *        {
 *          raw: "1 = 1",
 *        },
 *      ],
 *      groupBy: ["id", "name", "age"],
 *      orderBy: [
 *        { column: "id", direction: "asc" },
 *        { column: "age", direction: "desc" },
 *      ],
 *      pagination: { page: 2, pageSize: 10 }, // Equivalent to limit: { limit: 10, offset: 10 }
 *    }
 */
export type SelectQuery<ModuleType = Record<string, unknown>> = {
  columns: SelectClauseArgs<ModuleType>;
  from: string;
  where?: WhereClauseArgs<ModuleType>;
  groupBy?: GroupByClauseArgs<ModuleType>;
  orderBy?: OrderByClauseArgs<ModuleType>;
  limit?: LimitClauseArgs;
  pagination?: PaginationClauseArgs;
};
