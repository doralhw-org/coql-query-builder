# Zoho COQL Query Builder

A lightweight query builder for Zoho CRM that abstracts the COQL queries and provides a fluent API for building them.

## Installation

```bash
npm install @doralhw-org/zoho-coql-query-builder
```

## Usage

You'll need to create a object of the query builder and pass it a function that can fetch the data with the provided query.
This function must return the data in the same format as the Zoho CRM API response.

```ts
import { ZohoCoqlQueryBuilder } from "@doralhw-org/zoho-coql-query-builder";

const zohoCoqlQueryBuilder = new ZohoCoqlQueryBuilder({
  queryFunction: queryZohoCrm,
});
```

### Fetching data

After creating the query builder object you can use the `select` method to fetch the data. The query passed will then be turned
to one or more COQL queries and executed. The data will then be merged together and returned as an array of records.

```ts
const records = await zohoCoqlQueryBuilder.select({
  columns: [
    "id",
    "Name",
    "Age",
    "Role",
    "Email",
    { column: "Address_Line_1", alias: "Address" },
  ],
  from: "Contacts",
  where: [{ equals: [{ column: "id" }, { value: "123" }] }],
});
```

This merge is performed based on the `id` column. If the `id` column is not added as a column to the query, it will be added
to the queries generated. If the `id` column has a different name, or you want to group based on a different identifier
column, you may alias the column to `id` .

Alternatively, you can use the static `buildQuery` method to build the query and then execute it on your own. The method will return one or more COQL queries depending on the workarounds required to obtain the data based on the limitations of the Zoho CRM API.

```ts
const queries = ZohoCoqlQueryBuilder.buildQuery({
  columns: [
    "id",
    "Name",
    "Age",
    "Role",
    "Email",
    { column: "Address_Line_1", alias: "Address" },
  ],
  from: "Contacts",
  where: [{ equals: [{ column: "id" }, { value: "123" }] }],
});
```

## Documentation

For comprehensive documentation including detailed usage patterns, limitations, and workarounds for each query clause, see the [Query Builder Documentation](./lib/query-builder/README.md).

### Where Conditions

The available where conditions are:

- `equals`
- `greaterThan`
- `lessThan`
- `greaterThanOrEquals`
- `lessThanOrEquals`
- `between`
- `in`
- `like`

These can be negated by wrapping the condition object within a `not` attribute and combined with the `and` and `or` operators. The where clause array will join the conditions with the `and` operator by default.

```ts
where: [
  { not: { equals: [{ column: "id" }, { value: "123" }] } },
  {
    and: [
      { greaterThan: [{ column: "Age" }, { value: "30" }] },
      { lessThan: [{ column: "Age" }, { value: "40" }] },
    ],
  },
  {
    or: [
      { in: { column: "Name", valueSet: ["John", "Jane"] } },
      { like: { column: "Name", pattern: "John%" } },
    ],
  },
  {
    like: { column: "Email", pattern: "%@example.com" },
  },
];
```

For detailed information about where clause structure, limitations, and workarounds, see the [Where Clause section](./lib/query-builder/README.md#where-clause) in the full documentation.
