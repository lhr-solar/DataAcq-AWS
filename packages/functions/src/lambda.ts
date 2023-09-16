import { ApiHandler } from "sst/node/api";

import { InfluxDB } from "@influxdata/influxdb-client";
import { BucketsAPI } from "@influxdata/influxdb-client-apis";

const influx = new InfluxDB({
  url: `http://${process.env.INFLUXDB_API_ENDPOINT}`,
  token: process.env.INFLUXDB_TOKEN,
});

export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: `Hello world.`,
  };
});

export const health = ApiHandler(async (_evt) => {
  const { buckets } = await new BucketsAPI(influx).getBuckets();

  if (!buckets || buckets.length === 0) {
    return {
      statusCode: 500,
      body: `Internal Server Error.`,
    };
  }

  return {
    statusCode: 200,
    body: `OK. InfluxDB has ${buckets.length} buckets.`,
  };
});
