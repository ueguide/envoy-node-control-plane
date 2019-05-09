const edsServices = require( './pb/envoy/api/v2/eds_grpc_pb' )
const discovery = require( './pb/envoy/api/v2/discovery_pb' )
const googlePBAny = require( 'google-protobuf/google/protobuf/any_pb.js' )
const messages = require( './util/messages' )

// passed storage module
// let cache

const createResponse = ( cacheResponse ) => {
  const { version, resourcesList } = cacheResponse

  // build discovery response
  const response = new discovery.DiscoveryResponse()
  response.setVersionInfo( version.toString() )
  response.setTypeUrl( 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' )

  // build resources to assign
  const returnResourcesList = resourcesList.map( function( dataResource ) {
    // for each resource, great a google protobuf Any buffer message
    const any = new googlePBAny.Any()

    // create ClusterLoadAssignment message
    const clusterLoadAssignment = messages.buildClusterLoadAssignment( dataResource )

    // pack cluster load assignment message into any
    any.pack( clusterLoadAssignment.serializeBinary(), 'envoy.api.v2.ClusterLoadAssignment' )

    return any
  })

  // assign resources to response
  response.setResourcesList( returnResourcesList )

  return response
}

const makeStreamEndpoints = ( cache ) => {
  return ( call ) => {
    // set stream id

    // unique nonce generator for req-resp pairs per xDS stream; the server
    // ignores stale nonces. nonce is only modified within send() function.
    let streamNonce = 0

    // store cancel watcher function
    let streamWatcher

    // sends a serialized protobuf response
    const send = ( cacheResponse ) => {
      // create DiscoveryResponse from cache service response
      const response = createResponse( cacheResponse )

      // increment nonce
      streamNonce++
      response.setNonce( streamNonce.toString() )
      // console.log( 'streamNonce>>>', streamNonce )

      // write to stream
      call.write( response )
    }

    call.on( 'data', async function( request ) {
      // console.log( '----received request on stream----', streamNonce )
      // console.log( JSON.stringify( request.toObject(), null, 2 ) )
      const nonce = request.getResponseNonce()

      if ( nonce === '' || nonce.toString() === streamNonce.toString() ) {
        // cancel current watcher if set
        if ( streamWatcher ) {
          streamWatcher.cancel()
        }
        // console.log( 'CREATE CACHE WATCHER' )
        const { cacheResponse, watcher } = await cache.createWatch( request )
        streamWatcher = watcher
        if ( cacheResponse ) {
          send( cacheResponse )
        } else if ( watcher ) {
          send( await watcher.watch() )
        }

      }
    })

    call.on( 'end', function() {
      // cancel current watcher if set
      if ( streamWatcher ) {
        streamWatcher.cancel()
      }
      call.end()
    })
  }
}

exports.makeStreamEndpoints = makeStreamEndpoints

function fetchEndpoints( /* call, callback */ ) {
  // console.log( 'stream endpoints called' )
}

exports.registerServices = function( server, cacheManager ) {

  server.addService(
    edsServices.EndpointDiscoveryServiceService,
    {
      streamEndpoints: makeStreamEndpoints( cacheManager ),
      fetchEndpoints: fetchEndpoints
    }
  )
}
