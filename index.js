const dns = require('dns');
const { Resolver } = require('dns');
const AWS = require('aws-sdk');

const zoneId = process.env.ZONEID;
const recordSet = process.env.RECORDSET;
const ttl = parseInt(process.env.TTL ? process.env.TTL : '300');
const recordComment = process.env.RECORD_COMMENT
const intervalMinutes = process.env.INTERVAL_MINUTES

function getResolverIp() {
  return new Promise((resolve, reject) => {
    try {
      dns.lookup('resolver1.opendns.com', (err, address) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(address);
      });
    } catch (error) {
      reject(error);
    }
  })
}

function getIp() {
  return new Promise((resolve, reject) => {
    try {
      const resolverAddress = getResolverIp().then((resolverAddress) => {
        const resolver = new Resolver();
        resolver.setServers([resolverAddress])
        resolver.resolve4('myip.opendns.com', (err, addresses) => {
          if (err || addresses.length == 0) {
            reject(err);
          }
          resolve(addresses[0]);
        })
      })
      .catch((err) => {
        console.error('Failed to resolve ip');
        reject(err);
      });
      
    } catch (error) {
      console.error("ERROR:" + error);
      process.exit(1);
    }
  })
}

function updateDNS(newIp, zoneId, recordSet, ttl, recordComment) {
  return new Promise((resolve, reject) => {
    const route53 = new AWS.Route53();
    
    const change = {
      ChangeBatch: {
        Changes: [{
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: recordSet,
            ResourceRecords: [{
              'Value': newIp,
            }],
            TTL: ttl,
            Type: "A",
          },
        }],
        Comment: recordComment,
      },
      HostedZoneId: zoneId,
    };
    console.log('changing record set:', change);
    route53.changeResourceRecordSets(change, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    })
  });
}

function getAwsCredentials() {
  return new Promise((resolve, reject) => {
    AWS.config.getCredentials((err) => {
      if (err) {
        reject(err);
      }
      resolve()
    })
  });
}

async function start() {
  const intervalSeconds = intervalMinutes * 60;
  let lastIp = 'NOT SET';
  setInterval(async () => {
    try {
      const ip = await getIp();
      console.log('got ip:', ip);
      if (lastIp == 'NOT SET' || ip !== lastIp) {
        await getAwsCredentials();
        await updateDNS(ip, zoneId, recordSet, ttl, recordComment);
      }
      lastIp = ip;
  
    } catch (error) {
      console.error('ERROR:', error);
      process.exit(1);
    }
  }, 1000 * intervalSeconds);
  
  
}

// get ip own ip

// if changed, update

start();