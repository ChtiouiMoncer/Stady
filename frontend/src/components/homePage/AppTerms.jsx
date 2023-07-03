import { Box, Container, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import Navbar from "../Navbar";
import AppFooter from "./AppFooter";

const AppTerms = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 5, textAlign: "center", mb: 5 }}>
          <img src={logo} alt="Logo" style={{ width: 300, height: 120 }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
            Terms and Conditions
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please read these terms and conditions carefully before using our website.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              By accessing or using the Stady website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our website.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              These terms and conditions apply to all users of our website, including owners and members.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              1. Ownership and Intellectual Property
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Stady and its associated logos and trademarks are the property of Stady Corporation. Unauthorized use of our intellectual property is strictly prohibited.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Users are not permitted to copy, distribute, or use any of our intellectual property without prior written consent.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Any violation of our intellectual property rights may result in legal action.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              2. User Conduct
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Users of the Stady website are expected to conduct themselves in a responsible and respectful manner.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Prohibited actions include but are not limited to:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - Posting false or misleading information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - Engaging in fraudulent activities
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - Violating the privacy of other users
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              - Attempting to gain unauthorized access to the website's systems
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Users found in violation of these terms may be banned from using our website.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              3. Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Stady is not responsible for any damages or losses incurred as a result of using our website or booking sports grounds through our platform.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Users are solely responsible for their interactions with other users and the accuracy of the information provided on our website.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Stady does not guarantee the availability or quality of sports grounds listed on our platform. Users are advised to perform their own due diligence before making a booking.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Stady is not liable for any disputes or conflicts arising between owners and members.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              4. Governing Law
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              These terms and conditions shall be governed by and construed in accordance with the laws of Tunisia.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Any legal action or proceedings arising out of or in connection with these terms shall be brought exclusively in the courts of Tunisia.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              By using our website, you agree to submit to the jurisdiction of the courts of Tunisia.
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            Please contact us if you have any questions or concerns regarding these terms and conditions.
          </Typography>
        </Box>
      </Container>
      <AppFooter />
    </>
  );
};

export default AppTerms;
