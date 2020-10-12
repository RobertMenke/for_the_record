## Run the project

#### Pre-requisites
- NPM is installed
- Node.js is installed

#### Set up
- Clone the repository (the npm `postinstall` script should set up and run the project)

If postinstall doesn't work for some reason:
- cd into the project directory
- Run `npm i && npm run build && npm run start:prod`

## Running the tests
- `npm test`

## Additional Questions
#### Question
You have a new requirement to implement for your application: its logic should stay exactly the same but it will need to have a different user interface (e.g. if you wrote a web app, a different UI may be a REPL).
Please describe how you would go about implementing this new UI in your application? Would you need to restructure your solution in any way?

#### Answer
This repository is organized into services and uses the repository pattern for state management. The business logic in each service is coordinated using `CommandLineUiController`. If I were to implement a different UI I would need to create an additional controller. For example, if I were creating a web app I would create an HTTP controller called `NumberInputController`. `NumberInputController` would have 2 endpoints.

- PUT `/api/output-frequency`
- PUT `/api/next-number`

These endpoints would roughly correspond to the methods `start` and `handleInput` in `CommandLineUiController`. The entry point would need to be adjusted to use a command line argument to indicate whether the app should launch as a console app or as a web app. The key difference is that the web app would bind to a port and running continuously while the console app executes immediately and exits when the program has finished collecting input. 

#### Question
You now need to make your application “production ready”, and deploy it so that it can be used by customers.
Please describe the steps you’d need to take for this to happen.

#### Answer
In order to make this project production ready I would do the following:
- Instead of using an in-memory data store I'd use a SQL database. My `FrequencyRepository` class would become a `TypeORM` repository and my `FrequencyStore` would become a `TypeORM` entity.
- I would do user research to determine which fibonacci values were most likely to be input. Based on my findings I would consider either memoizing the fibonacci determination function or potentially using a caching layer like memcached or redis to avoid redundant computations.
- I would use environment variables to govern information like the maximum fibonacci range and the port to bind to in the case of a web app.
- I would create a Dockerfile to containerize the application when used as a web app.
- I would use a continuous integration service like CircleCI or GitHub Actions to run verify my tests pass and linting rules are honored on each commit. 
- For the CLI app I would use the oclif framework and upload the repository to NPM with installation and usage instructions
- For the web app I would use a service like Heroku, AWS, or Azure to provision a server and set up DNS/SSL

#### Question:
What did you think about this coding test - is there anything you’d suggest in order to improve it?

#### Answer
Overall I think the test was good. The idea of supporting multiple user interfaces is a good test of one's ability to create modular software. The command line interface also provides an interesting testing problem since a CLI blocks while waiting for input. The one thing I would clarify is whether you intended to test for fibonacci numbers up to the number 1000 or if you intended to test for the first 1000 numbers in the fibonacci sequence. I was unsure but err'd on the side of caution and used ES2020's `BigInt` to handle the very large numbers that are produced 1000 iterations in to the fibonacci sequence.
