// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_load_stats_v2_lrs_pb = require('../../../../envoy/service/load_stats/v2/lrs_pb.js');
var envoy_api_v2_core_base_pb = require('../../../../envoy/api/v2/core/base_pb.js');
var envoy_api_v2_endpoint_load_report_pb = require('../../../../envoy/api/v2/endpoint/load_report_pb.js');
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
var validate_validate_pb = require('../../../../validate/validate_pb.js');

function serialize_envoy_service_load_stats_v2_LoadStatsRequest(arg) {
  if (!(arg instanceof envoy_service_load_stats_v2_lrs_pb.LoadStatsRequest)) {
    throw new Error('Expected argument of type envoy.service.load_stats.v2.LoadStatsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_load_stats_v2_LoadStatsRequest(buffer_arg) {
  return envoy_service_load_stats_v2_lrs_pb.LoadStatsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_service_load_stats_v2_LoadStatsResponse(arg) {
  if (!(arg instanceof envoy_service_load_stats_v2_lrs_pb.LoadStatsResponse)) {
    throw new Error('Expected argument of type envoy.service.load_stats.v2.LoadStatsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_load_stats_v2_LoadStatsResponse(buffer_arg) {
  return envoy_service_load_stats_v2_lrs_pb.LoadStatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// [#protodoc-title: Load reporting service]
//
var LoadReportingServiceService = exports.LoadReportingServiceService = {
  // Advanced API to allow for multi-dimensional load balancing by remote
  // server. For receiving LB assignments, the steps are:
  // 1, The management server is configured with per cluster/zone/load metric
  //    capacity configuration. The capacity configuration definition is
  //    outside of the scope of this document.
  // 2. Envoy issues a standard {Stream,Fetch}Endpoints request for the clusters
  //    to balance.
  //
  // Independently, Envoy will initiate a StreamLoadStats bidi stream with a
  // management server:
  // 1. Once a connection establishes, the management server publishes a
  //    LoadStatsResponse for all clusters it is interested in learning load
  //    stats about.
  // 2. For each cluster, Envoy load balances incoming traffic to upstream hosts
  //    based on per-zone weights and/or per-instance weights (if specified)
  //    based on intra-zone LbPolicy. This information comes from the above
  //    {Stream,Fetch}Endpoints.
  // 3. When upstream hosts reply, they optionally add header <define header
  //    name> with ASCII representation of EndpointLoadMetricStats.
  // 4. Envoy aggregates load reports over the period of time given to it in
  //    LoadStatsResponse.load_reporting_interval. This includes aggregation
  //    stats Envoy maintains by itself (total_requests, rpc_errors etc.) as
  //    well as load metrics from upstream hosts.
  // 5. When the timer of load_reporting_interval expires, Envoy sends new
  //    LoadStatsRequest filled with load reports for each cluster.
  // 6. The management server uses the load reports from all reported Envoys
  //    from around the world, computes global assignment and prepares traffic
  //    assignment destined for each zone Envoys are located in. Goto 2.
  streamLoadStats: {
    path: '/envoy.service.load_stats.v2.LoadReportingService/StreamLoadStats',
    requestStream: true,
    responseStream: true,
    requestType: envoy_service_load_stats_v2_lrs_pb.LoadStatsRequest,
    responseType: envoy_service_load_stats_v2_lrs_pb.LoadStatsResponse,
    requestSerialize: serialize_envoy_service_load_stats_v2_LoadStatsRequest,
    requestDeserialize: deserialize_envoy_service_load_stats_v2_LoadStatsRequest,
    responseSerialize: serialize_envoy_service_load_stats_v2_LoadStatsResponse,
    responseDeserialize: deserialize_envoy_service_load_stats_v2_LoadStatsResponse,
  },
};

exports.LoadReportingServiceClient = grpc.makeGenericClientConstructor(LoadReportingServiceService);
