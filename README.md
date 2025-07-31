# WanderLust 

WanderLust is a full-stack web application inspired by Airbnb, allowing users to browse, create, review, and manage vacation rental listings from around the world.

## Features

- **User Authentication:** Sign up, log in, and log out securely using local strategy or Google OAuth.
- **Listings:** Browse all available listings, view details, and filter by location or type.
- **Create & Edit Listings:** Authenticated users can add new listings with images, edit their own listings, and delete them.
- **Image Uploads:** Upload listing images using Multer and Cloudinary integration.
- **Reviews:** Users can leave reviews and ratings on listings, and listing owners can manage reviews.
- **Responsive Design:** Mobile-friendly UI using Bootstrap 5.
- **Flash Messages:** User feedback for actions like login, signup, and CRUD operations.
- **Server-Side Validation:** Robust validation using Joi to ensure data integrity.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap 5, custom CSS
- **Authentication:** Passport.js (Local & Google OAuth)
- **Image Storage:** Cloudinary
- **Session Management:** express-session, connect-mongo
- **Validation:** Joi

## Project Structure

```
.
├── app.js
├── models/
├── controllers/
├── routes/
├── views/
├── public/
├── utils/
├── init/
├── cloudConfig.js
├── middleware.js
├── schema.js
├── .env
└── README.md