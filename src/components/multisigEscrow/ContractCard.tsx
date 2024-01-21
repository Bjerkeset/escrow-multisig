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
import {formatDate} from "@/lib/utils";

export default function ContractCard({contract}: any) {
  // The contract tx is either a deployment tx or a later iteration of the contract.
  const contractTxId = contract.latest_tx_id || contract.deployment_tx_id;

  return (
    <Card key={contract.id}>
      <CardHeader>
        <CardTitle>{contract.title}</CardTitle>
        <CardDescription>
          Deployment txId: {contract.deployment_tx_id}
        </CardDescription>
        <CardDescription>
          Created: {formatDate(contract.created_at)}
        </CardDescription>
        <CardDescription>Latest txId: {contract.latest_tx_id}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-1">
        <p>Amount locked</p>
        <p>
          {contract.sats_amount_locked}
          <span> sats</span>
        </p>
        <Button asChild>
          <Link href={`/contracts/${contractTxId}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
