/* Equality Conditions */

import {
  BetweenCondition,
  ComparisonConditionOperand,
  EqualsCondition,
  GreaterThanCondition,
  GreaterThanOrEqualCondition,
  InCondition,
  LessThanCondition,
  LessThanOrEqualCondition,
  LikeCondition,
  QueryValue,
} from "../../types";

type EqualsConditionBuilderArgs = {
  condition: EqualsCondition;
  not?: boolean;
};

export const equalsConditionBuilder = ({
  condition,
  not,
}: EqualsConditionBuilderArgs) => {
  const [firstOperand, secondOperand] = condition.equals;

  let parsedCondition = "";

  let operator = not ? "!=" : "=";

  if ("value" in secondOperand && secondOperand.value === null) {
    operator = not ? "is not" : "is";
  }

  parsedCondition += `${parseOperand(firstOperand)} ${operator} ${parseOperand(
    secondOperand
  )}`;

  return parsedCondition;
};

/* Comparison Conditions */

type LessThanConditionBuilderArgs = {
  condition: LessThanCondition;
  not?: boolean;
};

export const lessThanConditionBuilder = ({
  condition,
  not,
}: LessThanConditionBuilderArgs) => {
  if (not) {
    return greaterThanOrEqualConditionBuilder({
      condition: {
        greaterThanOrEqual: condition.lessThan,
      },
    });
  }

  const [firstOperand, secondOperand] = condition.lessThan;

  return `${parseOperand(firstOperand)} < ${parseOperand(secondOperand)}`;
};

type GreaterThanConditionBuilderArgs = {
  condition: GreaterThanCondition;
  not?: boolean;
};

export const greaterThanConditionBuilder = ({
  condition,
  not,
}: GreaterThanConditionBuilderArgs) => {
  if (not) {
    return lessThanOrEqualConditionBuilder({
      condition: {
        lessThanOrEqual: condition.greaterThan,
      },
    });
  }

  const [firstOperand, secondOperand] = condition.greaterThan;

  return `${parseOperand(firstOperand)} > ${parseOperand(secondOperand)}`;
};

type LessThanOrEqualConditionBuilderArgs = {
  condition: LessThanOrEqualCondition;
  not?: boolean;
};

export const lessThanOrEqualConditionBuilder = ({
  condition,
  not,
}: LessThanOrEqualConditionBuilderArgs) => {
  if (not) {
    return greaterThanConditionBuilder({
      condition: {
        greaterThan: condition.lessThanOrEqual,
      },
    });
  }

  const [firstOperand, secondOperand] = condition.lessThanOrEqual;

  return `${parseOperand(firstOperand)} <= ${parseOperand(secondOperand)}`;
};

type GreaterThanOrEqualConditionBuilderArgs = {
  condition: GreaterThanOrEqualCondition;
  not?: boolean;
};

export const greaterThanOrEqualConditionBuilder = ({
  condition,
  not,
}: GreaterThanOrEqualConditionBuilderArgs) => {
  if (not) {
    return lessThanConditionBuilder({
      condition: {
        lessThan: condition.greaterThanOrEqual,
      },
    });
  }

  const [firstOperand, secondOperand] = condition.greaterThanOrEqual;

  return `${parseOperand(firstOperand)} >= ${parseOperand(secondOperand)}`;
};

/* Between Conditions */

type BetweenConditionBuilderArgs = {
  condition: BetweenCondition;
  not?: boolean;
};

export const betweenConditionBuilder = ({
  condition,
  not,
}: BetweenConditionBuilderArgs) => {
  const {
    column,
    valueRange: [firstOperand, secondOperand],
  } = condition.between;

  const operator = not ? "not between" : "between";

  if (typeof firstOperand !== typeof secondOperand) {
    throw new Error("Between condition operands must be of the same type");
  }

  return `${column} ${operator} ${parseQueryValue(
    firstOperand
  )} and ${parseQueryValue(secondOperand)}`;
};

/* In Conditions */

type InConditionBuilderArgs = {
  condition: InCondition;
  not?: boolean;
};

export const inConditionBuilder = ({
  condition,
  not,
}: InConditionBuilderArgs): string | string[] => {
  const operator = not ? "not in" : "in";

  const { column, valueSet } = condition.in;

  if (valueSet.length === 0) {
    throw new Error("In condition value set is empty");
  }

  if (valueSet.length <= 50) {
    return generateInCondition(column, operator, valueSet);
  }

  if (not) {
    throw new Error(
      "In condition value set batching is not supported for not in operator, either reduce the number of values in the value set below 50 or use the in operator instead."
    );
  }

  const valueSetBatches = [];
  const givenValueSet = valueSet;

  while (givenValueSet.length > 0) {
    valueSetBatches.push(valueSet.splice(0, 50));
  }

  return valueSetBatches.map((valueSetBatch) =>
    generateInCondition(column, operator, valueSetBatch)
  );
};

export const generateInCondition = (
  column: string,
  operator: "in" | "not in",
  values: QueryValue[]
) => {
  return `${column} ${operator} (${values
    .map((value) => parseQueryValue(value))
    .join(", ")})`;
};

/* Like Conditions */

type LikeConditionBuilderArgs = {
  condition: LikeCondition;
  not?: boolean;
};

export const likeConditionBuilder = ({
  condition,
  not,
}: LikeConditionBuilderArgs) => {
  const operator = not ? "not like" : "like";

  const { column, pattern } = condition.like;

  return `${column} ${operator} '${pattern}'`;
};

/* Operand Parsing */

export const parseOperand = (operand: ComparisonConditionOperand) => {
  if ("column" in operand) {
    return `${operand.column}`;
  }

  return parseQueryValue(operand.value);
};

export const parseQueryValue = (value: QueryValue) => {
  if (typeof value === "string") {
    if (value.startsWith("'") && value.endsWith("'")) {
      return value;
    }

    return `'${value}'`;
  }

  if (value === null) {
    return "null";
  }

  return value.toString();
};
