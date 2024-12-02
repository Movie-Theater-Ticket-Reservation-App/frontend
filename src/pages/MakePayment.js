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
  CheckBox,
} from "grommet";
import { AuthContext } from "../context/AuthContext";
import { NotificationsContext } from "../context/NotificationsContext";

const MakePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const size = useContext(ResponsiveContext);
  const { userID } = useContext(AuthContext);
  const { fetchNotifications } = useContext(NotificationsContext);

  let userIdValue = parseInt(userID, 10);
  if (isNaN(userIdValue)) {
    userIdValue = 0;
  }

  const [email, setEmail] = useState("");
  const { theatre, movie, showtime, selectedSeats } = location.state || {};
  const [formData, setFormData] = useState({
    selectedPaymentMethod: null,
    paymentType: "",
    owner: "",
    cardNumber: "",
    expiryDate: "",
    ccv: "",
    useCreditPoints: false,
  });
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [creditPoints, setCreditPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userIdValue > 0) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`http://localhost:8080/users/${userIdValue}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const userProfile = await response.json();
          setEmail(userProfile.email);
          setSavedPaymentMethods(
            userProfile.paymentMethods.map((method) => ({
              ...method,
              cardNum: method.cardNum.toString(),
            }))
          );
          setCreditPoints(userProfile.creditPoints || 0);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setError("An error occurred while fetching user information.");
        }
      };

      fetchUserProfile();
    }
  }, [userIdValue]);

  if (!theatre || !movie || !showtime || !selectedSeats) {
    return (
      <Box align="center" pad="large">
        <Text color="status-critical" size="large">
          Error: Missing booking details.
        </Text>
      </Box>
    );
  }

  const ticketPrice = 20.0;
  const numberOfTickets = selectedSeats.length;
  const subtotal = ticketPrice * numberOfTickets;
  const tax = subtotal * 0.05;
  const pointsValue = redeemPoints * 0.01;
  const totalAmount = Math.max(0, subtotal + tax - pointsValue);

  const handleCreditPointSelection = (checked) => {
    setFormData((prevState) => ({
      ...prevState,
      useCreditPoints: checked,
    }));
    setRedeemPoints(
      checked ? Math.min(creditPoints, Math.floor((subtotal + tax) * 100)) : 0
    );
  };

  const handlePaymentMethodSelection = (option) => {
    const selectedMethod = savedPaymentMethods.find((method) => method.id === option.id);
    if (selectedMethod) {
      setFormData({
        ...formData,
        selectedPaymentMethod: option.id,
        paymentType: selectedMethod.paymentType,
        owner: selectedMethod.cardOwner,
        cardNumber: selectedMethod.cardNum,
        expiryDate: selectedMethod.expiry,
        ccv: selectedMethod.ccv,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const ticketDetails = [];
      const totalAmountPerTicket = ticketPrice * (1 + 0.05);

      for (const seat of selectedSeats) {
        const paymentData = {
          paymentType: formData.paymentType.toLowerCase(),
          amount: totalAmountPerTicket,
          cardOwner: formData.owner,
          cardNumber: parseInt(formData.cardNumber.replace(/\D/g, ""), 10),
          ccv: parseInt(formData.ccv, 10),
          expiry: formData.expiryDate,
          email: email,
        };

        const paymentResponse = await fetch("http://localhost:8080/payments/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        if (!paymentResponse.ok) {
          const errorText = await paymentResponse.text();
          throw new Error(`Payment processing failed: ${errorText}`);
        }

        const paymentResult = await paymentResponse.json();

        const ticketData = {
          showtimeID: showtime.showtimeID,
          seatNumber: seat,
          theatreID: theatre.theatreID,
          userID: paymentResult.user,
          date: `${showtime.date} ${showtime.time}`,
          paymentID: paymentResult.paymentID,
          ticketStatus: "booked",
        };

        const ticketResponse = await fetch("http://localhost:8080/tickets/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ticketData),
        });

        if (!ticketResponse.ok) {
          const errorText = await ticketResponse.text();
          throw new Error(`Ticket creation failed: ${errorText}`);
        }

        const ticketResult = await ticketResponse.json();
        ticketDetails.push({
          ticketID: ticketResult.ticketID,
          movieName: movie.movieTitle,
          theatre: theatre.theatreName,
          showtime: `${showtime.time}, ${showtime.date}`,
          seat: `Seat ${ticketData.seatNumber}`,
        });
      }

      if (formData.useCreditPoints && redeemPoints > 0) {
        await fetch(`http://localhost:8080/users/${userIdValue}/update-credits`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ creditPoints: creditPoints - redeemPoints }),
        });
      }

      if (userIdValue > 0) {
        const notificationData = {
          userID: userIdValue,
          message: `Successfully booked tickets for ${movie.movieTitle}!`,
        };

        await fetch("http://localhost:8080/notifications/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationData),
        });

        fetchNotifications();
      }

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
          flex={false}
        >
          <PageHeader title="Process Payment" alignSelf="start" />
          {error && (
            <Text color="status-critical" margin={{ bottom: "small" }}>
              {error}
            </Text>
          )}

<Form onSubmit={handleSubmit}>
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
        options={[
          { id: null, label: "None" },
          ...savedPaymentMethods.map((method) => ({
            id: method.id,
            label: `${method.paymentType} ****${method.cardNum.slice(-4)}`,
          })),
        ]}
        labelKey="label"
        valueKey="id"
        value={formData.selectedPaymentMethod}
        onChange={({ option }) => handlePaymentMethodSelection(option)}
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
  {creditPoints > 0 && (
    <FormField>
      <CheckBox
        label={`Use Credit Points (${creditPoints} available)`}
        checked={formData.useCreditPoints}
        onChange={(event) =>
          handleCreditPointSelection(event.target.checked)
        }
      />
    </FormField>
  )}
  <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
    <Button type="submit" label="Pay" primary />
    <Button
      label="Cancel"
      onClick={() => navigate("/")}
      secondary
    />
  </Box>
</Form>

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
            {redeemPoints > 0 && (
              <Box direction="row" justify="between" width="100%" margin={{ bottom: "xsmall" }}>
                <Text>
                  Credits Used ({redeemPoints} points):
                </Text>
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