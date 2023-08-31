import { StackContext, Api } from "sst/constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          INFLUXDB_ADMIN_ENDPOINT: process.env.INFLUXDB_ADMIN_ENDPOINT!,
          INFLUXDB_API_ENDPOINT: process.env.INFLUXDB_API_ENDPOINT!,
          INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME!,
          INFLUXDB_PASSWORD: process.env.INFLUXDB_PASSWORD!,
          INFLUXDB_TOKEN: process.env.INFLUXDB_TOKEN!,
        },
        vpc: Vpc.fromLookup(stack, "vpc", {
          vpcId: process.env.VPC_ID!,
        }),
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
