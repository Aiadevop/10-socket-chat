// //Mismo nombre que la colección sin la s.
// //Çotejamos en la base de datos que lo introducido es correcto.

// const { Schema, model } = require('mongoose');

// const ProductoSchema = Schema({

//     producto: {
//         type: String,
//         required: [true, 'La categoría es obligatoria.'],
//         unique:true

//     },
//     estado: {
//         type: Boolean,
//         default: true,
//         required: true
//     },
//     usuario: {
//         type: Schema.Types.ObjectId,
//         ref: 'Usuario',
//         required: true
//     },
//     precio: {
//         type:Number,
//         default:0
//     },
//     categoria:{
//         type: Schema.Types.ObjectId,
//         ref:'Categoria',
//         required: true
//     },
//     descripcion:{
//         type: String
//     },
//     disponible: {
//         type: Boolean,
//         default: true
//     }

// });

// ProductoSchema.methods.toJSON = function() {

//     //Se saca la versión y el password y todos los demás aparecen.
//     const { __v, estado, ...producto } = this.toObject();
//     return producto;
// }

// module.exports = model('Producto', ProductoSchema)