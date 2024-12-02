import React from 'react';
import { Box, Carousel, Text, Button, Image } from 'grommet';

// Height for movie content
const contentHeight = "60vh"; // Full viewport height

export const Autoplay = () => (
  <Box fill="horizontal" align="center" pad="none" margin={{ bottom: "small" }}>
    <Carousel controls={false} play={5000} fill>
      {/* Hero Section */}
      <Box height={contentHeight} width="100%" style={{ position: "relative" }}>
        <Image
          src="/images/theWildRobot.jpg"
          alt="WildRobot"
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
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))",
          }}
        >
          <Text size="xxlarge" weight="bold" color="light-1">
            The Wild Robot
          </Text>
          <Text size="large" color="light-1" margin={{ vertical: "medium" }}>
            A story of friendship, technology, and nature.
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
          </Box>
        </Box>
      </Box>

      <Box height={contentHeight} width="100%">
        <Image
          src="/images/gladiator2.png"
          alt="Gladiator II"
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
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))"
          }}
        >
          <Text size="xxlarge" weight="bold" color="light-1">
            Gladiator II
          </Text>
          <Text size="large" color="light-1" margin={{ vertical: "medium" }}>
            A hero will rise. The legend will live. The Gladiator.
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
          </Box>
        </Box>
      </Box>
      <Box height={contentHeight} width="100%">
        <Image
          src="/images/venom.png"
          alt="Venom: The Last Dance"
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
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))"
          }}
        >
          <Text size="xxlarge" weight="bold" color="light-1">
            Venom: The Last Dance
          </Text>
          <Text size="large" color="light-1" margin={{ vertical: "medium" }}>
            The final chapter in the Venom saga.
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
          </Box>
        </Box>
      </Box>
    </Carousel>
  </Box>
);

export default {
  title: 'Media/Carousel/Autoplay',
};