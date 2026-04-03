import { Stack, type StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import { tagCiviqStack } from "../../../lib/tag-stack.js";

export class DevBootstrapStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    tagCiviqStack(this);
    this.templateOptions.description =
      "Bootstrap layer for civiq development infrastructure.";
  }
}

