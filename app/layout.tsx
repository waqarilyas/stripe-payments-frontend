"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stripePromise = loadStripe(
    "pk_test_51PNWEw06HpHstD8MC0PQ96uso9G5dOVCbxWlBGQKWvDuPLMSkejY88bH1JrxZIS75XiHKaqbixq9t078qEuRwtHC00LLSwcEoN"
  );

  const appearance = {
    theme: "stripe",
  };
  const options = {
    // clientSecret,
    appearance,
    mode: "setup",
    currency: "aud",

    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },

    paymentMethods: {
      card: {
        iconStyle: "default",
        hideIcon: false,
        billingAddressCollection: "required",
      },
    },
  };

  return (
    <html lang="en">
      <Elements options={options} stripe={stripePromise}>
        <body className={inter.className}>{children}</body>
      </Elements>
    </html>
  );
}
