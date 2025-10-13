
import { Box, Container } from "@mui/material";
import Sidebar from "./Sidebar";

const Home = () => {


    return (
        <Box 
            display="flex" 
            gap={2}
            padding={'.5em'}
        >
            <Box
                sx={{
                    display: { xs: "none", sm: "block" },
                    flex: '20%',
                    backgroundColor: '#fff',
                    border: '1px solid #b8b8b8ff',
                    borderRadius: '5px'
                }}
            >
                <Sidebar />
            </Box>
            <Box
                sx={{
                    flex: '80%',
                    border: '1px solid #b8b8b8ff',
                    height: '3em',
                    borderRadius: '5px'
                }}
            ></Box>
        </Box>
    )
};

export default Home;