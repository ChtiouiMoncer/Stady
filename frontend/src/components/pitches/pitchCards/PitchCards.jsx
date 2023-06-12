import { Box, Stack, Typography, styled } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../../../api/axios'
import Navbar from "../../Navbar";


const StyledBox = styled(Box) (({ theme }) => ({

    bgcolor: "background.default",
    display: 'flex',
    flexDirection:"column",
    padding: '20px 20px',
}));

const PitchCards = () => {

     //users data state
     const [pitches, setPitches] = useState(); 
 
     //react dom
     const navigate = useNavigate();
     const location = useLocation();
 
     //REFRESH TOKEN ENDPOINT
     const PITCHES_URL = '/api/grounds'
 
     useEffect(() => {
         let isMounted = true;
         const controller = new AbortController(); //cancel the request when the comp unmounts
 
         const getPitches = async () => {
             try {
                 const response = await axios.get(PITCHES_URL, {
                         signal: controller.signal, //cancel the request if we need to    
                         headers: {'accept': 'application/json'} // include the accept header
                     },
                   
                 );
                 
                 //console.log(response.data);
                 isMounted && setPitches(response.data);
                 console.log(response.data);
                 
 
             } catch (err) {
                 //console.error(err);
                 //console.log(err);
                 
                 //Handling an expired refresh token
                 if (err?.response?.status === 404 )
                 {
                    console.log('not found')
                 }       
 
                 
     
             }
         }
 
         getPitches();
 
         // cleanup function is used to handle any necessary clean-up tasks when the component is unmounted
          return () => {
             isMounted = false; //the code ensures that the state is only updated if the component is still mounted.
             controller.abort(); //cancel any requests when the comp unmounts
         }
     }, [])

    
    return (  
        <>
            <Navbar />

            <StyledBox >
                <Typography sx={{ color: "green.main", fontWeight: 600 }} >
                    Find your next adventure with these Pitch deals
                </Typography>

            
                            
                <Box> 
                    {pitches && pitches.map(pitch => (
                        <Card key={pitch.id} sx={{ maxWidth: 345 }}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image="/static/images/cards/contemplative-reptile.jpg"
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div"></Typography>
                            <Typography variant="body2" color="text.secondary">
                            {pitch?.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                        </Card>
                    ))}
                    </Box>
                
            </StyledBox>
        </>
    );
}
 
export default PitchCards;

