## About The Project

A full-stack, gamified web application inspired by tower defense mechanics, developed as part of Singapore Polytechnic's **Back-End Development (ST0503)** curriculum. 

The project delivers a secure RESTful API paired with an interactive frontend, featuring a complete in-game economy, unit inventory, and branching progression systems.

Users will need skillpoints to buy monkeys and then upgrade them. Users can also combine these monekys once they are fully maxed out. This can only be done for same types of monkeys and differnt upgrade paths.

### Key Features
* **Authentication & Security**: Secure user registration and login utilizing **bcrypt** password hashing and **JWT (JSON Web Tokens)** for stateless route protection and role verification.
* **Game Economy & Challenges**: Users complete skill-based challenges to earn skillpoints and currency.
* **Branching Upgrade & Fusion Engine**: Players spend points to acquire units, progress along non-linear upgrade paths, and fuse maxed-out units into advanced tier units.
* **Inventory Management (CRUD)**: Dynamic inventory tracking backed by relational database queries with MySQL connection pooling.
* **Community Reviews**: User-submitted ratings and reviews for units and challenge tiers.

### Tech Stack
* **Backend**: Node.js, Express.js (MVC Architecture)
* **Database**: MySQL (`mysql2` connection pool)
* **Authentication**: JWT, bcrypt
* **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
* **Testing**: Jest, Supertest
