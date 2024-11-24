import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Button, Text, Heading } from "grommet";

const rows = 5; // Number of rows in the seat map
const cols = 8; // Number of seats per row

const SeatBookingPage = () => {
  const { theatreId, movieId, showtime } = useParams();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (row, col) => {
    const seat = `${String.fromCharCode(65 + row)}${col + 1}`; // Convert row to letter and add column number
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <Box pad="medium" align="center">
      {/* Display Movie and Showtime Information */}
      <Heading level={2} margin="none">
        Select Your Seats
      </Heading>
      <Text margin={{ bottom: "medium" }}>Showtime: {showtime}</Text>

      {/* Seat Selection */}
      <Box direction="column" gap="small">
        {/* X-axis Labels */}
        <Box direction="row" gap="small" align="center" pad={{ left: "30px" }}>
          <Text size="small" color="dark-5"></Text>
          {Array(cols)
            .fill()
            .map((_, col) => (
              <Text
                key={col}
                size="small"
                weight="bold"
                style={{ width: "30px", textAlign: "center" }}
              >
                {col + 1}
              </Text>
            ))}
        </Box>

        {Array(rows)
          .fill()
          .map((_, row) => (
            <Box key={row} direction="row" gap="small" align="center">
              {/* Y-axis Labels */}
              <Text
                size="small"
                weight="bold"
                style={{ width: "30px", textAlign: "center" }}
              >
                {String.fromCharCode(65 + row)} {/* Convert row index to letters */}
              </Text>
              {Array(cols)
                .fill()
                .map((_, col) => {
                  const seat = `${String.fromCharCode(65 + row)}${col + 1}`; // Seat identifier
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <Button
                      key={seat}
                      plain
                      onClick={() => toggleSeat(row, col)}
                      style={{
                        width: "30px",
                        height: "30px",
                        background: isSelected ? "#007bff" : "#fff", // Blue for selected, white for deselected
                        border: "1px solid",
                        borderColor: isSelected ? "#007bff" : "#ccc", // Blue border for selected
                        transition: "background-color 0.3s ease", // Smooth transition
                      }}
                    />
                  );
                })}
            </Box>
          ))}
      </Box>

      {/* Selected Seats */}
      <Text margin={{ top: "medium" }}>
        Selected Seats: {selectedSeats.join(", ") || "None"}
      </Text>

      {/* Confirm Booking */}
      <Button
        primary
        label="Confirm Booking"
        onClick={() => alert(`Booked seats: ${selectedSeats.join(", ")}`)}
        margin={{ top: "medium" }}
      />
    </Box>
  );
};

export default SeatBookingPage;