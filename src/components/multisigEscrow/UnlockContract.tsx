"use client";
import {PandaSigner} from "scrypt-ts/dist/bsv/signers/panda-signer";
import {Owner, StatefulMultiSig} from "@/contracts/statefullMultisig";
import {
  FixedArray,
  GorillapoolProvider,
  MethodCallOptions,
  PubKey,
  bsv,
} from "scrypt-ts";
import artifact from "@/../artifacts/statefullMultisig.json";
import {useSigner} from "@/context/SignerProvider";
StatefulMultiSig.loadArtifact(artifact);

import React from "react";
import {Button} from "../ui/button";

type Props = {
  txId: string;
  canClaim: boolean;
};

export default function UnlockContract({txId, canClaim}: Props) {
  const {signer} = useSigner();

  const handlePay = async () => {
    if (!signer) {
      console.error("Signer is not available, log in again.");
      return;
    }
    const outputIndex = 0;
    const publicKey = await signer.getDefaultPubKey();
    console.log("publicKey: ", publicKey.toString());

    const tx = await signer.connectedProvider.getTransaction(txId);

    const instance = StatefulMultiSig.fromTx(tx, outputIndex);
    console.log("instance: ", instance);
    await instance.connect(signer);

    // const next = instance.next();

    const {tx: UnlockTx} = await instance.methods.pay(
      // Method call options:
      {
        changeAddress: await signer.getDefaultAddress(),
      } as MethodCallOptions<StatefulMultiSig>
    );
    console.log("UnlockTx TxId: ", UnlockTx.id);
  };

  return (
    <Button onClick={handlePay} variant="success">
      Claim Payment
    </Button>
  );
}
