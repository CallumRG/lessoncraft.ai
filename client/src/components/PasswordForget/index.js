import React, { useState } from "react";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { toast } from 'react-toastify';

function PasswordForget() {
  const [email, setEmail] = useState('');

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div className="App">
      <h1>Forget Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default PasswordForget;
