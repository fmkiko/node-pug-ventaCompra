import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});
const nombreDB = process.env.DB_NOMBRE;
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const db = new Sequelize(nombreDB, userName, password, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    difene:{
        timestamps: true // Para que cree automaticamente en la db create_at y udata_at
    },
    // matener y reutilizar las conexiones que este vivas con pool
    pool: {
        max: 5, // Maximas conexiones a matener por usuario
        min: 0, // minima cuando no hay actividad 0
        acquire: 30000, // 30 segunos antes de lanzar el error
        idle: 10000 // 10segundo sin actividad y desconecta db´s
    },
    operatorAliases: false
} );

export default db;