[![Build Status](https://travis-ci.org/dev2peak/simple-multi-container-app.svg?branch=master)](https://travis-ci.org/dev2peak/simple-multi-container-app)

# Multi-container Application 

## Client

A simple React application, serving the UI and handling user interactions, and communicating with the Server.

Default React Application, listen for requests on port 3000.

## Server

An Express server, working as the mediator coordinating the communication with the Cache and DB, to put/get API requests.

Listen on port 5000.

## Worker

The actual worker node, doing the job requests for the compute.

## Other Components

### Gateway (Ngnix)

Listen on port 8080.

### Database (Postgres)

### Cache (Redis)

