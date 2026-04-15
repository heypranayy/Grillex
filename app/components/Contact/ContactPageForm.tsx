"use client";

import React, { FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";
import Input from "../Input";
import TextArea from "../TextArea";
import Button from "../Button";
import SpinnerSvg from "../SpinnerSvg";

interface IProps {
  gridpercol ? : string;
}

const EMAILJS_SERVICE_ID = "service_jc1a7kv";
const EMAILJS_TEMPLATE_ID = "template_t2xxjf9";
const EMAILJS_PUBLIC_KEY = "XmqnRp_8-2pvHfWdv";

export default function ContactPageForm({gridpercol} : IProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setResponse(null);
    setError(null);

    if (!EMAILJS_PUBLIC_KEY) {
      setError("Set your EmailJS public key in ContactPageForm.tsx");
      setIsPending(false);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("first-name") ?? "").trim();
    const lastName = String(formData.get("last-name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const senderPhone = String(formData.get("number") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const templateParams = {
      first_name: firstName,
      last_name: lastName,
      email: senderEmail,
      phone: senderPhone,
      message,
      to_email:
        "pranay.chatterjee29@gmail.com,subrata.ash@gmail.com,meetuon23@gmail.com",
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
        publicKey: EMAILJS_PUBLIC_KEY,
      });
      form.reset();
      router.push("/thank-you");
    } catch (submitError) {
      setError("Failed to submit form. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} method="post" action="#" className="space-y-4">
      <div className={`grid grid-cols-2 gap-4`}>
        <Input
          required
          name="first-name"
          type="text"
          placeholder="Your first name *"
        />
        <Input
          required
          name="last-name"
          type="text"
          placeholder="Your Last name *"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 ts:grid-cols-1">
        <Input
          required
          name="email"
          type="email"
          placeholder="Your email address *"
        />
        <Input
          required
          name="number"
          type="text"
          maxLength={10}
          pattern="[0-9\s]{10}"
          title="Please enter a 10 digit valid mobile number"
          placeholder="Your contact number *"
        />
      </div>
      <TextArea required name="message" placeholder="Your message *" rows={8} />
      <Button type="submit" disabled={isPending} className="w-full py-[12px] flex-center">
        {isPending ? <SpinnerSvg size="1rem" /> : <span>SUBMIT</span>}
      </Button>
      <p
        className={`text-center ${
          response || error ? "opacity-100" : "opacity-0"
        } ${error ? "text-red-700" : "text-green-700"}`}
      >
        {error || response || ""}
      </p>
    </form>
  );
}
