Step by Step Guide to writing Unit Tests for Express API

Unit testing is a software development process in which the smallest testable parts of an application, called units, are individually and independently scrutinized for proper operation. It is a very important aspect of software development. The main objective of unit testing is to isolate written code to test and determine if it works as intended.

Unit testing is a crucial stage in the development process because, when done properly, it can aid in finding early code issues that could be more challenging to identify in subsequent testing phases.

In this article, I hope to show you how to write unit test for your Express API.

![bravo!](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mc0aud6g0kph01art5m4.gif)

## Why is Unit Testing important?

As a developer, you should always strive to write clean, maintainable, and reliable code. Unit testing is one of the ways to achieve this.
Early in the development cycle, writing unit tests enables the discovery of flaws before they contaminate later stages.

## Prerequisites

Before we start writing unit tests, we need to have a basic understanding of the following:

- Express
- MongoDB
- Mocha
- Chai

## Setting up the project

We will be using a simple Express API to demonstrate how to write unit tests. The API will be a simple blog API that allows users to create, read, update, and delete blog posts.

To get started, create a new folder and initialize a new Node.js project by running the following command in your terminal:

    `npm init -y`

Next, install the following dependencies:

      `npm i express mongoose nodemon mocha chai chai-http --save-dev`

- Express: A web framework for Node.js
- Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js
- Mocha: A JavaScript test framework for Node.js
- Chai: A BDD / TDD assertion library for Node.js
- Chai-http: HTTP integration testing with Chai assertions
- Nodemon: A utility that will monitor for any changes in your source and automatically restart your server

## Setting up the Express API

Create a new file named app.js and add the following code:

  ```js	
    const express = require('express');
    const mongoose = require('mongoose');
    const app = express();

    mongoose.connect('mongodb://localhost:27023/blog', { useNewUrlParser: true, useUnifiedTopology: true });

    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  ```

In the code above, we are importing the required dependencies, initializing the Express app, connecting to the MongoDB database, and setting up the server.

Next, create a new folder named routes and add a new file named blog.js. Add the following code to the file:

```js
    const express = require('express');
    const router = express.Router();

    router.get('/', (req, res) => {
      res.send('Hello World!');
    });

    module.exports = router;
  ```

In the code above, we are importing the required dependencies, initializing the Express router, and creating a simple GET route.

Next, add the following code to the app.js file:

```js

    const blogRoutes = require('./routes/blog');

    app.use('/blog', blogRoutes);
  ```

In the code above, we are importing the blog routes and adding them to the Express app.

## Setting up the MongoDB database

Create a new folder named models and add a new file named blog.js. Add the following code to the file:

```js
    const mongoose = require('mongoose');

    const blogSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      }

    }, { timestamps: true });

    module.exports = mongoose.model('Blog', blogSchema);

  ```

In the code above, we are importing the required dependencies, creating a new schema, and exporting the model.


Next, create a new folder named test and add a new file named blog.js. Add the following code to the file:

```js
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    const app = require('../app');
    const Blog = require('../models/blog');

    const should = chai.should();

    chai.use(chaiHttp);
  ```
In the code above, we are importing the required dependencies, initializing the Express app, and importing the Blog model.

## Writing the unit tests

Now that we have set up the project, let's write the unit tests.

Before  writing the unit tests, let's pay attention to the following keywords used in testing Express APIs:

- **describe**: This is used to group tests together. It takes two arguments, the first is a string that describes the test, and the second is a callback function that contains the tests.

- **it**: This is used to write a test. It takes two arguments, the first is a string that describes the test, and the second is a callback function that contains the test.

- **before**: This is used to run a function before all the tests in a describe block. It takes a callback function that contains the code to be executed.

- **beforeEach**: This is used to run a function before each test in a describe block. It takes a callback function that contains the code to be executed.

- **after**: This is used to run a function after all the tests in a describe block. It takes a callback function that contains the code to be executed.

- **afterEach**: This is used to run a function after each test in a describe block. It takes a callback function that contains the code to be executed.

- **request**: This is used to make HTTP requests to the Express app. It takes two arguments, the first is the Express app, and the second is a callback function that contains the code to be executed.

- **end**: This is used to end the request. It takes a callback function that contains the code to be executed.

- **should**: This is used to make assertions. It takes a callback function that contains the code to be executed.


### Testing the GET route

Add the following code to the blog.js file:

```js
    describe('GET /blog', () => {
      it('should get all the blog posts', (done) => {
        chai.request(app)
          .get('/blog')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });
    });
  ```

In the code above, we are describing the GET route, and testing if the route returns a status code of 200, an array, and an empty array.

### Testing the POST route

Add the following code to the blog.js file:

```js
    describe('POST /blog', () => {
      it('should not create a blog post without title field', (done) => {
        let blog = {
          body: 'This is the body'
        }
        chai.request(app)
          .post('/blog')
          .send(blog)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('title');
            res.body.errors.title.should.have.property('kind').eql('required');
            done();
          });
      });

      it('should create a blog post', (done) => {
        let blog = {
          title: 'This is the title',
          body: 'This is the body'
        }
        chai.request(app)
          .post('/blog')
          .send(blog)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Blog successfully added!');
            res.body.blog.should.have.property('title');
            res.body.blog.should.have.property('body');
            done();
          });
      });
    });
  ```

In the code above, we are describing the POST route, and testing if the route returns a status code of 200, an object, and an error message if the title field is not provided. We are also testing if the route returns a status code of 200, an object, and a success message if the title and body fields are provided.

### Testing the GET (by id) route

Add the following code to the blog.js file:

```js
    describe('GET /blog/:id', () => {
      it('should get a blog post by the given id', (done) => {
        let blog = new Blog({
          title: 'This is the title',
          body: 'This is the body'
        });
        blog.save((err, blog) => {
          chai.request(app)
            .get('/blog/' + blog.id)
            .send(blog)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('title');
              res.body.should.have.property('body');
              res.body.should.have.property('_id').eql(blog.id);
              done();
            });
        });

      });
    });
  ```

In the code above, we are describing the GET (by id) route, and testing if the route returns a status code of 200, an object, and the blog post with the given id.

### Testing the PUT route

Add the following code to the blog.js file:

```js
    describe('PUT /blog/:id', () => {
      it('should update the blog post given the id', (done) => {
        let blog = new Blog({
          title: 'This is the title',
          body: 'This is the body'
        });
        blog.save((err, blog) => {
          chai.request(app)
            .put('/blog/' + blog.id)
            .send({
              title: 'This is the updated title',
              body: 'This is the updated body'
            })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('Blog updated!');
              res.body.blog.should.have.property('title').eql('This is the updated title');
              res.body.blog.should.have.property('body').eql('This is the updated body');
              done();
            });
        });
      });
    });
  ```

In the code above, we are describing the PUT route, and testing if the route returns a status code of 200, an object, and a success message if the blog post with the given id is updated.

## Running the tests

To run the tests writen, we need to update the package.json file. Add the following code to the scripts object:

```js
    "test": "mocha"
```
    
Then run the following command in the terminal:
    
```js
  npm test
```

The tests should run successfully and the output should be similar to the one below:

```js
  Blog
    GET /blog
      ✓ should get all the blog posts
    POST /blog
      ✓ should not create a blog post without title field
      ✓ should create a blog post
    GET /blog/:id
      ✓ should get a blog post by the given id
    PUT /blog/:id
      ✓ should update the blog post given the id
    
    5 passing (1s)
```

## Conclusion

In this tutorial, we have learned how to write tests for a RESTful API using Mocha and Chai. We have also learned how to test the GET, POST, GET (by id), and PUT routes.


