"use client";
import {createClient} from "@/utils/supabase/client";
import {Button} from "../ui/button";
import {useSigner} from "@/context/SignerProvider";
import {StatefulMultiSig} from "@/contracts/statefullMultisig";
import artifact from "@/../artifacts/statefullMultisig.json";
import {MethodCallOptions, Scrypt, bsv, findSig} from "scrypt-ts";

Scrypt.init({
  apiKey: "mainnet_2lk1XmmtRnji3xiRQAAbuwwuHiZOwK1eTfb1ykupfWNH0RdnE",
  network: bsv.Networks.mainnet,
});

export default function AddValidation({txId}: {txId: string}) {
  StatefulMultiSig.loadArtifact(artifact);
  const {signer} = useSigner();
  const supabase = createClient();

  const handleCall = async () => {
    if (!signer) {
      console.error("No signer found");
      return;
    }
    // await signer.connect(new ScryptProvider());
    // const provider = new GorillapoolProvider(bsv.Networks.mainnet);
    // const signer = new PandaSigner(provider);
    const publicKey = await signer.getDefaultPubKey();

    const contractId = {
      txId: txId,
      outputIndex: 0,
    };

    const instance = await Scrypt.contractApi.getLatestInstance(
      StatefulMultiSig,
      contractId
    );

    console.log("instance: ", instance);

    // Get signer's public key as a string
    const signerPubKey = publicKey.toString();
    // Function to find the index of the matching owner
    const findMatchingOwnerIndex = (owners, signerPubKey) => {
      return owners.findIndex(
        (owner) => owner.pubKey === signerPubKey && !owner.validated
      );
    };
    // // Find index of the matching owner
    const pubKeyIdx = findMatchingOwnerIndex(instance.owners, signerPubKey);

    if (pubKeyIdx === -1) {
      console.error(
        "Signer has allready validated or public key does not match any owner"
      );
      return;
    }
    console.log("Matching Owner Index: ", pubKeyIdx);

    // Construct next contract instance and update flag array.
    const next = instance.next();
    next.owners[pubKeyIdx].validated = true;
    // Connect to the contract instance
    await instance.connect(signer);

    // Call the add method. Creates a new transaction with updated flag array (updated state).
    const {tx: callTx} = await instance.methods.add(
      (sigResps) => findSig(sigResps, publicKey),
      BigInt(pubKeyIdx), // Index of the matching owner
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

    const newValue = callTx.id; // The new value you want to set for latest_tx_id
    const valueToMatch = txId; // The value you are looking for in the deployment_tx_id or latest_tx_id columns
    const columnNameToMatch = "deployment_tx_id"; // The column name to match (deployment_tx_id)
    const columnNameToUpsert = "latest_tx_id"; // The column name to update (latest_tx_id)
    const alternativeColumnNameToMatch = "latest_tx_id"; // Alternative column name to match (latest_tx_id)

    // Update the row with the matching deployment_tx_id or latest_tx_id
    const {data, error} = await supabase
      .from("contracts")
      .update({[columnNameToUpsert]: newValue})
      .or(
        `${columnNameToMatch}.eq.${valueToMatch},${alternativeColumnNameToMatch}.eq.${valueToMatch}`
      );

    if (error) {
      console.error(error);
    } else {
      // Proceed with non-null and non-empty data array
      console.log("Row updated:", data);
    }
  };

  return <Button onClick={handleCall}>Add Validation</Button>;
}
