/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.displayName = 'proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    maxHeapSizeBytes: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig}
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig;
  return proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig}
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMaxHeapSizeBytes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMaxHeapSizeBytes();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
};


/**
 * optional uint64 max_heap_size_bytes = 1;
 * @return {number}
 */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.prototype.getMaxHeapSizeBytes = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.envoy.config.resource_monitor.fixed_heap.v2alpha.FixedHeapConfig.prototype.setMaxHeapSizeBytes = function(value) {
  jspb.Message.setField(this, 1, value);
};


goog.object.extend(exports, proto.envoy.config.resource_monitor.fixed_heap.v2alpha);
