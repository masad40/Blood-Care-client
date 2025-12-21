import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
  } = useForm();

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
      setValue("recipientUpazila", "");
    } else {
      setFilteredUpazilas([]);
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("You must be logged in to create a request.");
      return;
    }

    setIsSubmitting(true);

    const requestData = {
      requesterName: user?.displayName || user?.name || "Anonymous",
      requesterEmail: user?.email,
      recipientName: data.recipientName,
      bloodGroup: data.bloodGroup,
      district: data.recipientDistrict,
      upazila: data.recipientUpazila,
      hospital: data.hospitalName,
      fullAddress: data.fullAddress,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
    };

    try {
      const response = await axios.post("https://blood-donation-server-tan.vercel.app/donation-requests", requestData);

      if (response.data.success || response.data.insertedId) {
        toast.success("Blood donation request created successfully! 🩸");
        reset();
        navigate("/dashboard/my-donation-requests");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create request. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 px-10 py-8 rounded-2xl shadow-2xl text-center max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Account Blocked</h2>
          <p className="text-lg">You are currently not allowed to create blood donation requests.</p>
          <p className="mt-3">Please contact the administrator for assistance.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | Create Donation Request</title>
        <meta name="description" content="Create a new blood donation request to help save lives in your community." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              🩸 Create New Blood Donation Request
            </h1>
            <p className="mt-4 text-red-100 text-lg">
              Your request can save a life today.
            </p>
          </div>

          <div className="p-6 lg:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl">
                <div>
                  <label className="label font-semibold text-gray-700 dark:text-gray-300">
                    Requester Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || user?.name || ""}
                    readOnly
                    className="input input-bordered w-full bg-gray-200 dark:bg-gray-600"
                  />
                </div>
                <div>
                  <label className="label font-semibold text-gray-700 dark:text-gray-300">
                    Requester Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full bg-gray-200 dark:bg-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("recipientName", { required: "Recipient name is required" })}
                    type="text"
                    placeholder="Patient's full name"
                    className="input input-bordered w-full"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("bloodGroup", { required: "Blood group is required" })}
                    className="select select-bordered w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Blood Group
                    </option>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("recipientDistrict", { required: "District is required" })}
                    onChange={handleDistrictChange}
                    className="select select-bordered w-full"
                    defaultValue=""
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
                  {errors.recipientDistrict && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientDistrict.message}</p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Upazila <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("recipientUpazila", { required: "Upazila is required" })}
                    className="select select-bordered w-full"
                    disabled={filteredUpazilas.length === 0}
                    defaultValue=""
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
                  {errors.recipientUpazila && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientUpazila.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("hospitalName", { required: "Hospital name is required" })}
                    type="text"
                    placeholder="e.g., Dhaka Medical College Hospital"
                    className="input input-bordered w-full"
                  />
                  {errors.hospitalName && (
                    <p className="text-red-500 text-sm mt-1">{errors.hospitalName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fullAddress", { required: "Full address is required" })}
                    type="text"
                    placeholder="Road, area, house no."
                    className="input input-bordered w-full"
                  />
                  {errors.fullAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullAddress.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label font-semibold">
                    Donation Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("donationDate", { required: "Date is required" })}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="input input-bordered w-full"
                  />
                  {errors.donationDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.donationDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="label font-semibold">
                    Donation Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("donationTime", { required: "Time is required" })}
                    type="time"
                    className="input input-bordered w-full"
                  />
                  {errors.donationTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.donationTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="label font-semibold">
                  Why Blood is Needed <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("requestMessage", { required: "Message is required" })}
                  rows="8"
                  placeholder="Describe patient's condition, urgency level, number of bags needed, contact person, etc."
                  className="textarea textarea-bordered w-full resize-none"
                />
                {errors.requestMessage && (
                  <p className="text-red-500 text-sm mt-1">{errors.requestMessage.message}</p>
                )}
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-error btn-wide text-lg font-bold px-12 py-4 shadow-lg hover:shadow-xl transition"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Creating Request...
                    </>
                  ) : (
                    "Submit Request"
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