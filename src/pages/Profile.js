import React, { useState, useContext } from "react";
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

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "********",
    membershipFee: 20.0,
    creditPoints: 100,
    address: "123 Main Street, Calgary, AB",
    paymentMethods: [
      { type: "Credit", number: "1234123412341234", owner: "John Doe", expiry: "12/25", ccv: "123" },
      { type: "Debit", number: "5678567856785678", owner: "Jane Doe", expiry: "08/26", ccv: "456" },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(null);
  const [currentPayment, setCurrentPayment] = useState({
    type: "Credit",
    number: "",
    owner: "",
    expiry: "",
    ccv: "",
  });

  const size = useContext(ResponsiveContext);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(user);
  };

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
    alert("Profile updated!");
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
    const updatedPayments = [...formData.paymentMethods];
    const maskedNumber = `****${currentPayment.number.slice(-4)}`; // Mask card number

    if (currentPaymentIndex !== null) {
      updatedPayments[currentPaymentIndex] = {
        ...currentPayment,
        number: maskedNumber,
      };
    } else {
      updatedPayments.push({
        ...currentPayment,
        number: maskedNumber,
      });
    }
    setFormData({ ...formData, paymentMethods: updatedPayments });
    setShowPaymentModal(false);
  };

  return (
    <Page background="light-3" fill>
      <Box
        fill
        align="center"
        justify={size === "small" ? "center" : "start"}
        pad="medium"
      >
        <Box
          width={size === "small" ? "90%" : "36%"}
          pad="medium"
          background="white"
          elevation="small"
          round="small"
        >
          <PageHeader title="Profile" alignSelf="start" />
          {editMode ? (
            <>
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="Email" name="email" required>
                  <TextInput
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="Password" name="password">
                  <TextInput
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="Address" name="address">
                  <TextInput
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </FormField>
                <Box margin={{ bottom: "small" }}>
                  <Text>
                    <strong>Membership Fee:</strong> ${formData.membershipFee.toFixed(2)}
                  </Text>
                </Box>
                <Box margin={{ bottom: "small" }}>
                  <Text>
                    <strong>Credit Points:</strong> {formData.creditPoints}
                  </Text>
                </Box>
                <Box margin={{ top: "medium" }}>
                  <Text weight="bold" margin={{ bottom: "small" }}>
                    Payment Methods
                  </Text>
                  <Box gap="small">
                    {formData.paymentMethods.map((method, index) => (
                      <Box
                        key={index}
                        direction="row"
                        justify="between"
                        align="center"
                      >
                        <Text>
                          {method.type} ****{method.number.slice(-4)}
                        </Text>
                        <Box direction="row" gap="small">
                          <Button
                            label="Edit"
                            onClick={() => handleEditPayment(method, index)}
                            size="small"
                          />
                          <Button
                            label="Delete"
                            onClick={() => handleDeletePayment(index)}
                            size="small"
                            color="status-critical"
                          />
                        </Box>
                      </Box>
                    ))}
                    <Button
                      label="Add Payment Method"
                      onClick={handleAddPayment}
                      size="small"
                      primary
                    />
                  </Box>
                </Box>
                <Box
                  direction="row"
                  gap="medium"
                  justify="center"
                  margin={{ top: "medium" }}
                >
                  <Button type="submit" label="Save" primary />
                  <Button label="Cancel" onClick={handleCancel} />
                </Box>
              </Form>
            </>
          ) : (
            <>
              <Text margin={{ bottom: "small" }}>
                <strong>Name:</strong> {user.name}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Email:</strong> {user.email}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Password:</strong> {user.password}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Address:</strong> {user.address}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Membership Fee:</strong> ${user.membershipFee.toFixed(2)}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Credit Points:</strong> {user.creditPoints}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Payment Methods:</strong>
                <ul>
                  {user.paymentMethods.map((method, index) => (
                    <li key={index}>
                      {method.type} ****{method.number.slice(-4)}
                    </li>
                  ))}
                </ul>
              </Text>
              <Box
                direction="row"
                gap="medium"
                justify="center"
                margin={{ top: "medium" }}
              >
                <Button label="View Tickets" href="/tickets" />
                <Button label="Payment History" href="/payments" />
              </Box>
              <Box
                direction="row"
                gap="medium"
                justify="center"
                margin={{ top: "medium" }}
              >
                <Button label="Edit Profile" onClick={handleEdit} primary />
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Payment Modal */}
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
                  placeholder="****1234"
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
                <Button
                  label="Cancel"
                  onClick={() => setShowPaymentModal(false)}
                />
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </Page>
  );
};

export default Profile;