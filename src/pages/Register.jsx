import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { createUser, updateProfileInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []));

    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => setAllUpazilas(data.upazilas || []));
  }, []);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const district = districts.find((d) => d.name === districtName);
    if (district) {
      const filtered = allUpazilas.filter((u) => u.district_id === district.id);
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const image = form.avatar.files[0];
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const photoURL = imgRes.data.data.display_url;

      await createUser(email, password);
      await updateProfileInfo(name, photoURL);

      const userInfo = {
        name,
        email,
        photoURL,
        bloodGroup,
        district,
        upazila,
        role: "donor",
        status: "active",
      };

      await axios.post("https://blood-donation-server-tan.vercel.app/users", userInfo);

      toast.success("Registration successful! Welcome to BloodCare 🩸");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Register as Donor</title>
        <meta
          name="description"
          content="Join BloodCare as a blood donor. Register with your details and help save lives in your community."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Register as Donor
            </h1>
            <p className="text-xl text-red-100">
              Join our community and help save lives
            </p>
          </div>

          <div className="card-body p-8 lg:p-12 -mt-6">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label text-lg font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="label text-lg font-semibold">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-lg font-semibold">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="file-input file-input-bordered w-full rounded-xl text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label text-lg font-semibold">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    className="select select-bordered w-full text-lg rounded-xl"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-lg font-semibold">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    onChange={handleDistrictChange}
                    className="select select-bordered w-full text-lg rounded-xl"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select District
                    </option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-lg font-semibold">
                    Upazila <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="upazila"
                    className="select select-bordered w-full text-lg rounded-xl"
                    defaultValue=""
                    required
                    disabled={filteredUpazilas.length === 0}
                  >
                    <option value="" disabled>
                      {filteredUpazilas.length === 0 ? "Select district first" : "Select Upazila"}
                    </option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label text-lg font-semibold">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="label text-lg font-semibold">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="input input-bordered w-full text-lg rounded-xl"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-error btn-lg w-full text-xl font-bold py-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
              >
                Register as Donor
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-red-600 dark:text-red-500 hover:underline transition"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;