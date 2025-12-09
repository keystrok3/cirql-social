import React, { useEffect, useState } from "react";
import { Alert, Box, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import PostCard from "../../components/PostCard/PostCard";
import CommentCard from "../../components/CommentCard/CommentCard";
import SendIcon from '@mui/icons-material/Send';
import { useLocation, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import useComments from "../../hooks/useComments";
import CustomAlert from "../../components/Alerts/CustomAlert";

const PostPage = () => {
  const { post_id } = useParams();
  const { create_comment, comments, error, message } = useComments(post_id); 
  const { state } = useLocation();

  const postFromState = state
  const [ post, setPost ] = useState(postFromState);
  const [ post_body, setPostBody ] = useState({
    content: ""
  });

  const handleChange = (e) => {
    const comment = e.target.value;

    setPostBody({ content: comment});
  };

  const handlePost = async () => {
    if(post_body.content === "") return;

    try {
      await create_comment(post_body);
    } catch (error) {
      console.log('Error posting comment: ', error);
    } finally{ 
      setPostBody({ content: ""});
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Box display={'flex'} alignItems={'center'} marginBottom={'1.5em'}>
          <IconButton onClick={() => window.history.back()}>
            <ArrowBack />
          </IconButton>

          <Typography marginLeft={'1em'} variant="h5">Post</Typography>
        </Box>

        <Divider />
        {/* Post content */}
        <Box>
          <PostCard
            post_id={post?.post_id}
            profilePic={post?.profile_photo}
            username={post?.username}
            screen_name={post?.screen_name}
            timePosted={post?.createdAt}
            text={post?.text}
            image={post?.image}
            // disableActions={true} // optional if you want to hide icons
          />
        </Box>

        <Divider sx={{ width: '95%', margin: '0 auto'}}/>

        { 
          message && 
          <Box width={'50%'}>
            <CustomAlert message={message} isError={error} />
          </Box>
        }

        <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            placeholder="Post your reply"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            value={post_body.content}
            onChange={handleChange}
          />
          <IconButton
            color="primary"
            sx={{ 
              mt: 0.5,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
            onClick={handlePost}
          >
            <SendIcon />
          </IconButton>
        </Box>

        <Divider sx={{ width: '95%', margin: '0 auto'}}/>

        {/* Comments */}
        <Box sx={{ p: 4, width: '95%', margin: '0 auto' }}>
          {comments.map((comment, idx) => {

            return (
              <React.Fragment key={`${idx}`}>
                <CommentCard
                  comment={comment}
                />
                {idx < comment.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            )
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default PostPage;
