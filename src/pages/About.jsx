import React from "react";
import { Link } from "react-router-dom";
import { Droplet, Heart, Users, Shield, Clock, Award } from "lucide-react";
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

const About = () => {
  return (
    <div className="min-h-screen bg-base-200 dark:bg-gray-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hero min-h-[60vh] bg-gradient-to-br from-red-500 to-red-700 text-white relative overflow-hidden"
      >
        <div className="hero-overlay bg-opacity-60"></div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="hero-content text-center z-10"
        >
          <div className="max-w-4xl">
            <h1 className="mb-6 text-5xl md:text-6xl font-black tracking-tight">
              BloodCare
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="inline-block ml-3"
              >
                <Droplet className="h-12 w-12" />
              </motion.span>
            </h1>

            <p className="mb-8 text-xl md:text-2xl font-light opacity-90">
              Connecting generous hearts with those in desperate need —
              <br />
              One drop at a time, we save lives together.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <section className="py-16 md:py-24 bg-base-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-600 dark:text-red-500">
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                BloodCare is dedicated to creating the largest and most reliable
                community-driven blood donation network in Bangladesh. We believe
                that no life should be lost due to lack of timely blood
                availability.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Through technology, awareness, and compassion, we're building a
                society where donating blood becomes a regular act of kindness.
              </p>
            </motion.div>

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-8 border-red-500/30">
                <img
                  src="https://media.istockphoto.com/id/465380623/photo/blood-donors-making-donation-in-hospital.jpg?s=612x612&w=0&k=20&c=ttur5IIY7kB4SnTLlJGMDIHA4Z3VJJC2ea6xImpmsI4="
                  alt="Community blood donation"
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-xl shadow-xl"
              >
                <p className="text-3xl font-bold">10,000+</p>
                <p className="text-sm">Lives Impacted</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-red-700 dark:text-red-500"
          >
            Why BloodCare?
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {[
              { icon: Heart, title: "Real-time Matching", desc: "Instantly connect donors with nearby patients in critical need" },
              { icon: Clock, title: "24/7 Availability", desc: "Round-the-clock platform for urgent requests and responses" },
              { icon: Shield, title: "Verified Profiles", desc: "All donors go through verification for your safety" },
              { icon: Users, title: "Growing Community", desc: "Thousands of active donors and volunteers across Bangladesh" },
              { icon: Award, title: "Impact Tracking", desc: "See exactly how your donation has saved lives" },
              { icon: Droplet, title: "Awareness Campaigns", desc: "Regular events and education to promote blood donation" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="card bg-base-100 dark:bg-gray-800 shadow-xl"
              >
                <div className="card-body items-center text-center">
                  <item.icon className="h-12 w-12 text-red-600 mb-4" />
                  <h3 className="card-title text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white text-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be the Reason Someone Smiles Today
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Your one donation can save up to 3 precious lives.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="btn btn-lg bg-white text-red-700 hover:bg-gray-100 font-bold px-10"
            >
              Become a Donor Now
            </Link>
            <Link
              to="/donation-requests"
              className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-red-700 px-10"
            >
              Post a Request
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 text-center bg-base-100 dark:bg-gray-800"
      >
        <p className="text-2xl font-medium text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} BloodCare — Because every drop counts
        </p>
      </motion.div>
    </div>
  );
};

export default About;
