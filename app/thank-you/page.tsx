import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Grillex",
  description: "Thank you for contacting Grillex.",
  alternates: {
    canonical: "/thank-you",
  },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <section className="max-w-2xl w-full text-center border border-gray-200 rounded-lg p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Thank You!</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Your message has been submitted successfully. Our team will contact you
          shortly.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block uppercase font-semibold bg-[#B62E26] px-6 py-3 tracking-[0.2em] text-white hover:bg-[#FFB426] hover:text-black transition-all duration-300"
          >
            Back To Home
          </Link>
        </div>
      </section>
    </main>
  );
}
