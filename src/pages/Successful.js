import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Page, PageHeader, Text, Layer } from "grommet";
import { Checkmark, Close } from "grommet-icons";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Successful = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticketDetails } = location.state || {};

  // Access userID from AuthContext
  const { userID } = useContext(AuthContext);
  const isLoggedIn = userID && userID !== "0";

  // State for notification
  const [notification, setNotification] = useState(null);

  // Set notification after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification("An email of your ticket and receipt has been sent.");
    }, 2000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // If ticketDetails is not provided, show a message
  if (!ticketDetails || ticketDetails.length === 0) {
    return (
      <Box align="center" pad="large">
        <Text color="status-critical" size="large">
          No ticket details available.
        </Text>
      </Box>
    );
  }

  return (
    <Page background="light-3" fill>
      {/* Display notification if it exists */}
      {notification && (
        <Layer
          position="top"
          modal={false}
          margin={{ vertical: "medium", horizontal: "small" }}
          onEsc={() => setNotification(null)}
          responsive={false}
          plain
        >
          <Box
            align="center"
            direction="row"
            gap="small"
            justify="between"
            round="small"
            elevation="medium"
            pad={{ vertical: "small", horizontal: "medium" }}
            background="status-ok"
          >
            <Text>{notification}</Text>
            <Button icon={<Close />} onClick={() => setNotification(null)} plain />
          </Box>
        </Layer>
      )}

      <Box
        fill
        align="center"
        justify="center"
        pad={{ horizontal: "medium", vertical: "large" }}
        background="white"
        round="small"
        elevation="small"
        width="large"
      >
        <Box align="center" margin={{ bottom: "medium" }}>
          <Checkmark color="status-ok" size="large" />
          <PageHeader title="Payment Successful!" />
        </Box>

        <Box margin={{ bottom: "medium" }} align="center">
          <Text size="large" weight="bold">
            Thank you for your reservation!
          </Text>
          <Text size="large" weight="bold">
            Your booking and receipt will be sent to your email.
          </Text>
          <Text size="medium" color="dark-6">
            Here are your ticket details:
          </Text>
        </Box>

        {/* Ticket Details */}
        {ticketDetails.map((ticket, index) => (
          <Box
            key={ticket.ticketID}
            pad={{ vertical: "small", horizontal: "medium" }}
            gap="small"
            background="light-2"
            round="small"
            margin={{ bottom: "small" }}
            width="100%"
          >
            <Text>
              <strong>Ticket {index + 1}</strong>
            </Text>
            <Text>
              <strong>Ticket ID:</strong> {ticket.ticketID}
            </Text>
            <Text>
              <strong>Movie Name:</strong> {ticket.movieName}
            </Text>
            <Text>
              <strong>Theatre:</strong> {ticket.theatre}
            </Text>
            <Text>
              <strong>Showtime:</strong> {ticket.showtime}
            </Text>
            <Text>
              <strong>Seat:</strong> {ticket.seat}
            </Text>
          </Box>
        ))}

        {/* Actions */}
        <Box
          direction="row"
          gap="medium"
          justify="center"
          margin={{ top: "medium" }}
        >
          {/* Conditionally render the "View Tickets" button */}
          {isLoggedIn && (
            <Button
              label="View Tickets"
              onClick={() => navigate("/tickets")}
              primary
              style={{
                borderRadius: "25px",
                padding: "10px 20px",
              }}
            />
          )}
          <Button
            label="Back to Home"
            onClick={() => navigate("/")}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
            }}
          />
        </Box>
      </Box>
    </Page>
  );
};

export default Successful;