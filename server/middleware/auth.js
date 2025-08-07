require("dotenv").config();
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("❌ Missing CLERK_SECRET_KEY in .env");
}

const clerkMiddleware = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

module.exports = clerkMiddleware;
