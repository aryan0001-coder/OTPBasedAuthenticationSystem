const express = require("express");
const twilio = require("twilio");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(express.json());

const TWILIO_ACCOUNT_SID = process.env.SECRET_URI;
const TWILIO_AUTH_TOKEN = "503775e469de3e069e804a320f19149b";
const TWILIO_PHONE_NUMBER = "+12538028538";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const otpStorage = {};

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

app.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = generateOTP();

  const expirationTime = Date.now() + 5 * 60 * 1000;

  otpStorage[phoneNumber] = { otp, expiresAt: expirationTime };

  try {
    await client.messages.create({
      body: `Your OTP for login verification is: ${otp}. Please enter this OTP to complete your authentication. This OTP is valid for 5 minutes.\n\nBest Regards, Aryan `,
      from: +12538028538,
      to: +918630851349,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
