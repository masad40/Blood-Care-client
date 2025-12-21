import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const EditRequest = () => {
  const { user, role } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

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
        const res = await axios.get(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}`);
        const req = res.data;
        setRequest(req);

        const isRequester = req.requesterEmail === user?.email;
        if (!isRequester && role !== "admin") {
          toast.error("You are not authorized to edit this request");
          navigate("/dashboard/my-donation-requests");
          return;
        }

        setValue("recipientName", req.recipientName);
        setValue("bloodGroup", req.bloodGroup);
        setValue("recipientDistrict", req.district);
        setValue("recipientUpazila", req.upazila);
        setValue("hospitalName", req.hospital);
        setValue("fullAddress", req.fullAddress);
        setValue("donationDate", req.donationDate.split("T")[0]);
        setValue("donationTime", req.donationTime);
        setValue("requestMessage", req.requestMessage);

        const districtObj = districts.find((d) => d.name === req.district);
        if (districtObj) {
          const filtered = allUpazilas.filter((u) => u.district_id === districtObj.id);
          setFilteredUpazilas(filtered);
        }
      } catch (err) {
        toast.error("Failed to load request");
        navigate("/dashboard/my-donation-requests");
      } finally {
        setLoading(false);
      }
    };

    if (user && districts.length > 0) {
      fetchRequest();
    }
  }, [id, user, districts, allUpazilas, navigate, setValue]);

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
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/donation-requests/${id}`, {
        recipientName: data.recipientName,
        bloodGroup: data.bloodGroup,
        district: data.recipientDistrict,
        upazila: data.recipientUpazila,
        hospital: data.hospitalName,
        fullAddress: data.fullAddress,
        donationDate: data.donationDate,
        donationTime: data.donationTime,
        requestMessage: data.requestMessage,
      });

      toast.success("Request updated successfully!");
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (user?.status === "blocked") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
        <div className="alert alert-error shadow-2xl max-w-2xl text-center p-12 rounded-3xl bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-700">
          <span className="text-3xl font-bold text-red-700 dark:text-red-300">Account Blocked</span>
          <p className="mt-6 text-xl text-red-700 dark:text-red-300">You cannot edit donation requests.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | Edit Donation Request</title>
        <meta name="description" content="Edit your blood donation request details to help donors find you easily." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Edit Blood Donation Request
              </h1>
              <p className="mt-4 text-red-100 text-lg">
                Update the details to help donors reach you faster.
              </p>
            </div>

            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 dark:bg-gray-700/50 p-6 rounded-2xl">
                  <div>
                    <label className="label font-semibold text-gray-700 dark:text-gray-300">
                      Requester Name
                    </label>
                    <input
                      type="text"
                      value={request?.requesterName || ""}
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
                      value={request?.requesterEmail || ""}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label font-semibold">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("recipientDistrict", { required: "District is required" })}
                      onChange={handleDistrictChange}
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
                    Request Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("requestMessage", { required: "Message is required" })}
                    rows="8"
                    className="textarea textarea-bordered w-full resize-none"
                    placeholder="Describe the patient's condition, urgency, contact info, etc."
                  />
                  {errors.requestMessage && (
                    <p className="text-red-500 text-sm mt-1">{errors.requestMessage.message}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                  <button
                    type="submit"
                    className="btn btn-error btn-wide btn-lg text-xl font-bold shadow-xl hover:shadow-2xl transition"
                  >
                    Update Request
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-wide btn-lg text-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRequest;