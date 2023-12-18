const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080});

wss.on("connection" , (ws) => {

    ws.on('error', console.error); // caso haja algum erro sera evidenciada no console

    // ao receber uma mensagem o servidor se encarregara de enviar a mensagem para todos
    // os clientes conectados
    ws.on("message", (data) => {

        wss.clients.forEach((client) => client.send(data.toString()))
    })

    console.log("client connected");
})