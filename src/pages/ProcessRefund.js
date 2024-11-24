import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageHeader,
  Text,
  TextInput,
  ResponsiveContext,
} from "grommet";

const ProcessRefund = () => {
  const size = useContext(ResponsiveContext); // Detect screen size
  const navigate = useNavigate(); // For redirection

  // Form data and error state
  const [formData, setFormData] = useState({
    ticketID: "",
    refundReason: "",
  });
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock data for tickets
  const tickets = [
    {
      ticketID: "001",
      movieTitle: "The Great Gatsby",
      showtime: "2024-11-28T16:30:00Z",
      price: 19.0,
      purchaseDate: "2024-11-15T00:00:00Z",
      isRegisteredUser: false,
      status: "Valid", // Ticket is valid
    },
    {
      ticketID: "002",
      movieTitle: "Wall-E",
      showtime: "2024-11-25T14:00:00Z",
      price: 15.0,
      purchaseDate: "2024-11-12T00:00:00Z",
      isRegisteredUser: true,
      status: "Cancelled", // Ticket has been cancelled
    },
    {
        ticketID: "003",
        movieTitle: "Wall-E",
        showtime: "2024-11-25T14:00:00Z",
        price: 15.0,
        purchaseDate: "2024-11-12T00:00:00Z",
        isRegisteredUser: true,
        status: "Valid", // Ticket has been cancelled
      },
  ];

  // Handle ticket ID input and validation
  const handleTicketIDChange = (event) => {
    const enteredTicketID = event.target.value;
    setFormData({ ...formData, ticketID: enteredTicketID });

    // Find matching ticket
    const matchingTicket = tickets.find((ticket) => ticket.ticketID === enteredTicketID);
    if (matchingTicket) {
      if (matchingTicket.status === "Cancelled") {
        setError("Refund is not allowed. This ticket has already been cancelled.");
        setSelectedTicket(null); // Clear the selected ticket
      } else {
        setSelectedTicket(matchingTicket);
        setError(""); // Clear any previous error
      }
    } else {
      setSelectedTicket(null);
      setError("Invalid Ticket ID");
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.ticketID || !formData.refundReason || !selectedTicket) {
      setError("Please fill in all fields");
      return;
    }
    if (!isRefundEligible(selectedTicket.showtime)) {
      setError("Refunds can only be requested at least 72 hours before the showtime.");
      return;
    }

    const adminFee = selectedTicket.isRegisteredUser ? 0 : selectedTicket.price * 0.15;
    const refundAmount = selectedTicket.price - adminFee;

    setError("");
    alert(`Refund of $${refundAmount.toFixed(2)} processed successfully!`);
    navigate("/payments");
  };

  // 72-Hour Cancellation Check
  const isRefundEligible = (showtime) => {
    const currentTime = new Date();
    const showtimeDate = new Date(showtime);
    const diffInHours = (showtimeDate - currentTime) / (1000 * 60 * 60); // Conversion
    return diffInHours >= 72; // Eligible if 72 hours or more remain
  };

  return (
    <Page background="light-3" fill>
      <Box
        fill
        align="center"
        justify={size === "small" ? "center" : "start"}
        pad={{ top: size === "small" ? "3/5" : "medium", horizontal: "medium" }}
      >
        <Box
          width={size === "small" ? "90%" : "40%"}
          pad="medium"
          background="white"
          elevation="small"
          round="small"
        >
          <PageHeader title="Refund Request" alignSelf="start" />
          {error && (
            <Text color="status-critical" margin={{ bottom: "small" }}>
              {error}
            </Text>
          )}
          <Form onSubmit={handleSubmit}>
            <FormField label="Ticket ID" name="ticketID" required>
              <TextInput
                name="ticketID"
                placeholder="Enter your Ticket ID"
                value={formData.ticketID}
                onChange={handleTicketIDChange}
              />
            </FormField>
            <FormField label="Reason for Refund" name="refundReason" required>
              <TextInput
                name="refundReason"
                placeholder="Briefly explain the reason"
                value={formData.refundReason}
                onChange={(event) =>
                  setFormData({ ...formData, refundReason: event.target.value })
                }
              />
            </FormField>

            {/* Ticket Details */}
            {selectedTicket && (
              <Box margin={{ top: "medium" }}>
                <Text>
                  <strong>Movie Title:</strong> {selectedTicket.movieTitle}
                </Text>
                <Text>
                  <strong>Showtime:</strong> {new Date(selectedTicket.showtime).toLocaleString()}
                </Text>
                <Text>
                  <strong>Purchase Date:</strong> {new Date(selectedTicket.purchaseDate).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Ticket Price:</strong> ${selectedTicket.price.toFixed(2)}
                </Text>
                {!selectedTicket.isRegisteredUser && (
                  <Text>
                    <strong>Admin Fee (15%):</strong> -${(selectedTicket.price * 0.15).toFixed(2)}
                  </Text>
                )}
                <Text>
                  <strong>Refund Amount:</strong> $
                  {(selectedTicket.price - (selectedTicket.isRegisteredUser ? 0 : selectedTicket.price * 0.15)).toFixed(
                    2
                  )}
                </Text>
              </Box>
            )}

            <Box
              direction="row"
              gap="medium"
              justify="center"
              margin={{ top: "medium" }}
            >
              <Button type="submit" label="Submit Refund" primary />
              <Button label="Cancel" href="/" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Page>
  );
};

export default ProcessRefund;