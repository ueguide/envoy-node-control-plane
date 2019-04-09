const data = {
	"cds": {
		"test_node": {
			"nonce": "test_node_nonce",
			"resourcesList": [
				{
					"name": "some_service",
					"connect_timeout": "25",
    			"type": "STRICT_DNS",
					"lb_policy": "ROUND_ROBIN",
					"load_assignment": {
						"cluster_name": "some_cluster",
						"endpoints": [
							{
								"lb_endpoints": [
									{
										"endpoint": {
											"address": {
												"socket_address": {
													"address": "service_host_name",
													"port_value": "3000"
												}
											}
										}
									}
								]
							}
						]
					}
				}
			]
		}
	},
	"lds": {
		"test_node": {
			"nonce": "test_node_nonce",
			"resourcesList": [
				{
					"address": {
						"socket_address": {
							"address": "0.0.0.0",
							"port_value": "80"
						}
					},
					"filter_chains": [
						{
							"filters": [
								{
									"name": "envoy.http_connection_manager",
									"config": {
										"codec_type": "auto",
										"stat_prefix": "ingress_http",
										"route_config": {
											"name": "local_route",
											"virtual_hosts": [
												{
													"name": "some_virtual_host",
													"domains": [
														"*"
													],
													"routes": [
														{
															"match": {
																"prefix": "/"
															},
															"route": {
																"cluster": "some_cluster"
															}
														}
													]
												}
											]
										},
										"http_filters": [
											{
											 "config": {},
											 "name": "envoy.router"
											}
										]
									}
								}
							]
						}
					]
				}
			]
		}
	},
	"rds": {
    "test_node": {
      "nonce": "test_node_nonce",
      "resourcesList": [
        {
          "name": "local_route",
          "virtual_hosts": [
            {
              "name": "service",
              "domains": [
                "*"
              ],
              "routes": [
                {
                  "match": {
                    "prefix": "/"
                  },
                  "route": {
                    "cluster": "test_cluster"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
	},
	"eds": [
    {
      "cluster_name": "test_cluster",
      "endpoints": [
        {
          "lb_endpoints": [
            {
              "endpoint": {
                "address": {
                  "socket_address": {
                    "address": "54.242.145.125",
                    "port_value": "32772"
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

exports.get = function getData ( requestParams ) {
	switch( requestParams.typeUrl ) {
		case 'type.googleapis.com/envoy.api.v2.Cluster': {
			return data.cds && data.cds[ requestParams.node.id ] || undefined
		}
		case 'type.googleapis.com/envoy.api.v2.Listener': {
			return data.lds && data.lds[ requestParams.node.id ] || undefined
		}
		case 'type.googleapis.com/envoy.api.v2.RouteConfiguration': {
			const nodeId = requestParams.node.id
			const routeNames = requestParams.resourceNamesList
			if ( !data.rds || !data.rds[ nodeId] ) {
				return undefined
			}
			
			const resourcesList = data.rds[ nodeId].resourcesList.filter((resource) => {
				return routeNames.indexOf( resource.name ) > -1
			})

			if ( resourcesList.length > 0 ) {
				return {
					nonce: data.rds[ nodeId].nonce,
					resourcesList
				}
			}

			return undefined
		}
		case 'type.googleapis.com/envoy.api.v2.ClusterLoadAssignment': {
			const routeNames = requestParams.resourceNamesList

			const resourcesList = data.eds.filter((resource) => {
				return routeNames.indexOf( resource.cluster_name ) > -1
			})

			if ( resourcesList.length > 0 ) {
				return {
					resourcesList
				}
			}

			return undefined
		}
	default:
		return undefined
	}
}
