import React, { useState, useContext } from "react";
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

const MakePayment = () => {
  // Mock saved payment methods
  const savedPaymentMethods = [
    { id: 1, type: "Debit", owner: "John Smith", number: "****8123", expiryDate: "12/25", cvv: "123" },
    { id: 2, type: "Credit", owner: "Jane Doe", number: "****4567", expiryDate: "05/24", cvv: "456" },
  ];

  const [formData, setFormData] = useState({
    selectedPaymentMethod: null,
    paymentType: "",
    owner: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    useCreditPoints: "No",
  });

  const [creditPoints] = useState(0); // Mock credit points balance
  const [redeemPoints, setRedeemPoints] = useState(0); // Points used to redeem
  const [error, setError] = useState("");
  const size = useContext(ResponsiveContext); // Detect screen size

  // Mock data for calculation
  const ticketPrice = 19.1; // Price per ticket
  const numberOfTickets = 3; // Example number of tickets
  const subtotal = ticketPrice * numberOfTickets;
  const tax = subtotal * 0.05; // tax
  const pointsValue = redeemPoints * 0.01; // Convert points to dollar value, 1 point = $0.01
  const totalAmount = Math.max(0, subtotal + tax - pointsValue); // Adjust total amount with redeemed points

  const handleCreditPointSelection = (option) => {
    setFormData((prevState) => ({
      ...prevState,
      useCreditPoints: option,
    }));
    setRedeemPoints(option === "Yes" ? Math.min(creditPoints, Math.ceil((subtotal + tax) / 0.01)) : 0);
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
        cvv: selectedMethod.cvv,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !formData.paymentType ||
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.cvv
    ) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    alert(`Payment of $${totalAmount.toFixed(2)} processed successfully!`);
    // Add API call logic here to process the payment
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
          <PageHeader title="Process Payment" alignSelf="start" />
          {error && (
            <Text color="status-critical" margin={{ bottom: "small" }}>
              {error}
            </Text>
          )}

          {/* Payment Form Fields */}
          <Form onSubmit={handleSubmit}>
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
            <FormField label="CVV" name="cvv" required>
              <TextInput
                name="cvv"
                placeholder="XXX"
                value={formData.cvv}
                onChange={(event) =>
                  setFormData({ ...formData, cvv: event.target.value })
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
              <Button label="Cancel" href="/" />
            </Box>
          </Form>

          {/* Calculation Section at the Bottom */}
          <Box margin={{ top: "medium" }} align="center">
            <Box direction="row" justify="between" width="100%">
              <Text>Number of Tickets:</Text>
              <Text>{numberOfTickets} x ${ticketPrice}</Text>
            </Box>
            <Box direction="row" justify="between" width="100%">
              <Text>Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </Box>
            <Box direction="row" justify="between" width="100%">
              <Text>Tax (5%):</Text>
              <Text>${tax.toFixed(2)}</Text>
            </Box>
            {formData.useCreditPoints === "Yes" && (
              <Box direction="row" justify="between" width="100%">
                <Text>Redeem Points ({redeemPoints}):</Text>
                <Text>- ${pointsValue.toFixed(2)}</Text>
              </Box>
            )}
            <Box direction="row" justify="between" width="100%">
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