const ldsServices = require('./pb/envoy/api/v2/lds_grpc_pb')
const discovery = require('./pb/envoy/api/v2/discovery_pb')
const ldsPB = require('./pb/envoy/api/v2/lds_pb')
const listenerPB = require('./pb/envoy/api/v2/listener/listener_pb.js')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const googleStruct = require('google-protobuf/google/protobuf/struct_pb.js')
const makeResponseNonce = require('./util/response-nonce')
const messages = require('./util/messages')

let cache

function streamListeners(call) {
  call.on('data', async function( request ) {
    const params = request.toObject()
    // console.log(JSON.stringify( params, null, 2 ))

    // get stored data for request
    const storedData = await cache.get( params )
    if ( !storedData ) {
      // console.log('NO DATA AVAILABLE')
      //return this.end()
    } else {
      // check for nonce to stop infinite updates
      const nonce = makeResponseNonce( storedData )
      if ( params.responseNonce === nonce ) {
        //return this.end()
      }

      // build discovery response
      const response = new discovery.DiscoveryResponse()
      response.setVersionInfo( 0 )
      response.setTypeUrl( 'type.googleapis.com/envoy.api.v2.Listener' )
      response.setNonce( nonce )

      // build resources to assign
      const resourcesList = storedData.resourcesList.map( function ( dataResource ) {
        // for each resource, great a google protobuf Any buffer message
        const any = new googlePBAny.Any()

        // create Listener message
        // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/lds.proto
        const listener = new ldsPB.Listener()

        // create Address message 
        const address = messages.buildAddress( dataResource.address )

        // assign address 
        listener.setAddress( address )

        // build filter chains 
        const filterChains = dataResource.filter_chains.map( function ( dataFilterChain ) {
          // build filterChain 
          // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/listener/listener.proto#envoy-api-msg-listener-filterchain
          const filterChain = new listenerPB.FilterChain()

          // build filters 
          const filters = dataFilterChain.filters.map( function ( dataFilter ) {
            // build Filter message 
            // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/listener/listener.proto#envoy-api-msg-listener-filter
            const filter = new listenerPB.Filter()
            filter.setName( dataFilter.name )

            // build config Struct
            // https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct
            const config = googleStruct.Struct.fromJavaScript( dataFilter.config )

            // assign config to filter 
            filter.setConfig( config )

            return filter
          })

          // assign filters to filter chain 
          filterChain.setFiltersList( filters )

          return filterChain
        })

        // assign filterChains to listener
        listener.setFilterChainsList( filterChains )

        // pack listener message into any
        any.pack( listener.serializeBinary(), 'envoy.api.v2.Listener')

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

function fetchListeners(call, callback) {
  console.log('fetchListeners called')
}

exports.registerServices = function ( server, cacheManager ) {
  cache = cacheManager 

  server.addService(
    ldsServices.ListenerDiscoveryServiceService, 
    {
      streamListeners: streamListeners,
      fetchListeners: fetchListeners
    }
  )
}
