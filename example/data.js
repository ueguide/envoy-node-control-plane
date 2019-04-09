const fs = require('fs')
const data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'))

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
