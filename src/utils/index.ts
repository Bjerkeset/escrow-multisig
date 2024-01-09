// "use server";
import {StatefulMultiSig} from "@/contracts/statefullMultisig";
import {GorillapoolProvider, PandaSigner, bsv} from "scrypt-ts";
import artifact from "@/../artifacts/statefullMultisig.json";
StatefulMultiSig.loadArtifact(artifact);

export async function getContractInstance() {
  const txId =
    "f40cb6f2da813e1f3fceaadc54df60ba05249a9d0f9350a77f30bfd18e832f20";
  const outputIndex = 0;
  const provider = new GorillapoolProvider(bsv.Networks.mainnet);
  const signer = new PandaSigner(provider);
  const {isAuthenticated, error} = await signer.requestAuth();
  if (!isAuthenticated) {
    throw new Error(error);
  }
  await signer.connect(provider);
  const tx = await signer.connectedProvider.getTransaction(txId);
  const instance = StatefulMultiSig.fromTx(tx, outputIndex);
  console.log("instance:", instance);
}
