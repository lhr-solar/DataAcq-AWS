import { ApiHandler } from "sst/node/api";

import { InfluxDB, Point, HttpError } from "@influxdata/influxdb-client";
import { BucketsAPI } from "@influxdata/influxdb-client-apis";
import { SSM } from "aws-sdk";
import { promisify } from "util";

const ssm = new SSM({ region: "us-west-2" });

const influx = new InfluxDB({
  url: `http://${process.env.INFLUXDB_API_ENDPOINT}`,
  token: "admin_token",
});

export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: `Hello world.`,
  };
});

export const health = ApiHandler(async (_evt) => {
  // const ssm = new SSM();
  // const getParameter = promisify(
  //   (Name: string, cb: (err: any, data: SSM.GetParameterResult) => void) =>
  //     ssm.getParameter(
  //       {
  //         Name,
  //       },
  //       cb
  //     )
  // );

  // const { Parameter: parameter } = await getParameter(
  //   process.env.INFLUXDB_ADMIN_TOKEN!
  // );
  const { buckets } = await new BucketsAPI(influx).getBuckets();

  if (!buckets || buckets.length === 0) {
    return {
      statusCode: 500,
      body: `Internal Server Error.`,
    };
  }

  return {
    statusCode: 200,
    // body: `OK. ${buckets?.length} buckets found. Decoded token: ${parameter?.Value}`,
    body: `OK. ${buckets?.length} buckets found.`,
  };
});
