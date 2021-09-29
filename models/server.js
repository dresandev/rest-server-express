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
        this.paths = {
            auth      : '/api/auth',
            categories: '/api/categories',
            user      : '/api/users',
            products  : '/api/products',
            search    : '/api/search',
        };
        //app routes
        this.routes();
        this.port = process.env.PORT;
        this.host = process.env.HOST;
    }

    async connectDB() {
        await dbCOnexion();
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.user, require('../routes/user.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
    }

    middlewares() {
        //el cors es para comunicarnos solo con
        //los clientes que deseemos
        this.app.use(cors());
        //lectura y parseo del body de una peticion
        this.app.use(express.json());
        //para manejar el contenido estatico en la carpeta public
        this.app.use(express.static('public'));
    }

    listen() {
        this.app.listen(this.port, this.host);
    }
}

module.exports = Server;