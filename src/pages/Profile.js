import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageHeader,
  TextInput,
  Text,
  ResponsiveContext,
  Layer,
  Select,
} from "grommet";
import { Close } from "grommet-icons";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const size = useContext(ResponsiveContext);
  const { userID } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(null);
  const [currentPayment, setCurrentPayment] = useState({
    type: "Credit",
    number: "",
    owner: "",
    expiry: "",
    ccv: "",
  });
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userID) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${userID}`);
        const data = response.data;

        const transformedData = {
          ...data,
          paymentMethods: data.paymentMethods.map((method) => ({
            type: method.paymentType.charAt(0).toUpperCase() + method.paymentType.slice(1),
            number: method.cardNum.toString(),
            owner: method.cardOwner,
            expiry: method.expiry,
            ccv: method.ccv,
          })),
        };

        setUser(transformedData);
        setFormData(transformedData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userID, navigate]);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    setFormData(user);
  };

  const handleSave = async () => {
    const updatedData = {
      userID,
      name: formData.name,
      email: formData.email,
      address: formData.address,
      creditPoints: formData.creditPoints,
      paymentMethods: formData.paymentMethods.map((method) => ({
        cardOwner: method.owner,
        cardNum: parseInt(method.number.replace(/\D/g, ""), 10), // Convert to number
        ccv: parseInt(method.ccv, 10), // Ensure CCV is also numeric
        expiry: method.expiry,
        paymentType: method.type.toLowerCase(),
      })),
    };

    try {
      await axios.put(`http://localhost:8080/users/${userID}`, updatedData);
      setUser(formData);
      setEditMode(false);
      setNotification("Profile updated successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error.response || error.message);
      setNotification("Error updating profile. Please try again.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeletePayment = (index) => {
    const updatedPayments = formData.paymentMethods.filter((_, i) => i !== index);
    setFormData({ ...formData, paymentMethods: updatedPayments });
  };

  const handleEditPayment = (payment, index) => {
    setCurrentPayment(payment);
    setCurrentPaymentIndex(index);
    setShowPaymentModal(true);
  };

  const handleAddPayment = () => {
    setCurrentPayment({ type: "Credit", number: "", owner: "", expiry: "", ccv: "" });
    setCurrentPaymentIndex(null);
    setShowPaymentModal(true);
  };

  const handleSavePayment = () => {
    if (
      !currentPayment.number ||
      !currentPayment.owner ||
      !currentPayment.expiry ||
      !currentPayment.ccv ||
      !currentPayment.type
    ) {
      setNotification("Please fill in all payment details.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const newPayment = {
      type: currentPayment.type,
      number: currentPayment.number.replace(/\D/g, ""), // Ensure only digits
      owner: currentPayment.owner,
      expiry: currentPayment.expiry,
      ccv: currentPayment.ccv,
    };

    const updatedPayments = [...formData.paymentMethods];
    if (currentPaymentIndex !== null) {
      updatedPayments[currentPaymentIndex] = newPayment; // Update existing payment
    } else {
      updatedPayments.push(newPayment); // Add new payment
    }

    setFormData({ ...formData, paymentMethods: updatedPayments });
    setShowPaymentModal(false);
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <Page background="light-3" fill>
      {notification && (
        <Layer
          position="top"
          modal={false}
          margin={{ vertical: "medium", horizontal: "small" }}
          onEsc={() => setNotification(null)}
          responsive={false}
          plain
        >
          <Box
            align="center"
            direction="row"
            gap="small"
            justify="between"
            round="small"
            elevation="medium"
            pad={{ vertical: "small", horizontal: "medium" }}
            background="status-ok"
          >
            <Text>{notification}</Text>
            <Button icon={<Close />} onClick={() => setNotification(null)} plain />
          </Box>
        </Layer>
      )}
      <Box fill align="center" justify={size === "small" ? "center" : "start"} pad="medium">
        <Box width={size === "small" ? "90%" : "36%"} pad="medium" background="white" elevation="small" round="small">
          <PageHeader title="Profile" alignSelf="start" />
          {editMode ? (
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
            >
              <FormField label="Name" name="name" required>
                <TextInput
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormField>
              <FormField label="Email" name="email" required>
                <TextInput
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormField>
              <FormField label="Address" name="address">
                <TextInput
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </FormField>
              <Box margin={{ bottom: "small" }}>
                <Text>
                  <strong>Credit Points:</strong> {formData.creditPoints}
                </Text>
              </Box>
              <Box margin={{ top: "medium" }}>
                <Text weight="bold" margin={{ bottom: "small" }}>
                  Payment Methods
                </Text>
                {formData.paymentMethods.map((method, index) => (
                  <Box key={index} direction="row" justify="between" align="center">
                    <Text>
                      {method.type} ****{method.number.slice(-4)}
                    </Text>
                    <Box direction="row" gap="small">
                      <Button label="Edit" onClick={() => handleEditPayment(method, index)} size="small" />
                      <Button label="Delete" onClick={() => handleDeletePayment(index)} size="small" color="status-critical" />
                    </Box>
                  </Box>
                ))}
                <Button label="Add Payment Method" onClick={handleAddPayment} size="small" primary />
              </Box>
              <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
                <Button type="submit" label="Save" primary />
                <Button label="Cancel" onClick={handleCancel} />
              </Box>
            </Form>
          ) : (
            <>
              <Text><strong>Name:</strong> {user.name}</Text>
              <Text><strong>Email:</strong> {user.email}</Text>
              <Text><strong>Address:</strong> {user.address}</Text>
              <Text><strong>Credit Points:</strong> {user.creditPoints}</Text>
              <Box margin={{ top: "medium" }}>
                <Text weight="bold" margin={{ bottom: "small" }}>
                  Payment Methods
                </Text>
                {user.paymentMethods.map((method, index) => (
                  <Text key={index}>
                    {method.type} ****{method.number.slice(-4)}
                  </Text>
                ))}
              </Box>
              <Box direction="row" gap="small" margin={{ top: "medium" }} justify="center">
                <Button label="Edit Profile" onClick={handleEdit} primary />
                <Button label="View Tickets" onClick={() => navigate("/tickets")} />
                <Button label="View Payments" onClick={() => navigate("/payments")} />
              </Box>
            </>
          )}
        </Box>
      </Box>

      {showPaymentModal && (
        <Layer
          onEsc={() => setShowPaymentModal(false)}
          onClickOutside={() => setShowPaymentModal(false)}
        >
          <Box pad="medium" width="medium">
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                handleSavePayment();
              }}
            >
              <FormField label="Card Type" name="type" required>
                <Select
                  name="type"
                  options={["Credit", "Debit"]}
                  value={currentPayment.type}
                  onChange={({ option }) =>
                    setCurrentPayment({ ...currentPayment, type: option })
                  }
                />
              </FormField>
              <FormField label="Card Owner" name="owner" required>
                <TextInput
                  name="owner"
                  placeholder="John Doe"
                  value={currentPayment.owner}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, owner: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Card Number" name="number" required>
                <TextInput
                  name="number"
                  placeholder="1234567812345678"
                  value={currentPayment.number}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, number: e.target.value })
                  }
                />
              </FormField>
              <FormField label="CCV" name="ccv" required>
                <TextInput
                  name="ccv"
                  placeholder="***"
                  type="password"
                  value={currentPayment.ccv}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, ccv: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Expiry Date (MM/YY)" name="expiry" required>
                <TextInput
                  name="expiry"
                  placeholder="MM/YY"
                  value={currentPayment.expiry}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, expiry: e.target.value })
                  }
                />
              </FormField>
              <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
                <Button type="submit" label="Save" primary />
                <Button label="Cancel" onClick={() => setShowPaymentModal(false)} />
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </Page>
  );
};

export default Profile;