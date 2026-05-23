variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "db_username" {
  description = "MySQL database username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "MySQL database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "fruitdb"
}