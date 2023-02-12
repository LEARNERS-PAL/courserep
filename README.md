<div align="center" id="top"> 
  <img src="./.github/app.gif" alt="Courserep" />

&#xa0;

  <!-- <a href="https://courserep.netlify.app">Demo</a> -->
</div>

<h1 align="center">Courserep</h1>

<!-- <p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/LEARNERS-PAL/courserep?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/LEARNERS-PAL/courserep?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/LEARNERS-PAL/courserep?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/LEARNERS-PAL/courserep?color=56BEB8">

  <img alt="Github issues" src="https://img.shields.io/github/issues/LEARNERS-PAL/courserep?color=56BEB8" />

  <img alt="Github forks" src="https://img.shields.io/github/forks/LEARNERS-PAL/courserep?color=56BEB8" />

  <img alt="Github stars" src="https://img.shields.io/github/stars/LEARNERS-PAL/courserep?color=56BEB8" />
</p> -->

Status

<h4 align="center"> 
	🚧  Courserep 🚀 Under construction...  🚧
</h4>

<hr>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="https://github.com/LEARNERS-PAL" target="_blank">Author</a>
</p>

<br>

## :dart: About

This is a WhatsApp bot that helps you to get the latest updates from your course reps.
It is intended to assist the course reps in their duties and to help students get the latest updates from their Lecturers.

It is built using [TypeScript](https://www.typescriptlang.org/), [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) and [Wweb.js](https://wwebjs.dev/).

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Yarn](https://yarnpkg.com/) (Optional)
- [Git](https://git-scm.com/)
- [wweb.js](https://wwebjs.dev/)

## :sparkles: Features Checklist

- [ ] Send reminders on lectures and tutorials
- [ ] Send reminders on assignments, tests and quizzes
- [ ] Send daily weather reports
- [ ] GPA calculator
- [ ] Used as dictionary
- [ ] Random jokes and quotes to make chat more lively
- [ ] ...............

## :rocket: Technologies

The following tools were used in this project:

- [Expo](https://expo.io/)
- [Node.js](https://nodejs.org/en/)
- [React](https://pt-br.reactjs.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.

## :checkered_flag: Starting

1. Clone the repo

```sh
git clone https://github.com/learners-pal/courserep.git
```

2. Install NPM packages

```sh
npm install
```

3. Create a `.env` file in the root directory and add the following

```sh
MONGO_URI=<your_mongo_uri>
```

4. Run the app

```sh
npm run bot
```

## :memo: Bugs 🐛

On start up, you are likely to get an error like this:

```sh
Error: TypeError: Cannot read property 'collection' of undefined in MongoStore ........
```

This is because the `MongoStore` is not yet connected to the database. To fix this,

1. Open the `node_modules/wwebjs-mongo/src/MongoStore.js` file and make the following changes on line 10 and 11

```sh
    # Before
      let multiDeviceCollection = this.mongoose.connection.db.collection(`whatsapp-${options.session}.files`);
      let hasExistingSession = await multiDeviceCollection.countDocuments();

    # After
      let multiDeviceCollection = this.mongoose.connection.db?.collection(`whatsapp-${options.session}.files`);
      let hasExistingSession = await multiDeviceCollection?.countDocuments();

```

2. Open the `node_modules/whatsapp-web.js/src/util/Injected.js` file and make the following changes on line 28

```sh
  # Before
  window.Store.QueryExist = window.mR.findModule('queryExists')[0].queryExists;

  # After
  window.Store.QueryExist = window.mR.findModule('queryExists')[0] ? window.mR.findModule('queryExists')[0].queryExists : window.mR.findModule('queryExist')[0].queryWidExists;
```

## :memo: Contributioin ##
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

<!-- ## :memo: License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file. -->


Made with :heart: by <a href="https://github.com/qbentil" target="_blank">Shadrack Bentil</a>

&#xa0;

<a href="#top">Back to top</a>
```
