import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageHeader,
  Text,
  TextInput,
  Select,
  ResponsiveContext,
} from "grommet";
import { AuthContext } from "../context/AuthContext";
import { NotificationsContext } from "../context/NotificationsContext"; // Import NotificationsContext

const MakePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const size = useContext(ResponsiveContext); // Detect screen size
  const { userID } = useContext(AuthContext); // Get the userID from AuthContext
  const { fetchNotifications } = useContext(NotificationsContext); // Get fetchNotifications

  let userIdValue = parseInt(userID, 10);

  if (isNaN(userIdValue)) {
    userIdValue = 0; // Assign 0 if userID is NaN
  }

  // State for email
  const [email, setEmail] = useState("");

  // Retrieve booking details from location.state
  const { theatre, movie, showtime, selectedSeats } = location.state || {};

  // Initialize state hooks
  const [formData, setFormData] = useState({
    selectedPaymentMethod: null,
    paymentType: "",
    owner: "",
    cardNumber: "",
    expiryDate: "",
    ccv: "",
    useCreditPoints: "No",
  });

  const [creditPoints] = useState(0); // Mock credit points balance
  const [redeemPoints, setRedeemPoints] = useState(0); // Points used to redeem
  const [error, setError] = useState("");

  // Fetch user email if userID is present
  useEffect(() => {
    if (userIdValue > 0) {
      // Fetch user profile
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`http://localhost:8080/users/${userIdValue}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const userProfile = await response.json();
          setEmail(userProfile.email);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setError("An error occurred while fetching user information.");
        }
      };

      fetchUserProfile();
    }
  }, [userIdValue]);

  // Check if booking details are available
  if (!theatre || !movie || !showtime || !selectedSeats) {
    return (
      <Box align="center" pad="large">
        <Text color="status-critical" size="large">
          Error: Missing booking details.
        </Text>
      </Box>
    );
  }

  // Mock saved payment methods
  const savedPaymentMethods = [
    {
      id: 1,
      type: "Credit",
      owner: "John Smith",
      number: "****8123",
      expiryDate: "12/25",
      ccv: "123",
    },
    {
      id: 2,
      type: "Debit",
      owner: "Jane Doe",
      number: "****4567",
      expiryDate: "05/24",
      ccv: "456",
    },
  ];

  // Update calculations based on selectedSeats
  const ticketPrice = 20.0; // Price per ticket
  const numberOfTickets = selectedSeats.length;
  const subtotal = ticketPrice * numberOfTickets;
  const tax = subtotal * 0.05; // Assuming 5% tax
  const pointsValue = redeemPoints * 0.01; // Convert points to dollar value
  const totalAmount = Math.max(0, subtotal + tax - pointsValue);

  const handleCreditPointSelection = (option) => {
    setFormData((prevState) => ({
      ...prevState,
      useCreditPoints: option,
    }));
    setRedeemPoints(
      option === "Yes" ? Math.min(creditPoints, Math.ceil((subtotal + tax) / 0.01)) : 0
    );
  };

  const handlePaymentMethodSelection = (option) => {
    const selectedMethod = savedPaymentMethods.find((method) => method.id === option.id);
    if (selectedMethod) {
      setFormData({
        ...formData,
        selectedPaymentMethod: option.id,
        paymentType: selectedMethod.type,
        owner: selectedMethod.owner,
        cardNumber: selectedMethod.number,
        expiryDate: selectedMethod.expiryDate,
        ccv: selectedMethod.ccv,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (
      !formData.paymentType ||
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.ccv
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");

    try {
      const ticketDetails = []; // Array to store ticket details
      const totalAmountPerTicket = ticketPrice * (1 + 0.05); // Include tax (5%)

      // For each seat, process payment and create ticket
      for (const seat of selectedSeats) {
        // Prepare payment data for one ticket
        const paymentData = {
          paymentType: formData.paymentType.toLowerCase(),
          amount: totalAmountPerTicket,
          cardOwner: formData.owner,
          cardNumber: parseInt(formData.cardNumber.replace(/\D/g, ""), 10),
          ccv: parseInt(formData.ccv, 10),
          expiry: formData.expiryDate,
          email: email,
        };

        // Log payment data
        console.log("Processing payment for seat:", seat.seatNumber || seat);
        console.log("Payment Data Being Sent:", JSON.stringify(paymentData));

        // Process Payment
        const paymentResponse = await fetch("http://localhost:8080/payments/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        if (!paymentResponse.ok) {
          const errorText = await paymentResponse.text();
          console.error("Payment processing failed:", errorText);
          throw new Error("Payment processing failed");
        }

        const paymentResult = await paymentResponse.json();
        console.log("Payment successful:", paymentResult);

        const { paymentID, user: newUserID } = paymentResult;

        // Proceed with ticket creation
        const ticketData = {
          showtimeID: showtime.showtimeID,
          seatNumber: seat.seatNumber || seat,
          theatreID: theatre.theatreID,
          userID: newUserID,
          date: `${showtime.date} ${showtime.time}`, // Include date and time
          paymentID: paymentID,
          ticketStatus: "booked",
        };

        console.log("Creating ticket with data:", JSON.stringify(ticketData));

        const ticketResponse = await fetch("http://localhost:8080/tickets/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        });

        if (!ticketResponse.ok) {
          const errorText = await ticketResponse.text();
          console.error("Ticket creation failed:", errorText);
          throw new Error("Ticket creation failed");
        }

        const ticketResult = await ticketResponse.json();
        console.log("Ticket created:", ticketResult);

        // Collect ticket details for display
        ticketDetails.push({
          ticketID: ticketResult.ticketID,
          movieName: movie.movieTitle,
          theatre: theatre.theatreName,
          showtime: `${showtime.time}, ${showtime.date}`,
          seat: `Seat ${ticketData.seatNumber}`,
        });
      }

      // Send notification to registered user
      if (userIdValue > 0) {
        const notificationData = {
          userID: userIdValue,
          message: `Successfully booked tickets for ${movie.movieTitle}!`,
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

      // Navigate to the success page with ticket details
      navigate("/successful", { state: { ticketDetails } });
    } catch (error) {
      console.error("Error during payment and ticket creation:", error);
      setError("An error occurred during the payment process.");
    }
  };

  return (
    <Page background="light-3" fill="vertical">
      <Box
        fill="vertical"
        overflow="auto"
        align="center"
        justify="center"
        pad={{ vertical: "medium", horizontal: "medium" }}
      >
        <Box
          width={size === "small" ? "90%" : "40%"}
          pad="medium"
          background="white"
          elevation="small"
          round="small"
          flex={false} // Prevents the Box from shrinking
        >
          <PageHeader title="Process Payment" alignSelf="start" />
          {error && (
            <Text color="status-critical" margin={{ bottom: "small" }}>
              {error}
            </Text>
          )}

          {/* Payment Form Fields */}
          <Form onSubmit={handleSubmit}>
            {/* Email Field for Guest Users */}
            {userIdValue === 0 && (
              <FormField label="Email" name="email" required>
                <TextInput
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormField>
            )}
            {savedPaymentMethods.length > 0 && (
              <FormField label="Saved Payment Methods" name="savedPaymentMethods">
                <Select
                  name="savedPaymentMethods"
                  options={savedPaymentMethods.map((method) => ({
                    id: method.id,
                    label: `${method.type} ${method.number}`,
                  }))}
                  labelKey="label"
                  valueKey="id"
                  value={formData.selectedPaymentMethod}
                  onChange={({ option }) => handlePaymentMethodSelection(option)}
                />
              </FormField>
            )}
            {creditPoints > 0 && (
              <FormField
                label={`Use Credit Points (Available: ${creditPoints})`}
                name="useCreditPoints"
              >
                <Select
                  name="useCreditPoints"
                  options={["Yes", "No"]}
                  value={formData.useCreditPoints}
                  onChange={({ option }) => handleCreditPointSelection(option)}
                />
              </FormField>
            )}
            <FormField label="Payment Type" name="paymentType" required>
              <Select
                name="paymentType"
                options={["Credit", "Debit"]}
                value={formData.paymentType}
                onChange={({ option }) =>
                  setFormData({ ...formData, paymentType: option })
                }
              />
            </FormField>
            <FormField label="Card Owner" name="owner" required>
              <TextInput
                name="owner"
                placeholder="John Smith"
                value={formData.owner}
                onChange={(event) =>
                  setFormData({ ...formData, owner: event.target.value })
                }
              />
            </FormField>
            <FormField label="Card Number" name="cardNumber" required>
              <TextInput
                name="cardNumber"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={formData.cardNumber}
                onChange={(event) =>
                  setFormData({ ...formData, cardNumber: event.target.value })
                }
              />
            </FormField>
            <FormField label="Expiry Date (MM/YY)" name="expiryDate" required>
              <TextInput
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(event) =>
                  setFormData({ ...formData, expiryDate: event.target.value })
                }
              />
            </FormField>
            <FormField label="CVV" name="ccv" required>
              <TextInput
                name="ccv"
                placeholder="XXX"
                value={formData.ccv}
                onChange={(event) =>
                  setFormData({ ...formData, ccv: event.target.value })
                }
              />
            </FormField>
            <Box
              direction="row"
              gap="medium"
              justify="center"
              margin={{ top: "medium" }}
            >
              <Button type="submit" label="Pay" primary />
              <Button
                label="Cancel"
                onClick={() => navigate("/")}
                secondary
              />
            </Box>
          </Form>

          {/* Calculation Section at the Bottom */}
          <Box margin={{ top: "small" }} align="center">
            <Box direction="row" justify="between" width="100%" margin={{ bottom: "xsmall" }}>
              <Text>Number of Tickets:</Text>
              <Text>
                {numberOfTickets} x ${ticketPrice.toFixed(2)}
              </Text>
            </Box>
            <Box direction="row" justify="between" width="100%" margin={{ bottom: "xsmall" }}>
              <Text>Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </Box>
            <Box direction="row" justify="between" width="100%" margin={{ bottom: "xsmall" }}>
              <Text>Tax (5%):</Text>
              <Text>${tax.toFixed(2)}</Text>
            </Box>
            {formData.useCreditPoints === "Yes" && (
              <Box direction="row" justify="between" width="100%" margin={{ bottom: "xsmall" }}>
                <Text>Redeem Points ({redeemPoints}):</Text>
                <Text>- ${pointsValue.toFixed(2)}</Text>
              </Box>
            )}
            <Box direction="row" justify="between" width="100%" margin={{ bottom: "xsmall" }}>
              <Text>
                <strong>Total:</strong>
              </Text>
              <Text>
                <strong>${totalAmount.toFixed(2)}</strong>
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default MakePayment;