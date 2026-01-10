import { useContext, useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const { createUser, updateProfileInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH LOCATION DATA ---------------- */
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [districtRes, upazilaRes] = await Promise.all([
          fetch("/districts.json").then((res) => res.json()),
          fetch("/upazilas.json").then((res) => res.json()),
        ]);

        setDistricts(districtRes?.districts || []);
        setAllUpazilas(upazilaRes?.upazilas || []);
      } catch {
        toast.error("Failed to load location data");
      }
    };

    loadLocations();
  }, []);

  /* ---------------- DISTRICT CHANGE ---------------- */
  const handleDistrictChange = useCallback(
    (e) => {
      const selectedName = e.target.value;
      const district = districts.find((d) => d.name === selectedName);

      if (!district) {
        setFilteredUpazilas([]);
        return;
      }

      const matchedUpazilas = allUpazilas.filter(
        (u) => u.district_id === district.id
      );
      setFilteredUpazilas(matchedUpazilas);
    },
    [districts, allUpazilas]
  );

  /* ---------------- REGISTER HANDLER ---------------- */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

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

    if (!image) {
      toast.error("Profile photo is required");
      return;
    }

    try {
      setLoading(true);

      /* -------- IMAGE UPLOAD -------- */
      const formData = new FormData();
      formData.append("image", image);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const photoURL = imgRes?.data?.data?.display_url;
      if (!photoURL) throw new Error("Image upload failed");

      /* -------- AUTH -------- */
      await createUser(email, password);
      await updateProfileInfo(name, photoURL);

      /* -------- SAVE USER -------- */
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

      await axios.post(
        "https://blood-donation-server-tan.vercel.app/users",
        userInfo
      );

      toast.success("Registration successful! Welcome to BloodCare 🩸");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Register as Donor</title>
        <meta
          name="description"
          content="Register as a blood donor on BloodCare and help save lives."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white">Register as Donor</h1>
            <p className="mt-2 text-lg text-red-100">
              Join our community and help save lives
            </p>
          </div>

          {/* FORM */}
          <div className="p-8 lg:p-12 -mt-6">
            <form onSubmit={handleRegister} className="space-y-6">

              {/* BASIC INFO */}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="name"
                  placeholder="Full Name"
                  className="input input-bordered rounded-xl"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="input input-bordered rounded-xl"
                  required
                />
              </div>

              {/* IMAGE */}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="file-input file-input-bordered rounded-xl w-full"
                required
              />

              {/* LOCATION & BLOOD */}
              <div className="grid md:grid-cols-3 gap-6">
                <select name="bloodGroup" required className="select select-bordered rounded-xl">
                  <option value="" disabled selected>
                    Blood Group
                  </option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg}>{bg}</option>
                  ))}
                </select>

                <select
                  name="district"
                  onChange={handleDistrictChange}
                  required
                  className="select select-bordered rounded-xl"
                >
                  <option value="" disabled selected>
                    District
                  </option>
                  {districts.map((d) => (
                    <option key={d.id}>{d.name}</option>
                  ))}
                </select>

                <select
                  name="upazila"
                  disabled={!filteredUpazilas.length}
                  required
                  className="select select-bordered rounded-xl"
                >
                  <option value="" disabled selected>
                    {filteredUpazilas.length ? "Upazila" : "Select district first"}
                  </option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              {/* PASSWORD */}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input input-bordered rounded-xl"
                  required
                />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered rounded-xl"
                  required
                />
              </div>

              {/* SUBMIT */}
              <button
                disabled={loading}
                className="btn btn-error btn-lg w-full rounded-2xl text-xl font-bold"
              >
                {loading ? "Creating Account..." : "Register as Donor"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-red-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
