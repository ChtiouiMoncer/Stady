Sports Reservation Web App
This is a web application for reserving sports facilities. It is built with Symfony, API Platform, React, and Material UI.

Features
Users can create an account and log in
Users can browse available sports facilities and view their availability
Users can reserve a sports facility for a specific date and time
Admin users can manage sports facilities and reservations
Requirements
PHP 7.4 or higher
Symfony 5.x
API Platform 2.x
Node.js 14.x or higher
React 17.x
Material UI 5.x
Installation
Clone this repository:

bash
Copy code
git clone https://github.com/<your-username>/<your-repo-name>.git
Install the backend dependencies:

bash
Copy code
cd backend
composer install
Set up the database:

bash
Copy code
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
Start the backend server:

sql
Copy code
symfony server:start
Install the frontend dependencies:

bash
Copy code
cd frontend
npm install
Start the frontend server:

sql
Copy code
npm start
Usage
Open your web browser and go to http://localhost:3000 to use the web app.

Contributing
Contributions are welcome! Please fork this repository and submit a pull request with your changes.
