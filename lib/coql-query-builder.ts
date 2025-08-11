import { queryBuilder } from "./query-builder";
import { CrmCoqlQueryFunction, CrmCoqlRecord } from "./types/crm";
import { QueryBuilderConfiguration, SelectQuery } from "./types/query";

type CoqlQueryBuilderArgs = {
  queryFunction: CrmCoqlQueryFunction;
  config?: QueryBuilderConfiguration;
};

/**
 * COQL Query Builder
 *
 * This class provides a simple query builder for interacting with Zoho CRM using COQL queries.
 * It allows you to build and execute complex queries, and return the results as an array of records.
 *
 * @example
 * const coqlQueryBuilder = new CoqlQueryBuilder({
 *   queryFunction: queryCrm,
 * });
 *
 * const records = await coqlQueryBuilder.select({
 *   columns: ["id", "name"],
 *   from: "Users",
 *   where: [
 *     { equals: [{ column: "id" }, { value: "123" }] },
 *   ],
 * });
 */
export class CoqlQueryBuilder {
  private readonly queryFunction: CrmCoqlQueryFunction;
  private readonly config?: QueryBuilderConfiguration;

  constructor(args: CoqlQueryBuilderArgs) {
    this.queryFunction = args.queryFunction;
    this.config = args.config;
  }

  /**
   * Select records from Zoho CRM
   *
   * Handles workarounds for Zoho's COQL limitations such as column selection limits
   * and IN condition value limits.
   *
   * If IN conditions limits are surpassed, limit and pagination query attributes won't
   * be supported.
   *
   * @template ModuleType - The module type to select from, will provide Intellisense for the columns
   * @template RecordType - The record type to return
   *
   * @param query - The query to execute
   * @returns An array of records from Zoho CRM
   */
  async select<
    ModuleType extends CrmCoqlRecord = CrmCoqlRecord,
    RecordType extends Partial<CrmCoqlRecord> = CrmCoqlRecord
  >(query: SelectQuery<ModuleType>, config?: QueryBuilderConfiguration): Promise<RecordType[]> {
    const coqlQueries = this.buildQuery(query, config);

    const responses = await Promise.all(
      coqlQueries.map((coqlQuery) => this.queryFunction<RecordType>(coqlQuery))
    );

    const responsesData = responses
      .map((response) => response.data)
      .flat()
      .filter(Boolean);

    // If there is only one query, return the data directly as there is no need to deduplicate or merge partial records
    if (coqlQueries.length === 1) {
      return responsesData;
    }

    // Deduplication and partial record merging
    const recordDictionary = responsesData.reduce<Record<string, RecordType>>(
      (acc, currentRecord) => {
        acc[currentRecord.id!] = { ...acc[currentRecord.id!], ...currentRecord };

        return acc;
      },
      {}
    );

    return Object.values(recordDictionary);
  }

  /**
   * Builds a set of COQL queries, based on the provided query
   *
   * If the query exceeds column selection limits it will then build a new query
   * with the remaining columns. Each of these will select the id of the record to
   * make it possible to reliably merge the results together.
   *
   * If the where clause contains a IN condition that exceeds the limit of 50 values
   * it will then build a new query to match for the remaining values. Limit and pagination
   * are not supported in these cases.
   *
   * @template ModuleType - The module type to select from, will provide Intellisense for the columns
   *
   * @param query - The query to build
   * @returns An array of COQL queries
   */
  buildQuery<ModuleType extends CrmCoqlRecord = CrmCoqlRecord>(
    query: SelectQuery<ModuleType>,
    config?: QueryBuilderConfiguration
  ): string[] {
    const queryBuilderConfig = {
      ...this.config,
      ...config,
    };

    return queryBuilder(query as SelectQuery, queryBuilderConfig);
  }
}
