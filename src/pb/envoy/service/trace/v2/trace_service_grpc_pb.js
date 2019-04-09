// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_trace_v2_trace_service_pb = require('../../../../envoy/service/trace/v2/trace_service_pb.js');
var envoy_api_v2_core_base_pb = require('../../../../envoy/api/v2/core/base_pb.js');
var trace_pb = require('../../../../trace_pb.js');
var google_api_annotations_pb = require('../../../../google/api/annotations_pb.js');
var validate_validate_pb = require('../../../../validate/validate_pb.js');

function serialize_envoy_service_trace_v2_StreamTracesMessage(arg) {
  if (!(arg instanceof envoy_service_trace_v2_trace_service_pb.StreamTracesMessage)) {
    throw new Error('Expected argument of type envoy.service.trace.v2.StreamTracesMessage');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_trace_v2_StreamTracesMessage(buffer_arg) {
  return envoy_service_trace_v2_trace_service_pb.StreamTracesMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_service_trace_v2_StreamTracesResponse(arg) {
  if (!(arg instanceof envoy_service_trace_v2_trace_service_pb.StreamTracesResponse)) {
    throw new Error('Expected argument of type envoy.service.trace.v2.StreamTracesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_trace_v2_StreamTracesResponse(buffer_arg) {
  return envoy_service_trace_v2_trace_service_pb.StreamTracesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// Service for streaming traces to server that consumes the trace data. It
// uses OpenCensus data model as a standard to represent trace information.
var TraceServiceService = exports.TraceServiceService = {
  // Envoy will connect and send StreamTracesMessage messages forever. It does
  // not expect any response to be sent as nothing would be done in the case
  // of failure.
  streamTraces: {
    path: '/envoy.service.trace.v2.TraceService/StreamTraces',
    requestStream: true,
    responseStream: false,
    requestType: envoy_service_trace_v2_trace_service_pb.StreamTracesMessage,
    responseType: envoy_service_trace_v2_trace_service_pb.StreamTracesResponse,
    requestSerialize: serialize_envoy_service_trace_v2_StreamTracesMessage,
    requestDeserialize: deserialize_envoy_service_trace_v2_StreamTracesMessage,
    responseSerialize: serialize_envoy_service_trace_v2_StreamTracesResponse,
    responseDeserialize: deserialize_envoy_service_trace_v2_StreamTracesResponse,
  },
};

exports.TraceServiceClient = grpc.makeGenericClientConstructor(TraceServiceService);
