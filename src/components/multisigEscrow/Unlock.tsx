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
StatefulMultiSig.loadArtifact(artifact);
// Deployed TX: d22b4978d3b818465cbf848a5f75e4960049c8eb6b76fecde9e11bdc3292e1ff

export default function Unlock() {
  // Hardcoded pubKeys array based on the owners array
  // const pubKeys: bsv.PublicKey[] = [
  //   bsv.PublicKey.fromString(
  //     "033b5b3b5b45a137a293281a0b38892737c5f3c13eb3f9a9ce4906e00b2038d048"
  //   ),
  //   bsv.PublicKey.fromString(
  //     "02314a9e072337e0191a4dbaad15f83a06457b1494d77f92c2061f4ed14e680e44"
  //   ),
  //   bsv.PublicKey.fromString(
  //     "02a0849ac46e9afa883eca84c9de4d4cb82f72884c6983a9473a98ab6afafd5bc5"
  //   ),
  // ];

  // const hardcodedPubKeys = [
  //   "033b5b3b5b45a137a293281a0b38892737c5f3c13eb3f9a9ce4906e00b2038d048",
  //   "02314a9e072337e0191a4dbaad15f83a06457b1494d77f92c2061f4ed14e680e44",
  //   "02a0849ac46e9afa883eca84c9de4d4cb82f72884c6983a9473a98ab6afafd5bc5",
  // ];

  // // let owners: FixedArray<Owner, typeof StatefulMultiSig.M>;
  // let pubKeys: bsv.PublicKey[] = []; // Initialize the pubKeys array
  // const _owners: Array<Owner> = [];

  // for (let i = 0; i < StatefulMultiSig.M; i++) {
  //   const pubKey = new bsv.PublicKey(hardcodedPubKeys[i]);
  //   pubKeys.push(pubKey); // Add the pubKey to the pubKeys array
  //   _owners.push({
  //     pubKey: PubKey(pubKey.toByteString()),
  //     validated: false,
  //   });
  // }
  // owners = _owners as FixedArray<Owner, typeof StatefulMultiSig.M>;

  // Define the the owner's public keys
  const generateOwners = () => {
    const privKeys: bsv.PrivateKey[] = [];
    const pubKeys: bsv.PublicKey[] = [];
    let owners: FixedArray<Owner, typeof StatefulMultiSig.M>;

    const _owners: Array<Owner> = [];
    for (let i = 0; i < StatefulMultiSig.M; i++) {
      const privKey = bsv.PrivateKey.fromRandom(bsv.Networks.testnet);
      const pubKey = privKey.toPublicKey();
      privKeys.push(privKey);
      pubKeys.push(pubKey);
      _owners.push({
        pubKey: PubKey(pubKey.toByteString()),
        validated: false,
      });
    }
    owners = _owners as FixedArray<Owner, typeof StatefulMultiSig.M>;
    console.log("pubKeys: ", pubKeys);
    console.log("owners: ", owners);
  };

  //Unlock txId: d6e1898b6c6b8c96de108e21e2187bf2cc88e26c396058dbc1db235845ce676d
  const handlePay = async () => {
    const outputIndex = 0;
    const txId =
      "bf16dfd9162a6457a84741e3bc4c0e06eb45f0eb0a64d319473823dfd1d334b1";
    // const pubKeyIdx = 0;
    const provider = new GorillapoolProvider(bsv.Networks.mainnet);
    const signer = new PandaSigner(provider);
    const {isAuthenticated, error} = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }
    await signer.connect(provider);
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
    <main>
      <div className="">
        {/* <button
          className="bg-blue-700 rounded-md px-2 py-1"
          onClick={generateOwners}
        >
          Generate Owners
        </button> */}
        <button
          className="bg-blue-700 rounded-md px-2 py-1"
          onClick={handlePay}
        >
          handlePay
        </button>
      </div>
    </main>
  );
}
