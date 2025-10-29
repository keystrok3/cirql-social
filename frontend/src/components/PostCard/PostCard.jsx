import React, { useState } from 'react';
import {
  Card,
  Avatar,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Repeat,
  ChatBubbleOutline,
} from '@mui/icons-material';
import { elapsed_time } from '../../utils/elapsed_time';

const PostCard = ({ profilePic, username, screen_name, timePosted, text, image }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const theme = useTheme();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleRepost = () => setRepostCount(repostCount + 1);
  const handleComment = () => setCommentCount(commentCount + 1);

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: '20px auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2,
        p: 2,
      }}
    >
      {/* TOP SECTION: Two Columns */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* LEFT COLUMN: Avatar */}
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

        {/* RIGHT COLUMN: Text content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Row 1: screen name, username, time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {screen_name || username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{username}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              • {elapsed_time(timePosted) || 'Just now'}
            </Typography>
          </Box>

          {/* Row 2: text and/or image */}
          {text && (
            <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
              {text}
            </Typography>
          )}
          {image && (
            <Box
              component="img"
              src={`http://localhost:8000/${image}`}
              alt="Post content"
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 2,
                mt: 1,
              }}
            />
          )}
        </Box>
      </Box>

      {/* BOTTOM SECTION: Action Buttons (full width) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          mt: 2,
          pt: 1,
        }}
      >
        {/* Like */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton onClick={handleLike} color={liked ? 'error' : 'default'} size="small">
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          {likeCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          )}
        </Box>

        {/* Repost */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton onClick={handleRepost} color="default" size="small">
            <Repeat />
          </IconButton>
          {repostCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              {repostCount}
            </Typography>
          )}
        </Box>

        {/* Comment */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
