const express = require('express');
const cors = require('cors');
const initTables = require('../src/configs/initTables');
const addAdminUser = require("../src/configs/createDemo");

const app = express();

// Enable CORS with specific origin
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Allow only frontend server at this URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions)); // Apply CORS configuration

// Make sure tables are initialized before adding admin user
const initializeSystem = async () => {
    try {
        await initTables(); // Wait for tables to be created first
        await addAdminUser(); // Then add admin user
    } catch (error) {
        console.error('Error initializing system:', error);
    }
};

// Initialize tables and add admin user
initializeSystem();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from 'frontend/src'
app.use(express.static('frontend/src'));

// Define your routes here
const mainRoutes = require('./routes/mainRoutes');
app.use("/api", mainRoutes);

// Don't start the server here, just export the app
module.exports = app;
