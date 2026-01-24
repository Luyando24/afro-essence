"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      {/* Hero */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200">We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Have questions about our products, shipping, or need help choosing the right texture? 
                Our customer support team is here to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">+86 151 1033 5070</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9am to 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">hello@afroessence.com</p>
                  <p className="text-sm text-gray-500">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Office</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    No. 88, Hair Avenue<br />
                    Guangzhou, China
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-8">
               <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">FAQ</h3>
               <div className="space-y-4">
                 <details className="group bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm cursor-pointer">
                   <summary className="font-medium text-gray-900 dark:text-white list-none flex justify-between items-center">
                     How long does shipping take?
                     <span className="transition group-open:rotate-180">
                       <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                     </span>
                   </summary>
                   <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
                     Standard shipping takes 3-5 business days. Express shipping options are available at checkout.
                   </p>
                 </details>
                 <details className="group bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm cursor-pointer">
                   <summary className="font-medium text-gray-900 dark:text-white list-none flex justify-between items-center">
                     Can I dye the hair?
                     <span className="transition group-open:rotate-180">
                       <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                     </span>
                   </summary>
                   <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
                     Yes! Our hair is 100% Virgin Human Hair and can be dyed, bleached, and heat styled.
                   </p>
                 </details>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            
            {formStatus === 'success' ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-6 rounded-md text-center">
                <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
                <p>Thank you for contacting us. We will get back to you shortly.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Returns & Exchanges</option>
                    <option>Wholesale</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-primary text-white py-3 px-6 rounded-md font-bold hover:bg-opacity-90 transition-all flex justify-center items-center disabled:opacity-70"
                >
                  {formStatus === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
