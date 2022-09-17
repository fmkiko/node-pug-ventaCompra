import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from '../config/db.js';

// Crear la tabla usuarios
const Usuario = db.define('usuarios', {
    // campo nombre
    nombre: {
        type: DataTypes.STRING, //string hace referencia varchar
        allowNull: false // no se permite null
    },
    // campo email
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // campo password
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // campo token, no definimos el objeto ya que no tiene más atributos, es decir no requiere nada.
    token: DataTypes.STRING,
    // campo confirmado, igual que el token
    confirmado: DataTypes.BOOLEAN
   
},
{
    hooks:{
        beforeCreate: async function(usuario){
            // Generamos un salt de 10
            const salt = await bcrypt.genSalt(10);
            // hacemos el has:
            usuario.password = await bcrypt.hash( usuario.password, salt);
        }
    }
});

export default Usuario;