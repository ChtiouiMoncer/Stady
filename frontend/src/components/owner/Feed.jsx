import React from "react";
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Collapse, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Post from "./Post";

const  Feed = () => {    
    return (
      // with the sx  <Box sx={{ bgcolor: 'lightblue', flex: 4, p: 2 }}>Feed</Box>
      <Box flex={8} >
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </Box>
      );
}
 
export default Feed;