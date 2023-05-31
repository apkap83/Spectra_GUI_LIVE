import React, { useState } from "react";
import "./password_reset.scss";

export const PasswordResetForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Close the popup
    setShowPopup(false);
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Reset Password</button>

      {showPopup && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Reset</button>
          </form>
        </div>
      )}
    </div>
  );
};
