import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Rating } from '@mui/material';

export default function ReviewCard({review}) {
  return (
<Card sx={{ minWidth: 275, border: '1px solid #ccc', borderRadius: '8px', marginBottom:'10px' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', marginRight: '10px' }}>
          {review.owner.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1">{review.owner.username}</Typography>
      </Box>
      
      <Typography variant="body1" sx={{ margin:'10px 10px'  }}>{review.reviewText}</Typography>
      <Rating name="read-only" sx={{ margin:'5px'}} value={review.reviewStar} readOnly />
    </CardContent>
  </Card>
  );
}