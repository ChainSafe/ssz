import {
  BlindedBeaconBlock,
  BlindedBeaconBlockBody,
  ExecutionPayloadHeader,
  FullOrBlindedBeaconBlock,
  FullOrBlindedBeaconBlockBody,
  FullOrBlindedBlobSidecar,
  FullOrBlindedExecutionPayload,
  FullOrBlindedSignedBeaconBlock,
  FullOrBlindedSignedBlobSidecar,
} from "../allForks/types.ts";
import {ts as bellatrix} from "../bellatrix/index.ts";
import {ts as deneb} from "../deneb/index.ts";

export function isBlindedExecution(payload: FullOrBlindedExecutionPayload): payload is ExecutionPayloadHeader {
  // we just check transactionsRoot for determinging as it the base field
  // that is present and differs from ExecutionPayload for all forks
  return (payload as ExecutionPayloadHeader).transactionsRoot !== undefined;
}

export function isBlindedBeaconBlock(block: FullOrBlindedBeaconBlock): block is BlindedBeaconBlock {
  return isBlindedBeaconBlockBody(block.body);
}

export function isBlindedBeaconBlockBody(body: FullOrBlindedBeaconBlockBody): body is BlindedBeaconBlockBody {
  return (body as BlindedBeaconBlockBody).executionPayloadHeader !== undefined;
}

export function isBlindedSignedBeaconBlock(
  signedBlock: FullOrBlindedSignedBeaconBlock
): signedBlock is bellatrix.SignedBlindedBeaconBlock {
  return (signedBlock as bellatrix.SignedBlindedBeaconBlock).message.body.executionPayloadHeader !== undefined;
}

export function isBlindedBlobSidecar(blob: FullOrBlindedBlobSidecar): blob is deneb.BlindedBlobSidecar {
  return (blob as deneb.BlindedBlobSidecar).blobRoot !== undefined;
}

export function isBlindedSignedBlobSidecar(
  blob: FullOrBlindedSignedBlobSidecar
): blob is deneb.SignedBlindedBlobSidecar {
  return (blob as deneb.SignedBlindedBlobSidecar).message.blobRoot !== undefined;
}
