import { App } from "aws-cdk-lib";
import { DevBootstrapStack } from "../envs/dev/01-bootstrap/stack.js";
import { DevNetworkStack } from "../envs/dev/02-network/stack.js";
import { DevDataStack } from "../envs/dev/03-data/stack.js";
import { DevServicesStack } from "../envs/dev/04-services/stack.js";
import { DevObservabilityStack } from "../envs/dev/05-observability/stack.js";

const app = new App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region =
  process.env.CDK_DEFAULT_REGION ??
  (app.node.tryGetContext("defaultRegion") as string | undefined) ??
  "eu-west-2";

const env = account
  ? {
      account,
      region
    }
  : {
      region
    };

new DevBootstrapStack(app, "civiq-dev-bootstrap", { env });
new DevNetworkStack(app, "civiq-dev-network", { env });
new DevDataStack(app, "civiq-dev-data", { env });
new DevServicesStack(app, "civiq-dev-services", { env });
new DevObservabilityStack(app, "civiq-dev-observability", { env });

