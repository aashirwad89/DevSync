# AWS - Complete Guide for DevSync

## Table of Contents
1. [AWS Fundamentals](#fundamentals)
2. [Compute Services](#compute)
3. [Storage Services](#storage)
4. [Database Services](#databases)
5. [Networking](#networking)
6. [Deployment](#deployment)
7. [Monitoring & Logging](#monitoring)
8. [Security & IAM](#security)
9. [Cost Optimization](#cost)
10. [Common Architectures](#architectures)

## AWS Fundamentals {#fundamentals}

### AWS Global Infrastructure
- **Regions**: Geographic areas (us-east-1, eu-west-1, etc.)
- **Availability Zones (AZs)**: Physical data centers within regions
- **Edge Locations**: CDN endpoints worldwide
- **Local Zones**: Extended regions closer to users

### Key Concepts
- **EC2**: Virtual machines in the cloud
- **S3**: Object storage service
- **RDS**: Managed relational database
- **Lambda**: Serverless compute
- **VPC**: Virtual private network
- **IAM**: Identity and access management

### AWS Account Structure
```
AWS Account
├── Regions
│   ├── us-east-1
│   │   ├── AZ 1a
│   │   ├── AZ 1b
│   │   └── AZ 1c
│   └── eu-west-1
├── Services
│   ├── EC2, RDS, S3, Lambda...
└── IAM (Global)
```

## Compute Services {#compute}

### EC2 (Elastic Compute Cloud)

**Instance Types**
```
General Purpose: t3, m5, m6i     (balanced CPU, memory, network)
Compute Optimized: c5, c6i      (high-performance processors)
Memory Optimized: r5, r6i, x1   (large amounts of RAM)
Storage Optimized: i3, d2, h1   (high I/O operations)
GPU Instances: p3, g4            (machine learning, graphics)

Naming: t3.medium
├── t3 = Instance family
└── medium = Size (micro, small, medium, large, xlarge, 2xlarge)
```

**Launch EC2 Instance**
```bash
# Using AWS CLI
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.micro \
  --key-name my-key-pair \
  --security-groups my-security-group \
  --region us-east-1

# Connect via SSH
ssh -i my-key-pair.pem ec2-user@public-ip

# For Ubuntu AMI
ssh -i my-key-pair.pem ubuntu@public-ip
```

**EC2 User Data Script** (run on launch)
```bash
#!/bin/bash
# Update system
sudo apt-get update
sudo apt-get install -y docker.io

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Pull and run Docker image
sudo docker run -d -p 8000:8000 myapp:latest
```

**EC2 Instance Management**
```bash
# List instances
aws ec2 describe-instances

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Create AMI (snapshot)
aws ec2 create-image --instance-id i-1234567890abcdef0 --name my-app-ami

# Associate Elastic IP
aws ec2 allocate-address --domain vpc
aws ec2 associate-address --instance-id i-1234567890abcdef0 --allocation-id eipalloc-xxxxx
```

### Auto Scaling & Load Balancing

**Application Load Balancer (ALB)**
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name my-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345

# Create target group
aws elbv2 create-target-group \
  --name my-targets \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-12345

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-1234567890abcdef0 Id=i-0987654321fedcba0
```

**Auto Scaling Group (ASG)**
```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name my-template \
  --version-description "Production version" \
  --launch-template-data file://launch-template.json

# Create ASG
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --launch-template LaunchTemplateName=my-template,Version=\$Latest \
  --min-size 2 \
  --max-size 6 \
  --desired-capacity 3 \
  --target-group-arns arn:aws:elasticloadbalancing:...
```

### Lambda (Serverless)

**Create Lambda Function**
```bash
# Create function
aws lambda create-function \
  --function-name my-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::account-id:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Update code
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip

# Invoke function
aws lambda invoke \
  --function-name my-function \
  --payload '{"key":"value"}' \
  response.json

# Set environment variables
aws lambda update-function-configuration \
  --function-name my-function \
  --environment Variables={KEY=value,DB_URL=mongodb://...}
```

**Lambda Handler (Node.js)**
```javascript
// index.js
exports.handler = async (event) => {
  console.log('Event:', event);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda',
      input: event
    })
  };
};
```

## Storage Services {#storage}

### S3 (Simple Storage Service)

**S3 Concepts**
- **Bucket**: Top-level container (globally unique name)
- **Object**: File with metadata and key
- **Key**: Unique identifier within bucket
- **Region**: Physical location of bucket
- **Versioning**: Keep multiple versions of objects
- **Access Control**: Public, private, or specific access

**Create and Manage S3 Bucket**
```bash
# Create bucket
aws s3 mb s3://my-devsync-bucket --region us-east-1

# Upload object
aws s3 cp file.txt s3://my-bucket/path/file.txt

# Upload directory
aws s3 sync ./local-folder s3://my-bucket/remote-folder

# Download object
aws s3 cp s3://my-bucket/file.txt ./file.txt

# List contents
aws s3 ls s3://my-bucket/
aws s3 ls s3://my-bucket/folder/ --recursive

# Delete object
aws s3 rm s3://my-bucket/file.txt

# Delete bucket (must be empty)
aws s3 rb s3://my-bucket

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-bucket \
  --versioning-configuration Status=Enabled
```

**S3 Bucket Policy (Public Read)**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

**S3 Bucket Policy (Specific User)**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/alice"
      },
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

**S3 Configuration**
```bash
# Enable static website hosting
aws s3website s3://my-bucket --index-document index.html --error-document error.html

# Enable CORS
aws s3api put-bucket-cors --bucket my-bucket --cors-configuration file://cors.json

# Set bucket lifecycle
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-bucket \
  --lifecycle-configuration file://lifecycle.json
```

### EBS (Elastic Block Store)

**Volume Management**
```bash
# Create volume
aws ec2 create-volume \
  --availability-zone us-east-1a \
  --size 100 \
  --volume-type gp3

# Attach to instance
aws ec2 attach-volume \
  --volume-id vol-12345 \
  --instance-id i-1234567890abcdef0 \
  --device /dev/sdf

# Create snapshot
aws ec2 create-snapshot --volume-id vol-12345

# Create volume from snapshot
aws ec2 create-volume \
  --snapshot-id snap-12345 \
  --availability-zone us-east-1a
```

## Database Services {#databases}

### RDS (Relational Database Service)

**Create RDS Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier mydb \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password MyPassword123! \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --multi-az \
  --publicly-accessible false
```

**RDS Management**
```bash
# List instances
aws rds describe-db-instances

# Modify instance
aws rds modify-db-instance \
  --db-instance-identifier mydb \
  --allocated-storage 100 \
  --apply-immediately

# Create backup
aws rds create-db-snapshot \
  --db-instance-identifier mydb \
  --db-snapshot-identifier mydb-backup-001

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier mydb-restored \
  --db-snapshot-identifier mydb-backup-001

# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier mydb \
  --backup-retention-period 30 \
  --apply-immediately
```

**Connection String**
```
mysql://admin:password@mydb.xxxxx.us-east-1.rds.amazonaws.com:3306/dbname
```

### DynamoDB (NoSQL)

**Create Table**
```bash
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=email,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

**Item Operations**
```bash
# Put item
aws dynamodb put-item \
  --table-name Users \
  --item file://item.json

# Get item
aws dynamodb get-item \
  --table-name Users \
  --key '{"userId":{"S":"user123"},"email":{"S":"user@example.com"}}'

# Query
aws dynamodb query \
  --table-name Users \
  --key-condition-expression "userId = :uid" \
  --expression-attribute-values '{":uid":{"S":"user123"}}'

# Scan
aws dynamodb scan --table-name Users
```

## Networking {#networking}

### VPC (Virtual Private Cloud)

**VPC Structure**
```
VPC (10.0.0.0/16)
├── Public Subnet (10.0.1.0/24)
│   └── EC2 Instance (Internet Gateway)
├── Private Subnet (10.0.2.0/24)
│   └── RDS Database (NAT Gateway)
└── Internet Gateway & Route Tables
```

**Create VPC**
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnet
aws ec2 create-subnet \
  --vpc-id vpc-12345 \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a

# Create Internet Gateway
aws ec2 create-internet-gateway

# Attach IGW to VPC
aws ec2 attach-internet-gateway \
  --internet-gateway-id igw-12345 \
  --vpc-id vpc-12345

# Create NAT Gateway (for private subnets)
aws ec2 create-nat-gateway \
  --subnet-id subnet-12345 \
  --allocation-id eipalloc-xxxxx
```

### Security Groups & NACLs

**Security Group (Stateful)**
```bash
# Create security group
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Security group for web server" \
  --vpc-id vpc-12345

# Authorize ingress
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-12345 \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-12345 \
  --protocol tcp \
  --port 22 \
  --cidr 203.0.113.0/24
```

## Deployment {#deployment}

### CloudFormation (Infrastructure as Code)

**Template Structure**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'DevSync Infrastructure'

Parameters:
  InstanceType:
    Type: String
    Default: t3.micro

Resources:
  # VPC
  MyVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: true

  # Subnet
  MySubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: us-east-1a

  # Security Group
  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Enable HTTP and SSH
      VpcId: !Ref MyVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

  # EC2 Instance
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: !Ref InstanceType
      SubnetId: !Ref MySubnet
      SecurityGroupIds:
        - !Ref MySecurityGroup
      UserData:
        Fn::Base64: |
          #!/bin/bash
          yum update -y
          yum install -y docker
          systemctl start docker

Outputs:
  InstancePublicIP:
    Description: Public IP of EC2 instance
    Value: !GetAtt MyEC2Instance.PublicIp
```

**CloudFormation Commands**
```bash
# Create stack
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml

# List stacks
aws cloudformation list-stacks

# Describe stack
aws cloudformation describe-stacks --stack-name my-stack

# Update stack
aws cloudformation update-stack \
  --stack-name my-stack \
  --template-body file://template.yaml

# Delete stack
aws cloudformation delete-stack --stack-name my-stack
```

### Elastic Beanstalk (PaaS)

**Deploy Application**
```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init my-app --platform node.js-18 --region us-east-1

# Create environment and deploy
eb create production --instance-type t3.micro

# Deploy new version
eb deploy

# View logs
eb logs

# SSH into instance
eb ssh

# Scale environment
eb scale 3  # Set desired capacity to 3

# Terminate environment
eb terminate
```

**.ebextensions/nodecommand.config**
```yaml
commands:
  01_npm_install:
    command: npm ci --production
    leader_only: true

option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node server.js"
  aws:autoscaling:launchconfiguration:
    InstanceType: t3.micro
  aws:elasticbeanstalk:cloudwatch:logs:
    StreamLogs: true
    DeleteOnTerminate: true
```

## Monitoring & Logging {#monitoring}

### CloudWatch

**Metrics & Alarms**
```bash
# Put custom metric
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name Requests \
  --value 100 \
  --timestamp 2024-01-01T12:00:00Z

# Create alarm
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold

# List alarms
aws cloudwatch describe-alarms

# Get metric statistics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

### CloudWatch Logs

**Log Groups & Streams**
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/lambda/my-function

# Create log stream
aws logs create-log-stream \
  --log-group-name /aws/lambda/my-function \
  --log-stream-name 2024-01-01

# Put log events
aws logs put-log-events \
  --log-group-name /aws/lambda/my-function \
  --log-stream-name 2024-01-01 \
  --log-events timestamp=1234567890000,message="Application started"

# Get log events
aws logs get-log-events \
  --log-group-name /aws/lambda/my-function \
  --log-stream-name 2024-01-01

# Filter logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --filter-pattern "ERROR"
```

## Security & IAM {#security}

### IAM Users & Policies

**Create IAM User**
```bash
# Create user
aws iam create-user --user-name alice

# Create access key
aws iam create-access-key --user-name alice

# Attach policy
aws iam attach-user-policy \
  --user-name alice \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# Create custom policy
aws iam put-user-policy \
  --user-name alice \
  --policy-name s3-read-only \
  --policy-document file://policy.json
```

**Policy Document (S3 Read-Only)**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ]
    }
  ]
}
```

### Secrets Manager

**Store Secrets**
```bash
# Create secret
aws secretsmanager create-secret \
  --name prod/db/password \
  --secret-string "MySecurePassword123!"

# Get secret
aws secretsmanager get-secret-value \
  --secret-id prod/db/password

# Rotate secret
aws secretsmanager rotate-secret \
  --secret-id prod/db/password \
  --rotation-rules AutomaticallyAfterDays=30
```

## Cost Optimization {#cost}

### Cost Management

1. **Use Reserved Instances** (Up to 72% savings)
```bash
aws ec2 purchase-reserved-instances-offering \
  --offering-id xxxxx \
  --instance-count 1
```

2. **Auto Scaling** (Scale down during off-peak)
```yaml
# Scale down at night
TargetTrackingScalingPolicyConfiguration:
  TargetValue: 50  # 50% CPU utilization
```

3. **Use Spot Instances** (Up to 90% savings)
```bash
aws ec2 request-spot-instances \
  --spot-price 0.05 \
  --instance-count 1 \
  --type one-time \
  --launch-specification file://spec.json
```

4. **S3 Lifecycle Policies**
```json
{
  "Rules": [
    {
      "Status": "Enabled",
      "Prefix": "logs/",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

5. **Monitor Costs**
```bash
# Get cost and usage
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

## Common Architectures {#architectures}

### Web Application Architecture
```
┌─────────────────────────────────────────────────────────┐
│ Route 53 (DNS)                                          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│ CloudFront (CDN)                                        │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│ Application Load Balancer                               │
└──────┬──────────────────────────────────────┬───────────┘
       │                                      │
┌──────▼─────────────────────┐   ┌───────────▼─────────┐
│ EC2 Instance (App Server)  │   │ EC2 Instance (App)  │
│ in Public Subnet (AZ 1a)   │   │ in Public Subnet 1b │
└──────┬─────────────────────┘   └───────────┬─────────┘
       │                                      │
└──────┬──────────────────────────────────────┬───────────┐
       │                                      │           │
┌──────▼────────────────────┐   ┌────────────▼───────┐   │
│ RDS Master (Multi-AZ)     │   │ ElastiCache        │   │
│ us-east-1a                │   │ (Redis)            │   │
└───────────────────────────┘   └────────────────────┘   │
                                                          │
┌─────────────────────────────────────────────────────────┘
│ S3 Bucket (Storage)
│ CloudWatch (Monitoring)
│ IAM (Security)
└─────────────────────────────────────────────────────────
```

---

## AWS CLI Quick Reference

```bash
# Configure credentials
aws configure

# List resources
aws ec2 describe-instances
aws s3 ls
aws rds describe-db-instances

# Get help
aws s3 help
aws ec2 run-instances help
```

**Learn More**: https://docs.aws.amazon.com