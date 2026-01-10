import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

import {
  FaHeartbeat,
  FaSearch,
  FaUserCheck,
  FaUsers,
  FaHandsHelping,
  FaEnvelopeOpenText,
  FaTint,
  FaAmbulance,
} from "react-icons/fa";
import CountUp from "react-countup";

const Home = () => {
  const stats = [
    { label: "Active Donors", value: 12500, icon: <FaUsers className="mx-auto text-red-600 text-5xl mb-3" /> },
    { label: "Successful Donations", value: 9200, icon: <FaHeartbeat className="mx-auto text-red-600 text-5xl mb-3" /> },
    { label: "Blood Requests", value: 8300, icon: <FaEnvelopeOpenText className="mx-auto text-red-600 text-5xl mb-3" /> },
    { label: "Lives Saved", value: 21000, icon: <FaHandsHelping className="mx-auto text-red-600 text-5xl mb-3" /> },
  ];

  const categories = [
    { title: "Blood Group A+", icon: <FaTint className="text-red-600 mx-auto text-5xl mb-4" /> },
    { title: "Blood Group B+", icon: <FaTint className="text-red-600 mx-auto text-5xl mb-4" /> },
    { title: "Blood Group O+", icon: <FaTint className="text-red-600 mx-auto text-5xl mb-4" /> },
    { title: "Emergency Donors", icon: <FaAmbulance className="text-red-600 mx-auto text-5xl mb-4" /> },
  ];

  const howItWorksSteps = [
    { title: "Register", desc: "Sign up as a donor or requester.", icon: <FaUserCheck className="text-red-600 text-5xl mb-4 mx-auto" /> },
    { title: "Search Donors", desc: "Use search donor to find nearby donors.", icon: <FaSearch className="text-red-600 text-5xl mb-4 mx-auto" /> },
    { title: "Save Lives", desc: "Donate blood and help patients in need.", icon: <FaHeartbeat className="text-red-600 text-5xl mb-4 mx-auto" /> },
  ];

  const testimonials = [
    { name: "Rahim", msg: "Found a donor within 2 hours!" },
    { name: "Nusrat", msg: "Very reliable platform for emergencies." },
    { name: "Sabbir", msg: "Proud to be a BloodCare donor." },
  ];

  const faqs = [
    { q: "Who can register as a donor?", a: "Anyone aged 18-65 in good health can register." },
    { q: "How often can I donate blood?", a: "You can donate every 3 months." },
    { q: "Is blood donation safe?", a: "Yes, it is a safe and quick process." },
  ];

  const newsPosts = [
    { title: "World Blood Donation Day 2026", date: "Jan 1, 2026" },
    { title: "Tips for Safe Blood Donation", date: "Dec 15, 2025" },
    { title: "How Blood Donation Saves Lives", date: "Nov 20, 2025" },
  ];

  return (
    <>
      <Helmet>
        <title>BloodCare | Donate Blood, Save Lives</title>
        <meta
          name="description"
          content="BloodCare is a modern blood donation platform connecting verified donors with patients in urgent need."
        />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

        {/* HERO */}
        <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-red-700 to-red-900 text-white overflow-hidden px-6">
          <div className="max-w-4xl text-center md:text-left space-y-6 z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Donate{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                Blood,
              </span>{" "}
              Save Lives
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl opacity-90 leading-relaxed">
              BloodCare connects verified donors with people who urgently need blood.<br />
              One donation can save <span className="font-semibold">up to three lives.</span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6 mt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="btn btn-lg bg-gradient-to-r from-yellow-400 via-red-500 to-red-700 text-white font-bold rounded-full shadow-lg shadow-red-700/60 relative overflow-hidden"
                >
                  <span className="relative z-10">Become a Donor</span>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-yellow-400 opacity-50"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>

              <Link
                to="/searchDonors"
                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-red-700 rounded-full font-semibold transition"
              >
                Search Donors
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block absolute right-10 bottom-10 w-48 h-48"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <path
                d="M32 2C20 20 14 30 14 40a18 18 0 0 0 36 0c0-10-6-20-18-38Z"
                fill="url(#bloodGradient)"
              />
              <defs>
                <linearGradient
                  id="bloodGradient"
                  x1="32"
                  y1="2"
                  x2="32"
                  y2="58"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF3B3B" />
                  <stop offset="1" stopColor="#7F0000" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose BloodCare</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Fast Donor Search", desc: "Search donors by blood group, district, and availability." },
              { title: "Verified Donors", desc: "Every donor profile is verified for authenticity." },
              { title: "24/7 Emergency Support", desc: "We help connect donors and patients anytime, anywhere." },
            ].map(({ title, desc }, i) => (
              <div key={i} className="card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gray-100 dark:bg-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How BloodCare Works</h2>
            <div className="grid md:grid-cols-3 gap-10 text-center">
              {howItWorksSteps.map(({ title, desc, icon }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
                >
                  {icon}
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ label, value, icon }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center"
              >
                {icon}
                <h3 className="text-4xl font-extrabold text-red-600">
                  <CountUp end={value} duration={3} separator="," />+
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-red-600 text-white py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Blood Urgently?</h2>
          <p className="mb-6">Post a blood request and reach donors instantly.</p>
          <Link to="/dashboard/createRequest" className="btn btn-lg bg-white text-red-600 font-bold rounded-full">
            Create Blood Request
          </Link>
        </section>

        {/* CATEGORIES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Categories</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {categories.map(({ title, icon }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                {icon}
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* POPULAR LISTINGS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Listings</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">Donor Name {item}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Blood Group: A+</p>
                <button className="btn btn-error btn-sm">Contact Donor</button>
              </div>
            ))}
          </div>
        </section>

        {/* LATEST NEWS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest News</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {newsPosts.map(({ title, date }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition"
              >
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{date}</p>
                <button className="btn btn-error btn-sm">Read More</button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
              >
                <h3 className="font-semibold text-lg mb-2">{q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(({ name, msg }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <p className="italic mb-4">“{msg}”</p>
                <h4 className="font-bold">{name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER SUBSCRIBE */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16 px-6 text-center rounded-2xl max-w-4xl mx-auto my-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">Get the latest news and updates about BloodCare</p>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="input input-bordered w-full sm:w-auto flex-grow text-lg rounded-full px-6 py-4"
              required
            />
            <button type="submit" className="btn btn-error btn-lg rounded-full px-10">
              Subscribe
            </button>
          </form>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Become a Lifesaver Today</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">Join thousands of donors helping save lives across Bangladesh.</p>
          <Link to="/register" className="btn btn-lg btn-error rounded-full">Join BloodCare</Link>
        </section>

      </div>
    </>
  );
};

export default Home;
