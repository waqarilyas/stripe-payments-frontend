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

    // const myHeaders = new Headers();
    // myHeaders.append("accept", "*/*");
    // myHeaders.append(
    //   "Authorization",
    //   "Bearer eyJraWQiOiJnRTREYkxmTzMwT0N2TCs2QmQ1UkNuVWJrTUxKN0ZVaTB1S2FoalQrUm9FPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlOTllYTQwOC02MDkxLTcwMGQtNjdkMy1kNWRiYTk3ZDE3NmMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0yLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0yX3FmSnBMMFJGMCIsImNvZ25pdG86dXNlcm5hbWUiOiJuZWFsZGF2aXMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJOZWFsRGF2aXMiLCJnaXZlbl9uYW1lIjoiTmVhbCIsIm9yaWdpbl9qdGkiOiI0YTc4Mzc4Yi02OTk1LTQxNGMtYmYyYS04OGVmYmUyMWI1NzciLCJhdWQiOiI1aW83M2lhNmplNDFjNzg1bDEyOGh2OWM0byIsImV2ZW50X2lkIjoiMzc3YzlhZGUtZTZlNy00ZDhhLWIyYzYtYjFmZDA4NjUwZmJkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTkyNTM3MjUsImV4cCI6MTcxOTM4MjE3NCwiY3VzdG9tOnJvbGUiOiJjbGllbnQiLCJpYXQiOjE3MTkyOTU3NzQsImZhbWlseV9uYW1lIjoiRGF2aXMiLCJqdGkiOiI2MTI1MTk3Ni1lOTIyLTQ5ZGItOGEwMy1lZmE5ZjRlOWNlMWIiLCJlbWFpbCI6Im5laGFsbmFzaXJraGFuNDA5QGdtYWlsLmNvbSJ9.KYW3oVEshHKzyOfDt8MXhASggLi-tkH7t4rT7yy_NNALzVKJuTHAdHqPgQjSasXWKBRdxbeI_3zGcVPP84Zi6w3vW5eFWtPGS5wDuPDF1VosLyIxqwYrLqmlmlGtF35bGw-ITsspqQjp3vuBjGXiOpGK1xVHaRInk44NATA7FOeW-XrhQ_Zg5V_92lsTV1QAOANaBFu0PcV67VY0Xxj72DwmNruLSyhEBAOUnLrzMFrUBHgCObOwg1Z7VE_hWnwlcTJ6mqYXvHyyrKwn-VWsC2f2LbHkQW88B3l9eDVhvLTI2N1kyXidIFy-2M1Th8FCmGsE_XP2oTleGOHAXzXw5Q"
    // );

    // const requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };

    // let response = await fetch(
    //   "https://81pwcn4d-3000.euw.devtunnels.ms/api/v1/payments/cards/setup-intent",
    //   requestOptions
    // );

    // response = await response.json();
    // console.log("🚀 ~ handleConfirm ~ response:", response);

    const clientSecret =
      "seti_1PVUJl06HpHstD8MePqeZxZX_secret_QMCjh1ggjqa8u7WKJ5IENI8UF9LutVZ";
    console.log("🚀 ~ handleConfirm ~ clientSecret:", clientSecret);

    // Confirm the SetupIntent using the details collected by the Payment Element

    // gwet current url with /confirm-setup to use as return url
    const return_url = window.location.href + "/confirm-setup";
    console.log("🚀 ~ handleConfirm ~ return_url:", return_url);

    const setupRes = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url,
      },
    });

    console.log("🚀 ~ handleConfirm ~ setupRes:", setupRes);

    const { error } = setupRes;

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
