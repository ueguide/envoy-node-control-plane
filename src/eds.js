const edsServices = require('./pb/envoy/api/v2/eds_grpc_pb')
const discovery = require('./pb/envoy/api/v2/discovery_pb')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const makeResponseNonce = require('./util/response-nonce')
const messages = require('./util/messages')

// passed storage module
let cache

function streamEndpoints(call) {
  call.on('data', async function( request ) {
    const params = request.toObject()
    // console.log(JSON.stringify( params, null, 2 ))

    // get stored data for request
    const storedData = await cache.get( params )
    if ( !storedData ) {
      // console.log('NO DATA AVAILABLE')
      //return this.end()
    } else {
      const nonce = makeResponseNonce( storedData )

      // build discovery response
      const response = new discovery.DiscoveryResponse()
      response.setVersionInfo( 0 )
      response.setTypeUrl( 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' )
      response.setNonce( nonce )

      // build resources to assign
      const resourcesList = storedData.resourcesList.map( function ( dataResource ) {
        // for each resource, great a google protobuf Any buffer message
        const any = new googlePBAny.Any()

        // create ClusterLoadAssignment message
        const clusterLoadAssignment = messages.buildClusterLoadAssignment( dataResource )
        
        // pack cluster load assignment message into any
        any.pack( clusterLoadAssignment.serializeBinary(), 'envoy.api.v2.ClusterLoadAssignment')

        return any
      })

      // assign resources to response
      response.setResourcesList( resourcesList )
      // write response
      this.write(response)
    }
  })
  call.on('end', function() {
    call.end()
  })
}

function fetchEndpoints(call, callback) {
  console.log('stream endpoints called')
}

exports.registerServices = function ( server, cacheManager ) {
  cache = cacheManager 

  server.addService(
    edsServices.EndpointDiscoveryServiceService, 
    {
      streamEndpoints: streamEndpoints,
      fetchEndpoints: fetchEndpoints
    }
  )
}
