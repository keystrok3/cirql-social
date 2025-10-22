import { Box, Typography } from "@mui/material";

const Feed = () => {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Feed
      </Typography>
      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          sx={{
            p: 1.5,
            mb: 1,
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body1">Post #{i + 1}</Typography>
          <Typography variant="body2" color="text.secondary">
            Example content for post #{i + 1}.
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Feed;
