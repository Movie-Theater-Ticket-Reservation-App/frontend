import React, { useContext } from "react";
import { Box, Button, Page, PageContent, PageHeader, Text, ResponsiveContext } from "grommet";

const NotFound = () => {
  const size = useContext(ResponsiveContext); // Detect screen size

  return (
    <Page background="light-3" fill>
      <Box
        fill
        align="center"
        justify={size === "small" ? "center" : "start"} // Center for small screens
        pad="medium"
      >
        <Box
          width={size === "small" ? "90%" : "50%"} // Adjust width based on screen size
          pad="medium"
          background="white"
          elevation="small"
          round="small"
        >
          <PageHeader title="404 - Page Not Found" alignSelf="center" />
          <Text margin={{ bottom: "medium" }} align="center">
            Sorry, the page you're looking for does not exist. Please check the URL or return to the homepage.
          </Text>
          <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
            <Button label="Go to Homepage" href="/" primary />
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default NotFound;