const cdsServices = require('./pb/envoy/api/v2/cds_grpc_pb')
const discovery = require('./pb/envoy/api/v2/discovery_pb')
const cdsPB = require('./pb/envoy/api/v2/cds_pb')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const googlePBDuration = require('google-protobuf/google/protobuf/duration_pb.js')
const makeResponseNonce = require('./util/response-nonce')
const messages = require('./util/messages')

let store 

function streamClusters(call) {
  call.on('data', function( request ) {
    const params = request.toObject()
    // console.log(JSON.stringify( params, null, 2 ))

    // get stored data for request
    const storedData = store.get( params )
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
      response.setTypeUrl( 'type.googleapis.com/envoy.api.v2.Cluster' )
      response.setNonce( nonce )
      
      // build resources to assign
      const resourcesList = storedData.resourcesList.map( function ( dataResource ) {
        //console.log(JSON.stringify( dataResource, null, 2 ))
        // for each resource, great a google protobuf Any buffer message
        const any = new googlePBAny.Any()

        // create Cluster message
        // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/cds.proto#cluster
        const cluster = new cdsPB.Cluster()
        cluster.setName( dataResource.name )

        // create DiscoveryType message 
        // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/cds.proto#envoy-api-enum-cluster-discoverytype
        cluster.setType( cdsPB.Cluster.DiscoveryType[ dataResource.type ] )
        
        // create Duration message 
        // https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#duration
        const duration = new googlePBDuration.Duration()
        duration.setSeconds( dataResource.connect_timeout )
        cluster.setConnectTimeout( duration )

        // create LB Policy message 
        // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/cds.proto#envoy-api-enum-cluster-lbpolicy
        cluster.setLbPolicy( cdsPB.Cluster.LbPolicy[ dataResource.lb_policy ] )
        
        // create ClusterLoadAssignment message
        const clusterLoadAssignment = messages.buildClusterLoadAssignment( dataResource.load_assignment )
        
        // assign clusterLoadAssignment
        cluster.setLoadAssignment( clusterLoadAssignment )
        
        // pack listener message into any
        any.pack( cluster.serializeBinary(), 'envoy.api.v2.Cluster')
        
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

function incrementalClusters(call) {
  // placeholder
}

function fetchClusters(call, callback) {
  // placeholder
}

exports.registerServices = function ( server, configStore ) {
  store = configStore 

  server.addService(
    cdsServices.ClusterDiscoveryServiceService, 
    {
      streamClusters: streamClusters,
      incrementalClusters: incrementalClusters,
      fetchClusters: fetchClusters
    }
  )
}
