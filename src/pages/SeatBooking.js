import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Text, Heading } from "grommet";

const rows = 6; // Number of rows in the seat map
const cols = 8; // Number of seats per row

// Example of unavailable seats
const unavailableSeats = ["A2", "A3", "D5", "E7", "E8"];

const SeatBookingPage = () => {
  const location = useLocation();
  const { theatre, movie, showtime } = location.state; // Access the passed state
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (row, col) => {
    const seat = `${String.fromCharCode(65 + row)}${col + 1}`; // Convert row to letter and add column number
    if (unavailableSeats.includes(seat)) return; // Prevent selecting unavailable seats
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <Box
      pad="large"
      align="center"
      gap="medium"
      style={{
        background: "#f9f9f9", // Light background
        borderRadius: "10px", // Rounded corners
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Subtle shadow
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
          Theatre: <span style={{ color: "#007bff" }}>{theatre.name}</span>
        </Text>
        <Text size="large" weight="bold">
          Movie: <span style={{ color: "#007bff" }}>{movie.title}</span>
        </Text>
        <Text size="medium" color="dark-5" margin={{ bottom: "medium" }}>
          Showtime: {showtime}
        </Text>
      </Box>

      {/* Seat Selection */}
      <Box direction="column" gap="small" align="center">
        {/* X-axis Labels */}
        <Box
          direction="row"
          gap="small"
          align="center"
          style={{
            paddingLeft: "30px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {Array(cols)
            .fill()
            .map((_, col) => (
              <Text
                key={col}
                size="medium"
                style={{ width: "30px", textAlign: "center", color: "#333" }}
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
                size="medium"
                style={{
                  width: "30px",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {String.fromCharCode(65 + row)}
              </Text>
              {Array(cols)
                .fill()
                .map((_, col) => {
                  const seat = `${String.fromCharCode(65 + row)}${col + 1}`; // Seat identifier
                  const isSelected = selectedSeats.includes(seat);
                  const isUnavailable = unavailableSeats.includes(seat); // Check if seat is unavailable
                  return (
                    <Button
                      key={seat}
                      plain
                      onClick={() => toggleSeat(row, col)}
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
                        transition: "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition
                        borderRadius: "4px", // Rounded corners for buttons
                        cursor: isUnavailable ? "not-allowed" : "pointer", // Change cursor for unavailable seats
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
            {selectedSeats.join(", ") || "None"}
          </span>
        </Text>
      </Box>

      {/* Confirm Booking */}
      <Button
        primary
        label="Confirm Booking"
        onClick={() => alert(`Booked seats: ${selectedSeats.join(", ")}`)}
        margin={{ top: "medium" }}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          background: "#007bff",
          color: "white",
          borderRadius: "5px",
        }}
      />
    </Box>
  );
};

export default SeatBookingPage;