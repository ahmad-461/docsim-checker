"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InfoPageLayout, { PageP, PageLink } from '../components/InfoPageLayout';
import { CONTACT_EMAIL } from '../constants';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const initialSubject = searchParams.get('subject') || "General Question";
  const validSubjects = ["General Question", "Bug Report", "Feedback", "Other"];
  const [subject, setSubject] = useState(validSubjects.includes(initialSubject) ? initialSubject : "General Question");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (!endpoint || endpoint === "YOUR_FORMSPREE_ENDPOINT_HERE") {
      // For development/demo if endpoint is not set
      console.warn("Formspree endpoint not set. Simulating success...");
      setTimeout(() => {
        setStatus('success');
      }, 1000);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const result = await response.json();
        // Formspree often returns an errors array or a single error string
        const msg = result.error || (result.errors && result.errors.map((e: any) => e.message).join(", ")) || "Something went wrong. Please try again.";
        setErrorMessage(msg);
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage("Failed to send message. Please check your connection.");
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {status === 'success' ? (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
          <PageP>Thanks — we&apos;ll get back to you soon.</PageP>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 text-orange-600 font-semibold hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Name <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email <span className="text-orange-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="General Question">General Question</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                Message <span className="text-orange-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                placeholder="How can we help?"
              ></textarea>
            </div>

            {status === 'error' && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98] transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {status === 'submitting' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : "Send Message"}
            </button>
          </form>
        </div>
      )}

      <div className="mt-12 text-center">
        <PageP>
          Prefer direct email? Reach us at{' '}
          <PageLink href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </PageLink>
        </PageP>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="Questions, feedback, or found a bug? We'd love to hear from you."
    >
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading form...</div>}>
        <ContactForm />
      </Suspense>
    </InfoPageLayout>
  );
}
