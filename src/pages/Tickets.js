import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  Box,
  Button,
  Page,
  PageContent,
  PageHeader,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  ResponsiveContext,
} from "grommet";

const Tickets = () => {
  // Mock ticket data (replace this with API call if necessary)
  const [tickets] = useState([
    {
      ticketID: "001",
      movieTitle: "The Great Gatsby",
      showtime: "4:30 PM, Nov 20, 2024",
      seatNumber: "A10",
      location: "Cineplex VIP Cinemas University District",
    },
    {
      ticketID: "002",
      movieTitle: "Wall-E",
      showtime: "2:00 PM, Nov 18, 2024",
      seatNumber: "B12",
      location: "Cineplex Odeon Westhills Cinemas",
    },
    {
      ticketID: "003",
      movieTitle: "Cars",
      showtime: "7:30 PM, Nov 15, 2024",
      seatNumber: "C5",
      location: "Cineplex VIP Cinemas University District",
    },
  ]);

  const size = useContext(ResponsiveContext); // Detect screen size
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Page background="light-3" fill>
      <Box
        fill
        align="center"
        justify={size === "small" ? "center" : "start"} 
        pad={{ top: size === "small" ? "none" : "medium", horizontal: "medium" }}
      >
        <Box
          width={size === "small" ? "95%" : "70%"} 
          pad="medium"
          background="white"
          round="small"
          elevation="small"
          overflow="auto" 
        >
          <PageHeader title="Your Tickets" />
          {tickets.length > 0 ? (
            <Box overflow="auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell scope="col" border="bottom">
                      Movie Title
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Showtime
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Location
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Seat
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.ticketID}>
                      <TableCell scope="row">
                        <strong>{ticket.movieTitle}</strong>
                      </TableCell>
                      <TableCell>{ticket.showtime}</TableCell>
                      <TableCell>{ticket.location}</TableCell>
                      <TableCell>
                        <strong>{ticket.seatNumber}</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box align="start" margin={{ bottom: "medium", top: "medium", left: "small" }}>
                <Button
                  label="Back"
                  onClick={() => navigate(-1)} 
                  size="small" 
                  primary 
                />
              </Box>
            </Box>
          ) : (
            <Text>No tickets found.</Text>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default Tickets;