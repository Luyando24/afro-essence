"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { useStoreSettings } from "@/components/StoreSettingsContext";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { settings } = useStoreSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 3–5 business days. Express shipping options are available at checkout."
    },
    {
      q: "Can I style or dye the hair?",
      a: "Our hair is 100% Kanekalon. It is heat-resistant and can be heat styled, but we do not recommend dyeing or bleaching synthetic fibers."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day money-back guarantee on all unopened, unused products. Contact our team to initiate a return."
    },
  ];

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh" }}>
      
      {/* Hero */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4B3621 0%, #2D2010 60%, #1A0F06 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border mb-6"
            style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C" }}
          >
            <MessageCircle className="h-3 w-3" /> Get In Touch
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            We'd love to hear from you. Our team is always ready to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Info + FAQ */}
          <div className="space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
                Reach Out
              </span>
              <h2 className="font-serif text-3xl font-bold mt-2 mb-4" style={{ color: "#1A1A1A" }}>
                Get in Touch
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#777" }}>
                Have questions about our products, shipping, or need help choosing the right texture? 
                Our customer support team is here to assist you every step of the way.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: <Phone className="h-5 w-5" />,
                  title: "Phone",
                  value: settings?.phone || "+86 151 1033 5070",
                  sub: "Mon–Fri, 9am–6pm",
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  title: "Email",
                  value: settings?.email || "hello@afroessence.com",
                  sub: "We reply within 24 hours",
                },
                {
                  icon: <MapPin className="h-5 w-5" />,
                  title: "Office",
                  value: settings?.address || "No. 88, Hair Avenue\nGuangzhou, China",
                  sub: "",
                },
                {
                  icon: <Clock className="h-5 w-5" />,
                  title: "Business Hours",
                  value: "Monday – Friday",
                  sub: "9:00 AM – 6:00 PM EST",
                },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-md"
                  style={{ borderColor: "#E8E2D9", backgroundColor: "#fff" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                  >
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-0.5" style={{ color: "#1A1A1A" }}>{contact.title}</h3>
                    <p className="text-sm whitespace-pre-line" style={{ color: "#555" }}>{contact.value}</p>
                    {contact.sub && <p className="text-xs mt-0.5" style={{ color: "#999" }}>{contact.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-serif text-xl font-bold mb-5" style={{ color: "#1A1A1A" }}>
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border overflow-hidden transition-all"
                    style={{ borderColor: "#E8E2D9", backgroundColor: "#fff" }}
                  >
                    <button
                      className="w-full flex justify-between items-center px-5 py-4 text-left"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <span className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{faq.q}</span>
                      <span
                        className="text-lg font-thin transition-transform duration-200"
                        style={{
                          color: "#C9A84C",
                          transform: openFaq === idx ? "rotate(45deg)" : "rotate(0)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4 border-t" style={{ borderColor: "#F0EBE4" }}>
                        <p className="text-sm pt-3 leading-relaxed" style={{ color: "#666" }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            className="p-8 md:p-10 rounded-3xl border shadow-sm"
            style={{ backgroundColor: "#fff", borderColor: "#E8E2D9" }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
              Drop Us a Line
            </span>
            <h2 className="font-serif text-2xl font-bold mt-2 mb-8" style={{ color: "#1A1A1A" }}>
              Send Us a Message
            </h2>

            {formStatus === 'success' ? (
              <div className="flex flex-col items-center text-center gap-4 py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                >
                  ✅
                </div>
                <h3 className="font-serif text-xl font-bold" style={{ color: "#1A1A1A" }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: "#777" }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="text-sm font-semibold border-b transition-colors"
                  style={{ color: "#C9A84C", borderColor: "#C9A84C" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "firstName", label: "First Name", type: "text", placeholder: "Sandra" },
                    { id: "lastName", label: "Last Name", type: "text", placeholder: "Mumba" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#555" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        required
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all"
                        style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                        onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                        onBlur={(e) => (e.target.style.borderColor = "#E8E2D9")}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#555" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all"
                    style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                    onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                    onBlur={(e) => (e.target.style.borderColor = "#E8E2D9")}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#555" }}>
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all cursor-pointer"
                    style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Returns & Exchanges</option>
                    <option>Wholesale</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#555" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all resize-none"
                    style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                    onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                    onBlur={(e) => (e.target.style.borderColor = "#E8E2D9")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                  style={{ backgroundColor: "#C9A84C", color: "#000" }}
                >
                  {formStatus === 'submitting' ? (
                    'Sending...'
                  ) : (
                    <>Send Message <Send className="h-4 w-4" /></>
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
