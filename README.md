# Solar Vehicle Team Cloud Infrastructure

AWS infrastructure for the solar vehicle team. This infrastructure is primarily used to host the influxdb server for the solar vehicle team and was designed to be scalable and extendable.

## Requirements

A few requirements are needed locally to deploy this infrastructure.

- Terraform
- AWS CLI (w/ credentials)
- Node.js

A handful of things need to be configured manually for Terraform.

- AWS Credentials
- EC2 Security Key Pair (Needs to be created in the AWS console and defined in `terraform/main.tf`)

Create `.auto.tfvars` using `ex.tfvars` as an example.

## Deploying

Deploying is very straight forward after the requirements are met. Simply run:

```bash
npm run build-db
npm run deploy
```

This will build the infrastructure from end-to-end.

## Destroying

To remove the existing infrastructure, run:

```bash
npm run remove
```

## Considerations

### Region

If region is changed from `us-east-1` (can be specified as var in `terraform/.auto.tfvars`) then the availability zones must be changed as well to fit the region's respectful zones. Region must also be defined in `sst.config.js`

### Development

Development is straight-forward if using a non-prod account with Terraform, though time-consuming. Developing with SST is not straight forward. Due to the nature of VPCs, it is not possible to develop locally without some sort of [VPN](https://docs.sst.dev/live-lambda-development#working-with-a-vpc).

## Overview

The infrastructure is not aggregated in one framework. The infrastructure is split between Terraform and Serverless Framework (SST). Terraform is used to build almost all of the infrastructure. We use [SST](https://sst.dev) to construct the lambda functions. SST provides an incredibly easy way to build serverless applications.

### Terraform Built

VPC

- Private network for EC2 instances. Secures our environment from the public internet.

Load Balancer

- Distributes traffic across multiple EC2 instances if needed.

Secret Manager or Parameter Store

- Stores the influxdb admin password, token, etc. in a secure matter. Eventually, we can support rolling credentials.

EBS

- Storage for influxdb data

EC2

- Influxdb server

### Serverless Framework Built

Lambda functions to interact with influxdb

- `get-data` - Gets data from influxdb
- `write-data` - Writes data to influxdb