import { readFileSync } from "fs";
import { credentials } from "@grpc/grpc-js";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

import { MusicRemoverClient } from "../proto/moubah_grpc_pb";
import { AudioRequest, GenericResponse } from "../proto/moubah_pb";

import { CONFIG_PATH } from "../const";
import ChunkRequestDTO from "../../dto/chunk-request";
import { mainLogger } from "../logger";

const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
const client = new MusicRemoverClient(
    `${config.grpc.host}:${config.grpc.port}`,
    credentials.createInsecure()
);

function dtoToGrpcMessage(chunkRequest: ChunkRequestDTO) {
    const audioRequest = new AudioRequest();
    audioRequest.setInputPath(chunkRequest.input_path);
    audioRequest.setOutputPath(chunkRequest.output_path);
    audioRequest.setRemoveOriginal(chunkRequest.remove_original);
    return audioRequest;
}

export function removeMusic(chunkRequest: ChunkRequestDTO) {
    return new Promise<GenericResponse>((resolve, reject) =>
        client.removeMusic(
            dtoToGrpcMessage(chunkRequest),
            (error, response) => {
                if (error) {
                    return reject(error);
                }
                if (response === null || response === undefined)
                    reject("No response from gRPC on getProcessId");
                else resolve(response);
            }
        )
    );
}

export function getProcessId() {
    return new Promise<number>((resolve, reject) =>
        client.getProcess(new Empty(), (err, response) => {
            if (err) reject(err);
            if (response === null || response === undefined)
                reject("No response from gRPC on getProcessId");
            else resolve(response.getId());
        })
    );
}

export async function ping({ recursive = true }) {
    return new Promise<void>(async (resolve, reject) =>
        client.ping(new Empty(), (err, _) => {
            if (!err) {
                return resolve();
            } else {
                mainLogger.info("gRPC: " + err.message);
                if (!recursive) reject();
                setTimeout(async () => {
                    await ping({ recursive: recursive });
                    resolve();
                }, 2000);
            }
        })
    );
}
