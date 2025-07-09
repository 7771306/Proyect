//backend/controllers/authController.js

import bcrypt from 'bcrypt';
import {
    buscarUsuarioPorCorreo,
    crearUsuario,
    obtenerRolPorId
}from '../models/userModel.js';
export const register = async (req, res) => {
    const { nombre, correo, contraseña, id_rol } = req.body;
    const userExistente = await buscarUsuarioPorCorreo(correo);
    if (userExistente){
        return res.status(400).json({ message: 'Correo ya registrado'});
    }
    const hash = await bcrypt.hash(contraseña, 10);
    await crearUsuario(nombre, correo, hash, id_rol);
    res.status(201).json({ message: 'Usuario creado correctamente'});
};

export const login = async (req, res) => {
    const { correo, contraseña } = req.body;
    const user = await buscarUsuarioPorCorreo(correo);
    if(!user) return res.status(404).json({ message: 'Usuario no encontrado'});
    const esValido = await bcrypt.compare(contraseña, user.contraseña);
    if(!esValido) return res.status(401).json({ message: 'Contraseña incorrecta'});
    const rol = await obtenerRolPorId(user.id_rol);
    res.status(200).json({ message: 'Login exitoso', rol});
};
