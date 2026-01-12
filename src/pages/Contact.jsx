import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-base-200 dark:bg-gray-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-br from-red-600 to-red-800 text-white"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            We're here to help. Reach out to us anytime regarding blood donation,
            requests, or any other questions.
          </p>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl font-bold mb-8 text-red-600 dark:text-red-500">
                Get in Touch
              </h2>
              <p className="text-lg text-base-content/80 mb-10">
                Have questions about becoming a donor, making a request, or
                anything else? Our team is ready to assist you.
              </p>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 6 }}
                className="flex items-start gap-5"
              >
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
                  <Phone className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Phone</h3>
                  <p className="text-base-content/80">+880 1616-259928</p>
                  <p className="text-base-content/80 text-sm mt-1">
                    (Available 24/7 for emergencies)
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ x: 6 }}
                className="flex items-start gap-5"
              >
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
                  <Mail className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Email</h3>
                  <a
                    href="mailto:tasnifmasad40@gmail.com"
                    className="text-red-600 hover:underline"
                  >
                    tasnifmasad40@gmail.com
                  </a>
                  <p className="text-base-content/60 text-sm mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ x: 6 }}
                className="flex items-start gap-5"
              >
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
                  <MapPin className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Location</h3>
                  <p className="text-base-content/80">
                    Dhaka, Bangladesh
                    <br />
                    (Service available nationwide)
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card bg-base-100 dark:bg-gray-800 shadow-2xl"
          >
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
                      <span className="label-text font-medium">
                        Email Address
                      </span>
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

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="btn btn-error btn-lg w-full gap-2"
                >
                  <Send size={20} />
                  Send Message
                </motion.button>
              </form>

              <div className="text-center mt-6 text-sm opacity-70">
                We respect your privacy. Your information will only be used to
                respond to your inquiry.
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 opacity-70"
        >
          <p>
            © {new Date().getFullYear()} BloodCare - Saving Lives Together
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
