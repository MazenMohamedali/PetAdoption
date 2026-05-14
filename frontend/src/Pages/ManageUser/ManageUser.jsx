import "./ManageUser.css";

export default function ManageUser() {
  const users = [
    { id: 1, img: "https://via.placeholder.com/50", banned: true },
    { id: 2, img: "https://via.placeholder.com/50", banned: true },
    { id: 3, img: "https://via.placeholder.com/50", banned: false },
    { id: 4, img: "https://via.placeholder.com/50", banned: true },
    { id: 5, img: "https://via.placeholder.com/50", banned: true },
  ];

  return (
    <div className="manage-page">
      <h1 className="manage-title">MANAGE USER</h1>

      <div className="users-list">
        {users.map((u) => (
          <div className="user-row" key={u.id}>
            <img src={u.img} className="user-avatar" />

            <button className={u.banned ? "ban-btn" : "unban-btn"}>
              {u.banned ? "Ban" : "Unban"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
