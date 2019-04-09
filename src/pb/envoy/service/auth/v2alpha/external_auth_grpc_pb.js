// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var envoy_service_auth_v2alpha_external_auth_pb = require('../../../../envoy/service/auth/v2alpha/external_auth_pb.js');
var envoy_api_v2_core_base_pb = require('../../../../envoy/api/v2/core/base_pb.js');
var envoy_type_http_status_pb = require('../../../../envoy/type/http_status_pb.js');
var envoy_service_auth_v2alpha_attribute_context_pb = require('../../../../envoy/service/auth/v2alpha/attribute_context_pb.js');
var google_rpc_status_pb = require('../../../../google/rpc/status_pb.js');
var validate_validate_pb = require('../../../../validate/validate_pb.js');

function serialize_envoy_service_auth_v2alpha_CheckRequest(arg) {
  if (!(arg instanceof envoy_service_auth_v2alpha_external_auth_pb.CheckRequest)) {
    throw new Error('Expected argument of type envoy.service.auth.v2alpha.CheckRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_auth_v2alpha_CheckRequest(buffer_arg) {
  return envoy_service_auth_v2alpha_external_auth_pb.CheckRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_envoy_service_auth_v2alpha_CheckResponse(arg) {
  if (!(arg instanceof envoy_service_auth_v2alpha_external_auth_pb.CheckResponse)) {
    throw new Error('Expected argument of type envoy.service.auth.v2alpha.CheckResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_envoy_service_auth_v2alpha_CheckResponse(buffer_arg) {
  return envoy_service_auth_v2alpha_external_auth_pb.CheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// [#protodoc-title: Authorization Service ]
//
// The authorization service request messages used by external authorization :ref:`network filter
// <config_network_filters_ext_authz>` and :ref:`HTTP filter <config_http_filters_ext_authz>`.
//
// A generic interface for performing authorization check on incoming
// requests to a networked service.
var AuthorizationService = exports.AuthorizationService = {
  // Performs authorization check based on the attributes associated with the
  // incoming request, and returns status `OK` or not `OK`.
  check: {
    path: '/envoy.service.auth.v2alpha.Authorization/Check',
    requestStream: false,
    responseStream: false,
    requestType: envoy_service_auth_v2alpha_external_auth_pb.CheckRequest,
    responseType: envoy_service_auth_v2alpha_external_auth_pb.CheckResponse,
    requestSerialize: serialize_envoy_service_auth_v2alpha_CheckRequest,
    requestDeserialize: deserialize_envoy_service_auth_v2alpha_CheckRequest,
    responseSerialize: serialize_envoy_service_auth_v2alpha_CheckResponse,
    responseDeserialize: deserialize_envoy_service_auth_v2alpha_CheckResponse,
  },
};

exports.AuthorizationClient = grpc.makeGenericClientConstructor(AuthorizationService);
