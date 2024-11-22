import React from "react";
import { Box, Button, Page, PageContent, PageHeader, Text } from "grommet";

const NotFound = () => {
  return (
    <Page background="light-3" fill>
      <PageContent>
        <Box
          fill
          align="center"
          justify="center"
          pad="medium"
        >
          <Box width="medium" pad="medium" background="white" elevation="small" round="small">
            <PageHeader title="404 - Page Not Found" alignSelf="center" />
            <Text margin={{ bottom: "medium" }} align="center">
              Sorry, the page you're looking for does not exist. Please check the URL or return to the homepage.
            </Text>
            <Box direction="row" gap="medium" justify="center" margin={{ top: "medium" }}>
              <Button label="Go to Homepage" href="/" primary />
            </Box>
          </Box>
        </Box>
      </PageContent>
    </Page>
  );
};

export default NotFound;