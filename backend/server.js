const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();  
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
