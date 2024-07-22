const searchRouter = require('express').Router();
const Service = require('../models/service');
const Customer = require('../models/customer')
const Business = require('../models/business');
const Auth = require('../models/authentication');
const jwt = require('jsonwebtoken');