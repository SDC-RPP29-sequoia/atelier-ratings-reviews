# Atelier

# ratings-reviews
API service for handling the 'Ratings and Reviews' module of the Atelier shopping app.

## Setup
- **Clone/pull repo**
- `npm install`
- Create a GitHub authorization token and store it in **`config.js`** (make sure it's `.gitignored`).
- `npm start` for the server
- `npm run build` (in a separate terminal) for webpack/react/index.html
- Navigate to `http://localhost:3000` in browser

## Contributing
- Install Pomander before attempting to push commits:
- `curl -s https://raw.githubusercontent.com/reactorcore/pomander/master/bin/install | bash`

## Documentation
- Documentation such as diagrams for the app and UX styling guidelines are stored in the **`./docs`** directory.
- See the [web style guide](./docs/web-style-guide.md) for the standards we are following for coding and project organization.

## Team Members
- [Mark Thomas](https://github.com/MarkPThomas) - [Engineering Journal](https://gist.github.com/MarkPThomas/6f8bf2493309b1daf45cc4641e596a6c)


## Testing (IP)
- [Jest](https://jestjs.io/) is the framework chosen to test React and probably all JavaScript code in the app.
- Tests are located in the **`./tests`** directory
- ```npm test``` to run the tests

# Continuous Integration (IP)
Basic test of JavaScript continuous integration uses [CircleCI](https://circleci.com/) to run the tests, and [Coveralls](https://coveralls.io/) for reporting test coverage.

Circle CI: [![SDC-RPP29-sequoia/atelier-ratings-reviews](https://circleci.com/gh/https://app.circleci.com/pipelines/github/SDC-RPP29-sequoia/atelier-ratings-reviews.svg?style=svg)](https://app.circleci.com/pipelines/github/SDC-RPP29-sequoia/atelier-ratings-reviews)

Coveralls: [![Coverage Status](https://coveralls.io/repos/github/rpp29-fec-gouda/atelier/badge.svg)](https://coveralls.io/github/rpp29-fec-gouda/atelier)

# SonarCloud (IP)
Additionally, [SonarCloud](https://sonarcloud.io/projects) is used for an overall check of code quality.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=alert_status)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Quality: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=alert_status)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Maintainability: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Reliability: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Security: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=security_rating)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Lines of Code: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=ncloc)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Coverage: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=coverage)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Bugs: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=bugs)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Code Smells: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=code_smells)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)

Technical Debt: [![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SDC-RPP29-sequoia_atelier-ratings-reviews&metric=sqale_index)](https://sonarcloud.io/dashboard?id=SDC-RPP29-sequoia_atelier-ratings-reviews)
