import React, { useState } from "react";
import {
  Box,
  Page,
  PageContent,
  PageHeader,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";

const Payments = () => {
  // Mock payment data (replace this with API call if necessary)
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

  return (
    <Page background="light-3" fill>
      <PageContent>
        <PageHeader title="Your Payments" />
        <Box pad="medium" background="white" round="small" elevation="small">
          {payments.length > 0 ? (
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
          ) : (
            <Text>No payments found.</Text>
          )}
        </Box>
      </PageContent>
    </Page>
  );
};

export default Payments;