import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import InfoSidebar from "./InfoSidebar";
import TopSection from "./TopSection"; // ← your top component


const Home = () => {
  return (
    <Box
      display="flex"
      gap={2}
      padding={".5em"}
      sx={{
        alignItems: "flex-start",
      }}
    >
      {/* Left sidebar */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          flex: "20%",
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

      {/* Main area */}
      <Box
        sx={{
          flex: "80%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        {/* Main feed area (with top component + feed below it) */}
        <Box
          sx={{
            flex: { xs: "100%", sm: "60%" },
            borderRadius: "5px",
            backgroundColor: "background.default",
          }}
        >
          {/* Top component — sticky on desktop */}
          <Box
            sx={{
              backgroundColor: "background.default",
              borderRadius: "5px 5px 0 0",
            }}
          >
            <TopSection />
          </Box>
          
          {/* Feed content below */}
          <Feed />
        </Box>

        {/* Info sidebar — visible only on desktop, sticky */}
        <Box
          sx={{
            flex: "40%",
            display: { xs: "none", sm: "block" },
            border: "1px solid #d0d0d0",
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
    </Box>
  );
};

export default Home;
