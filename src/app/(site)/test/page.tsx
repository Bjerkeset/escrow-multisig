import React from "react";
// import {Post, allPosts} from "@/.contentlayer/generated";
// import {components} from "@/lib/mdx";
import Link from "next/link";

// const allPostsByMonth = allPosts.reduce((acc, curr) => {
//   const month = new Date(curr.date).toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });
//   if (acc.hasOwnProperty(month)) {
//     acc[month].push(curr);
//   } else {
//     acc[month] = [curr];
//   }

//   return acc;
// }, {} as {[month: string]: Post[]});

export default function Home() {
  return (
    <div className="mx-auto container max-w-[calc(65ch+100px)] min-h-screen flex flex-col py-4 md:py-8 px-2 md:px-4">
      <div className="backdrop-blur-[2px] flex-1 flex flex-col rounded-lg bg-background/50 p-4 sm:p-8 border border-border/50">
        <main className="flex-1 mb-8">
          <h1 className="font-cal font-bold tracking-tight text-lg text-foreground mb-8">
            mx<span className="text-muted-foreground">kaske</span>
          </h1>
        </main>
      </div>
    </div>
  );
}
