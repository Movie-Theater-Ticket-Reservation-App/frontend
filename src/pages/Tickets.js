import React, { useState } from "react";
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

  return (
    <Page background="light-3" fill>
      <PageContent>
        <PageHeader title="Your Tickets" />
        <Box pad="medium" background="white" round="small" elevation="small">
          {tickets.length > 0 ? (
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
                    Seat Number
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.ticketID}>
                    <TableCell scope="row"> <strong>{ticket.movieTitle} </strong></TableCell>
                    <TableCell>{ticket.showtime}</TableCell>
                    <TableCell>{ticket.location}</TableCell>
                    <TableCell><strong>{ticket.seatNumber}</strong></TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Text>No tickets found.</Text>
          )}
        </Box>
      </PageContent>
    </Page>
  );
};

export default Tickets;