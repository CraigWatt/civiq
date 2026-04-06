import {
  CfnOutput,
  RemovalPolicy,
  Stack,
  type StackProps
} from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion
} from "aws-cdk-lib/aws-rds";
import type { Construct } from "constructs";
import { tagCiviqStack } from "../../../lib/tag-stack.js";

export class DevDataStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    tagCiviqStack(this);
    this.templateOptions.description =
      "Data layer for civiq development infrastructure.";

    const vpc = new Vpc(this, "DataVpc", {
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: "private",
          subnetType: SubnetType.PRIVATE_ISOLATED
        }
      ]
    });

    const dbSecurityGroup = new SecurityGroup(this, "DataSecurityGroup", {
      vpc,
      allowAllOutbound: true,
      description: "Security group for the civiq development Postgres instance"
    });

    dbSecurityGroup.addIngressRule(Peer.ipv4("10.0.0.0/8"), Port.tcp(5432));

    const database = new DatabaseInstance(this, "Postgres", {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED
      },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_16_3
      }),
      credentials: Credentials.fromGeneratedSecret("civiq"),
      securityGroups: [dbSecurityGroup],
      allocatedStorage: 20,
      maxAllocatedStorage: 50,
      deletionProtection: false,
      publiclyAccessible: false,
      multiAz: false,
      removalPolicy: RemovalPolicy.DESTROY,
      databaseName: "civiq"
    });

    CfnOutput(this, "DatabaseEndpoint", {
      value: database.instanceEndpoint.hostname
    });

    CfnOutput(this, "DatabaseSecretArn", {
      value: database.secret?.secretArn ?? "unknown"
    });
  }
}
