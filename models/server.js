const cors = require('cors');
const express = require('express');
const { dbCOnexion } = require('../database/config.db');
require('dotenv').config();

class Server {
    constructor() {
        this.app = express();
        //db conexion
        this.connectDB();
        //middlewares
        this.middlewares();
        //paths 
        this.userPath = '/api/users';
        //app routes
        this.routes();
        this.port = process.env.PORT;
    }

    async connectDB() {
        await dbCOnexion();
    }

    routes() {
        this.app.use(this.userPath, require('../routes/user.routes'));
    }

    middlewares() {
        //el cors es para comunicarnos solo con
        //los clientes que deseemos
        this.app.use(cors());
        //lectura y parseo del body de una peticion
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    listen() {
        this.app.listen(this.port);
    }
}

module.exports = Server;