import { Box } from "@mui/material";
import PostCard from "../../components/PostCard/PostCard";
import { useState, useEffect } from "react";
import { apiAuth } from "../../api/axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await apiAuth.get("/posts/fetch-all-posts");
        if (response.status !== 200) {
          console.error("Could not fetch:", response.statusText);
          return;
        }
        console.log(response.data.data)
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchAllPosts();
  }, []);

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
