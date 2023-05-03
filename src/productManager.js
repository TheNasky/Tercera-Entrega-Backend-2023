import fs from "fs";

if (!fs.existsSync("products.json")) {
    fs.writeFileSync("products.json", "[]");
    }

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path
        this.idAutoInc = -1
    }
    async loadDB(){
        try{
            this.products = JSON.parse(fs.readFileSync(this.path))
            if(this.products.length>0){
            this.idAutoInc=this.products[this.products.length-1].id
            }
        }catch(err){
            console.log("Error loading database")
        }
    }

    async updateDB(){
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(this.products ,null, 2))
        }catch(err){
            console.log("Error updating database")
        }

    }
    
    async addProduct(title,description,price,thumbnail,code,stock){
        await this.loadDB()
        this.idAutoInc++
        const productIfRepeated = this.products.some(item => item.code === code)
        if(productIfRepeated === false && title && description && price && thumbnail && code && stock){
            this.products.push({
                id:this.idAutoInc,
                title: title,
                description:description,
                price:price,
                thumbnail:thumbnail,
                code:code,
                stock:stock

            })
            await this.updateDB()
        }else{
            console.log("Error, duplicated product or invalid parameters")
        }
    }

    async getProducts(){
        await this.loadDB()
        if(this.products){
            return this.products
        }else{
            console.log("Product list is empty.");
        }
       
    }

    async getProductById(id){
        await this.loadDB()
        const productIfExists = this.products.find(product => product.id === id)
        if(productIfExists){
            return productIfExists
        }else{
            console.log(`Failed to get Product, Product ${id} was not found`)
        }
    }

    async updateProduct(id,parameters){   // ahora funciona con cualquier cantidad de parametros sin necesidad de agregarlos acá manualmente >:3
        await this.loadDB()
        const index = this.products.findIndex(product => product.id === id)
        if(index !== -1){
            for (const property in this.products[index]) {  // cada propiedad del producto a actualizar 
                this.products[index][property]=parameters[property] ?? this.products[index][property]  // se cambia por la del objeto parametro o queda igual si es undefined
            }
            await this.updateDB()
            console.log(`Product ${id} Updated`) 
        }else{
            console.log(`Product ${id} was not found`) 
        }
    }

    async deleteProduct(id){
        await this.loadDB()
        const index = this.products.findIndex(product => product.id === id)
        if(index !== -1){
            this.products.splice(index,index+1)
            await this.updateDB()
            console.log(`Product ${id} Deleted succesfully`)
        }else{
            console.log(`Failed to Delete Product, Product ${id} was not found`)
        }
    }
}


const juansito = new ProductManager("products.json");

juansito.addProduct("empanada1","una rica empanada",330,"empanada.jpg","328a",33)
juansito.addProduct("empanada2","una rica empanada",330,"empanada.jpg","328b",33)
juansito.addProduct("empanada3","una rica empanada",330,"empanada.jpg","328c",33)
juansito.addProduct("empanada4","una rica empanada",330,"empanada.jpg","328d",33)
juansito.addProduct("empanada5","una rica empanada",330,"empanada.jpg","328e",33)
juansito.addProduct("empanada6","una rica empanada",330,"empanada.jpg","328f",33)

    
console.log(juansito.getProducts())

juansito.updateProduct(0,{price:620,stock:12,title:"churrasco",description:"alto churrasco",thumbnail:"churrascoJugoso.jpg"})

console.log(juansito.getProducts())