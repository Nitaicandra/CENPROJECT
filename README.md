# Set Up
1. Ensure you have node.js v21.7.3
2. [Install Docker Desktop](https://docs.docker.com/engine/install/) and make sure you can use docker-compose on CLI
3. [Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the main repository
4. Clone your forked repository
5. Important: You will need two .env files. One to be placed within the server package, and another in the root of the project. You can get these files in our discord channel :)

# Run the application
1. Go to your local (forked) repository and build the containers:
```docker-compose up -d```

2. To stop the containers:
```docker-compose down```

To access the frontend of the application, go to http://localhost:5137
To access the backend/api of the application, go to http://localhost:30001

# Development guidelines
1. Any changes in code must come in the form of a PR and from your forked repo

2. You can develop by only running the mongodb container (if needed) and then running the commands below:
For react/vite:
```npm run dev```

For node/express:
```npm run dev```

3. Make sure you build after every successful chnage in the frontend:
```npm run build```

4. Make sure you update the containers after development with:
```docker-compose up --build```