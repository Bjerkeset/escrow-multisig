"use client";

import {useSigner} from "@/context/SignerProvider";
import {StatefulMultiSig} from "@/contracts/statefullMultisig";
import React, {useEffect, useState} from "react";
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
import {createClient} from "@/utils/supabase/client";
import {formatDate} from "@/lib/utils";
import {Button} from "../ui/button";
import UnlockContract from "../multisigEscrow/UnlockContract";

Scrypt.init({
  apiKey: process.env.NEXT_PUBLIC_SCRYPT_API_KEY,
  network: bsv.Networks.mainnet,
});

type Props = {
  txId: string;
  contract: any;
};

export default function ContractCardExpanded({txId, contract}: Props) {
  StatefulMultiSig.loadArtifact(artifact);
  const supabase = createClient();
  const [priceInBSV, setPriceInBSV] = useState("0.00");
  const {signer} = useSigner();
  const [owners, setOwners] = useState<
    Array<{pubKey: string; validated: boolean}>
  >([]);

  // Function to convert satoshis to BSV
  const satoshisToBSV = (satoshis) => {
    return (satoshis / 100000000).toFixed(8); // Adjust the number of decimal places if necessary
  };

  // Define a helper function to find the owner by public key
  const findOwnerValidatedStatus = (publicKey: string) => {
    const owner = owners.find((owner) => owner.pubKey === publicKey);
    return owner ? owner.validated : false;
  };

  // Variables for creator, escrow, and counterparty validated status
  const creatorValidated = findOwnerValidatedStatus(contract[0].creator_pubkey);
  const escrowValidated = findOwnerValidatedStatus(
    contract[0].validator_pubkey
  );
  const counterpartyValidated = findOwnerValidatedStatus(
    contract[0].counterparty_pubkey
  );

  useEffect(() => {
    async function getContractInstance() {
      const contractId = {
        txId: txId,
        outputIndex: 0,
      };

      try {
        const instance = await Scrypt.contractApi.getLatestInstance(
          StatefulMultiSig,
          contractId
        );

        console.log("instance: ", instance);
        if (instance) {
          // If you're sure about the structure, treat instance.from as any
          const instanceData: any = instance.from;
          const satoshis = instanceData?.satoshis;
          if (satoshis) {
            const price = satoshisToBSV(satoshis);
            setPriceInBSV(price); // Update the priceInBSV state
          }
          if (instance.owners) {
            setOwners(instance.owners);
          }
        }
      } catch (error) {
        console.error("error: ", error);
      }
    }
    getContractInstance();
  }, [signer, txId]);

  // Extract usernames from contract variable
  const creatorUsername = contract[0]?.author?.username;
  const escrowUsername = contract[0]?.escrow?.username;
  const counterpartyUsername = contract[0]?.counterparty?.username;

  // Define a function to get Tailwind CSS classes for validation status
  const getValidationClasses = (isValidated) => {
    return isValidated ? "text-green-500" : "text-red-500";
  };
  // Check if signer is available, and either escrow or creator is validated
  const canClaim = signer && (escrowValidated || creatorValidated);

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="grid grid-cols-2">
        <div>
          <CardTitle className="text-xl"> {contract[0].title} </CardTitle>
          <CardDescription className="text-base">
            Created. {formatDate(contract[0].created_at)}
          </CardDescription>
        </div>
        <div className=" ml-auto">
          Created by: {counterpartyUsername || "Unknown"}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col min-h-[400px]">
        <div className="">
          <h4 className="text-lg">CONTRACT TERMS</h4>
          <div className="h-0.5 bg-muted mb-3" />
          <p>{contract[0].terms}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="w-full pb-3">
          <div className="flex justify-between">
            <h4 className="text-lg">CONTRACT STATUS</h4>
            <h4 className="text-lg">CONTRACT AMOUNT</h4>
          </div>
          <div className="h-0.5 bg-muted" />
        </div>
        <div className="flex w-full ">
          <div className="w-full flex flex-col gap-1 ">
            <div className={getValidationClasses(escrowValidated)}>
              Escrow: {escrowUsername || "Unknown"} -{" "}
              {escrowValidated ? "Validated" : "Not Validated"}
            </div>
            <div className={getValidationClasses(counterpartyValidated)}>
              Counterparty: {counterpartyUsername || "Unknown"} -{" "}
              {counterpartyValidated ? "Validated" : "Not Validated"}
            </div>
            <div className={getValidationClasses(creatorValidated)}>
              Counterparty: {creatorValidated || "Unknown"} -{" "}
              {creatorValidated ? "Validated" : "Not Validated"}
            </div>
          </div>
          <div className="flex items-center h-10 w-36 ml-auto border border-green-400 rounded-xl px-2 ">
            {` ${priceInBSV} `}
          </div>
        </div>
        <div className="flex gap-1 justify-center w-full py-4">
          <AddValidation txId={txId} />
          <UnlockContract txId={txId} canClaim={canClaim} />
        </div>
      </CardFooter>
    </Card>
  );
}
