"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import "./styles.css"; // Assuming you have a CSS file for custom styles

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (event) => {
    console.log("🚀 ~ handleConfirm ~ event:", event);
    event.preventDefault();

    const { error: submitError } = await elements?.submit();
    if (submitError) {
      console.error(submitError);
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    // setLoading(true);

    const paymentEl = elements.getElement(PaymentElement);

    console.log("🚀 ~ handleConfirm ~ paymentEl:", paymentEl);

    // token creation api call here

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append(
      "Authorization",
      "Bearer eyJraWQiOiJnRTREYkxmTzMwT0N2TCs2QmQ1UkNuVWJrTUxKN0ZVaTB1S2FoalQrUm9FPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjOTNlYTQ4OC04MGYxLTcwMzEtOGRlZC0zNWMxNzE5YmY2YjYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX3FmSnBMMFJGMCIsImNvZ25pdG86dXNlcm5hbWUiOiJhd2Fpc2NsaWVudCIsInByZWZlcnJlZF91c2VybmFtZSI6ImF3YWlzQ2xpZW50IiwiZ2l2ZW5fbmFtZSI6IkF3YWlzIiwib3JpZ2luX2p0aSI6IjU3NjY1MGRiLTk1MTgtNGZkZS1hNGVkLTI0MzA1MDVkZjgwZCIsImF1ZCI6IjVpbzczaWE2amU0MWM3ODVsMTI4aHY5YzRvIiwiZXZlbnRfaWQiOiJhZTNhYTJlYS1kM2E4LTQ3OWItODUwNS0xZTUyNjU4ZmU1NDUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxODQyMTc0OSwiZXhwIjoxNzE5MDM3NzM1LCJjdXN0b206cm9sZSI6ImNsaWVudCIsImlhdCI6MTcxODk1MTMzNSwiZmFtaWx5X25hbWUiOiJLaGFsaWQiLCJqdGkiOiJkN2U0MjllMC1iMjMzLTQwNTEtOTg2NC1lYjIxYmQ0OWQxMDgiLCJlbWFpbCI6ImF3YWlzLmtoYWxpZCtBQ2xpZW50QGVoc2FhbnRlY2guY29tIn0.mnjBa29dvf41Bi9HUYY2XVOD-hPt1ZD1dv2_eP9JQU-DfRqA7XUe8joBTT_poGcnjuz-x0pJrYmMtWHdK2UjDTKdO7Xhf1w6v2EJ96cKIElC0nx6-rpkMINN_vf0zC9RWxHc0r8HmJRKET3-vXY9_gE-QS7OHTEfYrYl0Q3OMYtzKnxSHrXs5BWVILLAdIBVeS-EG3MQ95btlM8XsaeZC22qq1GNKa6P6uch4VLyOB12EKEAzb4Ty7HQzBREQHUoz6bO7Ft-gk5r2kfvKS2y83A3T0jazEtc0xiGrSAjDK2_drzjZvl1vpdepZIrS4G6QGnxyXey474i6sb31anpZA"
    );

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    let response = await fetch(
      "https://81pwcn4d-3000.euw.devtunnels.ms/api/v1/payments/cards/setup-intent",
      requestOptions
    );

    response = await response.json();
    console.log("🚀 ~ handleConfirm ~ response:", response);

    const clientSecret = response?.data?.client_secret;
    console.log("🚀 ~ handleConfirm ~ clientSecret:", clientSecret);

    // Confirm the SetupIntent using the details collected by the Payment Element

    // gwet current url with /confirm-setup to use as return url
    const return_url = window.location.href + "/confirm-setup";
    console.log("🚀 ~ handleConfirm ~ return_url:", return_url);

    const { error } = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the setup. Show the error to your customer (for example, payment details incomplete)
      console.error(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleConfirm}>
      <PaymentElement />
      <button
        type="submit"
        className="confirm-button"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Confirm"}
      </button>
    </form>
  );
};

export default function App() {
  return (
    <div className="App">
      <Payment />
    </div>
  );
}
