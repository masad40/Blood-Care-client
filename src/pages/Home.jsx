import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>BloodCare | Donate Blood, Save Lives</title>
        <meta
          name="description"
          content="A modern blood donation platform connecting verified donors with people in urgent need. Join as a donor or search for blood today."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 dark:from-red-800 dark:via-red-900 dark:to-red-950" />
          <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Donate Blood, Save Lives
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
              A modern blood donation platform connecting verified donors with people in need. Your single donation can save multiple lives.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/register"
                className="btn btn-lg bg-white text-red-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-4 text-lg font-bold rounded-full"
              >
                Join as Donor
              </Link>
              <Link
                to="/searchDonors"
                className="btn btn-lg btn-outline text-white border-white hover:bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-4 text-lg font-bold rounded-full"
              >
                Search Donors
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-16">
            Why Choose BloodCare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Quick Search",
                desc: "Find blood donors quickly based on location and blood group.",
                icon: "⚡",
              },
              {
                title: "Verified Donors",
                desc: "All donors are verified using secure authentication.",
                icon: "✅",
              },
              {
                title: "Secure Platform",
                desc: "Your data is protected with modern security standards.",
                icon: "🔒",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 rounded-3xl p-8 text-center border border-gray-200 dark:border-gray-700"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-100 dark:bg-gray-800 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-16">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: "📝", title: "Register", desc: "Create a donor account in minutes." },
                { icon: "🔍", title: "Search / Request", desc: "Find donors or post a blood request." },
                { icon: "🩸", title: "Donate", desc: "Connect with patients and save lives." },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="text-center transition-all duration-300 hover:scale-110"
                >
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-16">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full rounded-xl text-lg"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="input input-bordered w-full rounded-xl text-lg"
                />
                <textarea
                  placeholder="Your Message"
                  rows="6"
                  className="textarea textarea-bordered w-full rounded-xl text-lg resize-none"
                />
                <button className="btn btn-error w-full rounded-xl text-white text-lg font-bold shadow-lg hover:shadow-xl transition">
                  Send Message
                </button>
              </form>
            </div>

            <div className="flex flex-col justify-center space-y-6 text-lg">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Emergency Contact
              </h3>
              <p className="flex items-center gap-3">
                <span className="text-2xl">📞</span> +880 1234 567 890
              </p>
              <p className="flex items-center gap-3">
                <span className="text-2xl">📧</span> support@bloodcare.com
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Available 24/7 for urgent blood donation support and inquiries.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;