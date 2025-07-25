import { SelectQuery, WhereCondition } from "../../types";
import {
  betweenConditionBuilder,
  equalsConditionBuilder,
  greaterThanConditionBuilder,
  greaterThanOrEqualConditionBuilder,
  inConditionBuilder,
  lessThanConditionBuilder,
  lessThanOrEqualConditionBuilder,
  likeConditionBuilder,
} from "./condition";

export type WhereClauseBuilderArgs = {
  where: SelectQuery["where"];
};

export const whereClauseBuilder = ({
  where,
}: WhereClauseBuilderArgs): string[] => {
  if (!where?.length) {
    return ["where id is not null"];
  }

  if (where.length > 25) {
    throw new Error("Where clause cannot contain more than 25 conditions");
  }

  const parsedConditions = parseCondition({
    conditions: where,
    logicOperator: "and",
  });

  return parsedConditions.map((condition) => `where ${condition}`);
};

type ParseConditionArgs = {
  conditions: WhereCondition[];
  logicOperator: "and" | "or";
};

const parseCondition = ({
  conditions,
  logicOperator = "and",
}: ParseConditionArgs): string[] => {
  const parsedConditions = conditions.map((condition): string | string[] => {
    let conditionToParse = condition;

    if ("or" in condition) {
      return parseCondition({
        conditions: condition.or,
        logicOperator: "or",
      });
    }

    if ("and" in condition) {
      return parseCondition({
        conditions: condition.and,
        logicOperator: "and",
      });
    }

    const not = "not" in condition;

    if (not) {
      conditionToParse = condition.not;
    }

    if ("equals" in conditionToParse) {
      return equalsConditionBuilder({ condition: conditionToParse, not });
    }

    if ("lessThan" in conditionToParse) {
      return lessThanConditionBuilder({ condition: conditionToParse, not });
    }

    if ("lessThanOrEqual" in conditionToParse) {
      return lessThanOrEqualConditionBuilder({
        condition: conditionToParse,
        not,
      });
    }

    if ("greaterThan" in conditionToParse) {
      return greaterThanConditionBuilder({ condition: conditionToParse, not });
    }

    if ("greaterThanOrEqual" in conditionToParse) {
      return greaterThanOrEqualConditionBuilder({
        condition: conditionToParse,
        not,
      });
    }

    if ("between" in conditionToParse) {
      return betweenConditionBuilder({ condition: conditionToParse, not });
    }

    if ("in" in conditionToParse) {
      return inConditionBuilder({
        condition: conditionToParse,
        not,
      });
    }

    if ("like" in conditionToParse) {
      return likeConditionBuilder({
        condition: conditionToParse,
        not,
      });
    }

    if ("raw" in conditionToParse) {
      return conditionToParse.raw;
    }

    throw new Error(`Unknown condition: ${JSON.stringify(conditionToParse)}`);
  });

  const conditionPartsList = parsedConditions.filter((condition) =>
    Array.isArray(condition)
  );

  if (conditionPartsList.length === 0) {
    return [joinConditions(parsedConditions as string[], logicOperator)];
  }

  const conditionPartsLengths = conditionPartsList.map(
    (condition) => condition.length
  );

  const conditionPartsIndexesPermutations =
    generateConditionPartsIndexesPermutations(conditionPartsLengths);

  const joinedConditions = conditionPartsIndexesPermutations.map(
    (conditionPartsIndexesPermutation) => {
      let currentConditionPartsIndexesPermutationIndex = 0;
      const conditionsToJoin = parsedConditions.map((condition) => {
        if (typeof condition === "string") {
          return condition;
        }

        const conditionToJoin =
          condition[
            conditionPartsIndexesPermutation[
              currentConditionPartsIndexesPermutationIndex
            ]
          ];
        currentConditionPartsIndexesPermutationIndex++;

        return conditionToJoin;
      });

      return joinConditions(conditionsToJoin, logicOperator);
    }
  );

  return joinedConditions;
};

const generateConditionPartsIndexesPermutations = (lengths: number[]) => {
  const permutations = [];
  const maxAmountOfPermutations = lengths.reduce((acc, maxIndex) => {
    return acc * maxIndex;
  }, 1);

  const currentPermutation = Array.from({ length: lengths.length }, () => 0);

  for (let i = 0; i < maxAmountOfPermutations; i++) {
    permutations.push([...currentPermutation]);

    let currentPermutationNumberIndex = 0;
    while (currentPermutationNumberIndex < currentPermutation.length) {
      if (
        currentPermutation[currentPermutationNumberIndex] ===
        lengths[currentPermutationNumberIndex] - 1
      ) {
        currentPermutation[currentPermutationNumberIndex] = 0;
        currentPermutationNumberIndex++;
        continue;
      }

      currentPermutation[currentPermutationNumberIndex]++;
      break;
    }
  }

  return permutations;
};

const joinConditions = (conditions: string[], logicOperator: "and" | "or") => {
  return (
    conditions.reduce((acc, condition) => {
      if (acc === "") {
        return `(${condition}`;
      }

      return `${acc} ${logicOperator} (${condition}`;
    }, "") + Array.from({ length: conditions.length }, () => ")").join("")
  );
};
