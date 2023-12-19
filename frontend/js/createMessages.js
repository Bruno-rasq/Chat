export const messageSelfElement = (content) => {

    const element = document.createElement('div')

    element.classList.add('messages-self')
    element.innerHTML = content

    return element
}

export const messageOthersElement = (content, sender, senderColor) => {

    const element = document.createElement('div') 
    const span = document.createElement('span') 

    element.classList.add('messages-others')
    span.classList.add('messages-sender')

    span.style.color = senderColor

    element.appendChild(span)

    span.innerHTML = sender
    element.innerHTML += content

    return element
}

export const connectedElement = (username) => {

    const div = document.createElement('div')
    div.classList.add("user-connected")
    div.innerHTML = `${username} entrou no chat.`

    return div
}