import React, { useContext } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Grid,
  Grommet,
  Heading,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  ResponsiveContext,
} from "grommet";
import { Autoplay } from "../components/carousel-autoplay.js";
import TheatreList from "../components/theatre-list.js";

const CardTemplate = ({ title }) => {
  const size = useContext(ResponsiveContext);
  return (
    <Card>
      <CardHeader pad="medium">
        <Heading level={2} margin="none">
          {title}
        </Heading>
      </CardHeader>
      <CardBody pad="medium">
        <Paragraph maxLines={size === "small" ? 3 : undefined}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          porttitor non nulla ac vehicula.
        </Paragraph>
      </CardBody>
      <CardFooter pad="medium" background="background-contrast">
        Footer
      </CardFooter>
    </Card>
  );
};

const Landing = ({ dark }) => {
  const theatreData = [
    {
      name: "Cineplex VIP Cinemas University District",
      location: "Calgary, AB",
      distance: "1km",
      movies: [
        {
          title: "The Great Gatsby",
          rating: "PG-13",
          duration: "2h 23min",
          genre: "Drama, Romance",
          showtimes: ["4:30 PM", "8:30 PM"],
          image: "/images/gatsby.jpg",
        },
        {
          title: "Cars",
          rating: "G",
          duration: "1h 57min",
          genre: "Animation, Comedy",
          showtimes: ["5:15 PM", "6:45 PM", "9:00 PM"],
          image: "/images/cars.jpg",
        },
      ],
    },
    {
      name: "Cineplex Odeon Westhills Cinemas",
      location: "Calgary, AB",
      distance: "7km",
      movies: [
        {
          title: "Wall-E",
          rating: "G",
          duration: "1h 38min",
          genre: "Animation, Adventure",
          showtimes: ["12:50 PM", "3:00 PM"],
          image: "/images/walle.jpg",
        },
      ],
    },
  ];

  return (
    <Page background="light-3">
      <PageContent>
        <PageHeader title="Welcome to the movie ticket booking app!" />
        <Autoplay dark={dark} />
        <Grid columns="medium" gap="large" pad={{ bottom: "large" }}>
          <CardTemplate title="Card 1" />
          <CardTemplate title="Card 2" />
          <CardTemplate title="Card 3" />
        </Grid>
        <Box align = "start" pad={{ left: "1.5%" }}>        
            <h1>Tickets</h1>
        </Box>
        <TheatreList theatres={theatreData} />
      </PageContent>
    </Page>
  );
};

export default Landing;