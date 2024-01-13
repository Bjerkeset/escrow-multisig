import Copy from "@/components/Copy";
import Unlock from "@/components/multisigEscrow/Unlock";
import Deploy from "@/components/multisigEscrow/Deploy";
import Call from "@/components/multisigEscrow/Call";
import AuthButton from "@/components/auth/AuthButton";
import DeployContract from "@/components/multisigEscrow/DeployContract";
import {ModeToggle} from "@/components/mode-toggle";
import {Card, CardContent} from "@/components/ui/card";
import {Main} from "next/document";

export default async function page() {
  return (
    <main className="mx-auto container max-w-[calc(65ch+100px)] min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <Card className="flex justify-center max-w-5xl">
        <CardContent>
          {/* <Copy /> */}
          {/* <div className="flex gap-2">
        <Deploy />
        <Call />
        <Unlock />
      </div> */}
          <AuthButton />
          <ModeToggle />
          {/* <FormTest /> */}
          <DeployContract userId="1" />
        </CardContent>
      </Card>
    </main>
  );
}

// className="flex flex-col items-center gap-4"
