export type ZohoCrmCoqlRecord = {
  id: string;
  [key: string]: unknown;
};

export type ZohoCrmCoqlResponse<RecordType = ZohoCrmCoqlRecord> = {
  data: RecordType[];
  info: {
    count: number;
    more_records: boolean;
  };
};

/**
 * This is the function type that must be provided to the ZohoCoqlQueryBuilder constructor.
 *
 * It must receive directly a COQL query string and return a ZohoCrmCoqlResponse object.
 */
export type ZohoCrmCoqlQueryFunction = <RecordType = ZohoCrmCoqlRecord>(
  coqlQuery: string
) => Promise<ZohoCrmCoqlResponse<RecordType>>;
