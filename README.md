# Gun Inventory App

Express + MongoDB + Passport app that matches the provided schema and routing requirements.

## Features

- User registration and login with Passport local strategy
- User schema with `name`, `age`, `phoneNumber`, `gender`, and `isLegal`
- Gun schema with `gunName`, `price`, `automatic`, and timestamps
- Gun CRUD with routes using `/guns/:id` and `/guns/:id/delete`
- Bootstrap client-side validation
- Top-right authenticated user display in the navbar

## Setup

1. Install dependencies.
2. Create a `.env` file from the example below.
3. Start MongoDB locally or point to a MongoDB Atlas connection string.
4. Run `npm start`.

## Environment

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/your_database_name
SESSION_SECRET=replace_this_with_a_long_random_string
```
