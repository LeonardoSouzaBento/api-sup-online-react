import express, {Request, Response} from "express";

const app = express();
app.use(express.json())

type User = {id:number; nome:string; email:string};

// const usuarios = [{nome: 'João', idade: 20}, {nome: 'Maria', idade:19}];
let usuarios: User[]=[];
let id = 1;

app.get("/users", (req: Request, res: Response)=>{
    res.send(usuarios);
})

//pegar um usuario especifico: ":id"
app.get("/users/:id", (req: Request, res: Response)=>{
    let userID= Number(req.params.id);
    let user = usuarios.find(user=>user.id===userID);
    res.send(user);
})

//cadastro
app.post("/users", (req: Request, res: Response)=>{
    let user = req.body; //simular a entrada
    usuarios.push(user) //simular o cadastro de usuario
    user.id = ++id;
    res.send({mensage: "Usuario cadastrado com sucesso"})
})

//
app.delete("/users/:id", (req: Request, res: Response)=>{
    let userID= Number(req.params.id);
    const index = usuarios.findIndex(user => user.id === userID);
    usuarios.splice(index, 1)
    res.send("usuário deletado com sucesso");
})

app.put("/users/:id", (req: Request, res: Response) => {
    let userId = Number(req.params.id);
    let user = req.body;
    let index = usuarios.findIndex((_user:User) => _user.id === userId);
    usuarios[index].nome = user.nome;
    usuarios[index].email = user.email;
    res.send({
        message: "Usuário alterado com sucesso!"
    });
});

app.listen(3000, ()=>{console.log('Rodando na porta 3000');})