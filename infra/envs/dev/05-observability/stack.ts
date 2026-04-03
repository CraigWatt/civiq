import { Stack, type StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import { tagCiviqStack } from "../../../lib/tag-stack.js";

export class DevObservabilityStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    tagCiviqStack(this);
    this.templateOptions.description =
      "Observability layer for civiq development infrastructure.";
  }
}

