import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Collapse, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

const Post = () => {
    const label = { inputProps: { 'aria-label': 'Love It' } };
    return (
        <Card sx={{ margin:4}}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor:"red" }} aria-label="recipe">
                R
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Stade"
            subheader=" Opened from 2023"
          />
          <CardMedia
            component="img"
            height="20%"
            //weight="50"
            image="https://ca-times.brightspotcdn.com/dims4/default/0a38c65/2147483647/strip/true/crop/1000x667+0+0/resize/1200x800!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fde%2Fe5%2F3184c1374efe8d09081eb7eecc4d%2Ffootball2.jpg"
            alt="Paella dish"
          />
          <CardContent>
            <Typography variant="body2" color="text.primary">
              This impressive paella is a perfect party dish and a fun meal to cook
              together with your guests. Add 1 cup of frozen peas along with the mussels,
              if you like.
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
            <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{color:'red'}} />} />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>


      );
}
 
export default Post;
