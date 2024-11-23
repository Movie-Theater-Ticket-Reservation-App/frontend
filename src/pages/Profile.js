import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Page,
  PageContent,
  PageHeader,
  TextInput,
  Text,
  ResponsiveContext,
} from "grommet";

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "********",
    membershipFee: 25.0,
    creditPoints: 100,
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);

  const size = useContext(ResponsiveContext); // Detect screen size

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
            <Form
              onSubmit={() => {
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
              <Box margin={{ bottom: "small" }}>
                <Text>Membership Fee: ${formData.membershipFee.toFixed(2)}</Text>
              </Box>
              <Box margin={{ bottom: "small" }}>
                <Text>Credit Points: {formData.creditPoints}</Text>
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
                <strong>Membership Fee:</strong> ${user.membershipFee.toFixed(2)}
              </Text>
              <Text margin={{ bottom: "small" }}>
                <strong>Credit Points:</strong> {user.creditPoints}
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
    </Page>
  );
};

export default Profile;