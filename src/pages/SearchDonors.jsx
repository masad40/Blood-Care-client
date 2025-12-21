import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { toast } from "react-hot-toast";

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
      .catch((err) => {
        console.error("Failed to load location data", err);
        toast.error("Failed to load districts/upazilas");
      });
  }, []);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value.trim();
    setSearch({ ...search, district: districtName, upazila: "" });

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
      const res = await axios.get("https://blood-donation-server-tan.vercel.app/users/search-donors", {
        params: {
          bloodGroup: bloodGroup.trim(),
          district: district.trim(),
          upazila: upazila.trim(),
        },
      });

      const foundDonors = res.data.donors || [];
      setDonors(foundDonors);

      if (foundDonors.length === 0) {
        toast.error("No donors found with these criteria. Try different filters.");
      } else {
        toast.success(`Found ${foundDonors.length} donor${foundDonors.length > 1 ? "s" : ""}!`);
      }
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600 dark:text-red-500 mb-6">
              🔍 Search for Blood Donors
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Find available donors near you instantly and help save a life today.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12 mb-16">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Blood Group */}
              <div>
                <label className="label text-lg font-semibold">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  value={search.bloodGroup}
                  onChange={(e) => setSearch({ ...search, bloodGroup: e.target.value })}
                  className="select select-bordered w-full text-lg rounded-xl"
                  required
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="label text-lg font-semibold">
                  District <span className="text-red-500">*</span>
                </label>
                <select
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

              {/* Upazila */}
              <div>
                <label className="label text-lg font-semibold">
                  Upazila <span className="text-red-500">*</span>
                </label>
                <select
                  value={search.upazila}
                  onChange={(e) => setSearch({ ...search, upazila: e.target.value })}
                  className="select select-bordered w-full text-lg rounded-xl"
                  disabled={filteredUpazilas.length === 0}
                  required
                >
                  <option value="">
                    {filteredUpazilas.length === 0 ? "Select district first" : "Select Upazila"}
                  </option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons - এখন form-এর ভিতরে, layout ঠিক */}
              <div className="flex flex-col justify-end gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-error btn-lg w-full text-xl font-bold shadow-xl hover:shadow-2xl transition"
                >
                  {loading ? <span className="loading loading-spinner"></span> : "Search Donors"}
                </button>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="btn btn-ghost btn-lg w-full"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-red-600"></span>
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-20 bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl">
              <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-8">
                No donors found matching your search criteria.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Try adjusting the filters or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Found {donors.length} donor{donors.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {donors.map((donor) => (
                  <div
                    key={donor._id}
                    className="card bg-base-100 dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 rounded-3xl"
                  >
                    <div className="card-body items-center text-center p-8">
                      <div className="avatar mb-6">
                        <div className="w-32 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-4 shadow-2xl">
                          <img
                            src={donor.photoURL || "https://via.placeholder.com/128"}
                            alt={donor.name}
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <h2 className="card-title text-2xl font-bold">{donor.name || "Anonymous Donor"}</h2>

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
                        >
                          Contact Donor
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchDonors;