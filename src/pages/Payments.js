import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  Box,
  Button,
  Page,
  PageHeader,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  ResponsiveContext,
} from "grommet";

const Payments = () => {
  const [payments] = useState([
    {
      paymentID: "P001",
      date: "Nov 20, 2024",
      amount: 25.0,
      paymentType: "Credit Card",
    },
    {
      paymentID: "P002",
      date: "Nov 18, 2024",
      amount: 15.0,
      paymentType: "Debit Card",
    },
    {
      paymentID: "P003",
      date: "Nov 15, 2024",
      amount: 10.0,
      paymentType: "Credit Card",
    },
  ]);

  const size = useContext(ResponsiveContext); // Detect screen size
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Page background="light-3" fill>
      <Box
        fill
        align="center"
        justify={size === "small" ? "center" : "start"} // Center for small screens
        pad={{ top: size === "small" ? "none" : "medium", horizontal: "medium" }}
      >
        <Box
          width={size === "small" ? "95%" : "70%"} // Adjust width dynamically
          pad="medium"
          background="white"
          round="small"
          elevation="small"
          overflow="auto" // Enables scrolling for smaller screens
        >
          <PageHeader title="Your Payments" />          
          {payments.length > 0 ? (
            <Box overflow="auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell scope="col" border="bottom">
                      Date
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Amount ($)
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Payment Type
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.paymentID}>
                      <TableCell scope="row">{payment.date}</TableCell>
                      <TableCell>{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.paymentType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                align="start"
                direction="row"
                gap="medium"
                justify="left"
                margin={{ bottom: "medium", top: "medium", left: "small" }}
              >

                <Button
                  label="Back"
                  onClick={() => navigate(-1)}
                  primary={false}
                />
                <Button
                  label="Refund"
                  onClick={() => navigate("/refund")} // Redirect to refund page
                  primary
                />
              </Box>
            </Box>
          ) : (
            <Text>No payments found.</Text>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default Payments;