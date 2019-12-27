# What is sesopenko/aws-dynamic-dns

Route53 is a managed DNS service from AWS. This container makes it easy to update Route53 recordsets for a machine which has a dynamic IP address.

## Example AWS IAM Policy

It's advised that a policy is created specifically for managing the hosted zone.

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


## How to use the image

### Downloading an aws-dynamic-dns image

```bash
docker pull sesopenko/aws-dynamic-dns:latest
```

### Starting an aws-dynamic-dns instance

The image will poll [OpenDNS](https://www.opendns.com/) to get the public IP of the host, from the perspective of OpenDNS.  If it sees a change it will update the configured record on Route53.

```bash
docker run \
  -e ZONEID='enter zone id here' \
  -e RECORDSET='your.cname.goeshere.com' \
  -e TTL=300
  -e INTERVAL_MINUTES=30
  -e AWS_ACCESS_KEY_ID="your access key" \
  -e AWS_SECRET_ACCESS_KEY="your secret key" \
  -d sesopenko/aws-dynamic-dns:latest
```

* ZONEID is your AWS hosted zone which contains the DNS record to be updated.
* RECORDSET is the dns hostname to be updated.
* TTL is the DNS time-to-live expiration of the recordset.
* INTERVAL_MINUTES is how frequently the check will be performed.
* AWS_ACCESS_KEY_ID is the AWS IAM access key required to connect to AWS.  Keep this secure, using a secrets system.
* AWS_SECRET_ACCESS_KEY is the AWS IAM secret access key required to connect to AWS.

It's recommended that you keep your secret keys secure using a "secrets" system.  Kubernetes supports secrets which can be passed down as environment variables.  Docker for Enterprise has a similar solution.
