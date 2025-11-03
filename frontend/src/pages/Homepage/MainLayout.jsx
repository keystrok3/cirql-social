import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import InfoSidebar from "./InfoSidebar";

const MainLayout = () => {
  return (
    <Box display="flex" gap={2} padding=".25em" sx={{ alignItems: "flex-start" }}>
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          flex: "30%",
          backgroundColor: "#fff",
          border: "1px solid #b8b8b8ff",
          borderRadius: "5px",
          position: "sticky",
          top: ".5em",
          height: "calc(100vh - 1em)",
          overflowY: "auto",
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          flex: "70%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <Box
          sx={{
            flex: { xs: "100%", sm: "60%" },
            borderRadius: "5px",
            backgroundColor: "background.default",
          }}
        >
          {/* This is where child pages render */}
          <Outlet />
        </Box>
      </Box>
      <Box
        sx={{
          flex: "40%",
          display: { xs: "none", sm: "block" },
          border: "2px solid #d0d0d0",
          borderRadius: "5px",
          backgroundColor: "#fff",
          position: "sticky",
          top: ".5em",
          height: "calc(100vh - 1em)",
          overflowY: "auto",
        }}
      >
        <InfoSidebar />
      </Box>
    </Box>
  );
};

export default MainLayout;
