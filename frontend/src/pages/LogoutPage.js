import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    fetch("/api/logout").then(res => {
      if (res.ok) {
        window.location.href = "/"; // href is the entire URL for the current page, here we go back to the main page
      }
    });
  }, []);
  return <div>Logging out</div>;
};

export default Logout;
