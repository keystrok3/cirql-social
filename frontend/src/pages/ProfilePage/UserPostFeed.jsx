import { Box, Divider, Tabs, Tab } from "@mui/material";
import PostCard from "../../components/PostCard/PostCard";
import { useState, useEffect } from "react";
import { apiAuth } from "../../api/axios";
import { useParams } from "react-router-dom";
// Assuming you have a useAuth hook for the logged-in user's data
import { useAuth } from "../../context/AuthProvider"; 

const UserProfileFeed = () => {
  const [posts, setPosts] = useState([]);
  
  const { user: userParam } = useParams(); 
  
  const { userData } = useAuth(); // <-- USE AUTH CONTEXT
  const loggedInUsername = userData?.user?.username;

  const username = userParam || loggedInUsername; 
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      let endpoint = '';
      
      switch (activeTab) {
        case 0: // Posts
          endpoint = `/users/get-other-posts/${username}`; 
          break;
        case 1: // Liked Posts
          endpoint = `/users/get-other-likes/${username}`;
          break;
        case 2: // Reposted Posts
          endpoint = `/users/get-other-reposts/${username}`;
          break;
        default:
          return;
      }

      try {
        setLoading(true);
        // ... (rest of the fetching logic remains the same)
        const response = await apiAuth.get(endpoint);

        if (response.status === 200) {
            console.log('Fetched posts: ', response.data);
            setPosts(response.data);
        } else {
            console.log('Error: ', response.statusText);
            setPosts([]);
        }
        } catch (error) {
            console.error(`Error fetching ${['posts', 'liked posts', 'reposts'][activeTab]} for ${username}: `, error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Only fetch if a valid username is determined
    if (username) { 
      fetchPosts();
    }
  }, [activeTab, username]); // Dependency array is correct

  // ... (rest of the return statement remains the same)

  return (
    <Box p={0} mt={'1em'}>
      {/* Tabs Component for navigation */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        aria-label="User Posts Tabs"
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider' 
        }}
      >
        <Tab label="Posts" />
        <Tab label="Likes" />
        <Tab label="Reposts" />
      </Tabs>
      
      {/* Content Area */}
      <Box mt={2}>
        {loading ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>Loading...</Box>
        ) : !username ? (
            // Handle case where neither URL param nor logged-in user is available
            <Box sx={{ p: 2, textAlign: 'center' }}>User not found or not logged in.</Box>
        ) : posts.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            No {['posts', 'liked posts', 'reposts'][activeTab]} found for {username}.
          </Box>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </Box>
    </Box>
  );
};

export default UserProfileFeed;