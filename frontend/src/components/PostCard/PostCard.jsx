import React from "react";
import {
  Card,
  Avatar,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Repeat,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { elapsed_time } from "../../utils/elapsed_time";
import usePostLikes from "../../hooks/usePostLikes";
import useReposts from "../../hooks/useReposts";

const PostCard = ({
  post_id,
  profilePic,
  username,
  screen_name,
  timePosted,
  text,
  image,
}) => {
  const [commentCount, setCommentCount] = React.useState(0);

  const { likesCount, currentUserLikes, likePost, unlikePost } = usePostLikes(post_id);
  const { repostCount, reposted, make_repost, undo_repost } = useReposts(post_id)

  const theme = useTheme();

  const handleLike = async () => {
    try {
      if (currentUserLikes) {
        await unlikePost();
      } else {
        await likePost();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleRepost = async () => {
    try {
      if(reposted) {
        await undo_repost();
      } else {
        await make_repost();
      }
    } catch (error) {
      console.error("Error toggling repost:", error);
    }
  } 

  const handleComment = () => setCommentCount(commentCount + 1);

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "20px auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 2,
        p: 2,
      }}
    >
      {/* TOP SECTION */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Avatar */}
        <Box sx={{ flexShrink: 0 }}>
          <Avatar
            src={profilePic ? `http://localhost:8000/${profilePic}` : null}
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 48,
              height: 48,
            }}
          >
            {!profilePic && username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Post content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {screen_name || username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{username}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              • {elapsed_time(timePosted) || "Just now"}
            </Typography>
          </Box>

          {text && (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ whiteSpace: "pre-line" }}
            >
              {text}
            </Typography>
          )}
          {image && (
            <Box
              component="img"
              src={`http://localhost:8000/${image}`}
              alt="Post content"
              sx={{
                width: "100%",
                maxHeight: 400,
                objectFit: "cover",
                borderRadius: 2,
                mt: 1,
              }}
            />
          )}
        </Box>
      </Box>

      {/* ACTION BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          mt: 2,
          pt: 1,
        }}
      >
        {/* Like */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={handleLike}
            color={currentUserLikes ? "error" : "default"}
            size="small"
          >
            {currentUserLikes ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          {likesCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {likesCount}
            </Typography>
          )}
        </Box>

        {/* Repost */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton onClick={handleRepost} color="default" size="small">
            <Repeat />
          </IconButton>
          {reposted && (
            <Typography variant="body2" color="text.secondary">
              {repostCount}
            </Typography>
          )}
        </Box>

        {/* Comment */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton onClick={handleComment} color="default" size="small">
            <ChatBubbleOutline />
          </IconButton>
          {commentCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {commentCount}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
