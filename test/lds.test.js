const grpc = require('grpc')
const lds = require('../src/lds')
const ldsPB = require('../src/pb/envoy/api/v2/lds_pb')
const ldsServices = require('../src/pb/envoy/api/v2/lds_grpc_pb')
const discoveryMessages = require('../src/pb/envoy/api/v2/discovery_pb')
const envoyCore = require('../src/pb/envoy/api/v2/core/base_pb')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const mockDataStore = require('./mockDataStore')

let client
let server

beforeAll((done) => {
	server = new grpc.Server()
	lds.registerServices( server, mockDataStore )
	server.bind('0.0.0.0:55051', grpc.ServerCredentials.createInsecure())
	server.start()

  client = new ldsServices.ListenerDiscoveryServiceClient(
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


describe('Listener Discovery Service', () => {

	describe('streamListeners', () => {

		test('should receive nothing with empty data', ( done ) => {
			const request = new discoveryMessages.DiscoveryRequest()
			const node = new envoyCore.Node()
			node.setId( 'foobar' )
			node.setCluster( 'test_cluster' )
			request.setNode( node )
			request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.Listener' )
			request.setResponseNonce( '' )
			// console.log(request.toObject())
	
			const call = client.streamListeners()
	
			call.on('data', ( response ) => {
				done.fail('should not receive response data')
			})
	
			call.on('end', () => {
				done()
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
			request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.Listener' )
			request.setResponseNonce( '' )
			// console.log(request.toObject())
	
			const call = client.streamListeners()
			let result
	
			call.on('data', ( response ) => {
				result = response.toObject()
				const resource = result.resourcesList[0]
				const any = new googlePBAny.Any()
				any.setTypeUrl( resource.typeUrl )
				any.setValue( resource.value )
				const listener = any.unpack( 
					ldsPB.Listener.deserializeBinary, 
					any.getTypeName() 
				)
				.toObject()
				expect( listener ).toBeTruthy()
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

