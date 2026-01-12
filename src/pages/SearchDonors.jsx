import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaTint, FaMapMarkedAlt, FaHeartbeat } from "react-icons/fa";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchDonors = () => {
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/districts.json").then((res) => res.json()),
      fetch("/upazilas.json").then((res) => res.json()),
    ])
      .then(([districtData, upazilaData]) => {
        setDistricts(districtData.districts || []);
        setAllUpazilas(upazilaData.upazilas || []);
      })
      .catch(() => {
        toast.error("Failed to load districts/upazilas");
      });
  }, []);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setSearch((prev) => ({ ...prev, district: districtName, upazila: "" }));

    if (!districtName) {
      setFilteredUpazilas([]);
      return;
    }

    const district = districts.find((d) => d.name === districtName);
    if (district) {
      const filtered = allUpazilas.filter((u) => u.district_id === district.id);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const { bloodGroup, district, upazila } = search;

    if (!bloodGroup || !district || !upazila) {
      toast.error("Please select blood group, district and upazila");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "https://blood-donation-server-tan.vercel.app/users/search-donors",
        {
          params: {
            bloodGroup: bloodGroup.trim(),
            district: district.trim(),
            upazila: upazila.trim(),
          },
        }
      );

      const foundDonors = res.data.donors || [];
      setDonors(foundDonors);

      if (foundDonors.length === 0) {
        toast.error("No donors found with these criteria. Try different filters.");
      } else {
        toast.success(
          `Found ${foundDonors.length} donor${foundDonors.length > 1 ? "s" : ""}!`
        );
      }
    } catch {
      toast.error("Failed to search donors. Please try again.");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearch({ bloodGroup: "", district: "", upazila: "" });
    setFilteredUpazilas([]);
    setDonors([]);
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Search Blood Donors</title>
        <meta
          name="description"
          content="Quickly find available blood donors by blood group, district and upazila across Bangladesh."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600 dark:text-red-500 mb-6 flex items-center justify-center gap-3">
              <FaHeartbeat className="text-4xl" /> Search for Blood Donors
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Find available donors near you instantly and help save a life today.
            </p>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12 mb-16"
          >
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {/* Blood Group Select */}
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="label text-lg font-semibold flex items-center gap-2"
                >
                  <FaTint className="text-red-600 dark:text-red-400" />
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  id="bloodGroup"
                  value={search.bloodGroup}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, bloodGroup: e.target.value }))
                  }
                  className="select select-bordered w-full text-lg rounded-xl"
                  required
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div>
                <label
                  htmlFor="district"
                  className="label text-lg font-semibold flex items-center gap-2"
                >
                  <FaMapMarkedAlt className="text-red-600 dark:text-red-400" />
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  value={search.district}
                  onChange={handleDistrictChange}
                  className="select select-bordered w-full text-lg rounded-xl"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila Select */}
              <div>
                <label
                  htmlFor="upazila"
                  className="label text-lg font-semibold flex items-center gap-2"
                >
                  <FaMapMarkedAlt className="text-red-600 dark:text-red-400" />
                  Upazila <span className="text-red-500">*</span>
                </label>
                <select
                  id="upazila"
                  value={search.upazila}
                  onChange={(e) =>
                    setSearch((prev) => ({ ...prev, upazila: e.target.value }))
                  }
                  className="select select-bordered w-full text-lg rounded-xl"
                  disabled={filteredUpazilas.length === 0}
                  required
                >
                  <option value="">
                    {filteredUpazilas.length === 0
                      ? "Select district first"
                      : "Select Upazila"}
                  </option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col justify-end gap-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-error btn-lg w-full text-xl font-bold shadow-xl hover:shadow-2xl transition"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Search Donors"
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="btn btn-ghost btn-lg w-full"
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.section>

          {/* Results Section */}
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
          ) : donors.length === 0 ? (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-center py-20 bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl"
            >
              <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-8">
                No donors found matching your search criteria.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Try adjusting the filters or check back later.
              </p>
            </motion.section>
          ) : (
            <>
              <div className="text-center mb-10">
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Found {donors.length} donor{donors.length !== 1 ? "s" : ""}
                </p>
              </div>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {donors.map((donor) => (
                  <motion.article
                    key={donor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(239, 68, 68, 0.4)" }}
                    transition={{ duration: 0.3 }}
                    className="card bg-base-100 dark:bg-gray-800 shadow-xl rounded-3xl cursor-pointer"
                  >
                    <div className="card-body items-center text-center p-8">
                      <div className="avatar mb-6">
                        <div className="w-32 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-4 shadow-2xl">
                          <img
                            src={donor.photoURL || "https://via.placeholder.com/128"}
                            alt={donor.name || "Anonymous Donor"}
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <h2 className="card-title text-2xl font-bold">
                        {donor.name || "Anonymous Donor"}
                      </h2>

                      <div className="my-4">
                        <span className="badge badge-error badge-lg text-white font-bold text-xl px-6 py-4">
                          {donor.bloodGroup}
                        </span>
                      </div>

                      <div className="space-y-2 text-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {donor.upazila}, {donor.district}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                          {donor.email}
                        </p>
                      </div>

                      <div className="card-actions mt-6">
                        <a
                          href={`mailto:${donor.email}`}
                          className="btn btn-error btn-wide text-lg font-bold shadow-lg hover:shadow-xl transition"
                          aria-label={`Contact donor ${donor.name || "Anonymous"}`}
                        >
                          Contact Donor
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchDonors;
