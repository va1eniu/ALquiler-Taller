import { MongoClient, ObjectId } from "mongodb";
import { Router } from 'express';
import proxyUser from './middleware/proxyUser.js';
import dotenv from "dotenv";

dotenv.config();
const appCliente = Router();

const uri = process.env.MONGO_URI;
const dbName = "test";

appCliente.get("/", proxyUser, (req, res) => {
  res.send(JSON.stringify(req.body));
});

//2. Mostrartodoslosclientesregistradosenlabasededatos.

appCliente.get("/all:clients", async (req, res) => {
    try {
      const client = new MongoClient(uri);
      await client.connect();
  
      const db = client.db(dbName);
      const collection = db.collection("Clientes");
  
      const result = await collection.find().toArray();
  
      client.close();
  
      res.json(result);
    } catch (error) {
      console.error("Error al obtener todos los clientes", error);
      res.status(500).json("Error interno del servidor");
    }
  });

// 3. Obtener todos los automóviles disponibles para alquiler

appCliente.get("/automoviles_disponibles", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection("AutomovilesDisponibles");

    const result = await collection.find({ disponible: true }).toArray();

    client.close();

    res.json(result);
  } catch (error) {
    console.error("Error al obtener automóviles disponibles:", error);
    res.status(500).json("Error interno del servidor");
  }
});

// 4. Listar todos los alquileres activos con datos de clientes relacionados

appCliente.get("/alquileres_activos", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const alquileresCollection = db.collection("Alquileres");
    const clientesCollection = db.collection("Clientes");
    
    const result = await alquileresCollection
      .aggregate([
        {
          $match: { estado: "activo" }
        },
        {
          $lookup: {
            from: "Clientes", // Nombre exacto de la colección de clientes
            localField: "cliente_id", // Campo en "Alquileres" para relacionar
            foreignField: "_id", // Campo en "Clientes" para relacionar
            as: "cliente"
          }
        }
      ])
      .toArray();
  
    client.close();
  
    res.json(result);
  } catch (error) {
    console.error("Error al listar alquileres activos:", error);
    res.status(500).json("Error interno del servidor");
  }
});
  

// 5. Mostrar todas las reservas pendientes con datos del cliente y el automóvil reservado
appCliente.get("/reservas_pendientes", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const reservasCollection = db.collection("Reservas");
    const clientesCollection = db.collection("Clientes");
    const automovilesCollection = db.collection("Automoviles");

    const result = await reservasCollection
      .aggregate([
        {
          $match: { estado: "pendiente" }
        },
        {
          $lookup: {
            from: "Clientes",
            localField: "cliente_id",
            foreignField: "_id",
            as: "cliente"
          }
        },
        {
          $lookup: {
            from: "Automoviles",
            localField: "automovil_id",
            foreignField: "_id",
            as: "automovil"
          }
        }
      ])
      .toArray();

    client.close();

    res.json(result);
  } catch (error) {
    console.error("Error al mostrar reservas pendientes:", error);
    res.status(500).json("Error interno del servidor");
  }
});

// 6. Obtener los detalles de un alquiler específico por ID de alquiler
appCliente.get("/alquiler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const alquileresCollection = db.collection("Alquileres");

    const result = await alquileresCollection.findOne({ _id: new ObjectId(id) });

    client.close();

    if (result) {
      res.json(result);
    } else {
      res.status(404).json("Alquiler no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener detalles de alquiler:", error);
    res.status(500).json("Error interno del servidor");
  }
});

export default appCliente;
