"use client";

import { useStripe } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ConfirmSetup = () => {
  const stripe = useStripe();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const confirmSetup = async () => {
      const setup_intent = searchParams.get("setup_intent");
      console.log("🚀 ~ confirmSetup ~ setup_intent:", setup_intent);
      const setup_intent_client_secret = searchParams.get(
        "setup_intent_client_secret"
      );

      // const { setup_intent, setup_intent_client_secret } = router.query;

      if (!setup_intent || !setup_intent_client_secret) {
        console.error("Missing setup intent parameters");
        return;
      }

      // Fetch the SetupIntent details from Stripe
      const setupIntent = await stripe?.retrieveSetupIntent(
        setup_intent_client_secret
      );

      console.log("SetupIntent:", setupIntent);

      if (setupIntent?.setupIntent?.status !== "succeeded") {
        console.error("SetupIntent did not succeed");
        return;
      }

      // Attach the payment method to the customer
      const attachResponse = await fetch(
        "https://81pwcn4d-3000.euw.devtunnels.ms/api/v1/payments/cards/attach",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization:
              "Bearer eyJraWQiOiJnRTREYkxmTzMwT0N2TCs2QmQ1UkNuVWJrTUxKN0ZVaTB1S2FoalQrUm9FPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlOTllYTQwOC02MDkxLTcwMGQtNjdkMy1kNWRiYTk3ZDE3NmMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX3FmSnBMMFJGMCIsImNvZ25pdG86dXNlcm5hbWUiOiJuZWFsZGF2aXMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJOZWFsRGF2aXMiLCJnaXZlbl9uYW1lIjoiTmVhbCIsIm9yaWdpbl9qdGkiOiI0YTc4Mzc4Yi02OTk1LTQxNGMtYmYyYS04OGVmYmUyMWI1NzciLCJhdWQiOiI1aW83M2lhNmplNDFjNzg1bDEyOGh2OWM0byIsImV2ZW50X2lkIjoiMzc3YzlhZGUtZTZlNy00ZDhhLWIyYzYtYjFmZDA4NjUwZmJkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTkyNTM3MjUsImV4cCI6MTcxOTM4MjE3NCwiY3VzdG9tOnJvbGUiOiJjbGllbnQiLCJpYXQiOjE3MTkyOTU3NzQsImZhbWlseV9uYW1lIjoiRGF2aXMiLCJqdGkiOiI2MTI1MTk3Ni1lOTIyLTQ5ZGItOGEwMy1lZmE5ZjRlOWNlMWIiLCJlbWFpbCI6Im5laGFsbmFzaXJraGFuNDA5QGdtYWlsLmNvbSJ9.KYW3oVEshHKzyOfDt8MXhASggLi-tkH7t4rT7yy_NNALzVKJuTHAdHqPgQjSasXWKBRdxbeI_3zGcVPP84Zi6w3vW5eFWtPGS5wDuPDF1VosLyIxqwYrLqmlmlGtF35bGw-ITsspqQjp3vuBjGXiOpGK1xVHaRInk44NATA7FOeW-XrhQ_Zg5V_92lsTV1QAOANaBFu0PcV67VY0Xxj72DwmNruLSyhEBAOUnLrzMFrUBHgCObOwg1Z7VE_hWnwlcTJ6mqYXvHyyrKwn-VWsC2f2LbHkQW88B3l9eDVhvLTI2N1kyXidIFy-2M1Th8FCmGsE_XP2oTleGOHAXzXw5Q",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardToken: setupIntent.setupIntent.payment_method,
          }),
        }
      );

      const attachResult = await attachResponse.json();
      console.log("AttachResult:", attachResult);

      if (attachResponse.ok) {
        console.log("Payment method attached successfully");
      } else {
        console.error("Error attaching payment method:", attachResult);
      }
    };

    confirmSetup();
  }, [searchParams, stripe]);

  return (
    <div>
      <h1>Your card has been added successfully!</h1>
    </div>
  );
};

export default ConfirmSetup;
