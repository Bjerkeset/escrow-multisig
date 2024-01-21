import {Card, CardContent} from "@/components/ui/card";

const ABOUT_CONTENT = [
  {
    title: "What's a multisig escrow",
    subTitle:
      "An interface for secure, self-managed digital escrow agreements without a central intermediary.",
    content:
      "By using web3 infrastructure we can create a trustless escrow agreement that is self-managed only by the parties involved. This means that the funds are locked in a multisig transaction that requires a majority of the parties to sign off on the release of funds. This is a more secure and transparent way to manage escrow agreements as it eliminates the need for third-party fund custody and operates independently of centralized web servers.",
    sideTag: "Overview",
  },
  {
    title: "How it works",
    subTitle: "",
    content:
      "Blockchain technology allows for the transfer of digital assets from one set of keys to another without the need for an intermediary institution. Typically, the only requirement to transact a coin (UTXO) is a valid signature, which demonstrates possession of the private keys associated with the UTXO. What this smart contract introduces are additional conditions for transacting specific coins. We achieve this by using a smart contractracting language that customizes the locking script of an outgoing transaction. Adding the condition that two out of three parties must sign off on the transaction before it can be spent. ",
    sideTag: "1.",
  },
  {
    title: "How to use it",
    subTitle: "Step 1: Create a wallet at Panda Wallet",
    content:
      "Go to the Chrome Web Store and download the Panda Wallet browser extension. We chouse this wallet because it is a opnes-sourced and non-custodial sCrypt compatible wallet.",
    sideTag: "1.",
  },
  {
    // title: "How it works",
    subTitle: "Step 2: Create a multisig escrow agreement",
    content:
      "Navigate to create contract. Fill out the form, select an escrow validator in case of a dispute, selecte who the cuntracts conterparty is, and select the payment amount the counterparty will recive",
    sideTag: "1.",
  },
  {
    // title: "How it works",
    subTitle: "Step 2: Create a multisig escrow agreement",
    content:
      "Navigate to create contract. Fill out the form, select an escrow validator in case of a dispute, selecte who the cuntracts conterparty is, and select the payment amount the counterparty will recive",
    sideTag: "1.",
  },
];

function AboutContent() {
  return ABOUT_CONTENT.map((content, index) => (
    <div className="flex  flex-col gap-10 py-4" key={index}>
      <div className="flex ">
        <div className="w-1/6 flex mt-4 justify-start ">
          <span className="flex flex-col  text-muted-foreground">
            <span>{content.sideTag}</span>
            <span>{"-->"}</span>
          </span>
        </div>
        <div className="flex w-5/6 flex-col gap-2">
          <h2 className="text-2xl font-bold">{content.title}</h2>
          <h3 className="leading-6">{content.subTitle}</h3>
          <p className="text-pretty text-muted-foreground text-sm leading-6">
            {content.content}
          </p>
        </div>
      </div>
    </div>
  ));
}

export default function About() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col">
        <AboutContent />
      </CardContent>
    </Card>
  );
}
