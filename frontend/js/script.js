import { messageSelfElement, messageOthersElement, connectedElement } from "./createMessages.js";

'use strict';

// login elements

const login = document.querySelector('.login');
const login_form = login.querySelector('.login__form');
const login_input = login.querySelector('.login__input');
const login_btn = login.querySelector('.login__button');


//  chat elements

const chat = document.querySelector('.chat');
const chat_form = chat.querySelector('.chat__form');
const chat_input = chat.querySelector('.chat__input');
const chat_field = chat.querySelector('.chat__messages');


// user
const User = { id: '', name: '', color: '' };

const colors = [
    'red',
    'palevioletred',
    'olivedrab',
    'orangered',
    'orchid',
    'blueviolet',
    'royalblue',
    'rebeccapurple',
    'salmon',
    'springgreen',
    'khaki'
];

let websocket;

const validationName = (name) => {

    if(name.length >= 3){
        return true
    }
    return false
}

const setRandomColor = () => {

    const index = Math.floor(Math.random() * colors.length)
    return colors[index]
}

// desliza a tela para o final da janela
const scrollscreen = () => {

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

// habilita  o envio do formulario de login
const enableForm = () => {

    let name = login_input.value != '' ? true : false;

    if(name){
        login_btn.removeAttribute('disabled')
        return
    }

    login_btn.setAttribute('disabled', '')
}

// processa o conteudo enviado pelo servidor
// definindo se a mensagem é do proprio usuario ou de outro.
const processMessage = ({ data }) => {

    const { userName, userId, userColor, content} = JSON.parse(data)

    if( userName  && userId  && userColor  && content ){

        const message = userId == User.id 
        ? messageSelfElement(content) 
        : messageOthersElement(content, userName, userColor);

        chat_field.appendChild(message)

    } else {

        userlogin(userName)
    }
    
    scrollscreen()
}

// sinaliza no chat que o usuario @param name entrou no chat
const userlogin = (username) => {

    const user = connectedElement(username)
    chat_field.appendChild(user)
}

// assim que o login for concluido, cria o elemento User e o conecta ao servidor
const handleLogin = (event) => {

    event.preventDefault()

    if(!validationName(login_input.value)){
        alert('Erro: Por favor, preencha o campo de nome com 3 caracteres ou mais...')
        return;
    }

    User.id = crypto.randomUUID()
    User.name = login_input.value
    User.color = setRandomColor()

    login.style.display = 'none'
    chat.style.display = 'flex'

    websocket = new WebSocket("wss://chat-ehja.onrender.com")
    websocket.onmessage = processMessage

    userConnected()

    console.log(User)

}

// envia ao servidor o nome do user que conectou
const userConnected = () => {
    setTimeout(() => {

        websocket.send(JSON.stringify({ userName: login_input.value }))
        
    }, 2000)
}

// envia ao servidor um objeto com os dados do usuario e sua mensagem
const sendMessage = (event) => {

    event.preventDefault()

    const message = {
        userName: User.name,
        userId: User.id,
        userColor: User.color,
        content: chat_input.value
    }

    websocket.send(JSON.stringify(message))

    chat_input.value = ''
}

window.addEventListener('input', enableForm)
login_form.addEventListener('submit', handleLogin)
chat_form.addEventListener('submit', sendMessage)