import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  User,
  Heart,
  MapPin,
  Home,
  Calendar,
  Clock,
  MessageSquare,
  Loader2,
  PlusCircle,
} from "lucide-react";

const CreateDonationRequest = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();

  const selectedDistrict = watch("recipientDistrict");

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []))
      .catch((err) => console.error("Districts fetch failed:", err));

    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => setAllUpazilas(data.upazilas || []))
      .catch((err) => console.error("Upazilas fetch failed:", err));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name === selectedDistrict);
      if (district) {
        const filtered = allUpazilas.filter((u) => u.district_id === district.id);
        setFilteredUpazilas(filtered);
        setValue("recipientUpazila", ""); // reset upazila when district changes
      } else {
        setFilteredUpazilas([]);
      }
    }
  }, [selectedDistrict, districts, allUpazilas, setValue]);

  const minDate = new Date().toISOString().split("T")[0]; // today's date

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please login to create a request");
      return;
    }

    setIsSubmitting(true);

    const requestData = {
      requesterName: user?.displayName || user?.name || "Anonymous",
      requesterEmail: user?.email,
      recipientName: data.recipientName.trim(),
      bloodGroup: data.bloodGroup,
      district: data.recipientDistrict,
      upazila: data.recipientUpazila,
      hospital: data.hospitalName.trim(),
      fullAddress: data.fullAddress.trim(),
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage.trim(),
      createdAt: new Date(),
    };

    try {
      const res = await axios.post(
        "https://blood-donation-server-tan.vercel.app/donation-requests",
        requestData
      );

      if (res.data.insertedId || res.data.success) {
        toast.success("Request created successfully! 🩸", {
          duration: 4000,
        });
        reset();
        navigate("/dashboard/my-donation-requests");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create request. Try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="alert alert-warning shadow-xl max-w-md text-center">
          <span className="text-xl font-bold">Please Login First</span>
          <p className="mt-2">You need to be logged in to create a donation request.</p>
        </div>
      </div>
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="card bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-700 shadow-2xl max-w-lg text-center p-10">
          <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-4">
            Account Blocked
          </h2>
          <p className="text-lg mb-4">
            You are currently not allowed to create blood donation requests.
          </p>
          <p className="text-sm opacity-80">
            Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Create Donation Request | BloodCare</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fadeIn">
        <div className="card bg-base-100 dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-12 lg:py-16 text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 flex justify-center items-center gap-3">
              <Heart size={36} /> Create Blood Donation Request 🩸
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              One request can save multiple lives. Please fill the form carefully.
            </p>
          </div>

          <div className="card-body p-6 lg:p-12 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Requester Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-200 dark:bg-gray-700/50 p-6 rounded-2xl">
                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <User size={18} /> Requester Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || user?.name || "N/A"}
                    readOnly
                    className="input input-bordered w-full bg-base-300 cursor-not-allowed pl-9"
                  />
                </div>
                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <User size={18} /> Requester Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || "N/A"}
                    readOnly
                    className="input input-bordered w-full bg-base-300 cursor-not-allowed pl-9"
                  />
                </div>
              </div>

              {/* Recipient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <User size={18} /> Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("recipientName", {
                      required: "Recipient name is required",
                      minLength: { value: 3, message: "Minimum 3 characters" },
                    })}
                    type="text"
                    placeholder="Patient's full name"
                    className="input input-bordered w-full pl-9"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientName.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <Heart size={18} /> Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("bloodGroup", { required: "Please select blood group" })}
                    className="select select-bordered w-full pl-9"
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <MapPin size={18} /> District <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("recipientDistrict", { required: "District is required" })}
                    className="select select-bordered w-full pl-9"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.recipientDistrict && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientDistrict.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <MapPin size={18} /> Upazila <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("recipientUpazila", { required: "Upazila is required" })}
                    className="select select-bordered w-full pl-9"
                    disabled={!filteredUpazilas.length}
                  >
                    <option value="">
                      {filteredUpazilas.length ? "Select Upazila" : "Select district first"}
                    </option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {errors.recipientUpazila && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientUpazila.message}</p>
                  )}
                </div>
              </div>

              {/* Hospital & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <Home size={18} /> Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("hospitalName", { required: "Hospital name is required" })}
                    type="text"
                    placeholder="e.g. Dhaka Medical College Hospital"
                    className="input input-bordered w-full pl-9"
                  />
                  {errors.hospitalName && (
                    <p className="text-red-500 text-sm mt-1">{errors.hospitalName.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <Home size={18} /> Full Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fullAddress", { required: "Full address is required" })}
                    type="text"
                    placeholder="Road no, area, house/apartment"
                    className="input input-bordered w-full pl-9"
                  />
                  {errors.fullAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullAddress.message}</p>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <Calendar size={18} /> Required Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("donationDate", {
                      required: "Date is required",
                      min: {
                        value: minDate,
                        message: "Date cannot be in the past",
                      },
                    })}
                    type="date"
                    min={minDate}
                    className="input input-bordered w-full pl-9"
                  />
                  {errors.donationDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.donationDate.message}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="label font-semibold flex items-center gap-2">
                    <Clock size={18} /> Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("donationTime", { required: "Time is required" })}
                    type="time"
                    className="input input-bordered w-full pl-9"
                  />
                  {errors.donationTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.donationTime.message}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <label className="label font-semibold flex items-center gap-2">
                  <MessageSquare size={18} /> Why Blood is Needed <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("requestMessage", {
                    required: "Please describe the requirement",
                    minLength: { value: 20, message: "Minimum 20 characters" },
                  })}
                  rows="6"
                  placeholder="Patient's condition, urgency, number of bags needed, contact person etc..."
                  className="textarea textarea-bordered w-full resize-none pl-9"
                />
                {errors.requestMessage && (
                  <p className="text-red-500 text-sm mt-1">{errors.requestMessage.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-8 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-error btn-lg px-12 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Creating Request...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDonationRequest;
