"use client";
import React, {useState} from "react";

export default function Copy() {
  const passwords = [
    {label: "Main", password: process.env.NEXT_PUBLIC_PANDA_PRIVKEY_MAIN},
    {label: "Test", password: process.env.NEXT_PUBLIC_PANDA_PRIVKEY_TEST},
  ];
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (password, index) => {
    navigator.clipboard.writeText(password).then(
      () => {
        setCopiedIndex(index);
        setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="flex justify-center  ">
      <ul>
        {passwords.map((item, index) => (
          <li key={index}>
            <strong>{item.label}: </strong>
            {copiedIndex === index ? (
              <span>✓</span>
            ) : (
              <button onClick={() => copyToClipboard(item.password, index)}>
                Copy
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
