import { Box, Container, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";

const HowItWorks = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 5, textAlign: "center", mb: 5 }}>
          <img src={logo} alt="Logo" style={{ width: 300, height: 120 }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
            How It Works
          </Typography>

          {/* Owner Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              For Owners
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you an owner of a sports ground or facility? Stady provides you with a platform to showcase your ground and connect with sports enthusiasts looking for a place to play. Here's how it works for owners:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              1. Register your sports ground on Stady and provide detailed information about your facility, including location, amenities, pricing, and availability.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              2. Showcase your ground's features with photos and descriptions to attract potential customers.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              3. Manage your ground's availability calendar and pricing to ensure accurate and up-to-date information for users.
            </Typography>
          
          </Box>

          {/* Member Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              For Members
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you a sports enthusiast looking to book a sports ground or facility? Stady makes it easy for you to find and reserve the perfect place to play. Here's how it works for members:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              1. Browse through a wide range of sports grounds and facilities available on Stady.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              2. Use filters to narrow down your search based on location, sports type, availability, and amenities.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              3. View detailed information about each ground, including photos, pricing, amenities, and user reviews.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              4. Check the availability calendar to find open slots and book your preferred time.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              5. Make secure online payments and receive booking confirmations directly through the Stady platform.
            </Typography>
          </Box>

          {/* Stady Benefits */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Stady Benefits
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Stady aims to provide a seamless experience for both owners and members. Here are some key benefits:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            - Owners can reach a larger user base, showcase their facilities, and manage bookings efficiently.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            - Members can easily discover and book sports grounds that meet their specific requirements.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            - Secure online payments ensure a hassle-free booking process.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            - Transparent communication and messaging system facilitate easy coordination between owners and members.
          </Typography>

          {/* Join Stady */}
          <Typography variant="body1" sx={{ mb: 4 }}>
            Join Stady today and experience the convenience and excitement of sports ground reservation!
          </Typography>

          {/* App Footer */}
        </Box>
      </Container>
      <AppFooter />
    </>
  );
};

export default HowItWorks;