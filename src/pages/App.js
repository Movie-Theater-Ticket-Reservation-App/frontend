import React, { useContext, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Grommet,
  Header,
  Box,
  Button,
  Text,
  TextInput,
  Drop,
} from "grommet";
import { Search as SearchIcon, Notification } from "grommet-icons";
import { deepMerge } from "grommet/utils";

import { AuthProvider, AuthContext } from "../context/AuthContext";
import { NotificationsProvider, NotificationsContext } from '../context/NotificationsContext';

import Landing from "./Landing";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import Tickets from "./Tickets";
import Payments from "./Payments";
import Searches from "./Search";
import Successful from "./Successful";
import SeatBooking from "./SeatBooking";
import MakePayment from "./MakePayment";
import ProcessRefund from "./ProcessRefund";
import NotFound from "./404";

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

const AppBar = ({ dark, setDark }) => {
  const [hoveredButton, setHoveredButton] = useState(null); // Track which button is hovered
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [showNotifications, setShowNotifications] = useState(false); // Track notification visibility
  const notificationButtonRef = useRef(); // Reference for the notification button
  const navigate = useNavigate(); // Hook for navigation
  const { userID, logout } = useContext(AuthContext); // Access userID and logout from AuthContext

  const { notifications } = useContext(NotificationsContext);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout(); // Clear the user session
    navigate("/"); // Redirect to the homepage
  };

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
        {/* Search Field */}
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Box
            direction="row"
            align="center"
            gap="small"
            background="white"
            round="small"
            pad="xsmall"
            style={{ height: "32px", paddingLeft: "8px" }}
          >
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              plain
              style={{
                fontSize: "14px",
                height: "24px",
                border: "none",
              }}
            />
            <Button
              icon={<SearchIcon />}
              type="submit"
              a11yTitle="Search"
              style={{
                width: "24px",
                height: "24px",
                padding: "0",
              }}
            />
          </Box>
        </form>

        {/* Notifications */}
        {userID && (
          <Box ref={notificationButtonRef}>
            <Button
              icon={<Notification />}
              onClick={() => setShowNotifications(!showNotifications)}
              a11yTitle="Notifications"
              style={{
                height: "42px",
                width: "42px",
                borderRadius: "50%",
                padding: "0",
                color: hoveredButton === "notifications" ? "lightblue" : "white",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredButton("notifications")}
              onMouseLeave={() => setHoveredButton(null)}
            />
            {showNotifications && notificationButtonRef.current && (
              <Drop
                align={{ top: "bottom", right: "right" }}
                target={notificationButtonRef.current}
                onClickOutside={() => setShowNotifications(false)}
                onEsc={() => setShowNotifications(false)}
              >
                <Box pad="small" background="light-1" width="medium">
                  <Text weight="bold" margin={{ bottom: "small" }}>
                    Notifications
                  </Text>
                  {notifications.length > 0 ? (
                    notifications
                      .slice(-4) // Get the last 5 notifications
                      .reverse() // Optional: Reverse to show the latest first
                      .map((notif) => (
                        <Box
                          key={notif.id}
                          pad="small"
                          margin={{ bottom: "xsmall" }}
                          background="light-2"
                          round="small"
                        >
                          <Text size="small">{notif.message}</Text>
                        </Box>
                      ))
                  ) : (
                    <Text size="small">No notifications</Text>
                  )}
                </Box>
              </Drop>
            )}
          </Box>
        )}

        {/* Refund Button */}
        <Button
          label="Refund"
          plain
          onClick={() => navigate("/refund")}
          style={{
            height: "42px",
            padding: "0 16px",
            borderRadius: "4px",
            color: hoveredButton === "refund" ? "lightblue" : "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onMouseEnter={() => setHoveredButton("refund")}
          onMouseLeave={() => setHoveredButton(null)}
        />

        {/* Conditionally Render Buttons */}
        {userID ? (
          <>
            <Button
              label="Profile"
              plain
              onClick={() => navigate("/profile")}
              style={{
                height: "42px",
                padding: "0 16px",
                borderRadius: "4px",
                color: hoveredButton === "profile" ? "lightblue" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredButton("profile")}
              onMouseLeave={() => setHoveredButton(null)}
            />
            <Button
              label="Logout"
              plain
              onClick={handleLogout}
              style={{
                height: "42px",
                padding: "0 16px",
                borderRadius: "4px",
                color: hoveredButton === "logout" ? "lightblue" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredButton("logout")}
              onMouseLeave={() => setHoveredButton(null)}
            />
          </>
        ) : (
          <Button
            label="Login"
            plain
            onClick={() => navigate("/login")}
            style={{
              height: "42px",
              padding: "0 16px",
              borderRadius: "4px",
              color: hoveredButton === "login" ? "lightblue" : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredButton("login")}
            onMouseLeave={() => setHoveredButton(null)}
          />
        )}
      </Box>
    </Header>
  );
};

function App() {
  const [dark, setDark] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Grommet theme={theme} full themeMode={dark ? "dark" : "light"}>
          <AuthContext.Consumer>
            {({ userID }) => (
              <NotificationsProvider userID={userID}>
                <AppBar dark={dark} setDark={setDark} />
                <Routes>
                  <Route path="/" element={<Landing dark={dark} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/seat-booking/:theatreId/:movieId/:showtime"
                    element={<SeatBooking />}
                  />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/makepayment" element={<MakePayment />} />
                  <Route path="/refund" element={<ProcessRefund />} />
                  <Route path="/search" element={<Searches />} />
                  <Route path="/successful" element={<Successful />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NotificationsProvider>
            )}
          </AuthContext.Consumer>
        </Grommet>
      </Router>
    </AuthProvider>
  );
}

export default App;