import { FlattenKeys } from "./utils";

export type WhereClauseArgs<ModuleType = Record<string, unknown>> =
  WhereCondition<ModuleType>[];

export type WhereCondition<ModuleType = Record<string, unknown>> =
  | ComparisonCondition<ModuleType>
  | LogicalCondition<ModuleType>
  | RawCondition;

export type LogicalCondition<ModuleType = Record<string, unknown>> =
  | OrOperator<ModuleType>
  | AndOperator<ModuleType>
  | NotOperator<ModuleType>;

export type ComparisonCondition<ModuleType = Record<string, unknown>> =
  | EqualsCondition<ModuleType>
  | LessThanCondition<ModuleType>
  | LessThanOrEqualCondition<ModuleType>
  | GreaterThanCondition<ModuleType>
  | GreaterThanOrEqualCondition<ModuleType>
  | BetweenCondition<ModuleType>
  | InCondition<ModuleType>
  | LikeCondition<ModuleType>;

export type RawCondition = {
  raw: string;
};

export type OrOperator<ModuleType = Record<string, unknown>> = {
  or: WhereCondition<ModuleType>[];
};

export type AndOperator<ModuleType = Record<string, unknown>> = {
  and: WhereCondition<ModuleType>[];
};

export type NotOperator<ModuleType = Record<string, unknown>> = {
  not: ComparisonCondition<ModuleType>;
};

export type EqualsCondition<ModuleType = Record<string, unknown>> = {
  equals: [
    ConditionOperandColumn<ModuleType>,
    ComparisonConditionOperand<ModuleType> | null
  ];
};

export type LessThanCondition<ModuleType = Record<string, unknown>> = {
  lessThan: [
    ConditionOperandColumn<ModuleType>,
    ComparisonConditionOperand<ModuleType>
  ];
};

export type LessThanOrEqualCondition<ModuleType = Record<string, unknown>> = {
  lessThanOrEqual: [
    ConditionOperandColumn<ModuleType>,
    ComparisonConditionOperand<ModuleType>
  ];
};

export type GreaterThanCondition<ModuleType = Record<string, unknown>> = {
  greaterThan: [
    ConditionOperandColumn<ModuleType>,
    ComparisonConditionOperand<ModuleType>
  ];
};

export type GreaterThanOrEqualCondition<ModuleType = Record<string, unknown>> =
  {
    greaterThanOrEqual: [
      ConditionOperandColumn<ModuleType>,
      ComparisonConditionOperand<ModuleType>
    ];
  };

export type BetweenCondition<ModuleType = Record<string, unknown>> = {
  between: {
    column: QueryColumn<ModuleType>;
    valueRange: [QueryValue, QueryValue];
  };
};

export type InCondition<ModuleType = Record<string, unknown>> = {
  in: {
    column: QueryColumn<ModuleType>;
    valueSet: QueryValue[];
  };
};

export type LikeCondition<ModuleType = Record<string, unknown>> = {
  like: {
    column: QueryColumn<ModuleType>;
    pattern: string;
  };
};

export type ComparisonConditionOperand<ModuleType = Record<string, unknown>> =
  | ConditionOperandColumn<ModuleType>
  | ConditionOperandValue;

export type ConditionOperandColumn<ModuleType = Record<string, unknown>> = {
  column: QueryColumn<ModuleType>;
};

export type ConditionOperandValue = {
  value: QueryValue;
};

export type QueryValue = string | number | boolean;

export type QueryColumn<ModuleType = Record<string, unknown>> =
  FlattenKeys<ModuleType>;
