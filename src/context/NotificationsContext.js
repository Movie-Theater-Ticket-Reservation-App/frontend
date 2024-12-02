import React, { createContext, useState, useEffect } from 'react';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children, userID }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (userID) {
      try {
        const response = await fetch(`http://localhost:8080/users/${userID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        if (data.notificationHistory) {
          const fetchedNotifications = data.notificationHistory.map((notif, index) => ({
            id: index,
            message: notif.message,
          }));
          setNotifications(fetchedNotifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    }
  };

  useEffect(() => {
    const initializeNotifications = async () => {
      if (userID) {
        try {
          // Fetch the list of movies
          const moviesResponse = await fetch("http://localhost:8080/movies/");
          const movies = await moviesResponse.json();

          // Get today's date
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize time to midnight

          // Filter movies with future release dates
          const futureMovies = movies.filter((movie) => {
            const releaseDate = new Date(movie.releaseDate);
            return releaseDate > today;
          });

          // Fetch the user's profile
          const userProfileResponse = await fetch(
            `http://localhost:8080/users/${userID}`
          );
          const userProfile = await userProfileResponse.json();

          // Extract existing notification messages
          const existingMessages = userProfile.notificationHistory.map(
            (notification) => notification.message
          );

          // For each future movie, check if the notification exists
          for (const movie of futureMovies) {
            const message = `${movie.movieTitle} is coming out on ${movie.releaseDate}`;
            if (!existingMessages.includes(message)) {
              // Send notification to the notifications endpoint
              await fetch(`http://localhost:8080/notifications/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userID: userID,
                  message,
                }),
              });
            }
          }

          // Check for the membership fee notification
          const membershipMessage = "Membership fee automatically withdrawn";
          if (!existingMessages.includes(membershipMessage)) {
            // Send the membership fee notification
            await fetch(`http://localhost:8080/notifications/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userID: userID,
                message: membershipMessage,
              }),
            });
          }
        } catch (notificationError) {
          console.error("Error sending notifications:", notificationError);
        }

        // Now fetch the notifications
        await fetchNotifications();
      }
    };

    initializeNotifications();
  }, [userID]);

  return (
    <NotificationsContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};