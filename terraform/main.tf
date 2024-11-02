variable "region" {
  description = "The AWS region to deploy resources."
  type        = string
  default     = "eu-central-1"
}

provider "aws" {
  region = var.region
}

# Public bucket for images and audio files
resource "aws_s3_bucket" "public_assets" {
  bucket = "noos-public-assets"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.public_assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.public_assets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.public_assets.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "public_cors" {
  bucket = aws_s3_bucket.public_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["https://noos-three.vercel.app", "http://localhost:3000"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Private bucket for zip files
resource "aws_s3_bucket" "private_assets" {
  bucket = "noos-private-assets"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_public_access_block" "private_access" {
  bucket = aws_s3_bucket.private_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "private_cors" {
  bucket = aws_s3_bucket.private_assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "HEAD"]
    allowed_origins = ["https://noos-three.vercel.app", "http://localhost:3000"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Outputs
output "public_bucket_name" {
  value       = aws_s3_bucket.public_assets.bucket
  description = "The name of the public S3 bucket"
}

output "public_bucket_arn" {
  value       = aws_s3_bucket.public_assets.arn
  description = "The ARN of the public S3 bucket"
}

output "private_bucket_name" {
  value       = aws_s3_bucket.private_assets.bucket
  description = "The name of the private S3 bucket"
}

output "private_bucket_arn" {
  value       = aws_s3_bucket.private_assets.arn
  description = "The ARN of the private S3 bucket"
}

output "public_bucket_url" {
  value       = "https://${aws_s3_bucket.public_assets.bucket}.s3.${var.region}.amazonaws.com"
  description = "The URL to access the public S3 bucket."
}
