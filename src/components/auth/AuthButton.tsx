"use client";

import {GorillapoolProvider, PandaSigner, bsv} from "scrypt-ts";
import {Button} from "../ui/button";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

export default function AuthButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async () => {
    const provider = new GorillapoolProvider(bsv.Networks.mainnet);
    const signer = new PandaSigner(provider);
    const {isAuthenticated, error} = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }
    const walletAddress = await signer.getDefaultAddress();
    const walletPublicKey = await signer.getDefaultPubKey();
    // const walletAvatar = await signer.getDefaultPubKey();
    const walletPublicKeyString = walletPublicKey.toString();
    const walletAddressString = walletAddress.toString();
    console.log("walletAddress: ", walletAddress);
    console.log("walletAddressString: ", walletAddressString);

    // Find public key in users table and return user.
    let {data: user} = await supabase
      .from("users")
      .select("*")
      // Check if any address_key column contains the users walletAddress.
      .eq("address_key", walletAddressString);
    console.log("user ", user);

    // Insert new row if user is not found.
    if (user === null || [] || undefined) {
      console.log("no user");
      const {data, error} = await supabase
        .from("users")
        .insert([
          {address_key: walletAddressString, public_key: walletPublicKeyString},
        ])
        .select();
      console.log("User created", data);
      router.push(`/onboarding/${data[0].id}`);
    }
    // Redirect to onboarding page if user is not allready onboarded.
    // if (!user[0]?.isOnboarded) {
    //   // An extra check to make sure the user gets onboarded.
    //   router.push("/onboarding");
    // }
  };

  return (
    <div>
      <Button onClick={handleAuth}>Connect Wallet</Button>
    </div>
  );
}
