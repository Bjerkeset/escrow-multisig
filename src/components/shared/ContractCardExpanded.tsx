"use client";

import {useSigner} from "@/context/SignerProvider";
import {StatefulMultiSig} from "@/contracts/statefullMultisig";
import React, {useEffect} from "react";
import artifact from "@/../artifacts/statefullMultisig.json";
import {Scrypt, bsv} from "scrypt-ts";
import AddValidation from "./AddValidation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

Scrypt.init({
  apiKey: "mainnet_2lk1XmmtRnji3xiRQAAbuwwuHiZOwK1eTfb1ykupfWNH0RdnE",
  network: bsv.Networks.mainnet,
});

type Props = {
  txId: string;
  contract: any;
};

export default function ContractCardExpanded({txId, contract}: Props) {
  StatefulMultiSig.loadArtifact(artifact);
  const {signer} = useSigner();

  console.log("contract: ", contract.title);

  useEffect(() => {
    console.log("signer: ", signer);
    async function getContractInstace() {
      const contractId = {
        txId: txId, // NOTE: CAN BE WRONG
        outputIndex: 0,
      };

      try {
        const instance = await Scrypt.contractApi.getLatestInstance(
          StatefulMultiSig,
          contractId
        );
        console.log("currentInstance: ", instance);
      } catch (error) {
        console.log("error: ", error);
      }
    }
    getContractInstace();
  }, [signer, txId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle> {contract.title} </CardTitle>
        <CardDescription> {} </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <AddValidation txId={txId} />
      </CardFooter>
    </Card>
  );
}
