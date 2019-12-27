# aws-dynamic-dns
Dynamic DNS container for updating AWS Route 53

## AWS IAM Policy

Create an IAM user with restricted access to Route53.  Do not use an administrator user!

Here's an example policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "route53:ChangeResourceRecordSets",
            "Resource": "arn:aws:route53:::hostedzone/YOURHOSTEDZONEGOESHERE"
        }
    ]
}
```

## Build Container:

```bash
docker build -t aws-dynamic-dns .
```

## Run Container:
```bash
docker run \
  -e ZONEID='enter zone id here' \
  -e RECORDSET='your.cname.goeshere.com' \
  -e TTL=300
  -e INTERVAL_MINUTES=30
  -e AWS_ACCESS_KEY_ID="your access key" \
  -e AWS_SECRET_ACCESS_KEY="your secret key" \
  -t aws-dynamic-dns
```
