const addressPB = require('../pb/envoy/api/v2/core/address_pb')
const edsPB = require('../pb/envoy/api/v2/eds_pb')
const endpointPB = require('../pb/envoy/api/v2/endpoint/endpoint_pb')

const buildAddress = ( addressData ) => {
	// create Address message 
  // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/core/address.proto#envoy-api-msg-core-address
  const address = new addressPB.Address()
  // create SocketAddress message 
  // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/core/address.proto#envoy-api-msg-core-socketaddress
  const socketAddress = new addressPB.SocketAddress()
  // assign values to socket address
  socketAddress.setAddress( addressData.socket_address.address )
  socketAddress.setPortValue( addressData.socket_address.port_value )
  // assign socket address to address
	address.setSocketAddress( socketAddress )
	
	return address
}

const buildClusterLoadAssignment = ( loadAssignmentData ) => {
	// create ClusterLoadAssignment message
  // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/eds.proto#clusterloadassignment
  const clusterLoadAssignment = new edsPB.ClusterLoadAssignment()
  clusterLoadAssignment.setClusterName( loadAssignmentData.cluster_name )

  // build endpoints to assign
  const endpoints = loadAssignmentData.endpoints.map( function ( dataEndpoint ) {
    // create LocalityLbEndpoints message
    // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/endpoint/endpoint.proto#envoy-api-msg-endpoint-localitylbendpoints
    const localityLbEndpoints = new endpointPB.LocalityLbEndpoints()

    // build lbendpoints to assign 
    const lbEndpoints = dataEndpoint.lb_endpoints.map( function ( dataLbEndpoint ) {
      // create LbEndpoint message
      // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/endpoint/endpoint.proto#envoy-api-msg-endpoint-lbendpoint
      const lbEndpoint = new endpointPB.LbEndpoint()
      // create Endpoint message 
      // https://www.envoyproxy.io/docs/envoy/latest/api-v2/api/v2/endpoint/endpoint.proto#envoy-api-msg-endpoint-endpoint
      const endpoint = new endpointPB.Endpoint()

      // create Address message 
      const address = buildAddress( dataLbEndpoint.endpoint.address )

      // assign address to endpoint
      endpoint.setAddress( address )
      // assign endpoint to lb endpoint
      lbEndpoint.setEndpoint( endpoint )

      return lbEndpoint
    })
    // assign lb endpoints to locality lb endpoint
    localityLbEndpoints.setLbEndpointsList( lbEndpoints )

    return localityLbEndpoints
  }) 

  // assign endpoints to cluster
	clusterLoadAssignment.setEndpointsList( endpoints )
	
	return clusterLoadAssignment
}

exports.buildAddress = buildAddress
exports.buildClusterLoadAssignment = buildClusterLoadAssignment
