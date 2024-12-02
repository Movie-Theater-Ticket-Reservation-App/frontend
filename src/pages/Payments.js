import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
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
import { AuthContext } from "../context/AuthContext";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const size = useContext(ResponsiveContext); 
  const navigate = useNavigate(); 
  const { userID } = useContext(AuthContext);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment history.");
        }
        const data = await response.json();
        const paymentHistory = data.paymentHistory.map((payment) => ({
          amount: payment.amount.toFixed(2), // Ensure two decimal places for amount
          paymentType: payment.paymentType.charAt(0).toUpperCase() + payment.paymentType.slice(1), // Capitalize payment type
          cardNumber: `****${payment.cardNumber.toString().slice(-4)}`, // Mask card number
        }));

        setPayments(paymentHistory);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Unable to fetch your payment history. Please try again later.");
      }
    };

    if (userID) {
      fetchPayments();
    } else {
      setError("You must be logged in to view your payment history.");
    }
  }, [userID]);

  return (
    <Page background="light-3" fill>
      <Box
        fill
        align="center"
        justify={size === "small" ? "center" : "start"} 
        pad={{ top: size === "small" ? "none" : "medium", horizontal: "medium" }}
      >
        <Box
          width={size === "small" ? "95%" : "70%"} 
          pad="medium"
          background="white"
          round="small"
          elevation="small"
          overflow="auto"
        >
          <PageHeader title="Your Payments" />          
          {error ? (
            <Text color="status-critical">{error}</Text>
          ) : payments.length > 0 ? (
            <Box overflow="auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell scope="col" border="bottom">
                      Amount ($)
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Payment Type
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                      Card Number
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row">{payment.amount}</TableCell>
                      <TableCell>{payment.paymentType} card</TableCell>
                      <TableCell>{payment.cardNumber}</TableCell>
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
                  onClick={() => navigate("/refund")} 
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