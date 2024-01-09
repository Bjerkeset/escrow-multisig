import {PandaSigner} from "scrypt-ts/dist/bsv/signers/panda-signer";
import {Owner, StatefulMultiSig} from "@/contracts/statefullMultisig";
import {
  Addr,
  FixedArray,
  GorillapoolProvider,
  MethodCallOptions,
  PubKey,
  bsv,
  findSig,
} from "scrypt-ts";
import artifact from "../../../artifacts/statefullMultisig.json";
import Copy from "@/components/Copy";
import Contract from "@/components/multisigEscrow/Contract";
import Unlock from "@/components/multisigEscrow/Unlock";
import Deploy from "@/components/multisigEscrow/Deploy";
import Call from "@/components/multisigEscrow/Call";
import AuthButton from "@/components/auth/AuthButton";
export default async function page() {
  // StatefulMultiSig.loadArtifact(artifact);
  return (
    <div className="flex flex-col items-center gap-4">
      <Copy />
      <div className="flex gap-2">
        <Deploy />
        <Call />
        <Unlock />
      </div>
      <AuthButton />
    </div>
  );
}
