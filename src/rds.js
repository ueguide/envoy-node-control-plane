const rdsServices = require('./pb/envoy/api/v2/rds_grpc_pb')
const discovery = require('./pb/envoy/api/v2/discovery_pb')
const rdsPB = require('./pb/envoy/api/v2/rds_pb')
const routePB = require('./pb/envoy/api/v2/route/route_pb')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const makeResponseNonce = require('./util/response-nonce')

let cache

function streamRoutes(call) {
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
      response.setTypeUrl( 'type.googleapis.com/envoy.api.v2.RouteConfiguration' )
      response.setNonce( nonce )

      // build resources to assign
      const resourcesList = storedData.resourcesList.map( function ( dataResource ) {
        // for each resource, great a google protobuf Any buffer message
        const any = new googlePBAny.Any()

        // create RouteConfiguration message
        // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/rds.proto
        const routeConfiguration = new rdsPB.RouteConfiguration()
        routeConfiguration.setName( dataResource.name )

        const virtualHosts = dataResource.virtual_hosts.map( function (dataVirtualHost) {
          // create VirtualHost message
          // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/route/route.proto#envoy-api-msg-route-virtualhost
          const virtualHost = new routePB.VirtualHost()
          virtualHost.setName( dataVirtualHost.name)
          virtualHost.setDomainsList( dataVirtualHost.domains )

          const routes = dataVirtualHost.routes.map( function ( dataRoute ) {
            // create Route Message 
            // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/route/route.proto#envoy-api-msg-route-route
            const route = new routePB.Route()

            // create RouteMatch message 
            // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/route/route.proto#envoy-api-msg-route-routematch
            const match = new routePB.RouteMatch()
            match.setPrefix( dataRoute.match.prefix )

            // assign match to route
            route.setMatch( match )

            // create RouteAction message 
            // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/route/route.proto#envoy-api-msg-route-routeaction
            const routeAction = new routePB.RouteAction()
            routeAction.setCluster( dataRoute.route.cluster )

            // assign route action to route
            route.setRoute( routeAction )

            return route
          })
          // assign routes 
          virtualHost.setRoutesList( routes )

          return virtualHost
        })

        // assign virtualHosts to routeConfiguration
        routeConfiguration.setVirtualHostsList( virtualHosts )

        // pack routeConfiguration message into any
        any.pack( routeConfiguration.serializeBinary(), 'envoy.api.v2.RouteConfiguration')

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

function incrementalRoutes(call, callback) {
	console.log('incrementalRoutes called')
}

function fetchRoutes(call, callback) {
  console.log('fetchRoutes called')
}

exports.registerServices = function ( server, cacheManager ) {
  cache = cacheManager 

  server.addService(
    rdsServices.RouteDiscoveryServiceService, 
    {
			streamRoutes: streamRoutes,
			incrementalRoutes: incrementalRoutes,
      fetchRoutes: fetchRoutes
    }
  )
}
