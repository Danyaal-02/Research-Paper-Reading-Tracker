import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(148,163,184,0.12)",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
      <Outlet />
    </>
  );
};

export default RootLayout;
