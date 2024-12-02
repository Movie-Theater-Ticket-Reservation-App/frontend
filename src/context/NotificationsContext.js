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
    fetchNotifications();
  }, [userID]);

  return (
    <NotificationsContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};