import dotenv from 'dotenv';
import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
dotenv.config();
const appExpress = express();
// https://jwt.io/
// https://github.com/panva/jose

appExpress.use(express.json());
appExpress.use("/campus", appCliente);
const config = {
  hostname: "127.10.16.15",
  port: 5020
};
appExpress.listen(config, ()=>{
  console.log(`http://${config.hostname}:${config.port}`);
})


appExpress.get("/:id/:nombre", async(req,res)=>{
    // https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md
    let json = {
        id: req.params.id,
        nombre: req.params.nombre
    }
    const encoder = new TextEncoder();
    const jwtconstructor = new SignJWT({json});
    const jwt = await jwtconstructor
    .setProtectedHeader({alg:"HS256", typ: "JWT"})
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
    res.send({jwt});
})

appExpress.post("/", async(req,res)=>{
    // https://github.com/panva/jose/blob/main/docs/functions/jwt_verify.jwtVerify.md
    const {authorization} = req.headers;
    if (!authorization) return res.status(401).send({token: ":("});
    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            authorization,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );
        res.send(jwtData);
    } catch (error) {
        res.status(401).send({token: "Algo salio mal"});
    }
})

appExpress.listen(5010, ()=>{
    console.log(`http://localhost:5010/`);
})