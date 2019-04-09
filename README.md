### Requirements

1. Node 8+

### Installation

```bash
npm install --save envoy-node-control-plane
```


### Usage

```js
const grpc = require('grpc')
const xds = require('envoy-node-control-plane')

function main() {
  var server = new grpc.Server()

  // create an object to resolve requests from a storage source
  const store = require('./my-storage')
  
  // register discovery services
  xds.cds.registerServices( server, store )
  xds.lds.registerServices( server, store )
  xds.rds.registerServices( server, store )
  xds.eds.registerServices( server, store )

  server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('grpc server started, listening on port 3000')
}

main()
```

### Resolving response data for requests

A data storage object must be passed to xds registerServices functions in order to return stored envoy configurations back to requesting nodes.  This object must respond to a `.get( request )` method and return a json representation of the XDS resources as per Envoy Proxy.

The incoming `request` argument is a deserialization of the DiscoveryRequest proto in object form.  https://github.com/envoyproxy/envoy/blob/master/api/envoy/api/v2/discovery.proto

Matched resources must be passed as an array to a root `resourcesList` key, as per 
the DiscoveryResponse proto defintion.  https://github.com/envoyproxy/envoy/blob/master/api/envoy/api/v2/discovery.proto#L67

For an example EDS response:

```js
const store = {
    get: ( request ) => {
        if ( request.typeUrl === 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' ) {
            return {
                resourcesList: [
                    {
                        "cluster_name": "requested_cluster",
                        "endpoints": [
                            {
                                "lb_endpoints": [
                                    {
                                        "endpoint": {
                                            "address": {
                                                "socket_address": {
                                                    "address": "127.0.0.1",
                                                    "port_value": "5000"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }

        // return null or undefined if no data can be returned for request
        return undefined
    }
}
```
