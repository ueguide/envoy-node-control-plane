// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_metrics_v2_metrics_service_pb = require('../../../../envoy/service/metrics/v2/metrics_service_pb.js');
var envoy_api_v2_core_base_pb = require('../../../../envoy/api/v2/core/base_pb.js');
var metrics_pb = require('../../../../metrics_pb.js');
var validate_validate_pb = require('../../../../validate/validate_pb.js');

function serialize_envoy_service_metrics_v2_StreamMetricsMessage(arg) {
  if (!(arg instanceof envoy_service_metrics_v2_metrics_service_pb.StreamMetricsMessage)) {
    throw new Error('Expected argument of type envoy.service.metrics.v2.StreamMetricsMessage');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_metrics_v2_StreamMetricsMessage(buffer_arg) {
  return envoy_service_metrics_v2_metrics_service_pb.StreamMetricsMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_service_metrics_v2_StreamMetricsResponse(arg) {
  if (!(arg instanceof envoy_service_metrics_v2_metrics_service_pb.StreamMetricsResponse)) {
    throw new Error('Expected argument of type envoy.service.metrics.v2.StreamMetricsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_metrics_v2_StreamMetricsResponse(buffer_arg) {
  return envoy_service_metrics_v2_metrics_service_pb.StreamMetricsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// Service for streaming metrics to server that consumes the metrics data. It uses Prometheus metric
// data model as a standard to represent metrics information.
var MetricsServiceService = exports.MetricsServiceService = {
  // Envoy will connect and send StreamMetricsMessage messages forever. It does not expect any
  // response to be sent as nothing would be done in the case of failure.
  streamMetrics: {
    path: '/envoy.service.metrics.v2.MetricsService/StreamMetrics',
    requestStream: true,
    responseStream: false,
    requestType: envoy_service_metrics_v2_metrics_service_pb.StreamMetricsMessage,
    responseType: envoy_service_metrics_v2_metrics_service_pb.StreamMetricsResponse,
    requestSerialize: serialize_envoy_service_metrics_v2_StreamMetricsMessage,
    requestDeserialize: deserialize_envoy_service_metrics_v2_StreamMetricsMessage,
    responseSerialize: serialize_envoy_service_metrics_v2_StreamMetricsResponse,
    responseDeserialize: deserialize_envoy_service_metrics_v2_StreamMetricsResponse,
  },
};

exports.MetricsServiceClient = grpc.makeGenericClientConstructor(MetricsServiceService);
