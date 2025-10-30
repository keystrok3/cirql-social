import { Box, Typography } from "@mui/material";
import PostCard from "../../components/PostCard/PostCard";
import { useState } from "react";
import axios from 'axios';
import { apiAuth } from '../../api/axios'
import { useId } from "react";

const Feed = () => {
  const [ posts, setPosts ] = useState([]);

  const fetchAllPosts = async () => {
    try {
      const response = await apiAuth.get('/posts/fetch-all-posts');

      if(response.status !== 200) {
        console.log('Could not fetch', response.statusText);
      }

      setPosts([ ...response.data.data ]);
    } catch (error) {
      console.error('Error fetching: ', error);
    }
  };


  useState(() => {
    fetchAllPosts();
  }, [ ]);

  return (
    <Box p={2}>
      {
        posts.map((post, idx) => {
          return (
            <PostCard 
              key={`post ${idx}`} 
              profilePic={post.profile_photo}
              username={post.user}
              text={post.post_text}
              timePosted={post.createdAt}
              image={post?.images[0]}
              screen_name={post.screen_name}
              post_id={post.post_id}
            />
          )
          
        })
      }
    </Box>
  );
};

export default Feed;
