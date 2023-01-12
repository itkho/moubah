// GENERATED CODE -- DO NOT EDIT!

// package: 
// file: moubah.proto

import * as moubah_pb from "./moubah_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "@grpc/grpc-js";

interface IMusicRemoverService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  getProcess: grpc.MethodDefinition<google_protobuf_empty_pb.Empty, moubah_pb.Process>;
  ping: grpc.MethodDefinition<google_protobuf_empty_pb.Empty, moubah_pb.GenericResponse>;
  removeMusic: grpc.MethodDefinition<moubah_pb.AudioRequest, moubah_pb.GenericResponse>;
}

export const MusicRemoverService: IMusicRemoverService;

export interface IMusicRemoverServer extends grpc.UntypedServiceImplementation {
  getProcess: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, moubah_pb.Process>;
  ping: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, moubah_pb.GenericResponse>;
  removeMusic: grpc.handleUnaryCall<moubah_pb.AudioRequest, moubah_pb.GenericResponse>;
}

export class MusicRemoverClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  getProcess(argument: google_protobuf_empty_pb.Empty, callback: grpc.requestCallback<moubah_pb.Process>): grpc.ClientUnaryCall;
  getProcess(argument: google_protobuf_empty_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<moubah_pb.Process>): grpc.ClientUnaryCall;
  getProcess(argument: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<moubah_pb.Process>): grpc.ClientUnaryCall;
  ping(argument: google_protobuf_empty_pb.Empty, callback: grpc.requestCallback<moubah_pb.GenericResponse>): grpc.ClientUnaryCall;
  ping(argument: google_protobuf_empty_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<moubah_pb.GenericResponse>): grpc.ClientUnaryCall;
  ping(argument: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<moubah_pb.GenericResponse>): grpc.ClientUnaryCall;
  removeMusic(argument: moubah_pb.AudioRequest, callback: grpc.requestCallback<moubah_pb.GenericResponse>): grpc.ClientUnaryCall;
  removeMusic(argument: moubah_pb.AudioRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<moubah_pb.GenericResponse>): grpc.ClientUnaryCall;
  removeMusic(argument: moubah_pb.AudioRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<moubah_pb.GenericResponse>): grpc.ClientUnaryCall;
}
