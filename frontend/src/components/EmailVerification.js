import React, { useState } from 'react';
import axios from 'axios';

const EmailVerification = () => {
  const [email, setEmail] = useState('');

  const handleSendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-email', {
        to: email,
        subject: 'Email Verification',
        text: 'Your OTP code is: 123456', // Generate a random OTP and send it here
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendEmail}>Send Verification Email</button>
    </div>
  );
};

export default EmailVerification;
