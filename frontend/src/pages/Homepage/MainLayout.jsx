import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import InfoSidebar from "./InfoSidebar";
import BottomNav from "../../components/BottomNav";

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "25% 50% 25%" },
        backgroundColor: "#fff",
        minHeight: "100vh",
        overflow: "hidden", // prevent double scrollbars
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          borderRight: "1px solid #ccc",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "25%",
          overflowY: "auto",
          backgroundColor: "#fff",
        }}
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          gridColumn: { sm: 2 },
          backgroundColor: "#fff",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Outlet />
        <BottomNav />
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          borderLeft: "1px solid #ccc",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "25%",
          overflowY: "auto",
          backgroundColor: "#fff",
        }}
      >
        <InfoSidebar />
      </Box>
    </Box>
  );
};

export default MainLayout;
