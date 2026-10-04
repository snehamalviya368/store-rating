# Store Rating App

A web app where users can rate stores from 1 to 5.
Built with **React** (frontend), **Express.js** (backend) and **MySQL** (database).

## What each role can do

**System Administrator**
- Dashboard with total users, stores and ratings
- Add users (normal user, admin, store owner) and add stores
- See lists of users and stores, with filters (name, email, address, role) and sorting
- Click "View" on a user to see details (store owners also show their store's rating)

**Normal User**
- Sign up and log in
- See all stores, search by name and address, sort by clicking the column headings
- Give a rating (1 to 5) to a store and change it later
- Change own password

**Store Owner**
- Log in and change own password
- Dashboard with the store's average rating and the list of users who rated it

All roles use the same login page and can log out from the top bar.

## How to run

You need Node.js and MySQL installed.

### 1. Database
Run the schema file in MySQL (this creates a database called `store_rating`):
```
mysql -u root -p < backend/schema.sql
```

### 2. Backend
```
cd backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```
Open `.env` and set your MySQL password (`DB_PASSWORD`) and any random text for `JWT_SECRET`. Then:
```
npm run seed              # creates the first admin account
npm run dev               # starts the server on http://localhost:5000
```

### 3. Frontend
Open a second terminal:
```
cd frontend
npm install
npm run dev
```
Open the link shown in the terminal (usually http://localhost:5173).

## First login

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@example.com | Admin@123 |

Log in as admin, then use **Add User** (choose role "Store Owner") and **Add Store** (pick that owner) to set things up. Normal users can register themselves from the sign up page.

## Validation rules (frontend and backend both check these)
- Name: 20 to 60 characters (also used for store names)
- Address: required, max 400 characters
- Password: 8 to 16 characters, at least one capital letter and one special character
- Email: must look like a real email

## Project structure
```
backend/
  server.js          starts the app
  seed.js            creates the first admin
  schema.sql         database tables
  src/
    db.js            MySQL connection
    middleware.js    login check and role check
    validate.js      validation rules
    storeQueries.js  store list with average rating
    routes/          auth, admin, stores, owner
frontend/src/
  pages/             Login, Signup, AdminDashboard, UserStores, OwnerDashboard
  components/        Navbar, SortableTable, UserForm, ChangePassword, admin/...
  api.js             helper to call the backend
  validation.js      same rules as the backend
```

## Notes
- Passwords are stored hashed (bcrypt). Logins use JWT tokens.
- Sorting column names are checked against a fixed list before going into SQL.
- A user can have only one rating per store; rating again just updates it.
- If you ran an older version of this project, the new database is named `store_rating` so it will not clash with the old one.
