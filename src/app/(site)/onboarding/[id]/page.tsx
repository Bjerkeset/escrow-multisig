import OnboardingForm from "@/components/pages/onboarding/OnboardingForm";
import {createClient} from "@/utils/supabase/server";
import {cookies} from "next/headers";
import {useSearchParams} from "next/navigation";

export default async function page({params}: {params: {id: string}}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let {data: user} = await supabase
    .from("users")
    .select("*")
    // Check if any id column contains the users id.
    .eq("id", params.id);
  console.log("user ", user);

  return (
    <div>
      <h1 className="text-3xl">Onboarding</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <div>user Id: {params.id}</div>
      <OnboardingForm userId={params.id} />
    </div>
  );
}
