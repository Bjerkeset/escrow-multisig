import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "../ui/button";

export default function ContractCard({contract}: any) {
  const contractTxId = contract.latest_tx_id || contract.deployment_tx_id;
  return (
    <Card key={contract.id}>
      <CardHeader>
        <CardTitle>{contract.title}</CardTitle>
        <CardDescription>
          Deployment txId: {contract.deployment_tx_id}
        </CardDescription>
        <CardDescription>Latest txId: {contract.latest_tx_id}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col gap-1">
        <p> Amount locked </p>
        <p>
          {contract.sats_amount_locked} <span>satoshi's</span>
        </p>
        <Button asChild>
          <Link href={`/contracts/${contractTxId}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
