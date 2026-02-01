import React from "react";

export default function UserDashboard({ user }) {
  return (
    <div className="dashboard user-dashboard">
      <h1>Welcome {user.username}</h1>
    </div>
  );
}
