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
  bucket = "noos-public-assets-v2"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.public_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for noos public assets"
}

# Allow CloudFront access
resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.public_assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "PublicReadGetObject"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.public_assets.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "public_cors" {
  bucket = aws_s3_bucket.public_assets.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "HEAD", "GET"]
    allowed_origins = ["https://noos-three.vercel.app"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100" # North America and Europe

  origin {
    domain_name = aws_s3_bucket.public_assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.public_assets.bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.public_assets.bucket}"

    forwarded_values {
      query_string = false
      headers      = ["Origin"]
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000
    default_ttl            = 31536000
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_s3_bucket" "private_assets" {
  bucket = "noos-private-assets-v2"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_public_access_block" "private_access" {
  bucket                  = aws_s3_bucket.private_assets.id
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
    allowed_origins = ["https://noos-three.vercel.app"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

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

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.s3_distribution.id
  description = "The ID of the CloudFront distribution"
}

output "cloudfront_distribution_domain" {
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
  description = "The domain name of the CloudFront distribution"
}

output "public_bucket_url" {
  value       = "https://${aws_s3_bucket.public_assets.bucket}.s3.${var.region}.amazonaws.com"
  description = "The URL to access the public S3 bucket."
}
