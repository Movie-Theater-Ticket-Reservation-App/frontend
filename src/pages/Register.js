import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; // Import Axios
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
} from "grommet";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // To manage loading state
  const size = useContext(ResponsiveContext); // Detect screen size
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setError(""); // Clear errors
    setLoading(true); // Show loading state

    try {
      // Make API call
      const response = await axios.post("http://localhost:8080/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address || "", 
        creditPoints: 0,
      });

      if (response.status === 200 || response.status === 201) {
        // On successful registration, navigate to homepage
        alert("Registration successful!");
        navigate("/"); // Navigate to the homepage
      }
    } catch (err) {
      // Handle errors
      if (err.response?.data?.message) {
        setError(err.response.data.message); // Show error message from API
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loading state
    }
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
          <PageHeader title="Register" alignSelf="start" />
          {error && (
            <Text color="status-critical" margin={{ bottom: "small" }}>
              {error}
            </Text>
          )}
          <Form onSubmit={handleSubmit}>
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
            <FormField label="Password" name="password" required>
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
            <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
              <Button type="submit" label={loading ? "Registering..." : "Register"} primary disabled={loading} />
              <Button label="Cancel" href="/" />
            </Box>
          </Form>
        </Box>
      </Box>
    </Page>
  );
};

export default Register;