import DeployContract from "@/components/multisigEscrow/DeployContract";
import Navigation from "@/components/shared/Navigation";
import {Card, CardContent} from "@/components/ui/card";

export default function CreatePage() {
  return (
    <div>
      <DeployContract userId="1" />
    </div>
  );
}
