// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_ratelimit_v2_rls_pb = require('../../../../envoy/service/ratelimit/v2/rls_pb.js');
var envoy_api_v2_core_base_pb = require('../../../../envoy/api/v2/core/base_pb.js');
var envoy_api_v2_ratelimit_ratelimit_pb = require('../../../../envoy/api/v2/ratelimit/ratelimit_pb.js');
var validate_validate_pb = require('../../../../validate/validate_pb.js');

function serialize_envoy_service_ratelimit_v2_RateLimitRequest(arg) {
  if (!(arg instanceof envoy_service_ratelimit_v2_rls_pb.RateLimitRequest)) {
    throw new Error('Expected argument of type envoy.service.ratelimit.v2.RateLimitRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_ratelimit_v2_RateLimitRequest(buffer_arg) {
  return envoy_service_ratelimit_v2_rls_pb.RateLimitRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_service_ratelimit_v2_RateLimitResponse(arg) {
  if (!(arg instanceof envoy_service_ratelimit_v2_rls_pb.RateLimitResponse)) {
    throw new Error('Expected argument of type envoy.service.ratelimit.v2.RateLimitResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_ratelimit_v2_RateLimitResponse(buffer_arg) {
  return envoy_service_ratelimit_v2_rls_pb.RateLimitResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// [#protodoc-title: Rate Limit Service (RLS)]
//
var RateLimitServiceService = exports.RateLimitServiceService = {
  // Determine whether rate limiting should take place.
  shouldRateLimit: {
    path: '/envoy.service.ratelimit.v2.RateLimitService/ShouldRateLimit',
    requestStream: false,
    responseStream: false,
    requestType: envoy_service_ratelimit_v2_rls_pb.RateLimitRequest,
    responseType: envoy_service_ratelimit_v2_rls_pb.RateLimitResponse,
    requestSerialize: serialize_envoy_service_ratelimit_v2_RateLimitRequest,
    requestDeserialize: deserialize_envoy_service_ratelimit_v2_RateLimitRequest,
    responseSerialize: serialize_envoy_service_ratelimit_v2_RateLimitResponse,
    responseDeserialize: deserialize_envoy_service_ratelimit_v2_RateLimitResponse,
  },
};

exports.RateLimitServiceClient = grpc.makeGenericClientConstructor(RateLimitServiceService);
