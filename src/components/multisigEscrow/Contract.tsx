"use client";
import {getContractInstance} from "@/app/utils";
import {useEffect, useRef, useState} from "react";
import artifact from "@/../artifacts/statefullMultisig.json";
import {StatefulMultiSig} from "@/contracts/statefullMultisig";
import {PandaSigner, bsv} from "scrypt-ts";
import {OrdiProvider} from "scrypt-ord";
// import { OrdiProvider } from "scrypt-ord";
StatefulMultiSig.loadArtifact(artifact);

export default function Contract() {
  const [_payAddress, setPayAddress] = useState<bsv.Address | undefined>(
    undefined
  );
  const [_ordiAddress, setOrdiAddress] = useState<bsv.Address | undefined>(
    undefined
  );
  const [_network, setNetwork] = useState<bsv.Networks.Network | undefined>(
    undefined
  );
  const [_error, setError] = useState<string | undefined>(undefined);

  const _signer = useRef<PandaSigner | undefined>(undefined);

  useEffect(() => {
    _signer.current = new PandaSigner(new OrdiProvider());
  }, []);

  const connect = async () => {
    try {
      const signer = _signer.current as PandaSigner;
      const {isAuthenticated, error} = await signer.requestAuth();
      if (!isAuthenticated) {
        throw new Error(error);
      }
      setPayAddress(await signer.getDefaultAddress());
      setOrdiAddress(await signer.getOrdAddress());
      const network = await signer.getNetwork();
      setNetwork(network);
      await signer.connect(new OrdiProvider(network));
      setError(undefined);
    } catch (e) {
      setError(`${e}`);
    }
  };
  const connected = () => {
    return (
      _network !== undefined &&
      _payAddress !== undefined &&
      _ordiAddress !== undefined
    );
  };

  return <div> Contract...</div>;
}
