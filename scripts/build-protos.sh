#!/bin/bash

PROTOC="./node_modules/.bin/grpc_tools_node_protoc"
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
PROTOC_GEN_GRPC_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"

IN_DIR="./music-remover/src/protobuf"
OUT_DIR="./main/main/proto"
mkdir -p ${OUT_DIR}

$PROTOC \
    --plugin=protoc-gen-ts=$PROTOC_GEN_TS_PATH \
    --plugin=protoc-gen-grpc=$PROTOC_GEN_GRPC_PATH \
    --js_out=import_style=commonjs:$OUT_DIR \
    --grpc_out=grpc_js:$OUT_DIR \
    --ts_out=service=grpc-node,mode=grpc-js:$OUT_DIR \
    --proto_path=$IN_DIR \
    moubah.proto