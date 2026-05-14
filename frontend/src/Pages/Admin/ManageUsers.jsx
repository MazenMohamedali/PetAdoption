import { useState, useEffect } from "react";
import { userAPI, getStoredUser } from "../../services/api";
import "./Dashboard.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAllUsers();
      const usersArray = Array.isArray(data) ? data : (data.users || []);
      setUsers(usersArray);
    } catch (err) {
      setError("Failed to load users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const me = getStoredUser();
    if (me && me.id === userId) {
      alert("You cannot delete your own account.");
      return;
    }

    // If target is an admin, warn that backend may reject this action
    const target = users.find(u => u.id === userId);
    const adminWarning = target?.role === 'ADMIN' ? 'The selected user is an admin — the backend may reject this deletion.\n' : '';
    if (!window.confirm(`${adminWarning}Are you sure you want to delete this user?`)) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      fetchUsers();
      alert("User deleted successfully!");
    } catch (err) {
      setError("Failed to delete user: " + err.message);
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm("Make this user an admin?")) {
      return;
    }

    try {
      await userAPI.makeAdmin(userId);
      fetchUsers();
      alert("User is now an admin!");
    } catch (err) {
      setError("Failed to make user admin: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><p>Loading users...</p></div>;
  }

  return (
    <div className="manage-section">
      <h2 className="text-gradient mb-4">Users Management</h2>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="users-table glass-card p-4">
        {users.length === 0 ? (
          <p className="text-center text-light">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gender || "N/A"}</td>
                    <td>
                      <span className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-info"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {user.role !== "ADMIN" && (
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleMakeAdmin(user.id)}
                          >
                            Make Admin
                          </button>
                        )}

                        {/* Show Delete only when current user is an admin */}
                        {(() => {
                          const me = getStoredUser();
                          if (me && me.role === 'ADMIN') {
                            return (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </button>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

