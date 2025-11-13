import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Repeat,
  ChatBubbleOutline,
} from "@mui/icons-material";

import { elapsed_time } from "../../utils/elapsed_time";
import useReposts from "../../hooks/useReposts";
import useComments from "../../hooks/useComments";
import usePostLikes from "../../hooks/usePostlikes";

const PostCard = ({ post_id, profilePic, username, screen_name, timePosted, text, image }) => {

  const { likesCount, currentUserLikes, toggleLike } = usePostLikes(post_id);
  const { repostCount, reposted, toggleRepost } = useReposts(post_id);
  const { commentCount } = useComments(post_id);

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await toggleLike()
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleRepost = async (e) => {
    e.stopPropagation();
    try {
      await toggleRepost()
    } catch (error) {
      console.error("Error toggling repost:", error);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    const currentPath = location.pathname;
    let postData = { 
      post_id: post_id, 
      profile_photo: profilePic, 
      username: username, 
      screen_name: screen_name, 
      createdAt: timePosted, 
      text: text, 
      image: image 
    }
     
    // Only navigate if not already on this post's page
    if (currentPath !== `/post/${post_id}`) {
        return navigate(`/post/${post_id}`, { state: { ...postData } });

    }
  };


  return (
    <Box
      onClick={handleCommentClick}
      sx={{
        '&:hover': {
          backgroundColor: '#f3f3f3',
          transitionProperty: 'background-color',
          transitionDuration: '0.5s',
          cursor: 'pointer'
        }
      }}
    >

      <Divider />

      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        <Box sx={{ flexShrink: 0 }}>
          <Avatar
            src={profilePic ? `http://localhost:8000/${profilePic}` : null}
            sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}
          >
            {!profilePic && username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

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
            <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
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
      <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mt: 2, pt: 1 }}>
        {/* Like */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton onClick={handleLike} color={currentUserLikes ? "error" : "default"} size="small">
            {currentUserLikes ? <Favorite /> : <FavoriteBorder />}
          </IconButton>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ visibility: likesCount > 0 ? "visible" : "hidden" }}
          >
            {likesCount || 0}
          </Typography>
        </Box>

        {/* Repost */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton onClick={handleRepost} size="small">
            {reposted ? <Repeat sx={{ color: "primary.main" }} /> : <Repeat />}
          </IconButton>

          <Typography
            variant="body2"
            color={reposted ? "primary.main" : "text.primary"}
            sx={{ visibility: repostCount > 0 ? "visible" : "hidden" }}
          >
            {repostCount || 0}
          </Typography>
        </Box>

        {/* Comment */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton size="small">
            <ChatBubbleOutline />
          </IconButton>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ visibility: commentCount > 0 ? "visible" : "hidden" }}
          >
            {commentCount || 0}
          </Typography>
        </Box>
      </Box>


    </Box>
  );
};

export default PostCard;