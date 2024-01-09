"use client";
import {StatefulMultiSig} from "@/contracts/statefullMultisig";
import {
  GorillapoolProvider,
  MethodCallOptions,
  PandaSigner,
  bsv,
  findSig,
} from "scrypt-ts";
import artifact from "@/../artifacts/statefullMultisig.json";
StatefulMultiSig.loadArtifact(artifact);

export default function Call() {
  const txId =
    "bf16dfd9162a6457a84741e3bc4c0e06eb45f0eb0a64d319473823dfd1d334b1";
  const pubKeyIdx = 1;

  const handleCall = async () => {
    const provider = new GorillapoolProvider(bsv.Networks.mainnet);
    const signer = new PandaSigner(provider);
    const {isAuthenticated, error} = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }
    await signer.connect(provider);
    const publicKey = await signer.getDefaultPubKey();
    const address = await signer.getDefaultAddress();

    console.log("publicKey: ", publicKey.toString());

    const tx = await signer.connectedProvider.getTransaction(txId);
    const instance = StatefulMultiSig.fromTx(tx, 0);
    console.log("instance: ", instance);
    // Construct next contract instance and update flag array.
    const next = instance.next();
    next.owners[pubKeyIdx].validated = true;

    await instance.connect(signer);

    const {tx: callTx} = await instance.methods.add(
      (sigResps) => findSig(sigResps, publicKey),
      BigInt(pubKeyIdx),
      // Method call options:
      {
        pubKeyOrAddrToSign: publicKey,
        next: {
          instance: next,
          balance: instance.balance,
        },
      } as MethodCallOptions<StatefulMultiSig>
    );
    console.log("Call TxId: ", callTx.id);
    console.log("Call response", callTx);
  };
  return (
    <div>
      <button className="bg-blue-700 rounded-md px-2 py-1" onClick={handleCall}>
        handleCall
      </button>
    </div>
  );
}
