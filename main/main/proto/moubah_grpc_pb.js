// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var moubah_pb = require('./moubah_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_AudioRequest(arg) {
  if (!(arg instanceof moubah_pb.AudioRequest)) {
    throw new Error('Expected argument of type AudioRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_AudioRequest(buffer_arg) {
  return moubah_pb.AudioRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GenericResponse(arg) {
  if (!(arg instanceof moubah_pb.GenericResponse)) {
    throw new Error('Expected argument of type GenericResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GenericResponse(buffer_arg) {
  return moubah_pb.GenericResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Process(arg) {
  if (!(arg instanceof moubah_pb.Process)) {
    throw new Error('Expected argument of type Process');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Process(buffer_arg) {
  return moubah_pb.Process.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var MusicRemoverService = exports.MusicRemoverService = {
  getProcess: {
    path: '/MusicRemover/GetProcess',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: moubah_pb.Process,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_Process,
    responseDeserialize: deserialize_Process,
  },
  ping: {
    path: '/MusicRemover/Ping',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: moubah_pb.GenericResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_GenericResponse,
    responseDeserialize: deserialize_GenericResponse,
  },
  removeMusic: {
    path: '/MusicRemover/RemoveMusic',
    requestStream: false,
    responseStream: false,
    requestType: moubah_pb.AudioRequest,
    responseType: moubah_pb.GenericResponse,
    requestSerialize: serialize_AudioRequest,
    requestDeserialize: deserialize_AudioRequest,
    responseSerialize: serialize_GenericResponse,
    responseDeserialize: deserialize_GenericResponse,
  },
};

exports.MusicRemoverClient = grpc.makeGenericClientConstructor(MusicRemoverService);
