import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-base-200 dark:bg-gray-900">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            We're here to help. Reach out to us anytime regarding blood donation, 
            requests, or any other questions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-red-600 dark:text-red-500">
                Get in Touch
              </h2>
              <p className="text-lg text-base-content/80 mb-10">
                Have questions about becoming a donor, making a request, or anything else? 
                Our team is ready to assist you.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
                  <Phone className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Phone</h3>
                  <p className="text-base-content/80">+880 1711-XXXXXX</p>
                  <p className="text-base-content/80 text-sm mt-1">(Available 24/7 for emergencies)</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
                  <Mail className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Email</h3>
                  <a 
                    href="mailto:support@bloodcare-bd.org" 
                    className="text-red-600 hover:underline"
                  >
                    support@bloodcare-bd.org
                  </a>
                  <p className="text-base-content/60 text-sm mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
                  <MapPin className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Location</h3>
                  <p className="text-base-content/80">
                    Dhaka, Bangladesh<br />
                    (Service available nationwide)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card bg-base-100 dark:bg-gray-800 shadow-2xl">
            <div className="card-body p-8 lg:p-10">
              <h2 className="card-title text-3xl font-bold mb-8 text-red-600 dark:text-red-500">
                Send us a Message
              </h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Your Name</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Full name" 
                      className="input input-bordered w-full" 
                      required 
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email Address</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      className="input input-bordered w-full" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Subject</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="How can we help you?" 
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Message</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-32 w-full" 
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="btn btn-error btn-lg w-full gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>

              <div className="text-center mt-6 text-sm opacity-70">
                We respect your privacy. Your information will only be used to respond to your inquiry.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links / Footer-like section */}
        <div className="text-center mt-16 opacity-70">
          <p>© {new Date().getFullYear()} BloodCare - Saving Lives Together</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;