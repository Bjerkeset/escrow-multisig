"use client";
import {Button} from "@/components/ui/button";
import {createClient} from "@/utils/supabase/client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import artifact from "@/../artifacts/statefullMultisig.json";
import {Owner, StatefulMultiSig} from "@/contracts/statefullMultisig";
StatefulMultiSig.loadArtifact(artifact);
import React from "react";
import {
  Addr,
  FixedArray,
  GorillapoolProvider,
  PandaSigner,
  PubKey,
  bsv,
} from "scrypt-ts";
import {CalendarIcon, CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {MultiSelect} from "../ui/multi-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Textarea} from "../ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

const formSchema = z.object({
  amount: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  counterparty: z.string().min(2, {
    message: "You must select at least one counterparty.",
  }),
  description: z.string().min(2, {
    message: "The contract terms must me at least 2 characters.",
  }),
  validators: z
    .array(z.string())
    .min(1, "At least one framework must be selected"),
});

export default function DeployContract({userId}: {userId: string}) {
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      validators: [],
      counterparty: "",
    },
  });
  const owners: FixedArray<Owner, typeof StatefulMultiSig.M> = [
    {
      pubKey: PubKey(
        bsv.PublicKey.fromString(
          "033b5b3b5b45a137a293281a0b38892737c5f3c13eb3f9a9ce4906e00b2038d048"
        ).toByteString()
      ),
      validated: false,
    },
    {
      pubKey: PubKey(
        bsv.PublicKey.fromString(
          "02314a9e072337e0191a4dbaad15f83a06457b1494d77f92c2061f4ed14e680e44"
        ).toByteString()
      ),
      validated: false,
    },
    {
      pubKey: PubKey(
        bsv.PublicKey.fromString(
          "02a0849ac46e9afa883eca84c9de4d4cb82f72884c6983a9473a98ab6afafd5bc5"
        ).toByteString()
      ),
      validated: false,
    },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Initialize the blockchain provider and signer.
    const provider = new GorillapoolProvider(bsv.Networks.mainnet);
    const signer = new PandaSigner(provider);
    const {isAuthenticated, error} = await signer.requestAuth();
    if (!isAuthenticated) {
      throw new Error(error);
    }
    const myAddress = await signer.getDefaultAddress(); // Get address from wallet.
    const destAddr = Addr(myAddress.toByteString()); // Format address.
    console.log("destAddr: ", destAddr.toString());

    // Create a new contract instance with the destination address and owners.
    const instance = new StatefulMultiSig(destAddr, owners);

    await instance.connect(signer); // Connect the wallet to the contract instance.

    //Deploy the new contract intance to the blockchain.
    const deployTx = await instance.deploy(1);
    console.log("Deploy TX: ", deployTx.id);

    console.log(values);

    const {data} = await supabase
      .from("users")
      .update({username: values.counterparty})
      .eq("id", userId)
      .select();
  }

  const languages = [
    {
      value: "Bendik",
      label: "Bendik",
    },
    {
      value: "sveltekit",
      label: "Emil",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
    {
      value: "wordpress",
      label: "WordPress",
    },
    {
      value: "express.js",
      label: "Express.js",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Creation</CardTitle>
        <CardDescription>
          Add participance and deploy a smart-contract
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="counterparty"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Counterparty</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : ""}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput placeholder="Select a counterparty" />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("counterparty", language.value);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {language.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a counterparty for the contract.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validators"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Add validators</FormLabel>
                  <MultiSelect
                    selected={field.value}
                    options={[
                      {
                        value: "next.js",
                        label: "Bendik",
                      },
                      {
                        value: "sveltekit",
                        label: "Emil",
                      },
                      {
                        value: "nuxt.js",
                        label: "Nuxt.js",
                      },
                      {
                        value: "remix",
                        label: "Remix",
                      },
                      {
                        value: "astro",
                        label: "Astro",
                      },
                      {
                        value: "wordpress",
                        label: "WordPress",
                      },
                      {
                        value: "express.js",
                        label: "Express.js",
                      },
                    ]}
                    {...field}
                    className="sm:w-[510px]"
                  />
                  <FormDescription>
                    Select one or more validators.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Contract Terms</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe the terms of the contract.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount "in sats" locked in the smart contract
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
