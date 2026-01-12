import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

import { motion } from "framer-motion";
import {
  FiEdit,
  FiSave,
  FiXCircle,
  FiLoader,
  FiChevronLeft,
} from "react-icons/fi";

const EditRequest = () => {
  const { user, role } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const selectedDistrict = watch("recipientDistrict");

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []));

    fetch("/upazilas.json")
      .then((res) => res.json())
      .then((data) => setAllUpazilas(data.upazilas || []));
  }, []);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(
          `https://blood-donation-server-tan.vercel.app/donation-requests/${id}`
        );
        const req = res.data;
        setRequest(req);

        const isRequester = req.requesterEmail === user?.email;
        if (!isRequester && role !== "admin") {
          toast.error("You are not authorized to edit this request");
          navigate("/dashboard/my-donation-requests");
          return;
        }

        setValue("recipientName", req.recipientName || "");
        setValue("bloodGroup", req.bloodGroup || "");
        setValue("recipientDistrict", req.district || "");
        setValue("recipientUpazila", req.upazila || "");
        setValue("hospitalName", req.hospital || "");
        setValue("fullAddress", req.fullAddress || "");
        setValue("donationDate", req.donationDate?.split("T")[0] || "");
        setValue("donationTime", req.donationTime || "");
        setValue("requestMessage", req.requestMessage || "");

        const districtObj = districts.find((d) => d.name === req.district);
        if (districtObj) {
          const filtered = allUpazilas.filter(
            (u) => u.district_id === districtObj.id
          );
          setFilteredUpazilas(filtered);
        }
      } catch (err) {
        toast.error("Failed to load request details");
        navigate("/dashboard/my-donation-requests");
      } finally {
        setLoading(false);
      }
    };

    if (user && districts.length > 0 && allUpazilas.length > 0) {
      fetchRequest();
    }
  }, [id, user, districts, allUpazilas, navigate, setValue]);


  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name === selectedDistrict);
      if (district) {
        const filtered = allUpazilas.filter(
          (u) => u.district_id === district.id
        );
        setFilteredUpazilas(filtered);
        setValue("recipientUpazila", "");
      } else {
        setFilteredUpazilas([]);
      }
    }
  }, [selectedDistrict, districts, allUpazilas, setValue]);

  const minDate = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await axios.patch(
        `https://blood-donation-server-tan.vercel.app/donation-requests/${id}`,
        {
          recipientName: data.recipientName.trim(),
          bloodGroup: data.bloodGroup,
          district: data.recipientDistrict,
          upazila: data.recipientUpazila,
          hospital: data.hospitalName.trim(),
          fullAddress: data.fullAddress.trim(),
          donationDate: data.donationDate,
          donationTime: data.donationTime,
          requestMessage: data.requestMessage.trim(),
        }
      );

      toast.success("Request updated successfully! 🩸");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update request";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <FiLoader className="animate-spin text-6xl text-red-600" />
      </div>
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-error shadow-2xl max-w-lg text-center p-12 rounded-3xl"
        >
          <FiXCircle className="mx-auto mb-4 text-6xl" />
          <span className="text-3xl font-bold">Account Blocked</span>
          <p className="mt-6 text-xl">You cannot edit donation requests.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Donation Request | BloodCare</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
      >
        <div className="card bg-base-100 dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-12 text-center text-white">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 flex justify-center items-center gap-3"
            >
              <FiEdit /> Edit Donation Request 🩸
            </motion.h1>
            <p className="text-lg md:text-xl opacity-90">
              Update details to help donors find you faster.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="card-body p-6 lg:p-12"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
         
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-200 dark:bg-gray-700/50 p-6 rounded-2xl">
                <div>
                  <label className="label font-semibold">Requester Name</label>
                  <input
                    type="text"
                    value={request?.requesterName || ""}
                    readOnly
                    className="input input-bordered w-full bg-base-300 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="label font-semibold">Requester Email</label>
                  <input
                    type="email"
                    value={request?.requesterEmail || ""}
                    readOnly
                    className="input input-bordered w-full bg-base-300 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("recipientName", {
                      required: "Recipient name is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 characters",
                      },
                    })}
                    type="text"
                    className="input input-bordered w-full"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipientName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("bloodGroup", {
                      required: "Blood group is required",
                    })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Blood Group</option>
                    {[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("recipientDistrict", {
                      required: "District is required",
                    })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.recipientDistrict && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipientDistrict.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Upazila <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("recipientUpazila", {
                      required: "Upazila is required",
                    })}
                    className="select select-bordered w-full"
                    disabled={!filteredUpazilas.length}
                  >
                    <option value="">
                      {filteredUpazilas.length
                        ? "Select Upazila"
                        : "Select district first"}
                    </option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {errors.recipientUpazila && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipientUpazila.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("hospitalName", {
                      required: "Hospital name is required",
                    })}
                    type="text"
                    className="input input-bordered w-full"
                  />
                  {errors.hospitalName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hospitalName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fullAddress", {
                      required: "Full address is required",
                    })}
                    type="text"
                    className="input input-bordered w-full"
                  />
                  {errors.fullAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullAddress.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    Required Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("donationDate", {
                      required: "Date is required",
                      validate: (value) =>
                        new Date(value) >= new Date(minDate) ||
                        "Date cannot be in the past",
                    })}
                    type="date"
                    min={minDate}
                    className="input input-bordered w-full"
                  />
                  {errors.donationDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.donationDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("donationTime", {
                      required: "Time is required",
                    })}
                    type="time"
                    className="input input-bordered w-full"
                  />
                  {errors.donationTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.donationTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="label font-semibold">
                  Why Blood is Needed <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("requestMessage", {
                    required: "Please describe the requirement",
                    minLength: {
                      value: 10,
                      message: "Minimum 20 characters",
                    },
                  })}
                  rows="6"
                  placeholder="Patient's condition, urgency, number of bags needed, contact person etc..."
                  className="textarea textarea-bordered w-full resize-none"
                />
                {errors.requestMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requestMessage.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-error btn-lg px-12 font-bold shadow-xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin text-xl" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Update Request
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => navigate(-1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline btn-lg px-12 flex items-center justify-center gap-3"
                >
                  <FiChevronLeft />
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default EditRequest;
