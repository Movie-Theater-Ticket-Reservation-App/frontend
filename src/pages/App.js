import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Grommet, Header, Box, Button, Text } from "grommet";
import { Moon, Sun } from "grommet-icons";
import { deepMerge } from "grommet/utils";

import Landing from "./Landing"; 
import Login from "./Login"; 

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
const AppBar = ({ dark, setDark }) => (
  <Header
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
  >
    <Text size="large" color="white">
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        My App
      </Link>
    </Text>
    <Box direction="row" gap="medium">
      <Link to="/login" style={{ textDecoration: "none" }}>
        <Button label="Login" />
      </Link>
      
      <Button
        icon={dark ? <Moon /> : <Sun />}
        onClick={() => setDark(!dark)}
        a11yTitle={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
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

function App() {
  const [dark, setDark] = useState(false);

  return (
    <Router>
      <Grommet theme={theme} full themeMode={dark ? "dark" : "light"}>
        <AppBar dark={dark} setDark={setDark} />
        <Routes>
          <Route path="/" element={<Landing dark={dark} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Grommet>
    </Router>
  );
}

export default App;