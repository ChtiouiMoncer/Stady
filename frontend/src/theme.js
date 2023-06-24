import { createTheme } from "@mui/material";
import { blue, green, orange, yellow, red, indigo,grey,  amber, lightGreen } from '@mui/material/colors';
import { padding } from "@mui/system";


//export const theme = createTheme({
export const theme = (mode) => createTheme({
  typography: {
    fontFamily: "Montserrat",
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontStyle: "normal",
    h1: {
      fontWeight: 900,
      fontStyle: "normal",
      fontSize: 40,
      
    },
    h2: {
      fontWeight: 700,
      fontStyle: "normal",
    },
    h3: {
      fontWeight: 700,
      fontStyle: "normal",
    },
    h4: {
      fontWeight: 700,
      fontStyle: "normal",
    },
    h5: {
      fontWeight:600,
      fontStyle: "normal",
      fontSize:15,
      lineHeight: "33px"
    },
    h6: {
     
      fontWeight: "fontWeightBold",
      fontStyle: "normal",
      fontSize:25,

      //color: blue[500]
      //backgroundColor: green[200],
      //padding: 6
    },
    subtitle1: {
      fontWeight: 500,
      fontStyle: "normal",
    },
    subtitle2: {
      fontWeight: 400,
      fontStyle: "normal",
    },
    body1: {
      fontSize: 15,
      fontWeight: 400,
      fontStyle: "normal",
    },
    body2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      fontStyle: "normal",
    },
    caption: {
      fontWeight: 400,
      fontStyle: "normal",
    },
    overline: {
      fontWeight: 400,
      fontStyle: "normal",
    },
  },
  palette: {
    mode: mode,
    primary: {
      main: mode === "light" ? "#007B65"  : grey[50], // blue or black
      light: mode === "light" ? blue[500] : "#000000", // blue or black
      dark: mode === "light" ? blue[800] : grey[300], // dark blue or new dark color
  
    },
    secondary: {
      main: mode === "light" ? orange[300] : grey[50], // orange or black
      light: mode === "light" ? orange[500] : yellow[700], // light orange
      dark: mode === "light" ? orange[800] : yellow[600], // dark orange or new dark color
    },
    success: {
      main: mode === "light" ? "#007B65" : grey[50], // green or black
      light: mode === "light" ? green[500] : grey[50], // light green
      dark: mode === "light" ? green[800] : grey[50], // dark green or new dark color
    },
    warning: {
      main: mode === "light" ? yellow[300] : grey[50], // yellow or black
      light: mode === "light" ? yellow[500] : amber[700], // light yellow
      dark: mode === "light" ? yellow[800] : amber[600], // dark yellow or new dark color
    },
    error: {
      main: mode === "light" ? red[300] : grey[50], // red or black
      light: mode === "light" ? red[500] : red[700], // light red
      dark: mode === "light" ? red[800] : red[300], // dark red or new dark color
    },
    info: {
      main: mode === "light" ? indigo[300] : grey[50], // dark blue or black
      light: mode === "light" ? indigo[500] : blue[700], // light blue
      dark: mode === "light" ? indigo[800] : blue[300], // dark blue or new dark color
    },
    white: {
      main: mode === "light" ? grey[50] : grey[900], // white or black
      light: mode === "light" ? grey[100] : grey[200], // light gray
      dark: mode === "light" ? grey[200] : grey[600], // dark gray
    },
    black: {
      main: mode === "light" ? grey[900] : grey[50], // black or white
      light: mode === "light" ? grey[700] : grey[300], // light gray
      dark: mode === "light" ? "#000000" : grey[400], // dark gray
    },
    grey: {
      main: mode === "light" ? "#7C8DB0" : grey[50], // black or white
      light: mode === "light" ? grey[600] : grey[50], // black or white
      dark: mode === "light" ? grey[700] : grey[50], // black or white

      

    },
    green: {
      main: mode === "light" ? "#007B65" : grey[50], // black or white
      light: mode === "light" ? "#006653" : grey[50], // black or white

    },
    background: {
      paper: mode === "light" ? grey[50] : "#007B65", // white or dark gray
      default: mode === "light" ? grey[50] : "#007B65", // light gray or black
    },
    text: {
      primary: mode === "light" ? "#000000" : "#ffffff", // black or white
      //secondary: mode === "light" ? grey[600] : grey[400], // dark gray or light gray
      //disabled: mode === "light" ? grey[400] : grey[600], // light gray or dark gray
      //hint: mode === "light" ? grey[400] : grey[600], // light gray or dark gray
    },
  },
  
 
});
