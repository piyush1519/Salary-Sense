import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const role = user?.publicMetadata?.role;

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#f8f8f8",
      borderBottom: "1px solid #ddd"
    }}>
      <Link to="/" style={{
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "20px",
        color: "#333"
      }}>
        Salary-Sense
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <SignedIn>
          {isSignedIn && (
            <span style={{ fontSize: "14px", color: "#333" }}>
              Logged in as: <strong>{role}</strong>
            </span>
          )}
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
