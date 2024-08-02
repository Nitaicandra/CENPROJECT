# Set Up
1. Ensure you have node.js v21.7.3
2. [Install Docker Desktop](https://docs.docker.com/engine/install/) and make sure you can use docker-compose on CLI
3. [Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the main repository
4. Clone your forked repository
5. Important: You will need three .env files. Two will be inside the root and server package, while the other will be in the client package. These files are on our discord.
6. If on Windows, make sure you have your docker application open while running docker commands

# Run the application
1. Go to your local (forked) repository and build the containers:
```docker-compose up -d```

2. To stop the containers:
```docker-compose down```

# Usage

To access the frontend of the application, go to http://localhost:5173 \
To access the backend/api of the application, go to http://localhost:3001

# Development guidelines
1. Any changes in code must come in the form of a PR and from your forked repo

2. You can develop by only running the mongodb container (if needed) and then running the commands below:
For react/vite:
```npm run dev```

For node/express:
```npm run dev```

3. Make sure you build after every successful change in the frontend:
```npm run build```

4. Make sure you update the containers after development with:
```docker-compose up --build```

# Testing (Postman)

To see a list of all users, go to http://localhost:3001/api/users \
This can also be done as a POST on Postman using the same routing, it will return a list of all usernames, their account type, and unique id.

### Creating an Account

To create a test customer account, POST to http://localhost:3001/api/users/customers in this format: \
{ \
    "username": "a", \
    "password": "b", \
    "firstName": "c", \
    "lastName": "d", \
    "address": "e", \
    "zipCode": "12345", \
    "city": "g", \
    "state": "HI", \
    "email": "i@i.com", \
    "phoneNumber": "1234567890" \
}

To create a test business account, POST to http://localhost:3001/api/users/businesses in this format: \
{ \
    "username": "A", \
    "password": "B", \
    "businessName": "C", \
    "address": "D", \
    "zipCode": "12345", \
    "city": "F", \
    "state": "GA", \
    "email": "H@H.com", \
    "phoneNumber": "1234567890", \
    "availability": [{ \
    "Monday": [{"start": "9:00", "end": "12:00"}], \
    "Tuesday": [{"start": "9:00", "end": "12:00"}, {"start": "13:00", "end": "17:00"}] \
    }] \
}

These will return a login token, the username, and the account type.

### Logging In

To log in, Post to http://localhost:3001/api/login/ in this format: \
{ \
    "username": "A", \
    "password": "B" \
}

This will return a login token, the username, and the account type.

### Search

TBD

### Services

To request all services from a specific business, POST to http://localhost:3001/api/services/from/BUSINESS-ID with the business id in the BUSINESS-ID spot. \
This will require a valid login token, in Postman this is in the Authorization tab as a Bearer token. \


To request more details about a specific service, POST to http://localhost:3001/api/services/SERVICE-ID with the service id in the SERVICE-ID spot. \
This will return 

### Bookings

TBD

### Reviews

TBD