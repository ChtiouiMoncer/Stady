# Sports Reservation Web App
![image](https://github.com/ChtiouiMoncer/Stady/assets/46131932/0457022a-3c6b-468f-8a74-a41e63dcb873)

This is a web application for reserving sports facilities. It is built with Symfony, API Platform, React, and Material UI.

# Features

Users can create an account and log in
Users can browse available sports facilities and view their availability
Users can reserve a sports facility for a specific date and time
Admin users can manage sports facilities and reservations


# Requirements

PHP 7.4 or higher
Symfony 5.x
API Platform 2.x
Node.js 14.x or higher
React 17.x
Material UI 5.x


# Installation

-Clone this repository:
git clone https://github.com/<your-username>/<your-repo-name>.git

-Install the backend dependencies:
cd backend
composer install

-Set up the database:
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load

# Start the backend server:
symfony server:start

-Install the frontend dependencies:

cd frontend
npm install

# Start the frontend server:
npm start

# Usage
Open your web browser and go to http://localhost:3000 to use the web app.

# Contributing
Contributions are welcome! Please fork this repository and submit a pull request with your changes.

# Screenshots
![image](https://github.com/ChtiouiMoncer/Stady/assets/46131932/e85ab1e4-a014-46bb-84eb-cb1b230d0bf3)
![image](https://github.com/ChtiouiMoncer/Stady/assets/46131932/e6a77c39-08a6-4492-b246-9d52eab0a482)
![image](https://github.com/ChtiouiMoncer/Stady/assets/46131932/11c14797-d119-494d-9f80-6e58f45ac838)

# Other Features : 
The "Stady" web app is fully responsive and available in multi languages English per default and you can change to french !



