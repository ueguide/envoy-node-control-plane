// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_accesslog_v2_als_pb = require('../../../../envoy/service/accesslog/v2/als_pb.js');
var envoy_api_v2_core_base_pb = require('../../../../envoy/api/v2/core/base_pb.js');
var envoy_data_accesslog_v2_accesslog_pb = require('../../../../envoy/data/accesslog/v2/accesslog_pb.js');
var validate_validate_pb = require('../../../../validate/validate_pb.js');

function serialize_envoy_service_accesslog_v2_StreamAccessLogsMessage(arg) {
  if (!(arg instanceof envoy_service_accesslog_v2_als_pb.StreamAccessLogsMessage)) {
    throw new Error('Expected argument of type envoy.service.accesslog.v2.StreamAccessLogsMessage');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_accesslog_v2_StreamAccessLogsMessage(buffer_arg) {
  return envoy_service_accesslog_v2_als_pb.StreamAccessLogsMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_service_accesslog_v2_StreamAccessLogsResponse(arg) {
  if (!(arg instanceof envoy_service_accesslog_v2_als_pb.StreamAccessLogsResponse)) {
    throw new Error('Expected argument of type envoy.service.accesslog.v2.StreamAccessLogsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_accesslog_v2_StreamAccessLogsResponse(buffer_arg) {
  return envoy_service_accesslog_v2_als_pb.StreamAccessLogsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// [#protodoc-title: gRPC Access Log Service (ALS)]
//
// Service for streaming access logs from Envoy to an access log server.
var AccessLogServiceService = exports.AccessLogServiceService = {
  // Envoy will connect and send StreamAccessLogsMessage messages forever. It does not expect any
  // response to be sent as nothing would be done in the case of failure. The server should
  // disconnect if it expects Envoy to reconnect. In the future we may decide to add a different
  // API for "critical" access logs in which Envoy will buffer access logs for some period of time
  // until it gets an ACK so it could then retry. This API is designed for high throughput with the
  // expectation that it might be lossy.
  streamAccessLogs: {
    path: '/envoy.service.accesslog.v2.AccessLogService/StreamAccessLogs',
    requestStream: true,
    responseStream: false,
    requestType: envoy_service_accesslog_v2_als_pb.StreamAccessLogsMessage,
    responseType: envoy_service_accesslog_v2_als_pb.StreamAccessLogsResponse,
    requestSerialize: serialize_envoy_service_accesslog_v2_StreamAccessLogsMessage,
    requestDeserialize: deserialize_envoy_service_accesslog_v2_StreamAccessLogsMessage,
    responseSerialize: serialize_envoy_service_accesslog_v2_StreamAccessLogsResponse,
    responseDeserialize: deserialize_envoy_service_accesslog_v2_StreamAccessLogsResponse,
  },
};

exports.AccessLogServiceClient = grpc.makeGenericClientConstructor(AccessLogServiceService);
