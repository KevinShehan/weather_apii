# Node.js Weather Report Application

## Overview

This is a Node.js API that stores users’ emails and locations, and automatically sends weather reports every hour. The application uses MongoDB to store user data and weather reports, the OpenWeatherMap API to fetch weather data, and Nodemailer with Gmail to send emails. For testing, weather reports are sent every minute.

## Features

- Store user details including email and location.
- Update users’ locations.
- Fetch weather data for a user for a given day.
- Automatically send weather reports every hour.
- For testing, weather reports can be sent every minute.
- Provides endpoints to manually trigger weather report emails.

## Requirements

- Node.js
- MongoDB
- OpenWeatherMap API Key
- Gmail Account for Nodemailer

## Setup

### Prerequisites

1. Install [Node.js](https://nodejs.org/en/download/) and [MongoDB](https://docs.mongodb.com/manual/installation/).

2. Sign up for the [OpenWeatherMap API](https://openweathermap.org/api) and get an API key.

3. Ensure you have a Gmail account and enable [less secure app access](https://myaccount.google.com/security).
turn on app password use as password

### Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/weather-report-app.git
   cd weather-report-app

2. open the terminal and run npm i to install nodemodules
3. afther that to run this application type npm run in terminal
Thank you
