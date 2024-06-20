"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./styles.css"; // Assuming you have a CSS file for custom styles

const stripePromise = loadStripe(
  "pk_test_51PNWEw06HpHstD8MC0PQ96uso9G5dOVCbxWlBGQKWvDuPLMSkejY88bH1JrxZIS75XiHKaqbixq9t078qEuRwtHC00LLSwcEoN"
);

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (event) => {
    console.log("🚀 ~ handleConfirm ~ event:", event);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // setLoading(true);

    const paymentEl = elements.getElement(PaymentElement);

    console.log("🚀 ~ handleConfirm ~ paymentEl:", paymentEl);

    const response = await stripe.createToken({
      type: "card",
      card: paymentEl,
    });
    console.log("🚀 ~ handleConfirm ~ response:", response);
  };
  // useEffect(() => {
  //   setLoading(false);
  // }, []);

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
    <div className="App">
      <Elements options={options} stripe={stripePromise}>
        <Payment />
      </Elements>
    </div>
  );
}
