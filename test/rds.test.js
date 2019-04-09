const grpc = require('grpc')
const rds = require('../src/rds')
const rdsPB = require('../src/pb/envoy/api/v2/rds_pb')
const rdsServices = require('../src/pb/envoy/api/v2/rds_grpc_pb')
const discoveryMessages = require('../src/pb/envoy/api/v2/discovery_pb')
const envoyCore = require('../src/pb/envoy/api/v2/core/base_pb')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const mockDataStore = require('./mockDataStore')

let client
let server

beforeAll((done) => {
	server = new grpc.Server()
	rds.registerServices( server, mockDataStore )
	server.bind('0.0.0.0:55051', grpc.ServerCredentials.createInsecure())
	server.start()

  client = new rdsServices.RouteDiscoveryServiceClient(
      'localhost:55051',
      grpc.credentials.createInsecure()
  )
  done()
})

afterAll(done => {
	client = null
	server.forceShutdown()
  done()
})


describe('Route Discovery Service', () => {

	describe('streamRoutes', () => {

		test('should receive nothing with empty data', ( done ) => {
			const request = new discoveryMessages.DiscoveryRequest()
			const node = new envoyCore.Node()
			node.setId( 'foobar' )
			node.setCluster( 'test_cluster' )
			request.setNode( node )
			request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.RouteConfiguration' )
			request.setResponseNonce( '' )
			request.setResourceNamesList( ['local_route'])
			// console.log(request.toObject())
	
			const call = client.streamRoutes()
	
			call.on('data', ( response ) => {
				done.fail('should not receive response data')
			})
	
			call.on('end', () => {
				done()
			})

			call.on('error', ( err ) => {
				done.fail(err)
			})
	
			call.write( request )
			call.end()
		})

		test('should receive response with found node', ( done ) => {
			const request = new discoveryMessages.DiscoveryRequest()
			const node = new envoyCore.Node()
			node.setId( 'test_node' )
			node.setCluster( 'test_cluster' )
			request.setNode( node )
			request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.RouteConfiguration' )
			request.setResponseNonce( '' )
			request.setResourceNamesList( ['local_route'])
			// console.log(request.toObject())
	
			const call = client.streamRoutes()
			let result
	
			call.on('data', ( response ) => {
				result = response.toObject()
				const resource = result.resourcesList[0]
				const any = new googlePBAny.Any()
				any.setTypeUrl( resource.typeUrl )
				any.setValue( resource.value )
				const routeConfiguration = any.unpack( 
					rdsPB.RouteConfiguration.deserializeBinary, 
					any.getTypeName() 
				)
				.toObject()
				expect( routeConfiguration ).toBeTruthy()
				done()
			})
	
			call.on('end', () => {
				done.fail('should not end before receiving response')
			})

			call.on('error', ( err ) => {
				if ( !result ) {
					console.log(err)
					done.fail('should have responsed with result')
				}
			})
	
			call.write( request )
			call.end()
		})

	})

})

