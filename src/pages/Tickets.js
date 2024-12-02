import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Page,
  PageHeader,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  ResponsiveContext,
} from "grommet";
import { AuthContext } from "../context/AuthContext";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const size = useContext(ResponsiveContext);
  const navigate = useNavigate();
  const { userID } = useContext(AuthContext);

  // Function to translate seat number into A1, B1, etc.
  const calculateSeatPosition = (seatNumber) => {
    const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const rowIndex = Math.floor((seatNumber - 1) / 10);
    const seatInRow = ((seatNumber - 1) % 10) + 1;
    return `${rows[rowIndex]}${seatInRow}`;
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch ticket history.");
        }
        const data = await response.json();
        const ticketHistory = data.ticketsHistory || []; // Updated to match API response
  
        // Fetch all theatres
        const theatresResponse = await fetch("http://localhost:8080/theatres/");
        const theatres = theatresResponse.ok ? await theatresResponse.json() : [];
  
        // Fetch showtimes for theatres and enrich tickets
        const enrichedTickets = await Promise.all(
          ticketHistory.map(async (ticket) => {
            let movieTitle = "Unknown Movie";
            let theatreName = "Unknown Theatre";
  
            // Match theatreID to fetch theatreName
            const matchingTheatre = theatres.find(
              (theatre) => theatre.theatreID === ticket.theatreID
            );
            if (matchingTheatre) {
              theatreName = matchingTheatre.theatreName;
            }
  
            // Fetch showtimes for the specific theatre
            const showtimesResponse = await fetch(
              `http://localhost:8080/theatres/${ticket.theatreID}/showtimes`
            );
            if (showtimesResponse.ok) {
              const showtimes = await showtimesResponse.json();
              const matchingShowtime = showtimes.find(
                (showtime) => showtime.showtimeID === ticket.showtimeID
              );
              if (matchingShowtime) {
                movieTitle = matchingShowtime.movieTitle || "Unknown Movie";
              }
            }
  
            return {
              ...ticket,
              movieTitle,
              theatreName,
              seatPosition: calculateSeatPosition(ticket.seatNumber),
            };
          })
        );
  
        setTickets(enrichedTickets);
      } catch (err) {
        console.error("Error fetching ticket history:", err);
        setError("Unable to fetch your tickets. Please try again later.");
      }
    };
  
    if (userID) {
      fetchTickets();
    } else {
      setError("You must be logged in to view your tickets.");
    }
  }, [userID]);

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
          {error ? (
            <Text color="status-critical">{error}</Text>
          ) : tickets.length > 0 ? (
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
                        <strong>{ticket.movieTitle || "N/A"}</strong>
                      </TableCell>
                      <TableCell>{ticket.date || "N/A"}</TableCell>
                      <TableCell>
                        {ticket.theatreName || "Location not available"}
                      </TableCell>
                      <TableCell>
                        <strong>{ticket.seatPosition || "N/A"}</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                align="start"
                direction="row"
                gap="medium"
                justify="left"
                margin={{ bottom: "medium", top: "medium", left: "small" }}
              >
                <Button
                  label="Back"
                  onClick={() => navigate(-1)}
                  primary={false}
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