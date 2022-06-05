# **URLs monitor system**

urls-monitor is a simple web application that allows users to monitor their urls.

# Project Setup

## Requirements:

- install docker
- install docker-compose
- MongoDB database

## To run project locally:

- Clone repo `git clone https://github.com/abdelrhmanali29/urls-monitor.git`
- Add your environment variables in `.env.example`
- Change `.env.example` to '.env.production`
- Run `docker-compose up --build` in root folder
- Use [postman](https://www.postman.com/downloads/) to test endpoints or curl if you're cool
- Can find API docs ([swagger](https://swagger.io/)) at [http://localhost:3000/api/v1/docs](http://localhost/api/v1/docs) **(username: admin, password: admin)**

## Features

- Signup, Login, Logout, email verification
- Create checks
- Get reports

## How to ...?

### Protect endpoints

- check if token is provided
- Verification token if not valid it will
- Check if user still exists in database
- Check if user changed password after the token was issued
- If everything is OK, return current use

## Security

- Set security HTTP headers
- Limit requests from same API
- Body parser, reading data from body into req.body
- Data sanitization against NoSQL query injection
- Data sanitization against XSS
- Prevent parameter pollution

## TODO in the future

- Account lockout.
- Using caching in validations to speed them up.
