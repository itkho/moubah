// package: 
// file: moubah.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class AudioRequest extends jspb.Message {
  getInputPath(): string;
  setInputPath(value: string): void;

  getOutputPath(): string;
  setOutputPath(value: string): void;

  getRemoveOriginal(): boolean;
  setRemoveOriginal(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AudioRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AudioRequest): AudioRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AudioRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AudioRequest;
  static deserializeBinaryFromReader(message: AudioRequest, reader: jspb.BinaryReader): AudioRequest;
}

export namespace AudioRequest {
  export type AsObject = {
    inputPath: string,
    outputPath: string,
    removeOriginal: boolean,
  }
}

export class Process extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Process.AsObject;
  static toObject(includeInstance: boolean, msg: Process): Process.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Process, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Process;
  static deserializeBinaryFromReader(message: Process, reader: jspb.BinaryReader): Process;
}

export namespace Process {
  export type AsObject = {
    id: number,
  }
}

export class GenericResponse extends jspb.Message {
  getSucceeded(): boolean;
  setSucceeded(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenericResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GenericResponse): GenericResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenericResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenericResponse;
  static deserializeBinaryFromReader(message: GenericResponse, reader: jspb.BinaryReader): GenericResponse;
}

export namespace GenericResponse {
  export type AsObject = {
    succeeded: boolean,
    error: string,
  }
}

