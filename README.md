# Overview

A cooking forum created with Next.js and MongoDB, heavily WIP

# Running 

Note, Docker and Node.js are required to run this application

Create a `.env.local` file with the following environmental variables:
- `MONGO_USER`: the username used when authenticating to mongodb
- `MONGO_PASS`: the password used when authenticating to mongodb
- `IMAGES_DIR`: path where to store images, start with a "/", don't end with a "/"

Run `docker compose --env-file .env.local up -d`

Then, run the following in the projects directory:

    1. npm install
    2. npm build
    3. npm start

Generate some lorem ipsum posts with `node genLoremPosts.mjs <number of posts to generate>`

Now the application is available at http://localhost:3000
