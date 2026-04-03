import { Tags } from "aws-cdk-lib";
import type { Stack } from "aws-cdk-lib";

export function tagCiviqStack(stack: Stack) {
  Tags.of(stack).add("app", "civiq");
  Tags.of(stack).add("managed-by", "cdk");
}

