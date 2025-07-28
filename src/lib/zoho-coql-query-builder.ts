import { queryBuilder } from "./query-builder/query-builder";
import { SelectQuery } from "./types/query";
import { ZohoCrmCoqlQueryFunction, ZohoCrmCoqlRecord } from "./types/zoho";

type ZohoCoqlQueryBuilderOptions = {
  queryFunction: ZohoCrmCoqlQueryFunction;
};

/**
 * Zoho COQL Query Builder
 *
 * This class provides a simple query builder for interacting with Zoho CRM using COQL queries.
 * It allows you to build and execute complex queries, and return the results as an array of records.
 *
 * @example
 * const zohoCoqlQueryBuilder = new ZohoCoqlQueryBuilder({
 *   queryFunction: queryZohoCrm,
 * });
 *
 * const records = await zohoCoqlQueryBuilder.select({
 *   columns: ["id", "name"],
 *   from: "Users",
 *   where: [
 *     { equals: [{ column: "id" }, { value: "123" }] },
 *   ],
 * });
 */
export class ZohoCoqlQueryBuilder {
  private readonly queryFunction: ZohoCrmCoqlQueryFunction;

  constructor(options: ZohoCoqlQueryBuilderOptions) {
    this.queryFunction = options.queryFunction;
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
    ModuleType extends ZohoCrmCoqlRecord = ZohoCrmCoqlRecord,
    RecordType extends Partial<ZohoCrmCoqlRecord> = ZohoCrmCoqlRecord
  >(query: SelectQuery<ModuleType>): Promise<RecordType[]> {
    const coqlQueries = ZohoCoqlQueryBuilder.buildQuery(query);

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
  static buildQuery<ModuleType extends ZohoCrmCoqlRecord = ZohoCrmCoqlRecord>(
    query: SelectQuery<ModuleType>
  ): string[] {
    return queryBuilder(query as SelectQuery);
  }
}
