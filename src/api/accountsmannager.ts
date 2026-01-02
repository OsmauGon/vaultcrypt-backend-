import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma';
import { deriveSecretWord } from "../utils/swmannager";
import { Prisma } from '@prisma/client';
import { time } from 'console';

const numeroSaltos = parseInt(process.env.HASH_ROUNDS!)

export const accountsGlobalGet = async (req: Request, res: Response)=>{
    
    try {
        const accounts = await prisma.cuenta.findMany()
        if (!accounts){
            res.status(404).json({error: "No hay cuentas registradas"})
            return
        }
        res.status(200).json({message: `Se encontraron ${accounts.length} cuentas registradas:`,accounts})
    } catch (err) {
        res.status(500).json({error: 'Ocurrio un error', err})
    }

}
export const accountsIndividualGet = async (req: Request, res: Response)=>{
    
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: " falta el ID del usuario seleccionado" });
    }

    try {
        const account = await prisma.cuenta.findUnique({where: {id: Number(id)}})
        if (!account){
            res.status(404).json({error: `No se encontro la cuenta con el id ${id}`})
            return
        }
        res.status(200).json({account})
    } catch (err) {
        res.status(500).json({error: 'Ocurrio un error', err})
        console.error(err)
    }

}
export const accountsDelete = async (req: Request, res: Response)=>{
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: " falta el ID del usuario seleccionado" });
    }
    try {
        const deletedAccount = await prisma.cuenta.delete({where: {id: Number(id)}})
        if(deletedAccount){
            res.status(200).json({message: `Hemos borrado exitosamente el registro de cuenta ${id}`})
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025" ) {
                    res.status(400).json({meesage:`No existe un registro con el ID ${id}`})
                    }
            }
        res.status(500).json({message: "Ha ocurrido un error inesperado", error})
    }
}