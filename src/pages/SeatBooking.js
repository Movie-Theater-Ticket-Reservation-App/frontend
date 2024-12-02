import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Text, Heading } from "grommet";

const SeatBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theatre, movie, showtime } = location.state || {}; // Access the passed state

  const [seatsData, setSeatsData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalSeats, setTotalSeats] = useState(0);
  const [maxAllowedSeats, setMaxAllowedSeats] = useState(null);

  // Fetch seats data and calculate the total seats
  useEffect(() => {
    const fetchSeats = async () => {
      if (!showtime || !showtime.showtimeID) return; // Ensure showtimeID is available
      try {
        const response = await fetch(
          `http://localhost:8080/showtimes/seats/${showtime.showtimeID}`
        );
        const data = await response.json();
        setSeatsData(data);
        setTotalSeats(data.length); // Total seats available in the showtime
      } catch (error) {
        console.error("Error fetching seats data:", error);
      }
    };

    fetchSeats();
  }, [showtime]);

  // Fetch movie data and determine if seat limit applies
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/movies/");
        const movies = await response.json();

        const currentMovie = movies.find((m) => m.movieID === movie.movieID);
        if (currentMovie) {
          const releaseDate = new Date(currentMovie.releaseDate);
          const today = new Date();
          if (releaseDate > today) {
            // Count the already booked or reserved seats
            const alreadyBookedSeats = seatsData.filter(
              (seat) => seat.status !== "available"
            ).length;

            // Calculate maximum allowed seats
            const maxSeats = Math.ceil(totalSeats * 0.1) - alreadyBookedSeats;

            setMaxAllowedSeats(maxSeats > 0 ? maxSeats : 0); // Ensure the limit is not negative
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (movie && movie.movieID && totalSeats > 0) {
      fetchMovieDetails();
    }
  }, [movie, totalSeats, seatsData]);

  const toggleSeat = (seatNumber) => {
    const seat = seatsData.find((s) => s.seatNumber === seatNumber);
    if (!seat || seat.status !== "available") return; // Prevent selecting unavailable seats

    if (
      maxAllowedSeats &&
      selectedSeats.length >= maxAllowedSeats &&
      !selectedSeats.includes(seatNumber)
    ) {
      alert(
        `Maximum seat selection limit of 10% has been reached for this movie.`
      );
      return;
    }

    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatNumber)) {
        return prevSelectedSeats.filter((num) => num !== seatNumber);
      } else {
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  // Conditional rendering inside the return statement
  if (!theatre || !movie || !showtime) {
    return (
      <Box align="center" pad="large">
        <Text color="status-critical" size="large">
          Error: Missing booking details.
        </Text>
      </Box>
    );
  }

  // Arrange seats into rows of 10 seats each dynamically
  const seatsPerRow = 10;

  // Sort seatsData by seatID to ensure consistent order
  const sortedSeats = [...seatsData].sort((a, b) => a.seatID - b.seatID);

  // Group seats into rows and create a mapping for display
  const rows = [];
  const seatDisplayMap = {}; // Map seatNumber to { rowLabel, displaySeatNumber }
  let currentRow = [];
  let rowIndex = 0;

  sortedSeats.forEach((seat, index) => {
    currentRow.push(seat);
    if ((index + 1) % seatsPerRow === 0 || index === sortedSeats.length - 1) {
      const rowLabel = String.fromCharCode(65 + rowIndex);
      currentRow.forEach((seat, seatIndex) => {
        const displaySeatNumber = seatIndex + 1;
        seatDisplayMap[seat.seatNumber] = { rowLabel, displaySeatNumber };
      });
      rows.push({ rowLabel, seats: currentRow });
      currentRow = [];
      rowIndex++;
    }
  });

  return (
    <Box
      pad="large"
      align="center"
      gap="medium"
      style={{
        background: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        width: "90%",
        margin: "60px auto",
      }}
    >
      {/* Display Movie and Showtime Information */}
      <Box margin="small" align="center">
        <Heading level={2} margin="none">
          Select Your Seats
        </Heading>
        <Text size="large" weight="bold" margin={{ top: "small" }}>
          Theatre:{" "}
          <span style={{ color: "#007bff" }}>{theatre.theatreName}</span>
        </Text>
        <Text size="large" weight="bold">
          Movie: <span style={{ color: "#007bff" }}>{movie.movieTitle}</span>
        </Text>
        <Text size="medium" color="dark-5" margin={{ bottom: "medium" }}>
          Showtime: {showtime.date} at {showtime.time}
        </Text>
      </Box>

      {/* Seat Selection */}
      <Box direction="column" gap="small" align="center">
        {rows.map((row) => (
          <Box key={row.rowLabel} direction="row" gap="small" align="center">
            {/* Row Label */}
            <Text
              size="medium"
              style={{
                width: "30px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {row.rowLabel}
            </Text>
            {row.seats.map((seat, seatIndex) => {
              const displaySeatNumber = seatIndex + 1;
              const seatNumber = seat.seatNumber;
              const seatKey = `${row.rowLabel}${displaySeatNumber}`; // Seat identifier, e.g., "A1"
              const isSelected = selectedSeats.includes(seatNumber);
              const isUnavailable = seat.status !== "available";

              return (
                <Button
                  key={seatNumber}
                  plain
                  onClick={() => toggleSeat(seatNumber)}
                  style={{
                    width: "30px",
                    height: "30px",
                    background: isUnavailable
                      ? "#ddd" // Grey for unavailable seats
                      : isSelected
                      ? "#007bff" // Blue for selected seats
                      : "#fff", // White for unselected seats
                    border: "2px solid",
                    borderColor: isUnavailable
                      ? "#ddd"
                      : isSelected
                      ? "#007bff"
                      : "#ccc", // Match border color
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease",
                    borderRadius: "4px",
                    cursor: isUnavailable ? "not-allowed" : "pointer",
                  }}
                  disabled={isUnavailable} // Disable button for unavailable seats
                />
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Selected Seats */}
      <Box
        pad="medium"
        style={{
          borderTop: "1px solid #ddd",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Text size="medium">
          Selected Seats:{" "}
          <span style={{ fontWeight: "bold", color: "#007bff" }}>
            {selectedSeats
              .map((seatNumber) => {
                const { rowLabel, displaySeatNumber } = seatDisplayMap[seatNumber];
                return `${rowLabel}${displaySeatNumber}`;
              })
              .join(", ") || "None"}
          </span>
        </Text>
      </Box>

      {/* Proceed to Payment */}
      <Button
        primary
        label="Proceed"
        onClick={() =>
          navigate("/makepayment", {
            state: {
              theatre,
              movie,
              showtime,
              selectedSeats, // Now an array of seatNumbers
            },
          })
        }
        margin={{ top: "medium" }}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          background: "#007bff",
          color: "white",
          borderRadius: "5px",
        }}
        disabled={selectedSeats.length === 0}
      />
    </Box>
  );
};

export default SeatBookingPage;