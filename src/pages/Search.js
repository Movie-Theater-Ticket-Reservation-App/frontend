import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Page,
  PageHeader,
  Text,
  Button,
  Card,
  CardBody,
  Image,
  Select,
  DateInput,
  TextInput,
  ResponsiveContext,
  Layer,
} from "grommet";
import { Close } from "grommet-icons";

const Search = () => {
  const location = useLocation();
  const size = useContext(ResponsiveContext);
  const navigate = useNavigate();

  // Extract search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  // Mock data for theatres and movies aligned with API endpoints
  const theatres = [
    { theatreID: 1, theatreName: "Cineplex VIP Cinemas", location: "Downtown", capacity: 200 },
    { theatreID: 2, theatreName: "Cineplex Odeon Westhills Cinemas", location: "Westhills", capacity: 150 },
    { theatreID: 3, theatreName: "Landmark Cinemas Market Mall", location: "Market Mall", capacity: 180 },
  ];

  const allMovies = [
    {
      movieID: 1,
      movieTitle: "The Great Gatsby",
      url: "/images/posters/gatsbyPoster.png",
      rating: 13, // Assuming rating is age-based
      duration: "2h 23min",
      genre: "Drama, Romance",
      showtimes: [
        { showtimeID: 101, theatreID: 1, date: "2024-11-28", time: "4:30 PM" },
        { showtimeID: 102, theatreID: 1, date: "2024-11-28", time: "8:30 PM" },
        { showtimeID: 103, theatreID: 2, date: "2024-11-29", time: "2:00 PM" },
        { showtimeID: 104, theatreID: 2, date: "2024-11-29", time: "6:00 PM" },
        { showtimeID: 100, theatreID: 2, date: "2024-11-26", time: "6:00 PM" },
      ],
    },
    {
      movieID: 2,
      movieTitle: "Wall-E",
      url: "/images/posters/wallePoster.jpg",
      rating: 0,
      duration: "1h 38min",
      genre: "Animation, Adventure",
      showtimes: [
        { showtimeID: 201, theatreID: 1, date: "2024-11-28", time: "12:50 PM" },
        { showtimeID: 202, theatreID: 2, date: "2024-11-28", time: "3:00 PM" },
        { showtimeID: 203, theatreID: 3, date: "2024-11-30", time: "1:30 PM" },
        { showtimeID: 204, theatreID: 3, date: "2024-11-30", time: "4:30 PM" },
      ],
    },
    {
      movieID: 3,
      movieTitle: "Cars",
      url: "/images/posters/carsPoster.jpeg",
      rating: 0,
      duration: "1h 57min",
      genre: "Animation, Comedy",
      showtimes: [
        { showtimeID: 301, theatreID: 1, date: "2024-11-28", time: "5:15 PM" },
        { showtimeID: 302, theatreID: 1, date: "2024-11-28", time: "6:45 PM" },
        { showtimeID: 303, theatreID: 1, date: "2024-11-28", time: "9:00 PM" },
        { showtimeID: 304, theatreID: 3, date: "2024-11-29", time: "2:00 PM" },
        { showtimeID: 305, theatreID: 3, date: "2024-11-29", time: "8:00 PM" },
      ],
    },
  ];

  // States for input fields
  const [query, setQuery] = useState(initialQuery);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // State for search parameters after submission
  const [searchParams, setSearchParams] = useState({
    query: initialQuery,
    selectedTheatre: null,
    selectedDate: null,
  });

  // State for filtered movies
  const [filteredMovies, setFilteredMovies] = useState([]);

  // New state for notification
  const [notification, setNotification] = useState(null);

  // Handle search submission
  const handleSearch = () => {
    if (!selectedTheatre || !selectedDate) {
      alert("Please select both a theatre and a date before searching.");
      return;
    }
    setSearchParams({
      query,
      selectedTheatre,
      selectedDate,
    });
  };

  // Function to handle showtime button click
  const handleShowtimeClick = (theatre, movie, showtime) => {
    // Create the notification message
    const message = `You selected:
Theatre: ${theatre.theatreName}
Movie: ${movie.movieTitle}
Date: ${showtime.date}
Showtime: ${showtime.time}`;

    // Set the notification state
    setNotification(message);

    // Delay navigation by 2 seconds to show the notification
    setTimeout(() => {
      navigate(`/seat-booking/${showtime.theatreID}/${movie.movieID}/${showtime.showtimeID}`, {
        state: {
          theatre,
          movie,
          showtime,
        },
      });
    }, 2000);
  };

  useEffect(() => {
    // Set default theater and tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Increment the current date by 1
    const formattedTomorrow = tomorrow.toISOString().slice(0, 10); // Format it to YYYY-MM-DD
  
    setSelectedTheatre(theatres[0]?.theatreID || null); // Default to the first theater
    setSelectedDate(formattedTomorrow); // Set tomorrow's date
  
    // Automatically apply search parameters
    setSearchParams((prev) => ({
      ...prev,
      selectedTheatre: theatres[0]?.theatreID || null,
      selectedDate: formattedTomorrow,
    }));
  }, []);

  // Filter movies based on submitted search parameters
  useEffect(() => {
    const { query, selectedTheatre, selectedDate } = searchParams;

    if (!selectedTheatre || !selectedDate) {
      // Both dropdowns must be selected
      setFilteredMovies([]);
      return;
    }

    const results = allMovies.filter((movie) => {
      // Filter by title
      const matchesTitle = query
        ? movie.movieTitle.toLowerCase().includes(query.toLowerCase())
        : true; // If no query, include all movies

      // Filter by theatre
      const matchesTheatre = movie.showtimes.some(
        (showtime) => showtime.theatreID === selectedTheatre
      );

      // Filter by date
      const matchesDate = movie.showtimes.some(
        (showtime) => showtime.date === selectedDate
      );

      // Return only if all conditions match
      return matchesTitle && matchesTheatre && matchesDate;
    });

    setFilteredMovies(results);
  }, [searchParams]);

  return (
    <Page background="light-3" fill>
      <Box pad="medium" align="center">
        {/* Display notification if it exists */}
        {notification && (
          <Layer
            position="top"
            modal={false}
            margin={{ vertical: "medium", horizontal: "small" }}
            onEsc={() => setNotification(null)}
            responsive={false}
            plain
          >
            <Box
              align="center"
              direction="row"
              gap="small"
              justify="between"
              round="small"
              elevation="medium"
              pad={{ vertical: "small", horizontal: "medium" }}
              background="status-ok"
            >
              <Text>{notification}</Text>
              <Button
                icon={<Close />}
                onClick={() => setNotification(null)}
                plain
              />
            </Box>
          </Layer>
        )}

        <PageHeader
          title={
            searchParams.selectedTheatre && searchParams.selectedDate
              ? `Search Results for "${searchParams.query}"`
              : "Please select Theatre and Date"
          }
        />
        <Box
          direction={size === "small" ? "column" : "row"}
          gap="medium"
          pad="medium"
          justify="center"
        >
          {/* Dropdown for selecting theatre */}
          <Select
            options={theatres}
            labelKey="theatreName"
            valueKey={{ key: "theatreID", reduce: true }}
            placeholder="Select a Theatre"
            value={selectedTheatre}
            onChange={({ value }) => setSelectedTheatre(value)}
            style={{  flex: 1, width: size === "small" ? "80%" : "300px", minWidth: "150px", }}
            
          />
          {/* Date picker for selecting date */}
          <DateInput
                format="yyyy-mm-dd"
                value={selectedDate || undefined}
                onChange={({ value: nextValue }) => {
                    if (!nextValue) {
                    setIsDatePickerOpen(false); // Close the date picker
                    return;
                    }
                    const date = Array.isArray(nextValue) ? nextValue[0] : nextValue;
                    const parsedDate = new Date(date);
                    if (isNaN(parsedDate.getTime())) {
                    setIsDatePickerOpen(false); // Close the date picker
                    return;
                    }
                    const formattedDate = parsedDate.toISOString().slice(0, 10);
                    setSelectedDate(formattedDate);
                    setIsDatePickerOpen(false); // Close the date picker after selecting a date
                }}
                onFocus={() => setIsDatePickerOpen(true)} // Open the date picker when input is focused
                open={isDatePickerOpen}
                calendarProps={{
                    bounds: [
                    new Date().toISOString().slice(0, 10),
                    new Date(new Date().setMonth(new Date().getMonth() + 2))
                        .toISOString()
                        .slice(0, 10),
                    ],
                }}
                style={{ flex: 1, width: size === "small" ? "80%" : "300px", minWidth: "150px" }}
        />
        </Box>
        {/* Search Bar with Search Button */}
        <Box
          margin={{ top: "medium" }}
          width={size === "small" ? "100%" : "large"}
          direction="row"
          align="center"
        >
            
          <TextInput
            placeholder="Search for movies..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ fontSize: "16px", padding: "10px", flex: 1 }}
          />
          <Button
            label="Search"
            onClick={handleSearch}
            margin={{ left: "small" }}
            disabled={!selectedTheatre || !selectedDate}
          />
        </Box>
        {filteredMovies.length > 0 ? (
          <Box gap="medium" width="large" margin={{ top: "medium" }}>
            {filteredMovies.map((movie) => (
              <Card
                key={movie.movieID}
                background="white"
                elevation="small"
                round="small"
              >
                <CardBody
                  pad="small"
                  direction={size === "small" ? "column" : "row"}
                  gap="small"
                  align="center"
                >
                  <Image
                    src={movie.url}
                    alt={movie.movieTitle}
                    fit="contain"
                    height="200px"
                    width="150px"
                  />
                  <Box>
                    <Text size="large" weight="bold">
                      {movie.movieTitle}
                    </Text>
                    <Text size="small">
                      Rating: {movie.rating} | Duration: {movie.duration} | Genre:{" "}
                      {movie.genre}
                    </Text>
                    <Box
                      direction="row"
                      gap="small"
                      wrap
                      margin={{ top: "small" }}
                    >
                      {movie.showtimes
                        .filter(
                          (showtime) =>
                            showtime.theatreID === searchParams.selectedTheatre &&
                            showtime.date === searchParams.selectedDate
                        ).length > 0 ? (
                        movie.showtimes
                          .filter(
                            (showtime) =>
                              showtime.theatreID ===
                                searchParams.selectedTheatre &&
                              showtime.date === searchParams.selectedDate
                          )
                          .map((showtime) => (
                            <Button
                              key={showtime.showtimeID}
                              label={`${showtime.time}`}
                              primary
                              color="brand"
                              size="small"
                              onClick={() =>
                                handleShowtimeClick(
                                  theatres.find(
                                    (theatre) =>
                                      theatre.theatreID === showtime.theatreID
                                  ),
                                  movie,
                                  showtime
                                )
                              }
                            />
                          ))
                      ) : (
                        <Text>No showtimes available at this location</Text>
                      )}
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </Box>
        ) : (
          <Box pad="medium" align="center">
            <Text>No results found for your search.</Text>
          </Box>
        )}
        <Box
          direction="row" gap="small" justify="center" margin={{ top: "medium" }}>
          <Button label="Go Back" onClick={() => window.history.back()} />
          <Button label="Home" onClick={() => (window.location.href = "/")} primary/>
        </Box>
      </Box>
    </Page>
  );
};

export default Search;