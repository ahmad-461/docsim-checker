'use client';

import React, { useState } from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
import { CONTACT_EMAIL } from '../constants';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (!endpoint) {
      console.error('Formspree endpoint is not defined');
      // For development/demo purposes if endpoint is missing
      setTimeout(() => {
        setStatus('error');
      }, 1000);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'General Question', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="Questions, feedback, or found a bug? We'd love to hear from you."
      noProse={true}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-stone-800 rounded-3xl border border-gray-100 dark:border-stone-700 shadow-sm overflow-hidden">
          {status === 'success' ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Thanks — we'll get back to you soon.</h2>
              <p className="text-gray-600 dark:text-stone-400 mb-8">
                Your message has been sent successfully. We typically respond within 24-48 hours.
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-sm active:scale-95"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                  Something went wrong — please try again or email us directly at {CONTACT_EMAIL}.
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground ml-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={100}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-semibold text-foreground ml-1">
                  Subject
                </label>
                <div className="relative group">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-foreground appearance-none cursor-pointer"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-foreground ml-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-700 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 shadow-sm hover:shadow-md active:scale-95 transition-all transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-stone-500">
            Prefer email? Reach us directly at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-600 font-semibold hover:underline decoration-orange-200 underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </InfoPageLayout>
  );
}
