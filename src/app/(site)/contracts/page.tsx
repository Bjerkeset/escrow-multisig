import ContractCard from "@/components/multisigEscrow/ContractCard";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function ContractsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let {data: contracts} = await supabase.from("contracts").select("*");

  return (
    <div className="flex flex-col gap-4">
      {contracts.map((contract: any) => {
        return <ContractCard key={contract.id} contract={contract} />;
      })}
    </div>
  );
}
