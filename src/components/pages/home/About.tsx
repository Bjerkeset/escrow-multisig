import {Card, CardContent} from "@/components/ui/card";

export default function About() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-10 py-6">
        <div>
          <h1 className="text-2xl font-bold">Escrow Multisig</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            perferendis quo quaerat, delectus ullam dignissimos quos minus non
            ipsam libero, ducimus ad autem hic eveniet rerum odio doloremque
            earum consequatur!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Escrow Multisig</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            perferendis quo quaerat, delectus ullam dignissimos quos minus non
            ipsam libero, ducimus ad autem hic eveniet rerum odio doloremque
            earum consequatur!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Escrow Multisig</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            perferendis quo quaerat, delectus ullam dignissimos quos minus non
            ipsam libero, ducimus ad autem hic eveniet rerum odio doloremque
            earum consequatur!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
