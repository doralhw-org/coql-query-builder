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

export type ZohoCrmCoqlQueryFunction = <RecordType = ZohoCrmCoqlRecord>(
  coqlQuery: string
) => Promise<ZohoCrmCoqlResponse<RecordType>>;
