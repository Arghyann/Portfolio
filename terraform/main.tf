terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variable Definitions
variable "aws_region" {
  type        = string
  default     = "ap-south-1"
  description = "AWS Region to deploy resources in"
}

variable "instance_type" {
  type        = string
  default     = "t3.micro" # Free Tier eligible in ap-south-1
  description = "EC2 Instance Type"
}

variable "desired_private_ip" {
  type        = string
  default     = "172.31.0.50"
  description = "Static Private IP address within the default subnet range (172.31.0.0/20)"
}

# Key Pair resource using ~/.ssh/AWS.pub (same as Projects/Terraform)
resource "aws_key_pair" "deployer" {
  key_name   = "chickenwing-key"
  public_key = file("~/.ssh/AWS.pub")
}

# Fetch the Default VPC
data "aws_vpc" "default" {
  default = true
}

# Fetch Default Subnet in ap-south-1a (Subnet range: 172.31.0.0/20)
data "aws_subnet" "default" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "${var.aws_region}a"
}

# Fetch latest Ubuntu 24.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical owner ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group for SSH & SSH Portfolio
resource "aws_security_group" "portfolio_sg" {
  name        = "portfolio-ssh-sg"
  description = "Allow inbound SSH (port 22 & 2222) and outbound traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Standard SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Custom SSH Portfolio Port"
    from_port   = 2222
    to_port     = 2222
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound internet traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "portfolio-ssh-sg"
  }
}

# EC2 Instance
resource "aws_instance" "portfolio_vm" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = data.aws_subnet.default.id
  private_ip                  = var.desired_private_ip
  key_name                    = aws_key_pair.deployer.key_name
  vpc_security_group_ids      = [aws_security_group.portfolio_sg.id]
  associate_public_ip_address = true

  tags = {
    Name        = "SSH-Portfolio-VM"
    Environment = "Development"
  }
}

# Outputs
output "instance_id" {
  value       = aws_instance.portfolio_vm.id
  description = "The ID of the EC2 instance"
}

output "private_ip" {
  value       = aws_instance.portfolio_vm.private_ip
  description = "The assigned Private IP address"
}

output "public_ip" {
  value       = aws_instance.portfolio_vm.public_ip
  description = "The assigned Public IP address"
}

output "ssh_command" {
  value       = "ssh -i ~/.ssh/AWS.pem ubuntu@${aws_instance.portfolio_vm.public_ip}"
  description = "Command to SSH into the instance using AWS.pem key"
}
