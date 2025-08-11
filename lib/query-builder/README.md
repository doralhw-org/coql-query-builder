# Query Builder Documentation

The COQL Query Builder allows you to construct complex queries for Zoho CRM using a structured TypeScript interface. This documentation covers the usage patterns, configuration structure, limitations, and implemented workarounds for each query clause.

## Query Structure

All queries follow the `SelectQuery` interface structure:

```typescript
const query = {
  columns: SelectClauseArgs, // Required: columns to select
  from: string, // Required: table/module name
  where: WhereClauseArgs, // Optional: filtering conditions
  groupBy: GroupByClauseArgs, // Optional: grouping columns
  orderBy: OrderByClauseArgs, // Optional: sorting configuration
  limit: LimitClauseArgs, // Optional: result limiting
  pagination: PaginationClauseArgs, // Optional: pagination (alternative to limit)
};
```

## Select Clause

Defines which columns to retrieve from the specified table.

### Structure

```typescript
columns: (string | { column: string; alias: string })[]
```

### Examples

```typescript
// Basic column selection
columns: ["id", "Name", "Email"];

// With column aliases
columns: [
  "id",
  { column: "Account_Name", alias: "AccountName" },
  { column: "Email_Address", alias: "Email" },
];
```

### Limitations

- Maximum 50 columns per query (Zoho limitation)
- The `id` column cannot be aliased unless there is a group by clause
- If `id` column is not specified, it will be automatically added to ensure record merging and deduplication when more than one query is generated.

### Workarounds to Zoho limitations

- **Column batching**: When more than 50 columns are specified, multiple sets of columns are generated with batches of up to 49 columns plus the `id` column, these get combined with one or more where clauses to create a single query.

## Where Clause

Specifies filtering conditions for the query.

### Structure

```typescript
where: WhereCondition[]
```

### Available Conditions

#### Comparison Conditions

```typescript
// Equality
{
  equals: [{ column: "Name" }, { value: "John" }];
}
{
  equals: [{ column: "Status" }, { value: null }];
} // null values

// Numeric comparisons
{
  lessThan: [{ column: "Age" }, { value: 30 }];
}
{
  lessThanOrEqual: [{ column: "Age" }, { value: 30 }];
}
{
  greaterThan: [{ column: "Salary" }, { value: 50000 }];
}
{
  greaterThanOrEqual: [{ column: "Salary" }, { value: 50000 }];
}

// Column-to-column comparisons
{
  equals: [{ column: "Start_Date" }, { column: "End_Date" }];
}
```

#### Range and Set Conditions

```typescript
// Between condition
{
  between: {
    column: "Age",
    valueRange: [25, 65]
  }
}

// In condition
{
  in: {
    column: "Status",
    valueSet: ["Active", "Pending", "Approved"]
  }
}

// Like condition (pattern matching)
{
  like: {
    column: "Name",
    pattern: "John%"
  }
}
```

#### Logical Operators

```typescript
// OR conditions
{
  or: [
    { equals: [{ column: "Status" }, { value: "Active" }] },
    { equals: [{ column: "Status" }, { value: "Pending" }] },
  ];
}

// AND conditions (default behavior, but can be explicit)
{
  and: [
    { greaterThan: [{ column: "Age" }, { value: 18 }] },
    { lessThan: [{ column: "Age" }, { value: 65 }] },
  ];
}

// NOT operator
{
  not: {
    equals: [{ column: "Status" }, { value: "Inactive" }];
  }
}
```

#### Raw Conditions

```typescript
// For complex conditions not covered by typed conditions
{
  raw: "Modified_Time > '2023-01-01'";
}
```

### Limitations

- Maximum 25 conditions per where clause
- NOT IN conditions with more than 50 values are not supported due to batching complexity

### Workarounds to Zoho limitations

- **IN condition batching**: When IN conditions have more than 50 values, multiple queries are generated with batched value sets
- **Automatic condition grouping**: Since Zoho requires where conditions to be strictly unambiguous, the different conditions in the array are automatically grouped with AND operators and properly parenthesized so that no ambiguity is possible.

## Order By Clause

Specifies the sorting order for query results.

### Structure

```typescript
orderBy: {
  column: string;
  direction: "asc" | "desc";
}
[];
```

### Example

```typescript
orderBy: [
  { column: "Name", direction: "asc" },
  { column: "Created_Time", direction: "desc" },
  { column: "Age", direction: "asc" },
];
```

### Limitations

- Maximum 10 columns in order by clause (implementation limitation)
- Cannot be empty if specified (must contain at least one column)

## Group By Clause

Groups results by specified columns, typically used with aggregate functions.

### Structure

```typescript
groupBy: string[]
```

### Example

```typescript
groupBy: ["Department", "Status"];
```

### Limitations

- Maximum 4 columns in group by clause (Zoho limitation)
- Cannot be empty if specified (must contain at least one column)
- When group by is used, automatic `id` column injection is disabled
- Cannot be combined with multiple where clauses (when IN conditions create batching)
- Cannot be combined with multiple select clauses (when column count exceeds 50)

### Workarounds

- **ID column handling**: When group by is present, the `id` column aliasing restriction is lifted, allowing aggregated queries to alias the `id` field

## Limit and Pagination

Controls the number of results returned from the query. The `pagination` option automatically calculates the appropriate limit and offset values in a page and page size manner.

### Limit Structure

```typescript
limit: {
  limit: number;    // 1-2000
  offset?: number;  // optional starting position
}
```

### Pagination Structure

```typescript
pagination: {
  page: number; // page number (1-based)
  pageSize: number; // items per page (1-2000)
}
```

### Examples

```typescript
// Using limit
limit: { limit: 100, offset: 50 }

// Using pagination (equivalent to above)
pagination: { page: 2, pageSize: 50 }
```

### Limitations

- Maximum limit of 2000 records per query (Zoho limitation)
- Minimum limit of 1 record
- Sum of limit and offset cannot exceed 100,000 (Zoho limitation)
- Cannot use both `limit` and `pagination` simultaneously
- Cannot be used when multiple where clauses are generated (due to IN condition batching)
- Cannot be used when multiple select clauses are generated (due to select column batching)

## Error Handling

The query builder validates configurations and throws descriptive errors for:

- Empty required arrays (columns, orderBy, groupBy when specified)
- Conflicting options (limit + pagination)
- Zoho limitations exceeded (column counts, value set sizes, etc.)
- Invalid combinations (group by with batched queries)

## Type Safety

When using TypeScript, provide module types for enhanced intellisense:

```typescript
interface Contact {
  id: string;
  Name: string;
  Email: string;
  Account_Name: string;
}

const query: SelectQuery<Contact> = {
  columns: ["id", "Name"], // TypeScript will suggest available columns
  from: "Contacts",
};
```
