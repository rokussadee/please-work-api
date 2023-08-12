# DiscJunky – Back End

## Table of Contents

- About the Project
- Usage
- References
- Design

## About the project

This project was developed as a part of the "Web 2" course at Erasmushogeschool Brussel. The primary objective of this project was to create a web application that integrates music preferences, user authentication, and web scraping techniques.
The application utilizes the Express framework to build an API. It makes use of Spotify's Authorization Code Flow to log users in. This integration with Spotify enables the system to access users' favorite music.

Upon logging in, the application leverages the user's favorite music data to execute web scraping operations on Discogs, a platform renowned for its extensive collection of physical music releases. By linking the user's musical preferences to their favorite albums, the application searches Discogs for physical copies of those albums, allowing users to easily discover and potentially acquire items that match their musical tastes.

For more information about the Front End refer to the Front End repository's [README.md](https://github.com/EHB-MCT/web-2-frontend-22-23-rokussadee/blob/development/README.md) file.

## Usage

User must have a spotify account they can log in to. Upon clicking the "Log in with spotify" the user gets redirected to the Spotify Authorization page, and if login is successful, then redirected to /favorites.html.
For about ten seconds, no actual content will be rendered apart from the navigation menu to the right side. As of now, web scraping and content rendering are not ideal, so please wait a couple seconds for the Web Scraper to do its work. 

## References

- [Clean up MongoDB client on application shutdown ](https://stackoverflow.com/a/34321182)[(`index.js`: ln36)](./index.js)
- [Global mongodb variable for reusage of connections ](https://github.com/vercel/next.js/discussions/31416#discussioncomment-1754211)[(`mongodb.js`)](./db/mongodb.js)
- [Spotify connection largely based on *Spotify Web API Node*'s github page ](https://github.com/thelinmichael/spotify-web-api-node)[(`authentication.service.js`)](./services/authentication.service.js)
- [Web Scraping code written using Puppeteer.dev ](https://pptr.dev/)[(`listings.service.js`)](./services/listings.service.js)

