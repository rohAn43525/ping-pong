
const canvas = document.querySelector("#ping-pong")
const ctx = canvas.getContext("2d")
const startbtn = document.querySelector(".startbtn")
const pause = document.querySelector(".pausebtn")
const restart = document.querySelector(".resbtn")

let gameRunning = false
let animationId

const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    height: 100, 
    width: 10, 
    color: "red",
    score: 0

}
const comp = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    height: 100, 
    width: 10, 
    color: "black",
    score: 0
}
const net = {
    x: canvas.width / 2,
    y: 0,
    height: 10, 
    width: 2, 
    color: "white"

}

const ball = {

    x: canvas.width / 2,
    y: canvas.height /2,
    radius: 10,
    width: 5,
    height: 5, 
    color: "white",
    speed: 5,
    velocityX: 5,
    velocityY:5

}

restart.addEventListener("click", () => {
    document.location.load()
})

addEventListener("load", (event) => {
    render()
})

function drawNet(){
   const netwidth = 4
   const netspacing  = 15

   for(let i = 0; i <= canvas.height; i += netspacing){
        drawRectangle(net.x, net.y + 1, netwidth, net.height, net.color)
   }

   
   for(let i = 0; i <= canvas.height; i += netspacing){
    drawRectangle(net.x + net.width - netwidth, net.y + 1, netwidth, net.height, net.color)
}

}

function drawRectangle(x, y, w, h, c){
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
}

canvas.addEventListener("mousemove", movepaddle)



function drawcircle(x, y, r, color){

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI* 2, false)
    ctx.closePath()
    ctx.fill() 

}

function drawtext(text, x, y, color){

    ctx.fillStyle = color
    ctx.font = "45px fantasy"
    ctx.fillText(text, x, y)
}

function render(){
    drawRectangle(0, 0, canvas.width, canvas.height, "green")

    drawNet()

    drawtext(user.score, canvas.width /4, canvas.height/5, "white")
    drawtext(comp.score, (3*canvas.width) /4, canvas.height/5, "white")

    drawRectangle(user.x, user.y, user.width, user.height, user.color)
    drawRectangle(comp.x, comp.y, comp.width, comp.height, comp.color)

    drawcircle(ball.x, ball.y, ball.radius,  ball.color )

    drawRectangle(net.x, net.y, net.width, net.height, net.color)

}

canvas.addEventListener("mousemove", movepaddle)

    function movepaddle(evt){
        let rectangle = canvas.getBoundingClientRect()

        user.y = evt.clientY - rectangle.top -  user.height/2
    }


function collision(b, p){

    b.top = b.y - b.radius
    b.bottom = b.y + b.radius
    b.left = b.x - b.radius
    b.right = b.x + b.radius

    p.top = p.y
    p.bottom = p.y + p.height
    p.left = p.x
    p.right = p.x + p.width

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
}

function resetball(){
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2

    ball.speed = 5
    ball.velocityX = -ball.velocityX
}

function update(){

    ball.x  += ball.velocityX
    ball.y += ball.velocityY

    let computerLevel = 0.2

    comp.y += (ball.y - (comp.y + comp.height/2)) * computerLevel

    if(comp.y < 0){
        comp.y = 0
    }
    else if(comp.y + comp.height > canvas.height){
        comp.y = canvas.height - comp.height
    }

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY
    }

    let player = (ball.x < canvas.width/2)  ? user : comp

    if(collision(ball, player)){

        let collide = ball.y - (player.y + player.height/2)
        
        let collidePoint = collide/(player.height/2)

        let angleRad = collidePoint * Math.PI/4

        let direction = (ball.x < canvas.width/2) ? 1 : -1

        ball.velocityX = direction * ball.speed * Math.cos(angleRad)

        ball.velocityY = ball.speed * Math.sin(angleRad)

        ball.speed += 0.5

    }

    if(ball.x - ball.radius < 0){

        comp.score++
        resetball()
    }
    else if(ball.x + ball.radius > canvas.width){
        user.score++
        resetball()
    }

}

function animate(){

    if(!gameRunning){
        return
    }

    update()
    render()
    animationId = requestAnimationFrame(animate)
}

startbtn.addEventListener("click", () => {
    if(!gameRunning){
        gameRunning = true
        animate()
    }

})

pause.addEventListener("click", () => {
    gameRunning = false
    cancelAnimationFrame(animationId)
})