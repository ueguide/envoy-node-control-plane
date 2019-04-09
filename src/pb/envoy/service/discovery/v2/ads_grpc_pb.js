// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_discovery_v2_ads_pb = require('../../../../envoy/service/discovery/v2/ads_pb.js');
var envoy_api_v2_discovery_pb = require('../../../../envoy/api/v2/discovery_pb.js');

function serialize_envoy_api_v2_DiscoveryRequest(arg) {
  if (!(arg instanceof envoy_api_v2_discovery_pb.DiscoveryRequest)) {
    throw new Error('Expected argument of type envoy.api.v2.DiscoveryRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_api_v2_DiscoveryRequest(buffer_arg) {
  return envoy_api_v2_discovery_pb.DiscoveryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_api_v2_DiscoveryResponse(arg) {
  if (!(arg instanceof envoy_api_v2_discovery_pb.DiscoveryResponse)) {
    throw new Error('Expected argument of type envoy.api.v2.DiscoveryResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_api_v2_DiscoveryResponse(buffer_arg) {
  return envoy_api_v2_discovery_pb.DiscoveryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_api_v2_IncrementalDiscoveryRequest(arg) {
  if (!(arg instanceof envoy_api_v2_discovery_pb.IncrementalDiscoveryRequest)) {
    throw new Error('Expected argument of type envoy.api.v2.IncrementalDiscoveryRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_api_v2_IncrementalDiscoveryRequest(buffer_arg) {
  return envoy_api_v2_discovery_pb.IncrementalDiscoveryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_api_v2_IncrementalDiscoveryResponse(arg) {
  if (!(arg instanceof envoy_api_v2_discovery_pb.IncrementalDiscoveryResponse)) {
    throw new Error('Expected argument of type envoy.api.v2.IncrementalDiscoveryResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_api_v2_IncrementalDiscoveryResponse(buffer_arg) {
  return envoy_api_v2_discovery_pb.IncrementalDiscoveryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// [#not-implemented-hide:] Discovery services for endpoints, clusters, routes,
// and listeners are retained in the package `envoy.api.v2` for backwards
// compatibility with existing management servers. New development in discovery
// services should proceed in the package `envoy.service.discovery.v2`.
//
// See https://github.com/lyft/envoy-api#apis for a description of the role of
// ADS and how it is intended to be used by a management server. ADS requests
// have the same structure as their singleton xDS counterparts, but can
// multiplex many resource types on a single stream. The type_url in the
// DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
// the multiplexed singleton APIs at the Envoy instance and management server.
var AggregatedDiscoveryServiceService = exports.AggregatedDiscoveryServiceService = {
  // This is a gRPC-only API.
  streamAggregatedResources: {
    path: '/envoy.service.discovery.v2.AggregatedDiscoveryService/StreamAggregatedResources',
    requestStream: true,
    responseStream: true,
    requestType: envoy_api_v2_discovery_pb.DiscoveryRequest,
    responseType: envoy_api_v2_discovery_pb.DiscoveryResponse,
    requestSerialize: serialize_envoy_api_v2_DiscoveryRequest,
    requestDeserialize: deserialize_envoy_api_v2_DiscoveryRequest,
    responseSerialize: serialize_envoy_api_v2_DiscoveryResponse,
    responseDeserialize: deserialize_envoy_api_v2_DiscoveryResponse,
  },
  incrementalAggregatedResources: {
    path: '/envoy.service.discovery.v2.AggregatedDiscoveryService/IncrementalAggregatedResources',
    requestStream: true,
    responseStream: true,
    requestType: envoy_api_v2_discovery_pb.IncrementalDiscoveryRequest,
    responseType: envoy_api_v2_discovery_pb.IncrementalDiscoveryResponse,
    requestSerialize: serialize_envoy_api_v2_IncrementalDiscoveryRequest,
    requestDeserialize: deserialize_envoy_api_v2_IncrementalDiscoveryRequest,
    responseSerialize: serialize_envoy_api_v2_IncrementalDiscoveryResponse,
    responseDeserialize: deserialize_envoy_api_v2_IncrementalDiscoveryResponse,
  },
};

exports.AggregatedDiscoveryServiceClient = grpc.makeGenericClientConstructor(AggregatedDiscoveryServiceService);
