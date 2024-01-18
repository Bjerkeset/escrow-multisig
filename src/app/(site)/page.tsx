import About from "@/components/pages/home/About";

export default async function page() {
  return (
    <main className="mx-auto container max-w-[calc(65ch+100px)] min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <About />
      {/* <div className="flex gap-2">
            <Deploy />
            <Call />
           <Unlock />
          </div> */}

      {/* <FormTest /> */}
    </main>
  );
}
