# AcmePlex Movie Theatre Reservation Frontend

Welcome to the **AcmePlex Movie Theatre Reservation** frontend application! This is a React-based web application that allows users to browse movies, select showtimes, book seats, make payments, and manage reservations at AcmePlex cinemas.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Register and log in to your AcmePlex account.
- **Movie Search**: Search for movies by title, genre, or keywords.
- **Seat Booking**: Select seats in a visual layout for available showtimes.
- **Payment Processing**: Securely make payments for your reservations.
- **Profile Management**: View and edit your user profile and booking history.
- **Notifications**: Receive updates and notifications about your bookings.
- **Refund Processing**: Request refunds for eligible bookings.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Grommet**: A React-based framework that provides accessibility, modularity, responsiveness, and theming.
- **React Router DOM**: For handling in-app routing.
- **Context API**: For state management (Authentication and Notifications).
- **Grommet Icons**: Iconography for visual enhancements.
- **DeepMerge**: Utility for deep merging of theme configurations.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 14 or above.
- **npm**: Node Package Manager (comes with Node.js) or **yarn** as an alternative.

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/acmeplex-frontend.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd acmeplex-frontend
   ```

3. **Install Dependencies**
   Using npm:
   ```bash
   npm install
   ```

## Running the Application

To start the development server, run:

Using npm:

```bash
   npm run
```

This will launch the app on http://localhost:3000 in your default web browser. The app will automatically reload if you make changes to the code.

## Available Scripts

In the project directory, you can run:
• npm start: Runs the app in development mode.
• npm run build: Builds the app for production to the build folder.
• npm run eject: Ejects the app from Create React App configuration (irreversible).

## Project Structure

An overview of the project’s file and folder structure:

```bash
acmeplex-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── (Shared components)
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── NotificationsContext.js
│   ├── pages/
│   │   ├── App.js
│   │   ├── Landing.js
│   │   ├── Login.js
│   │   ├── Profile.js
│   │   ├── Register.js
│   │   ├── Tickets.js
│   │   ├── Payments.js
│   │   ├── Search.js
│   │   ├── Successful.js
│   │   ├── SeatBooking.js
│   │   ├── MakePayment.js
│   │   ├── ProcessRefund.js
│   │   └── 404.js
│   ├── index.js
│   └── styles/
│       └── (CSS or styled-components)
├── package.json
└── README.md
```

Thank you for using AcmePlex! If you have any questions or need assistance, please open an issue or contact the project maintainers.
