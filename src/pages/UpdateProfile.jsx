import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const UpdateProfile = () => {
  const { user, updateProfileInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ImgBB API key (তোমার .env বা config থেকে নিয়ে দাও)
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY || "your-imgbb-api-key";

  // ছবি আপলোড হ্যান্ডলার
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

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Update Your Profile
            </h1>
            <p className="text-xl text-red-100">
              Keep your information current so others can reach you easily
            </p>
          </div>

          <div className="card-body p-8 lg:p-16 -mt-6">
            <div className="flex flex-col items-center mb-10">
              <div className="avatar mb-6">
                <div className="w-32 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-4 shadow-2xl">
                  <img
                    src={
                      photoURL ||
                      user?.photoURL ||
                      "https://i.ibb.co/Q3LYhjtx/pngtree-user-icon-png-image-1796659.jpg"
                    }
                    alt="Profile Preview"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
                Current photo preview. Upload a new image to change it.
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Full Name */}
              <div>
                <label className="label text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="input input-bordered w-full text-xl px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="label text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="select select-bordered w-full text-xl rounded-2xl bg-gray-50 dark:bg-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition"
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

              {/* Image Upload */}
              <div>
                <label className="label text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Upload Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full text-lg rounded-2xl bg-gray-50 dark:bg-gray-700"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Uploading image...</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="btn btn-error btn-lg w-full text-xl font-bold py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-ghost btn-lg w-full text-xl py-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
