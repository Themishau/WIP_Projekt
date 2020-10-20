/* Canvas */
const canvas = document.getElementById("ArkanoidCanvas");
const canvasContext = canvas.getContext("2d");
let kspace = false;
let kleftA = false;
let krightA = false;

/* background */
const img = new Image();
img.src = "../img_folder/background_pattern1.jpg";

/* keyboard listener */
document.addEventListener("keydown", function(event)
{
    /* as there might be some support issues we have to check the property of the key pressed */
    if(event.which || event.charCode || event.keyCode )
    {
        var characterCode = event.which || event.charCode || event.keyCode;
    }
    else if (event.key!=undefined){
        var characterCode = charCodeArr[event.key] || event.key.charCodeAt(0);
    }
    else
    {
        var characterCode = 0;
    }
    /* check saved key */
    if(characterCode == 37)
    {
        kleftA = true;
    }
    else if(characterCode == 39)
    {
        krightA = true;
    }    
    if(characterCode == 32)
    {
        kspace = true;
    } 
});
document.addEventListener("keyup", function(event)
{
    /* as there might be some support issues we have to check the property of the key pressed */
    if(event.which || event.charCode || event.keyCode )
    {
        var characterCode = event.which || event.charCode || event.keyCode;
    }
    else if (event.key!=undefined)
    {
        var characterCode = charCodeArr[event.key] || event.key.charCodeAt(0);
    }
    else
    {
        var characterCode = 0;
    }
    /* check saved key */
    if(characterCode == 37)
    {
        kleftA = false;
    }
    else if(characterCode == 39)
    {
        krightA = false;
    }
    if(characterCode == 32)
    {
        kspace = true;
    } 
});

/* Paddel_Info */
const paddel_width = 120;
const paddel_height = 20;
const paddel_margin_bottom = 20; 
const paddel =  {
                    x      : canvas.width/2 - paddel_width/2,
                    y      : canvas.height - paddel_height/0.3,
                    width  : paddel_width,
                    height : paddel_height,
                    dx     : 3 // speed of movement right and left 
                };

/* ball */
const ball_width = 120;
const ball_height = 20;
const ball_margin_bottom = 20; 
const ball =  {
    x      : paddel.x - 10,
    y      : paddel.y - 10,
    radius  : 10,
    height : paddel_height,
    dx     : 3 // speed of movement right and left 
};

function draw()
{   
    drawBall();
    drawpaddel();
}

function drawBall()
{   

    canvasContext.fillStyle = "blue";
    canvasContext.arc(ball.x, ball.y, ball.radius, 0, Math*2);   
    canvasContext.strokeStyle = "green";
    canvasContext.strokeRect(ball.x, ball.y, ball.width, ball.height);
}

// draws paddel
function drawpaddel()
{   
    canvasContext.fillStyle = "grey";
    canvasContext.fillRect(paddel.x, paddel.y, paddel.width, paddel.height);   
    canvasContext.strokeStyle = "green";
    canvasContext.strokeRect(paddel.x, paddel.y, paddel.width, paddel.height);
}

function updatescreen()
{
    clearCanvasObject(paddel);
    draw();
    canvasContext.clearRect();
    
}

function drawRect(x, y)
{
    canvasContext.fillStyle = "green"; // red
    canvasContext.fillRect(x,y,50,20);
}

// playing around with canvas
function clearCanvasObject(object)
{
    canvasContext.clearRect(object.x, object.y, object.width, object.height);
}

function drawbackground(img)
{
    img.onload = function () 
                    {
                     canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
}
function paddelmovement()
{
    if(kleftA && (paddel.x > 0))
    {
        paddel.x -= paddel.dx;
    }
    else if(krightA && (paddel.x + paddel_width < canvas.width))
    {
        paddel.x += paddel.dx;
    }

}

function drawLoop()
{
    drawbackground(img);
    drawBall();
    paddelmovement();
    updatescreen();
    requestAnimationFrame(drawLoop);
}

function main()
{

    document.addEventListener("DOMContentLoaded", drawLoop);
}
main();

