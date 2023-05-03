import express from "express";
import fs from "fs";
const port = 8080
const app = express()

let data = await fs.promises.readFile('./products.json');
let merch = JSON.parse(data);
//console.log(merch);
       
serverStart()

async function serverStart() {
 
    app.listen(port, () => {
        console.log(`Example app listening on port http://localhost:${port}`);
    })
        
    app.get('/products', (req, res) => {
        const limit = req.query.limit;
        if(limit){
            const result = merch.slice(0, limit);
                return res.json(result);
            }
            else {
                return res.json(merch);
            }
    });
    
    app.get( '/products/:pid', (req, res) => {
        const id = req.params.pid;
        const product = merch.find((item) => item.id == id);
        if(product){
            return res.json(product);
        }else{
            return res.json("Product not found");

        };
    
    });
    
}


    
 