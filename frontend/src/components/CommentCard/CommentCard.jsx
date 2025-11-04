import { Avatar, Box, Typography } from "@mui/material";
import { useEffect } from "react";

const CommentCard = ({ comment }) => {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        mb: 2,
        pb: 1,
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Avatar
        src={comment?.profile_photo ? `http://localhost:8000/${comment?.profile_photo}` : null}
        sx={{ width: 40, height: 40 }}
      >
        {!comment?.profile_photo && comment?.username?.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2">{comment?.username}</Typography>
        <Typography variant="body2" color="text.secondary">
          {comment?.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentCard;
