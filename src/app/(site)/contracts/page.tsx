import ContractCard from "@/components/multisigEscrow/ContractCard";
import {Card, CardContent} from "@/components/ui/card";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import Navigation from "@/components/shared/Navigation";

export default async function ContractsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let {data: contracts} = await supabase.from("contracts").select("*");

  return (
    <div>
      {contracts.map((contract: any) => {
        return <ContractCard key={contract.id} contract={contract} />;
      })}
    </div>
  );
}
