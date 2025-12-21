import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const AllUsers = () => {
  const { role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [filterStatus, setFilterStatus] = useState("");

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("https://blood-donation-server-tan.vercel.app/users/all", {
        params: {
          page,
          limit: 10,
          status: filterStatus || undefined,
        },
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchUsers(1);
    }
  }, [role, filterStatus]);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/users/${userId}/role`, { role: newRole });
      toast.success("Role updated successfully");
      fetchUsers(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.patch(`https://blood-donation-server-tan.vercel.app/users/${userId}/status`, { status: newStatus });
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
      fetchUsers(pagination.currentPage);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (role !== "admin") {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="alert alert-error shadow-lg max-w-md">
          <span className="text-2xl font-bold">Access Denied</span>
          <p className="mt-2">Only admins can view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>BloodCare | All Users (Admin)</title>
        <meta name="description" content="Manage all registered users - change roles and block/unblock in BloodCare." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-base-100 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  👥 All Users
                </h1>
                <p className="mt-2 text-red-100 text-lg">
                  Total: {pagination.totalUsers} users
                </p>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select select-bordered bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full max-w-xs"
              >
                <option value="">All Users</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>
            </div>
          </div>

          <div className="p-6 lg:p-10">
            {users.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-500 dark:text-gray-400">
                  No users found with current filter.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-red-50 dark:bg-red-900/30 text-lg">
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Blood Group</th>
                        <th>District</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                          <td>
                            <div className="avatar">
                              <div className="w-14 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2">
                                <img src={u.photoURL || "https://via.placeholder.com/56"} alt={u.name} />
                              </div>
                            </div>
                          </td>
                          <td className="font-bold text-lg">{u.name}</td>
                          <td className="text-sm">{u.email}</td>
                          <td>
                            <span className="badge badge-error badge-lg text-white font-bold">
                              {u.bloodGroup}
                            </span>
                          </td>
                          <td>{u.district || "-"}</td>
                          <td>
                            <span className="badge badge-primary capitalize font-medium">
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge capitalize font-medium ${
                                u.status === "blocked" ? "badge-error" : "badge-success"
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td>
                            <div className="dropdown dropdown-end">
                              <label tabIndex={0} className="btn btn-ghost btn-sm">
                                ⋯
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu p-3 shadow-lg bg-base-100 dark:bg-gray-700 rounded-box w-56"
                              >
                                {u.status === "active" ? (
                                  <li>
                                    <button
                                      onClick={() => handleStatusChange(u._id, "blocked")}
                                      className="text-error font-medium"
                                    >
                                      Block User
                                    </button>
                                  </li>
                                ) : (
                                  <li>
                                    <button
                                      onClick={() => handleStatusChange(u._id, "active")}
                                      className="text-success font-medium"
                                    >
                                      Unblock User
                                    </button>
                                  </li>
                                )}

                                {u.role !== "volunteer" && u.role !== "admin" && (
                                  <li>
                                    <button onClick={() => handleRoleChange(u._id, "volunteer")}>
                                      Make Volunteer
                                    </button>
                                  </li>
                                )}

                                {u.role !== "admin" && (
                                  <li>
                                    <button onClick={() => handleRoleChange(u._id, "admin")}>
                                      Make Admin
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="card bg-base-200 dark:bg-gray-700 shadow-xl hover:shadow-2xl transition-shadow"
                    >
                      <div className="card-body">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="avatar">
                            <div className="w-20 rounded-full ring ring-red-500 ring-offset-2">
                              <img src={u.photoURL || "https://via.placeholder.com/80"} alt={u.name} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{u.name}</h3>
                            <p className="text-sm opacity-70">{u.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <strong>Blood:</strong>
                            <span className="badge badge-error text-white ml-2">{u.bloodGroup}</span>
                          </div>
                          <div>
                            <strong>District:</strong> {u.district || "-"}
                          </div>
                          <div>
                            <strong>Role:</strong>
                            <span className="badge badge-primary capitalize ml-2">{u.role}</span>
                          </div>
                          <div>
                            <strong>Status:</strong>
                            <span
                              className={`badge capitalize ml-2 ${
                                u.status === "blocked" ? "badge-error" : "badge-success"
                              }`}
                            >
                              {u.status}
                            </span>
                          </div>
                        </div>

                        <div className="card-actions justify-end mt-6">
                          <div className="dropdown dropdown-top dropdown-end">
                            <label tabIndex={0} className="btn btn-outline btn-error">
                              Actions ⋯
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu p-3 shadow-lg bg-base-100 dark:bg-gray-700 rounded-box w-56"
                            >
                              {u.status === "active" ? (
                                <li>
                                  <button
                                    onClick={() => handleStatusChange(u._id, "blocked")}
                                    className="text-error font-medium"
                                  >
                                    Block User
                                  </button>
                                </li>
                              ) : (
                                <li>
                                  <button
                                    onClick={() => handleStatusChange(u._id, "active")}
                                    className="text-success font-medium"
                                  >
                                    Unblock User
                                  </button>
                                </li>
                              )}

                              {u.role !== "volunteer" && u.role !== "admin" && (
                                <li>
                                  <button onClick={() => handleRoleChange(u._id, "volunteer")}>
                                    Make Volunteer
                                  </button>
                                </li>
                              )}

                              {u.role !== "admin" && (
                                <li>
                                  <button onClick={() => handleRoleChange(u._id, "admin")}>
                                    Make Admin
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="btn btn-outline btn-error"
                    >
                      Previous
                    </button>

                    <span className="text-lg font-medium">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="btn btn-outline btn-error"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;