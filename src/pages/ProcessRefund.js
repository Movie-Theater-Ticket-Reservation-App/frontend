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
  });
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [refundEligible, setRefundEligible] = useState(false);
  const [lookupMode, setLookupMode] = useState(true);

  // Mock data for tickets
  const tickets = [
    {
      ticketID: "001",
      movieTitle: "The Great Gatsby",
      showtime: "2024-12-28T16:30:00Z",
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
      status: "Valid", // Ticket is valid
    },
  ];

  // Handle ticket ID input and validation
  const handleTicketIDChange = (event) => {
    const enteredTicketID = event.target.value;
    setFormData({ ...formData, ticketID: enteredTicketID });
    setSelectedTicket(null); // Clear selected ticket on change
    setError(""); // Clear any error
    setLookupMode(true); // Reset to lookup mode
  };

  const handleLookUp = () => {
    const matchingTicket = tickets.find((ticket) => ticket.ticketID === formData.ticketID);
  
    if (matchingTicket) {
      if (matchingTicket.status === "Cancelled") {
        setError("Refund is not allowed. This ticket has already been cancelled.");
        setSelectedTicket(null);
      } else {
        setSelectedTicket(matchingTicket);
  
        // Check refund eligibility
        const eligible = isRefundEligible(matchingTicket.showtime);
        if (!eligible) {
          setError("Refunds can only be requested at least 72 hours before the showtime.");
          setRefundEligible(false);
        } else {
          setRefundEligible(true);
          setError(""); // Clear any error
          setLookupMode(false); // Switch to "Submit Refund" mode
        }
      }
    } else {
      setError("Invalid Ticket ID");
      setSelectedTicket(null);
    }
  };

  const handleSubmitRefund = () => {
    if (!selectedTicket || !refundEligible) {
      setError("Refund is not eligible.");
      return;
    }

    const adminFee = selectedTicket.isRegisteredUser ? 0 : selectedTicket.price * 0.15;
    const refundAmount = selectedTicket.price - adminFee;

    alert(`Refund of $${refundAmount.toFixed(2)} processed successfully!`);
    navigate("/");
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
          <Form>
            <FormField label="Ticket ID" name="ticketID" required>
              <TextInput
                name="ticketID"
                placeholder="Enter your Ticket ID"
                value={formData.ticketID}
                onChange={handleTicketIDChange}
              />
            </FormField>

            {selectedTicket && (
              <Box margin={{ top: "medium" }}>
                <Text>
                  <strong>Movie Title:</strong> {selectedTicket.movieTitle}
                </Text>
                <Text>
                  <strong>Showtime:</strong> {new Date(selectedTicket.showtime).toLocaleString()}
                </Text>
                <Text>
                  <strong>Purchase Date:</strong>{" "}
                  {new Date(selectedTicket.purchaseDate).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Ticket Price:</strong> ${selectedTicket.price.toFixed(2)}
                </Text>
                <Text>
                  <strong>Refund Amount:</strong> $
                  {refundEligible
                    ? (
                        selectedTicket.price -
                        (selectedTicket.isRegisteredUser ? 0 : selectedTicket.price * 0.15)
                      ).toFixed(2)
                    : "N/A"}
                </Text>
              </Box>
            )}

<Box
  direction="row"
  gap="medium"
  justify="center"
  margin={{ top: "medium" }}
>
  {lookupMode ? (
    <Button
      type="button"
      label="Look Up"
      primary
      onClick={handleLookUp}
    />
  ) : (
    <Button
      type="button"
      label="Submit Refund"
      primary
      onClick={handleSubmitRefund}
    />
  )}
  <Button label="Cancel" href="/" />
</Box>
          </Form>
        </Box>
      </Box>
    </Page>
  );
};

export default ProcessRefund;