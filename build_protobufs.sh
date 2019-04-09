#!/usr/bin/env bash

cd "$(dirname "$0")"

# Steal proto files from java-control-plane ;-)
# https://github.com/envoyproxy/java-control-plane
git clone git@github.com:envoyproxy/java-control-plane.git
cp -R java-control-plane/api/src/main/proto ./src/proto
rm -rf java-control-plane

# compile protocol buffers to js files
JS_OUT="import_style=commonjs,binary:../pb/"
GRPC_OUT="../pb/"
PLUGIN=`which grpc_tools_node_protoc_plugin`
PLUGIN="protoc-gen-grpc=$PLUGIN"
cd src/proto
grpc_tools_node_protoc --js_out=$JS_OUT --grpc_out=$GRPC_OUT --plugin=$PLUGIN *.proto
grpc_tools_node_protoc --js_out=$JS_OUT --grpc_out=$GRPC_OUT --plugin=$PLUGIN */*.proto
grpc_tools_node_protoc --js_out=$JS_OUT --grpc_out=$GRPC_OUT --plugin=$PLUGIN */*/*.proto
grpc_tools_node_protoc --js_out=$JS_OUT --grpc_out=$GRPC_OUT --plugin=$PLUGIN */*/*/*/*.proto
grpc_tools_node_protoc --js_out=$JS_OUT --grpc_out=$GRPC_OUT --plugin=$PLUGIN */*/*/*/*/*.proto
