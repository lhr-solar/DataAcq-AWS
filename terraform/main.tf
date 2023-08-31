locals {
  INFLUXDB_USERNAME    = "admin"
  INFLUXDB_PASSWORD    = "parameter/admin_password"
  INFLUXDB_ADMIN_TOKEN = "parameter/admin_token"
  ec2_key_pair_name    = "lhr2"
}

module "influxdb" {
  source = "./influx"

  admin_username = local.INFLUXDB_USERNAME
  admin_password = local.INFLUXDB_PASSWORD
  admin_token    = local.INFLUXDB_ADMIN_TOKEN

  data_storage_volume_size = 350
  wal_storage_volume_size  = 350

  prefix        = "svt"
  nodes         = 1
  instance_type = "t3.medium"
  key_pair_name = local.ec2_key_pair_name
  # hosted_zone_id = "Z200LS379IE475"

  # Generally, don't touch the below


  default_security_group = module.vpc.default_security_group_id
  private_subnet_ids     = module.vpc.private_subnets
  vpc_id                 = module.vpc.vpc_id

  storage_type = "ebs"
  tags = {
    Terraform   = "true"
    Environment = "prod"
  }
}

output "endpoints" {
  value = module.influxdb
}

output "locals" {
  value = {
    INFLUXDB_USERNAME    = local.INFLUXDB_USERNAME
    INFLUXDB_PASSWORD    = local.INFLUXDB_PASSWORD
    INFLUXDB_ADMIN_TOKEN = local.INFLUXDB_ADMIN_TOKEN
    VPC_ID               = module.vpc.vpc_id
  }
}
