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
import React, {useEffect, useState} from "react";
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
import {useSigner} from "@/context/SignerProvider";

StatefulMultiSig.loadArtifact(artifact);

const formSchema = z.object({
  title: z.string().min(2, {
    message: "The contract title must be at least 2 characters.",
  }),
  amount: z
    .string()
    .min(1)
    .max(10)
    .refine((val) => !isNaN(val as unknown as number), {
      message: "Student ID should be a number",
    }),
  counterparty: z.string().min(2, {
    message: "You must select at least one counterparty.",
  }),
  escrow: z.string().min(2, {
    message: "You must select at least one counterparty.",
  }),
  description: z.string().min(2, {
    message: "The contract terms must me at least 2 characters.",
  }),
  // validators: z
  //   .array(z.string())
  //   .min(1, "At least one framework must be selected"),
});

export default function DeployContract({userId}: {userId: string}) {
  const supabase = createClient();
  const {signer} = useSigner();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      escrow: "",
      // validators: [],
      counterparty: "",
    },
  });

  // New state for storing users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // console.log("artifact", artifact);
    async function fetchUsers() {
      let {data: fetchedUsers, error} = await supabase
        .from("users")
        .select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(fetchedUsers);
      }
    }
    fetchUsers();
  }, [supabase]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("signer", signer);

    // Helper function to find username by public key
    function findUsernameByPublicKey(publicKey) {
      const user = users.find((user) => user.public_key === publicKey);
      return user ? user.username : null;
    }

    // Proceed only if signer is available
    if (!signer) {
      console.error("Signer is not available, log in again.");
      return;
    }
    const myAddress = await signer.getDefaultAddress(); // Get address from wallet.
    const myPublicKey = await signer.getDefaultPubKey();
    const destAddr = Addr(myAddress.toByteString()); // Format address.

    console.log("all users>>>", users);
    console.log("onSubmit values", values);
    const escrow = values.escrow;
    const counterparty = values.counterparty;
    const creator = myPublicKey.toString();
    const title = values.title;
    const description = values.description;
    const amount = Number(values.amount);

    const creatorPublicKey = myPublicKey.toString();
    const counterpartyPublicKey = values.counterparty;
    const escrowPublicKey = values.escrow;

    // Find usernames by public keys
    const creatorUsername = findUsernameByPublicKey(creatorPublicKey);
    const counterpartyUsername = findUsernameByPublicKey(counterpartyPublicKey);
    const escrowUsername = findUsernameByPublicKey(escrowPublicKey);

    try {
      const validatorSignatory = {
        pubKey: PubKey(bsv.PublicKey.fromString(escrow).toByteString()),
        validated: false,
      };
      console.log("validatorSignatory", validatorSignatory);
      const counterpartySignatory = {
        pubKey: PubKey(bsv.PublicKey.fromString(counterparty).toByteString()),
        validated: false,
      };
      console.log("counterpartySignatory", counterpartySignatory);
      const creatorSignatory = {
        pubKey: PubKey(bsv.PublicKey.fromString(creator).toByteString()),
        validated: false,
      };
      console.log("creatorSignatory", creatorSignatory);

      // Explicitly define the signatories for the contract.
      const allSignatories: FixedArray<Owner, typeof StatefulMultiSig.M> = [
        validatorSignatory,
        counterpartySignatory,
        creatorSignatory,
      ];
      console.log("allSignatories", allSignatories);

      // Create a new contract instance with the destination address and owners.
      const instance = new StatefulMultiSig(destAddr, allSignatories);
      await instance.connect(signer);
      // Deploy the new contract intance to the blockchain.
      const deployTx = await instance.deploy(amount); // is the amount of satoshis to send to the contract.
      console.log("Deploy TX: ", deployTx.id);
      //c628a6fca280e261be2e80f1844cf1367dbdea68715126812468221d548e72d1
      //a4f02e776b02083e3f3f3c0a4388f0a99483e3dd6ac2426a0f12fb2541497378

      if (deployTx) {
        const {data, error} = await supabase
          .from("contracts")
          .insert([
            {
              title: title,
              terms: description,
              creator_pubkey: creatorPublicKey,
              validator_pubkey: escrowPublicKey,
              counterparty_pubkey: counterpartyPublicKey,
              sats_amount_locked: amount,
              deployment_tx_id: deployTx.id,
              author: {username: creatorUsername, pubkey: creatorPublicKey},
              escrow: {username: escrowUsername, pubkey: escrowPublicKey},
              counterparty: {
                username: counterpartyUsername,
                pubkey: counterpartyPublicKey,
              },
            },
          ])
          .select();
        console.log("supabase data", data);
      }
    } catch (error) {
      console.error("Error creating signatories:", error);
    }
  }

  // Convert users to options for the form fields
  const userOptions = users.map((user) => ({
    value: user.public_key,
    label: user.username,
    key: user.id,
  }));

  return (
    <Card className="">
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
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Contract Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Descriptive title for the contract.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? userOptions.find(
                                (option) => option.value === field.value
                              )?.label
                            : "Select a counterparty"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search" />
                        <CommandEmpty>No counterparties found.</CommandEmpty>
                        <CommandGroup>
                          {userOptions.map((user) => (
                            <CommandItem
                              key={user.key}
                              value={user.label}
                              onSelect={() => {
                                form.setValue("counterparty", user.value);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  user.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {user.label}
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

            {/* <FormField
              control={form.control}
              name="validators"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Add validators</FormLabel>
                  <MultiSelect
                    selected={field.value}
                    options={userOptions} // Use dynamic options here
                    {...field}
                    className="sm:w-[510px]"
                  />
                  <FormDescription>
                    Select one or more validators.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
              name="escrow"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Escrow validator</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? userOptions.find(
                                (option) => option.value === field.value
                              )?.label
                            : "Select a validator"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search" />
                        <CommandEmpty>No validators found.</CommandEmpty>
                        <CommandGroup>
                          {userOptions.map((user) => (
                            <CommandItem
                              key={user.key}
                              value={user.label}
                              onSelect={() => {
                                form.setValue("escrow", user.value);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  user.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {user.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select a escrow validator.</FormDescription>
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
                    The amount in sats locked in the smart contract
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
