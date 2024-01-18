import OnboardingForm from "@/components/pages/onboarding/OnboardingForm";
import {Card, CardContent} from "@/components/ui/card";
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
    <main className="mx-auto container max-w-[calc(65ch+100px)] min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <h1 className="text-3xl">Onboarding</h1>
          <p>Update your username to continue</p>
          {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          {/* <div>user Id: {params.id}</div> */}
          <div className="pt-10">
            <OnboardingForm userId={params.id} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
