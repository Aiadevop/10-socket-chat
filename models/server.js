const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller.socket');

class Server {


    constructor() {
        //Creamos express como una propiedad en el servidor.
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server );

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',


        }

        //Conectar a la base de datos
        this.conectarDB();

        //Middlewares (función que siempre se ejecuta al levantar nuestro servidor.)
        this.middlewares();

        //Rutas de mi aplicación.
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        //Cualquier información del front-end la va a intentar serializar a un JSON
        this.app.use(express.json());

        //.use es la palabra clave para determinar que es un middleware.
        this.app.use(express.static('public'));

        //Fileupload / Carga de Archivos    

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true //crea carpetas automaticamente

        }));
    }

    //Método con las rutas.
    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));


    }

    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    }

    //Puerto que escucha
    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto:', this.port);
        });
      
           
        
    }
    
}

module.exports = Server;