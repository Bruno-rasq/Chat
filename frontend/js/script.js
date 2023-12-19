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

    const { userId, userName, userColor, content} = JSON.parse(data)

    const message = userId == User.id 
    ? messageSelfElement(content) 
    : messageOthersElement(content, userName, userColor);

    chat_field.appendChild(message)

    scrollscreen()
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

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

    console.log(User)
}


// envia ao servidor um objeto com os dados do usuario e sua mensagem
const sendMessage = (event) => {

    event.preventDefault()

    const message = {
        userId: User.id,
        userName: User.name,
        userColor: User.color,
        content: chat_input.value
    }

    websocket.send(JSON.stringify(message))

    chat_input.value = ''
}

window.addEventListener('input', enableForm)
login_form.addEventListener('submit', handleLogin)
chat_form.addEventListener('submit', sendMessage)