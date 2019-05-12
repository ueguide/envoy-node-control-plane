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

const makeStreamEndpoints = ( cache, logger = null ) => {
  return ( call ) => {
    // set stream id

    // unique nonce generator for req-resp pairs per xDS stream; the server
    // ignores stale nonces. nonce is only modified within send() function.
    let streamNonce = 0

    // store cancel watcher function
    let streamWatcher

    // sends a serialized protobuf response
    const send = ( cacheResponse, request ) => {
      // create DiscoveryResponse from cache service response
      const response = createResponse( cacheResponse )

      // increment nonce
      streamNonce++
      response.setNonce( streamNonce.toString() )
      // console.log( 'streamNonce>>>', streamNonce )

      // write to stream
      call.write( response )
      // log
      if ( logger ) {
        logger.info(
          '--RESPONSE--',
          `Node=${request.getNode().getId()}`,
          'T=EDS',
          `V=${response.getVersionInfo()}`,
          `N=${streamNonce.toString()}`,
          request.getResourceNamesList()
        )
      }
    }

    call.on( 'data', async function( request ) {
      // console.log( '----received request on stream----', streamNonce )
      // console.log( JSON.stringify( request.toObject(), null, 2 ) )
      const nonce = request.getResponseNonce()
      if ( logger ) {
        logger.info(
          '--REQUEST--',
          `Node=${request.getNode().getId()}`,
          'T=EDS',
          `V=${request.getVersionInfo()}`,
          `N=${nonce}`,
          request.getResourceNamesList()
        )
      }

      if (
        nonce === '' || // first time call
        nonce.toString() === streamNonce.toString() || // req-resp pair match
        ( streamNonce === 0 && parseInt( nonce ) > 0 ) // management server deployment rollover
      ) {
        // cancel current watcher if set
        if ( streamWatcher ) {
          streamWatcher.cancel()
        }
        // create watcher - returns cache response or watcher promise to return
        const { cacheResponse, watcher } = await cache.createWatch( request )
        streamWatcher = watcher
        if ( cacheResponse ) {
          send( cacheResponse, request )
        } else if ( watcher ) {
          if ( logger ) {
            logger.info(
              '--WAIT-FOR-RESPONSE--',
              `Node=${request.getNode().getId()}`,
              'T=EDS',
              `V=${request.getVersionInfo()}`,
              `N=${nonce}`,
              request.getResourceNamesList()
            )
          }
          const awaitedResponse = await watcher.watch()
          if ( awaitedResponse ) {
            // reset streamWatcher
            streamWatcher = null
            // send response
            send( awaitedResponse, request )
          } else {
            // do nothing
          }
        }

      } else {
        if ( logger ) {
          logger.info(
            `--STALE-NONCE(${streamNonce})--`,
            `Node=${request.getNode().getId()}`,
            'T=EDS',
            `V=${request.getVersionInfo()}`,
            `N=${nonce}`,
            request.getResourceNamesList()
          )
        }
      }
    })

    call.on( 'end', function() {
      if ( logger ) {
        logger.info(
          `--END-STREAM(${streamNonce})--`
        )
      }
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

exports.registerServices = function( server, cacheManager, logger = null ) {

  server.addService(
    edsServices.EndpointDiscoveryServiceService,
    {
      streamEndpoints: makeStreamEndpoints( cacheManager, logger ),
      fetchEndpoints: fetchEndpoints
    }
  )
}
