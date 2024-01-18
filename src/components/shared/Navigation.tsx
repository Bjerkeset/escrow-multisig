import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import Copy from "@/components/Copy";
import AuthButton from "../auth/AuthButton";

const LINKS = [
  {name: "Home", href: "/"},
  {name: "Create", href: "/create"},
  {name: "Contracts", href: "/contracts"},
];

export default function Navigation() {
  return (
    <nav className="flex w-full p-2 h-32">
      <div className="w-1/4">
        <Copy />
      </div>
      <ul className="flex w-full justify-center gap-5">
        {LINKS.map((link) => (
          <li key={link.name}>
            <Link
              className={buttonVariants({variant: "link"})}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="w-1/4">
        <AuthButton />
      </div>
    </nav>
  );
}
