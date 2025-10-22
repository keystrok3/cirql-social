import { Box, Typography } from "@mui/material";

const InfoSidebar = () => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Info Sidebar
      </Typography>
      {[...Array(10)].map((_, i) => (
        <Box key={i} sx={{ mb: 1 }}>
          <Typography variant="body2">Sidebar item {i + 1}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default InfoSidebar;
