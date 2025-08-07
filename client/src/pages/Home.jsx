import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <Navigate to="/sign-in" />;

  const role = user?.publicMetadata?.role?.toLowerCase();

  console.log("Redirecting based on role:", role); // for debugging

  if (!role) return <p>No role assigned. Contact admin.</p>;

  if (role === "developer") return <Navigate to="/developer" />;
  if (role === "recruiter") return <Navigate to="/recruiter" />;
  if (role === "admin") return <Navigate to="/admin" />;

  return <p>Invalid role. Contact admin.</p>;
};

export default Home;
