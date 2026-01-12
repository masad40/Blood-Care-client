import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  User,
  Camera,
  Save,
  X,
  Upload,
  ArrowLeft,
  Droplet,
  Mail,
  Shield,
  Heart,
  Edit3,
  CheckCircle,
  Image,
  ChevronDown
} from "lucide-react";

const UpdateProfile = () => {
  const { user, updateProfileInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);


  useEffect(() => {
    if (user?.bloodGroup) {
      setBloodGroup(user.bloodGroup);
    }
  }, [user]);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY || "your-imgbb-api-key";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );

      const imageUrl = res.data.data.display_url;
      setPhotoURL(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image. Try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    setLoading(true);
    try {
      await updateProfileInfo(name.trim(), photoURL.trim(), bloodGroup);
      toast.success("Profile updated successfully! 🩸");
      navigate("/dashboard/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>BloodCare | Update Profile</title>
        <meta
          name="description"
          content="Update your profile information including name, blood group and photo."
        />
      </Helmet>

      <div
        className={`min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex flex-col items-center justify-center px-4 py-12 transition-opacity duration-700 sm:flex-row sm:items-start sm:gap-8 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="card w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">

          {/* Header with icons */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Edit3 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Heart className="h-10 w-10" /> Update Profile
            </h1>
            <p className="text-lg sm:text-xl text-red-100 flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" /> Keep your information current for lifesaving connections
            </p>
          </div>

          <div className="card-body p-6 sm:p-8 lg:p-16 -mt-6">
 
            <div className="flex flex-col items-center mb-10">
              <div className="relative group mb-6">
                <div className="w-28 sm:w-36 h-28 sm:h-36 rounded-full ring-4 ring-red-500 ring-offset-4 ring-offset-base-100 shadow-2xl overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={
                      photoURL ||
                      user?.photoURL ||
                      "https://i.ibb.co/Q3LYhjtx/pngtree-user-icon-png-image-1796659.jpg"
                    }
                    alt="Profile Preview"
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-2 right-2 p-3 bg-red-600 text-white rounded-full shadow-lg">
                  <Camera className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 text-center flex items-center gap-2">
                <Image className="h-5 w-5" /> Click to upload a new profile photo
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6 sm:space-y-8">
          
              <div>
                <label className="label text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                  <User className="h-6 w-6 text-red-600" /> Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="input input-bordered w-full text-lg sm:text-xl pl-12 pr-6 py-4 sm:py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                  <Mail className="h-6 w-6 text-red-600" /> Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full text-lg sm:text-xl pl-12 pr-6 py-4 sm:py-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Email cannot be changed</p>
              </div>

              <div>
                <label className="label text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                  <Droplet className="h-6 w-6 text-red-600" /> Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Droplet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => {
                      console.log("Selected Blood Group:", e.target.value);
                      setBloodGroup(e.target.value);
                    }}
                    className="select select-bordered w-full text-lg sm:text-xl pl-12 pr-12 py-4 sm:py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current selection: <span className="font-bold text-red-600">{bloodGroup || "Not selected"}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="label text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
                  <Upload className="h-6 w-6 text-red-600" /> Upload Profile Photo
                </label>
                <div className="relative">
                  <Upload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full text-lg sm:text-xl pl-12 rounded-2xl bg-gray-50 dark:bg-gray-700"
                    disabled={uploadingImage}
                  />
                </div>
                {uploadingImage && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm text-red-600"></span>
                    Uploading image...
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-10">
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="btn btn-error btn-lg w-full sm:w-auto text-lg sm:text-xl font-bold py-4 sm:py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl flex justify-center items-center gap-3 group"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Save Changes</span>
                      <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline btn-lg w-full sm:w-auto text-lg sm:text-xl py-4 sm:py-6 rounded-2xl flex justify-center items-center gap-3 group hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Cancel</span>
                  <X className="h-6 w-6 opacity-70" />
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" /> Current Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <User className="h-4 w-4" />
                    <span>Current Name:</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.displayName || "Not set"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Droplet className="h-4 w-4" />
                    <span>Current Blood Group:</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.bloodGroup || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;