// CONFIGURANDO O SERVIDOR
const express = require("express")
const server = express()


//CONFIGURAR O SERVIDOR PARA APRESENTAR ARQUIVOS EXTRAS
server.use(express.static('public'))


//HABILITAR BODY DO FORMULARIO
server.use(express.urlencoded({extends: true}))

//CONFIGURAR COM BANCO DE DADOS
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'134679852',
    host:'localhost',
    port: 5432,
    database:'doe'
})

//CONFIGURANDO TEMPLATE ENGINE







const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache:true,
})

//CONFIGURAR APRESENTAÇÃO DA PAGINA
server.get("/", function (req, res) {
    
    db.query("SELECT * FROM donors", function(err,result){
        if(err) return res.send('Erro no banco de dados ')

        const donors = result.rows
        return res.render("index.html", {donors})
    })

    
})

server.post("/", function(req,res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatorios.")
    }

    //COLOCAR INFORMAÇÕES DO DB
    const query = `
            INSERT INTO donors ("name","email","blood") 
            VALUES($1,$2,$3)`

    const values = [name, email, blood]
    db.query(query, values, function(err){
        if (err) return res.send('Erro no banco de dados')

        //FLUXO IDEAL
        return res.redirect("/")
    })

    
})

// LIGAR SERVIDOR E PERMITIR ACESSO NA PORTA 3000
server.listen(3000)