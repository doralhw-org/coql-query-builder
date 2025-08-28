export type CrmCoqlRecord = {
  id: string;
  [key: string]: unknown;
};

export type CrmCoqlResponse<RecordType = CrmCoqlRecord> = {
  data: RecordType[];
  info: CrmCoqlQueryMetadata;
};

export type CrmCoqlQueryMetadata = {
  count: number;
  more_records: boolean;
};

/**
 * This is the function type that must be provided to the CoqlQueryBuilder constructor.
 *
 * It must receive directly a COQL query string and return zoho's response.
 */
export type CrmCoqlQueryFunction = <RecordType = CrmCoqlRecord>(
  coqlQuery: string
) => Promise<CrmCoqlResponse<RecordType> | "">;
