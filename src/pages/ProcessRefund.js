import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationsContext } from '../context/NotificationsContext';

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
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  const [ticketDetails, setTicketDetails] = useState(null);
  
  const { fetchNotifications } = useContext(NotificationsContext);


  // Handle ticket ID input and validation
  const handleTicketIDChange = (event) => {
    const enteredTicketID = event.target.value;
    setFormData({ ...formData, ticketID: enteredTicketID });
    setSelectedTicket(null); // Clear selected ticket on change
    setError(""); // Clear any error
    setLookupMode(true); // Reset to lookup mode
  };

  const handleLookUp = async () => {
    try {
      // Fetch ticket details
      const ticketResponse = await fetch(`http://localhost:8080/tickets/${formData.ticketID}`);
      if (!ticketResponse.ok) {
        setError("Invalid Ticket ID");
        setSelectedTicket(null);
        return;
      }
      const ticketData = await ticketResponse.json();

      // Check if ticket is already cancelled
      if (ticketData.status.toLowerCase() === "cancelled") {
        setError("Refund is not allowed. This ticket has already been cancelled.");
        setSelectedTicket(null);
        return;
      }

      // Extract necessary data from ticket
      const { showtimeID, theatreID, movieID, userID, date: ticketDateTimeString, seatNumber } = ticketData;

      // Correctly parse the showtime date and time from ticketData.date
      const showtimeDateTime = parseTicketDateTime(ticketDateTimeString);

      // Check if showtimeDateTime is valid
      if (isNaN(showtimeDateTime.getTime())) {
        setError("Invalid showtime date or time in ticket data.");
        setSelectedTicket(null);
        return;
      }

      // Check refund eligibility (72 hours before showtime)
      const currentTime = new Date();
      const diffInHours = (showtimeDateTime - currentTime) / (1000 * 60 * 60); // Conversion

      // Debugging outputs
      console.log("Showtime DateTime:", showtimeDateTime.toString());
      console.log("Current Time:", currentTime.toString());
      console.log("Difference in Hours:", diffInHours);

      if (diffInHours < 72) {
        setError("Refunds can only be requested at least 72 hours before the showtime.");
        setRefundEligible(false);
        setSelectedTicket(null);
        return;
      }

      // Fetch movie details to get movie title
      const movieResponse = await fetch(`http://localhost:8080/movies/${movieID}`);
      if (!movieResponse.ok) {
        setError("Error fetching movie details.");
        setSelectedTicket(null);
        return;
      }
      const movieData = await movieResponse.json();
      const movieTitle = movieData.movieTitle;

      // Check if user is registered or guest
      let isGuest = false;
      try {
        const userResponse = await fetch(`http://localhost:8080/users/${userID}`);
        if (!userResponse.ok) {
          isGuest = true;
        } else {
          // To handle possible error 500 even with ok response
          const userData = await userResponse.json();
          if (!userData || !userData.userID) {
            isGuest = true;
          }
        }
      } catch (error) {
        isGuest = true;
      }
      setIsGuestUser(isGuest);

      // Fetch ticket price if available (assumed from payment or fixed price)
      const ticketPrice = await getTicketPrice(ticketData.paymentID);
      if (ticketPrice === null) {
        setError("Error fetching ticket price.");
        setSelectedTicket(null);
        return;
      }

      // Map seat numbers to seat labels (e.g., A1, B1)
      const seatLabel = mapSeatNumberToLabel(seatNumber);

      // Calculate refund amount
      let adminFeeAmount = 0;
      if (isGuest) {
        adminFeeAmount = ticketPrice * 0.15;
      }
      const refundAmt = ticketPrice - adminFeeAmount;
      setRefundAmount(refundAmt);
      setAdminFee(adminFeeAmount);

      // Set selected ticket and ticket details for display
      setSelectedTicket(ticketData);
      setTicketDetails({
        movieTitle: movieTitle,
        showtime: showtimeDateTime.toLocaleString(),
        ticketPrice: ticketPrice,
        seat: seatLabel,
      });
      setRefundEligible(true);
      setError(""); // Clear any error
      setLookupMode(false); // Switch to "Submit Refund" mode
    } catch (error) {
      console.error("Error during ticket lookup:", error);
      setError("An error occurred during the ticket lookup.");
      setSelectedTicket(null);
    }
  };

  const handleSubmitRefund = async () => {
    if (!selectedTicket || !refundEligible) {
      setError("Refund is not eligible.");
      return;
    }

    try {
      // Call the API to cancel the ticket
      const cancelResponse = await fetch(`http://localhost:8080/tickets/cancel/${selectedTicket.ticketID}`);
      if (!cancelResponse.ok) {
        const errorText = await cancelResponse.text();
        setError(`Error in refund processing: ${errorText}`);
        return;
      }
      const cancelData = await cancelResponse.json();
      const refundAmount = cancelData.refundAmount;

      // If the user is not a guest user, send a notification
      if (!isGuestUser) {
        const notificationData = {
          userID: selectedTicket.userID,
          message: `Refund for ${ticketDetails.movieTitle} has been processed.`,
        };

        try {
          const notificationResponse = await fetch(`http://localhost:8080/notifications/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationData),
          });

          if (notificationResponse.ok) {
            // Refresh notifications
            fetchNotifications();
          } else {
            console.error("Error sending notification");
          }

        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }

      alert(`Refund of $${refundAmount.toFixed(2)} processed successfully!`);
      navigate("/");
    } catch (error) {
      console.error("Error during refund processing:", error);
      setError("An error occurred during the refund processing.");
    }
  };

  // Function to get ticket price
  const getTicketPrice = async (paymentID) => {
    try {
      // We can assume a fixed price of $20 per ticket
      const fixedTicketPrice = 20.0; // Replace with actual logic if available
      return fixedTicketPrice;
    } catch (error) {
      console.error("Error fetching ticket price:", error);
      return null;
    }
  };

  // Function to map seat numbers to seat labels
  const mapSeatNumberToLabel = (seatNumber) => {
    // Assuming 10 seats per row, adjust as per your theatre configuration
    const seatsPerRow = 10;
    const rowNumber = Math.floor((seatNumber - 1) / seatsPerRow);
    const seatInRow = ((seatNumber - 1) % seatsPerRow) + 1;
    const rowLetter = String.fromCharCode(65 + rowNumber); // 'A' + rowNumber
    return `${rowLetter}${seatInRow}`;
  };

  // Function to parse ticketData.date
  const parseTicketDateTime = (dateTimeString) => {
    // dateTimeString is expected to be in the format "YYYY-MM-DD HH:MM AM/PM"
    // Split date and time
    const [datePart, timePart, ampm] = dateTimeString.split(' ');
    if (!datePart || !timePart || !ampm) {
      return new Date(NaN); // Invalid date
    }
    const [year, month, day] = datePart.split('-').map(Number);
    const [hoursPart, minutesPart] = timePart.split(':').map(Number);

    let hours = hoursPart;
    if (ampm.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    const minutes = minutesPart;

    // Months in JavaScript Date are 0-indexed (0 = January)
    return new Date(year, month - 1, day, hours, minutes, 0);
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

            {ticketDetails && (
              <Box margin={{ top: "medium" }}>
                <Text>
                  <strong>Movie Title:</strong> {ticketDetails.movieTitle}
                </Text>
                <Text>
                  <strong>Showtime:</strong> {ticketDetails.showtime}
                </Text>
                <Text>
                  <strong>Ticket Price:</strong> ${ticketDetails.ticketPrice.toFixed(2)}
                </Text>
                <Text>
                  <strong>Seat:</strong> {ticketDetails.seat}
                </Text>
                {isGuestUser && (
                  <Text>
                    <strong>Admin Fee (15%):</strong> ${adminFee.toFixed(2)}
                  </Text>
                )}
                <Text>
                  <strong>Refund Amount:</strong> ${refundAmount.toFixed(2)}
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
              <Button label="Cancel" onClick={() => navigate("/")} />
            </Box>
          </Form>
        </Box>
      </Box>
    </Page>
  );
};

export default ProcessRefund;