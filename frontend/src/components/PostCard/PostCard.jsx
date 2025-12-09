import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  useTheme,
  // Divider removed in favor of borderBottom
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
import { useLikeUpdates } from "../../context/LikesContext";
import { useRepost } from "../../context/RepostProvider";
import PostActionsMenu from "../ActionMenu/PostActionMenu";
import { useAuth } from "../../context/AuthProvider";

const PostCard = ({ post_id, profilePic, username, screen_name, timePosted, text, image }) => {

  const { likeUpdates } = useLikeUpdates();
  const { repostUpdates } = useRepost();

  const { userData } = useAuth();

  const refetchTrigger = likeUpdates[post_id] || 0;
  const repostRefetchTrigger = repostUpdates[post_id] || 0;

  const { likesCount, currentUserLikes, toggleLike } = usePostLikes(post_id, refetchTrigger);
  const { repostCount, reposted, toggleRepost } = useReposts(post_id, repostRefetchTrigger);
  const { commentCount } = useComments(post_id);

  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      await toggleLike();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleRepost = async (e) => {
    e.stopPropagation();
    try {
      await toggleRepost();
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
    };
     
    // Only navigate if not already on this post's page
    if (currentPath !== `/post/${post_id}`) {
        return navigate(`/post/${post_id}`, { state: { ...postData } });
    }
  };

  return (
    <Box
      onClick={handleCommentClick}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f3f3f3',
          transitionProperty: 'background-color',
          transitionDuration: '0.5s',
        }
      }}
    >
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        
        {/* LEFT COLUMN: AVATAR */}
        <Box sx={{ flexShrink: 0 }}>
          <Avatar
            src={profilePic ? `${import.meta.env.VITE_API_URL}/${profilePic}` : null}
            sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}
          >
            {!profilePic && username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* RIGHT COLUMN: CONTENT */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
          
          {/* HEADER ROW */}
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", flex: 1 }}>
              <Typography variant="subtitle1" component={'a'} sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {screen_name || username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{username}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                • {elapsed_time(timePosted) || "Just now"}
              </Typography>
            </Box>

            {/* Users can perform post actions on their */}
            {
              (username === userData?.user?.username) &&
              <Box onClick={(e) => e.stopPropagation()}>
                <PostActionsMenu post_id={post_id} />
              </Box>
            }
            
          </Box>

          {/* POST TEXT */}
          {text && (
            <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
              {text}
            </Typography>
          )}

          {/* POST IMAGE */}
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
                border: `1px solid ${theme.palette.divider}`
              }}
            />
          )}

          {/* 3. ACTION BAR: Now nested inside the content column */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, maxWidth: "80%" }}>
            
            {/* Comment */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton size="small" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                <ChatBubbleOutline fontSize="small" />
              </IconButton>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ visibility: commentCount > 0 ? "visible" : "hidden" }}
              >
                {commentCount || 0}
              </Typography>
            </Box>

            {/* Repost */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton onClick={handleRepost} size="small" sx={{ color: reposted ? "success.main" : "default" }}>
                <Repeat fontSize="small" />
              </IconButton>
              <Typography
                variant="caption"
                color={reposted ? "success.main" : "text.secondary"}
                sx={{ visibility: repostCount > 0 ? "visible" : "hidden" }}
              >
                {repostCount || 0}
              </Typography>
            </Box>

            {/* Like */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton onClick={handleLike} color={currentUserLikes ? "error" : "default"} size="small">
                {currentUserLikes ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
              </IconButton>
              <Typography
                variant="caption"
                color={currentUserLikes ? "error" : "text.secondary"}
                sx={{ visibility: likesCount > 0 ? "visible" : "hidden" }}
              >
                {likesCount || 0}
              </Typography>
            </Box>

            {/* Spacer to keep alignment similar to Twitter if you add a 4th icon (Share/View) */}
            <Box sx={{ width: 20 }} />

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostCard;