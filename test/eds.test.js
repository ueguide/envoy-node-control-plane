const eds = require( '../src/eds' )
const edsPB = require( '../src/pb/envoy/api/v2/eds_pb' )
const discoveryMessages = require( '../src/pb/envoy/api/v2/discovery_pb' )
const envoyCore = require( '../src/pb/envoy/api/v2/core/base_pb' )
const googlePBAny = require( 'google-protobuf/google/protobuf/any_pb.js' )

describe( 'Endpoint Discovery Service', () => {

  describe( 'streamEndpoints', () => {

    let requestHandler
    let callResponse
    let call

    beforeEach( () => {
      call = {
        on: jest.fn().mockImplementation( ( event, cb ) => {
          if ( event === 'data' ) {
            requestHandler = cb
          }
        }),
        write: jest.fn().mockImplementation( response => {
          callResponse = response
        })
      }
    })

    test( 'it writes response on found node', ( done ) => {
      const cache = {
        createWatch: jest.fn().mockImplementation( () => {
          return {
            cacheResponse: {
              version: '1',
              resourcesList: [
                {
                  'cluster_name': 'remote_cluster',
                  'endpoints': [
                    {
                      'lb_endpoints': [
                        {
                          'endpoint': {
                            'address': {
                              'socket_address': {
                                'address': '34.231.242.239',
                                'port_value': '32770'
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            watcher: null
          }
        })
      }

      const request = new discoveryMessages.DiscoveryRequest()
      const node = new envoyCore.Node()
      node.setId( 'test-node' )
      node.setCluster( 'test-cluster' )
      request.setNode( node )
      request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' )
      request.setResponseNonce( '' )
      request.setResourceNamesList( [ 'remote_cluster' ] )

      // call streamEndpoints (fires call.on methods)
      eds.makeStreamEndpoints( cache )( call )

      requestHandler( request )
        .then( () => {
          expect( call.write ).toHaveBeenCalled()

          const result = callResponse.toObject()
          expect( result.versionInfo ).toEqual( '1' )
          expect( result.nonce ).toEqual( '1' )

          const [ resource ] = result.resourcesList
          expect( resource.typeUrl ).toEqual( 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' )
          const any = new googlePBAny.Any()
          any.setTypeUrl( resource.typeUrl )
          any.setValue( resource.value )
          const clusterAssignment = any.unpack(
            edsPB.ClusterLoadAssignment.deserializeBinary,
            any.getTypeName()
          ).toObject()
          // console.log( clusterAssignment )
          expect( clusterAssignment.clusterName ).toEqual( 'remote_cluster' )
          done()
        })
        .catch( err => {
          done.fail( err )
        })
    })

    test( 'calls watcher if no cache response, returns response once fulfilled', ( done ) => {
      const cache = {
        createWatch: jest.fn().mockImplementation( () => {
          return {
            cacheResponse: null,
            watcher: {
              watch: jest.fn().mockImplementation( () => {
                return {
                  version: '2',
                  resourcesList: [
                    {
                      'cluster_name': 'remote_cluster',
                      'endpoints': [
                        {
                          'lb_endpoints': [
                            {
                              'endpoint': {
                                'address': {
                                  'socket_address': {
                                    'address': '34.231.242.239',
                                    'port_value': '32770'
                                  }
                                }
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              }),
              cancel: jest.fn()
            }
          }
        })
      }

      const request = new discoveryMessages.DiscoveryRequest()
      request.setVersionInfo( '1' )
      const node = new envoyCore.Node()
      node.setId( 'test-node' )
      node.setCluster( 'test-cluster' )
      request.setNode( node )
      request.setTypeUrl( 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' )
      request.setResponseNonce( '' )
      request.setResourceNamesList( [ 'remote_cluster' ] )

      // call streamEndpoints (fires call.on methods)
      eds.makeStreamEndpoints( cache )( call )

      requestHandler( request )
        .then( () => {
          expect( call.write ).toHaveBeenCalled()

          const result = callResponse.toObject()
          expect( result.versionInfo ).toEqual( '2' )

          const [ resource ] = result.resourcesList
          expect( resource.typeUrl ).toEqual( 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment' )
          const any = new googlePBAny.Any()
          any.setTypeUrl( resource.typeUrl )
          any.setValue( resource.value )
          const clusterAssignment = any.unpack(
            edsPB.ClusterLoadAssignment.deserializeBinary,
            any.getTypeName()
          ).toObject()
          // console.log( clusterAssignment )
          expect( clusterAssignment.clusterName ).toEqual( 'remote_cluster' )
          done()
        })
        .catch( err => {
          done.fail( err )
        })
    })

  })

})

