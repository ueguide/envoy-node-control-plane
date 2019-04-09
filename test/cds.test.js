const grpc = require('grpc')
const cds = require('../src/cds')
const cdsPB = require('../src/pb/envoy/api/v2/cds_pb')
const cdsServices = require('../src/pb/envoy/api/v2/cds_grpc_pb')
const discoveryMessages = require('../src/pb/envoy/api/v2/discovery_pb')
const envoyCore = require('../src/pb/envoy/api/v2/core/base_pb')
const googlePBAny = require('google-protobuf/google/protobuf/any_pb.js')
const mockDataStore = require('./mockDataStore')

let client
let server

beforeAll((done) => {
	server = new grpc.Server()
	cds.registerServices( server, mockDataStore )
	server.bind('0.0.0.0:55051', grpc.ServerCredentials.createInsecure())
	server.start()

  client = new cdsServices.ClusterDiscoveryServiceClient(
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


describe('Cluster Discovery Service', () => {

	describe('streamClusters', () => {

		test('should receive nothing with empty data', ( done ) => {
			const request = new discoveryMessages.DiscoveryRequest()
			const node = new envoyCore.Node()
			node.setId( 'foobar' )
			node.setCluster( 'test_cluster' )
			request.setNode( node )
			request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.Cluster' )
			request.setResponseNonce( '' )
			// console.log(request.toObject())
	
			const call = client.streamClusters()
	
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
			request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.Cluster' )
			request.setResponseNonce( '' )
			// console.log(request.toObject())
	
			const call = client.streamClusters()
			let result
	
			call.on('data', ( response ) => {
				result = response.toObject()
				const resource = result.resourcesList[0]
				const any = new googlePBAny.Any()
				any.setTypeUrl( resource.typeUrl )
				any.setValue( resource.value )
				const cluster = any.unpack( 
					cdsPB.Cluster.deserializeBinary, 
					any.getTypeName() 
				)
				.toObject()
				expect( cluster ).toBeTruthy()
				expect( cluster.name ).toEqual( 'some_service' )
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

