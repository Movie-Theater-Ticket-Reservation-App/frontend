import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Grid,
  Grommet,
  grommet,
  Header,
  Heading,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  ResponsiveContext,
  Text
} from "grommet";
import { Moon, Sun } from "grommet-icons";
import { deepMerge } from "grommet/utils";

// Custom components
import { Autoplay } from "../components/carousel-autoplay.js";
import TheatreList from "../components/theatre-list.js";

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
});

const AppBar = (props) => (
  <Header
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    {...props}
   />
  );

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
          porttitor non nulla ac vehicula. Aliquam erat volutpat. Mauris auctor
          faucibus est at mattis. Aliquam a enim ac nisi aliquam consectetur et
          ac velit. Mauris ut imperdiet libero.
        </Paragraph>
      </CardBody>
      <CardFooter pad="medium" background="background-contrast">
        Footer
      </CardFooter>
    </Card>
  );
};

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

function App() {
  const [dark, setDark] = useState(false);
  return (
    <Grommet theme={theme} full themeMode={dark ? "dark" : "light"}>
      <header className="App-header">
      </header>
      <Page background="light-3">
        <AppBar>
          <Text size="large">My App</Text>
          <Button
            a11yTitle={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            icon={dark ? <Moon /> : <Sun />}
            onClick={() => setDark(!dark)}
            tip={{
              content: (
                <Box 
                pad="small"
                round="small"
                background={dark ? "dark-1" : "light-3"}
                >
                  {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </Box>
              ),
                plain: true,
            }}
          />
        </AppBar>
        <PageContent>
          <PageHeader title="Welcome to the movie rental app!" />
          <Autoplay />
          <Grid columns="medium" gap="large" pad={{ bottom: "large" }}>
            <CardTemplate title="Card 1" />
            <CardTemplate title="Card 2" />
            <CardTemplate title="Card 3" />
          </Grid>
          <TheatreList theatres={theatreData} />
        </PageContent>
      </Page>
    </Grommet>
  );
}

export default App;
