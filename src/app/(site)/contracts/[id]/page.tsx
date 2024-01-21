import ContractCardExpanded from "@/components/shared/ContractCardExpanded";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";

export default async function ContractPage({params}: {params: {id: string}}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // Fetch the specific row from the 'contracts' table where 'id' equals 'params.id'
  let {data, error} = await supabase
    .from("contracts")
    .select("*")
    // Use .or to combine conditions
    .or(`latest_tx_id.eq.${params.id},deployment_tx_id.eq.${params.id}`);

  // console.log("get contract by txid ", data);

  return (
    <div>
      {data ? (
        <ContractCardExpanded contract={data} txId={params.id} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
