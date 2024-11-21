import React from 'react';
import { Box, Carousel, Text, Button, Image } from 'grommet';

// Height for movie content
const contentHeight = "50vh"; // Full viewport height

export const Autoplay = () => (
  <Box fill="horizontal" align="center" pad="none" margin={{ bottom: "large" }}>
    <Carousel controls={false} play={3000} fill>
      {/* Hero Section */}
      <Box height={contentHeight} width="100%" style={{ position: "relative" }}>
        <Image
          src="/frontend/images/gatsby.jpg"
          alt="Gatsby"
          fit="cover"
        />
        {/* Overlay Content */}
        <Box
          direction="column"
          justify="center"
          align="start"
          pad="large"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))", // Gradient effect
          }}
        >
          <Text size="xxlarge" weight="bold" color="light-1">
            The Great Gatsby
          </Text>
          <Text size="large" color="light-1" margin={{ vertical: "medium" }}>
            A timeless tale of ambition, love, and the pursuit of the American dream.
          </Text>
          <Box direction="row" gap="small">
            <Button
              primary
              label="Book"
              color="brand"
              style={{
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            />
            <Button
              secondary
              label="More Info"
              style={{
                background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
                color: "#000", // Black text
                border: "1px solid #ccc", // Subtle border
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "4px",
              }}
              hoverIndicator={{
                background: "rgba(255, 255, 255, 1)", // Fully white on hover
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box height={contentHeight} width="100%">
        <Image
          src="/frontend/images/cars.jpg"
          alt="Cars"
          fit="cover"
        />
        {/* Overlay Content */}
        <Box
          direction="column"
          justify="center"
          align="start"
          pad="large"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))", // Gradient effect
          }}
        >
          <Text size="xxlarge" weight="bold" color="light-1">
            Cars
          </Text>
          <Text size="large" color="light-1" margin={{ vertical: "medium" }}>
            A high-octane journey of racing, rivalry, and redemption.
          </Text>
          <Box direction="row" gap="small">
            <Button
              primary
              label="Book"
              color="brand"
              style={{
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            />
            <Button
              secondary
              label="More Info"
              style={{
                background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
                color: "#000", // Black text
                border: "1px solid #ccc", // Subtle border
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "4px",
              }}
              hoverIndicator={{
                background: "rgba(255, 255, 255, 1)", // Fully white on hover
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box height={contentHeight} width="100%">
        <Image
          src="/frontend/images/walle.jpg"
          alt="Wall-E"
          fit="cover"
        />
        {/* Overlay Content */}
        <Box
          direction="column"
          justify="center"
          align="start"
          pad="large"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))", // Gradient effect
          }}
        >
          <Text size="xxlarge" weight="bold" color="light-1">
            Wall-E
          </Text>
          <Text size="large" color="light-1" margin={{ vertical: "medium" }}>
            A lonely robot’s mission to save Earth turns into an extraordinary love story.”
          </Text>
          <Box direction="row" gap="small">
            <Button
              primary
              label="Book"
              color="brand"
              style={{
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            />
            <Button
              secondary
              label="More Info"
              style={{
                background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
                color: "#000", // Black text
                border: "1px solid #ccc", // Subtle border
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "4px",
              }}
              hoverIndicator={{
                background: "rgba(255, 255, 255, 1)", // Fully white on hover
              }}
            />
          </Box>
        </Box>
      </Box>
    </Carousel>
  </Box>
);

export default {
  title: 'Media/Carousel/Autoplay',
};