# GeoHelper Back

> Node.js application having [GeoHelper-Front](https://github.com/RTUITLab/GeoHelper-Front) as a frontend

## Configuration

First of all, you need to have Mongodb with enabled authorization.

After setting up database, you have to define env variables:
+ `M_USER`: mongodb username
+ `M_PASS`: mongodb password
+ `M_HOST`: mongodb host name or IP address
+ `M_PORT`: port that mongodb is listening
+ `M_DB`: batabase name
+ `M_SECRET`: secret string that is used inside app
+ `PORT`: port where application will be launched
+ `A_USER`: name of default user
+ `A_PASS`: default user password

In the end, run `npm install` to install all required dependences.

## Building

To run this application run `node services`.

## API Documentation

Description of GeoHelper Backend API is available [here](https://documenter.getpostman.com/view/8340120/T1LQfQfY).
