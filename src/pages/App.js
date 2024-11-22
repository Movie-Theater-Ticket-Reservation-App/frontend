import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Grommet, Header, Box, Button, Text } from "grommet";
import { Moon, Sun } from "grommet-icons";
import { deepMerge } from "grommet/utils";

import Landing from "./Landing"; 
import Login from "./Login"; 
import Profile from "./Profile";
import Register from "./Register";
import Tickets from "./Tickets";
import Payments from "./Payments"; 
import NotFound from "./404";


// Grommet theme customization
const theme = deepMerge({
  global: {
    colors: {
      brand: "#228BE6",
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
});

// Central AppBar
const AppBar = ({ dark, setDark }) => {
  const [hoveredButton, setHoveredButton] = useState(null); // Track which button is hovered

  return (
    <Header
      background="brand"
      pad={{ left: "medium", right: "small", vertical: "small" }}
      elevation="medium"
    >
      <Text size="large" color="white">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          AcmePlex
        </Link>
      </Text>
      <Box direction="row" gap="small" align="center">
        
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            label="Login"
            plain
            style={{
              height: "42px", 
              padding: "0", 
              borderRadius: "4px", 
              color: hoveredButton === "login" ? "lightblue" : "white", // Hover color effect
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("login")}
            onMouseLeave={() => setHoveredButton(null)}
          />
        </Link>
        
        <Link to="/profile" style={{ textDecoration: "none" }}>
          <Button
            label="Profile"
            plain
            style={{
              height: "42px", 
              padding: "0 16px", 
              borderRadius: "4px",
              color: hoveredButton === "profile" ? "lightblue" : "white", // Hover color effect
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("profile")}
            onMouseLeave={() => setHoveredButton(null)}
          />
        </Link>
        {/* Light/Dark Mode Button */}
        <Button
          icon={dark ? <Moon /> : <Sun />}
          onClick={() => setDark(!dark)}
          a11yTitle={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            height: "42px", // Same height as the Login and Profile buttons
            width: "42px", // Make it a square button
            borderRadius: "50%", // Keep it circular
            padding: "0", // Remove padding for a cleaner look
            color: hoveredButton === "theme" ? "lightblue" : "white", // Hover color effect
            cursor: "pointer",
          }}
          onMouseEnter={() => setHoveredButton("theme")}
          onMouseLeave={() => setHoveredButton(null)}
          tip={{
            content: (
              <Box
                pad="small"
                round="small"
                background={dark ? "dark-1" : "light-3"}
              >
                {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Box>
            ),
          }}
        />
      </Box>
    </Header>
  );
};

function App() {
  const [dark, setDark] = useState(false);

  return (
    <Router>
      <Grommet theme={theme} full themeMode={dark ? "dark" : "light"}>
        <AppBar dark={dark} setDark={setDark} />
        <Routes>
          <Route path="/" element={<Landing dark={dark} />} />

          {/* User routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/payments" element={<Payments />} />


          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Grommet>
    </Router>
  );
}

export default App;