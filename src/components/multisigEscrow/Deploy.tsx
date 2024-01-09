"use client";
import artifact from "@/../artifacts/statefullMultisig.json";
import {Owner, StatefulMultiSig} from "@/contracts/statefullMultisig";
StatefulMultiSig.loadArtifact(artifact);
import React from "react";
import {
  Addr,
  FixedArray,
  GorillapoolProvider,
  PandaSigner,
  PubKey,
  bsv,
} from "scrypt-ts";

export default function Deploy() {
  const owners: FixedArray<Owner, typeof StatefulMultiSig.M> = [
    {
      pubKey: PubKey(
        bsv.PublicKey.fromString(
          "033b5b3b5b45a137a293281a0b38892737c5f3c13eb3f9a9ce4906e00b2038d048"
        ).toByteString()
      ),
      validated: false,
    },
    {
      pubKey: PubKey(
        bsv.PublicKey.fromString(
          "02314a9e072337e0191a4dbaad15f83a06457b1494d77f92c2061f4ed14e680e44"
        ).toByteString()
      ),
      validated: false,
    },
    {
      pubKey: PubKey(
        bsv.PublicKey.fromString(
          "02a0849ac46e9afa883eca84c9de4d4cb82f72884c6983a9473a98ab6afafd5bc5"
        ).toByteString()
      ),
      validated: false,
    },
  ];

  const handleDeploy = async () => {
    const provider = new GorillapoolProvider(bsv.Networks.mainnet);
    const signer = new PandaSigner(provider);
    const {isAuthenticated, error} = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }
    const myAddress = await signer.getDefaultAddress();
    const destAddr = Addr(myAddress.toByteString());
    console.log("destAddr: ", destAddr.toString());

    const instance = new StatefulMultiSig(destAddr, owners);
    await instance.connect(signer);

    const deployTx = await instance.deploy(1);
    console.log("Deploy TX: ", deployTx.id);
  };

  return (
    <div>
      <button
        className="bg-blue-700 rounded-md px-2 py-1"
        onClick={handleDeploy}
      >
        handleDeploy
      </button>
    </div>
  );
}
