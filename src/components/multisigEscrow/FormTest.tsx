"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {Button} from "@/components/ui/button";
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

import {MultiSelect} from "../ui/multi-select";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  selectedFrameworks: z
    .array(z.string())
    .min(1, "At least one framework must be selected"),
});

export function FormTest() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      selectedFrameworks: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selectedFrameworks"
          render={({field}) => (
            <FormItem>
              <FormLabel>Select Frameworks</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
