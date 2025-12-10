import { Box, Divider } from "@mui/material";
import PostCard from "../../components/PostCard/PostCard";
import { useState, useEffect } from "react";
import { apiAuth } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataProvider";

const Feed = () => {
  const { posts } = useData();

  return (
    <Box p={0}>
      {posts.map((post) => (
          <PostCard
            key={post.post_id}
            profilePic={post.profile_photo}
            username={post.user}
            text={post.post_text}
            timePosted={post.createdAt}
            image={post?.images?.[0]}
            screen_name={post.screen_name}
            post_id={post.post_id}
          />
      ))}
    </Box>
  );
};

export default Feed;
