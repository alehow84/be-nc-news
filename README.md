# Northcoders News API

Welcome to Northcoders News API!

This project is a backend service built with the purpose of accessing data programatically. It aims to mimic real-world social news platforms (such as Reddit or Lemmy) and will later be used to feed information to front-end architecture. 

To see the hosted application visit: https://nc-news-dcnn.onrender.com/api

The first page you will see on loading lists the different endpoints available and includes an example response - give them a try 😎

To play around with the code:

1. Ensure you have Node.js (v20.8.0 or later) & PostgreSql (v16.1 or later) installed 
2. Fork and then Clone this repo to your local machine

```
git clone https://github.com/alehow84/be-nc-news.git
```
  
3. Navigate to the project directory & install the dependencies using the command: npm install
4. Create two .env files in the project root. .env.test for the testing environment, and .env.development for the development environment. 
5. In both .env files, add 'PGDATABASE=' followed by the correct database name. Please see /db/setup.sql
6. Ensure both .env files are added to the .gitignore

You're ready to go! 

Here are your commands: 

- To set up the database: npm run setup-dbs 
- To seed the local database: npm run seed
- To run tests: npm test
