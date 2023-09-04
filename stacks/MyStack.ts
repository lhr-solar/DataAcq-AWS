import { StackContext, Api } from "sst/constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export function API({ stack }: StackContext) {
  const vpcId = StringParameter.valueFromLookup(stack, "vpc_id");
  const vpc = Vpc.fromLookup(stack, "vpc", { vpcId });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          INFLUXDB_ADMIN_ENDPOINT: StringParameter.valueForStringParameter(
            stack,
            "influxdb_admin_endpoint"
          ),
          INFLUXDB_API_ENDPOINT: StringParameter.valueForStringParameter(
            stack,
            "influxdb_api_endpoint"
          ),
          INFLUXDB_USERNAME: "admin",
          INFLUXDB_PASSWORD: StringParameter.valueForStringParameter(
            stack,
            "admin_password"
          ),
          INFLUXDB_TOKEN: StringParameter.valueForStringParameter(
            stack,
            "admin_token"
          ),
        },
        vpc,
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /health": "packages/functions/src/lambda.health",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
