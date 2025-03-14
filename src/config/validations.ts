import mongoose from "mongoose"

export const validations = {

  // Expresión regular para validar correos electrónicos
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  
}

export class Validators {
  static isMongoID( id: string ){
    return mongoose.isValidObjectId(id);
  }
}