import React, { useContext } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Page,
  PageContent,
  Paragraph,
  ResponsiveContext,
} from "grommet";
import { Autoplay } from "../components/carousel-autoplay.js";
import TheatreList from "../components/theatre-list.js";
import { Link } from "react-router-dom";

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
          image: "/images/posters/gatsbyPoster.png",
        },
        {
          title: "Cars",
          rating: "G",
          duration: "1h 57min",
          genre: "Animation, Comedy",
          showtimes: ["5:15 PM", "6:45 PM", "9:00 PM"],
          image: "/images/posters/carsPoster.jpeg",
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
          image: "/images/posters/wallePoster.jpg",
        },
      ],
    },
  ];

  return (
    <Page background={dark ? "dark-1" : "light-4"}>
      <PageContent>
        {/* Hero Carousel */}
        <Autoplay dark={dark} />

        {/* Tickets Section */}
        <Box align="start" pad={{ left: "medium", top: "medium" }}>
          <Heading level={1} size="large">
            Tickets
          </Heading>
        </Box>

        {/* Theatre List */}
        <TheatreList theatres={theatreData} />
      </PageContent>
    </Page>
  );
};

export default Landing;