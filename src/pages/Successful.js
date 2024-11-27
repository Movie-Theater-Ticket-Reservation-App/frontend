import React from "react";
import { Box, Button, Page, PageHeader, Text } from "grommet";
import { Checkmark } from "grommet-icons";

const Successful = ({ ticketDetails }) => {
  
    // Mock details
    const details = ticketDetails || [
    {
      ticketID: "123456",
      movieName: "The Great Gatsby",
      theatre: "Cineplex VIP Cinemas University District",
      showtime: "4:30 PM, Nov 28, 2024",
      seat: "Row A, Seat 10",
    },
    {
      ticketID: "123457",
      movieName: "The Great Gatsby",
      theatre: "Cineplex VIP Cinemas University District",
      showtime: "4:30 PM, Nov 28, 2024",
      seat: "Row A, Seat 11",
    },
    
  ];

  return (
    <Page background="light-3" fill>
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

        <Box margin={{ bottom: "medium" }}>
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
        {details.map((ticket, index) => (
          <Box
            key={ticket.ticketID}
            pad={{ vertical: "small", horizontal: "medium" }}
            gap="small"
            background="light-2"
            round="small"
            margin={{ bottom: "small" }}
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
          <Button
            label="View Tickets"
            href="/tickets"
            primary
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
            }}
          />
          <Button
            label="Back to Home"
            href="/"
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