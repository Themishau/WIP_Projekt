

// information about canvas
function draw()
{

}
function updatescreen()
{

}
function drawRect(x, y)
{
    canvasContext.fillStyle = "green"; // red
    canvasContext.fillRect(x,y,50,20);
}

// playing around with canvas
function clearCanvasRect()
{
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function drawbackground(img)
{

    img.onload = function () 
                    {
                     canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
}
function drawLoop()
{


//drawLoop();
// playing around with canvas
drawRect(100, 200);
drawRect(100, 250);
drawRect(100, 300);
drawbackground(g);
draw();
updatescreen();
//requestAnimationFrame(drawLoop);

}


// get Canvas

const canvas = document.getElementById("ArkanoidCanvas");

// choose method properties
const canvasContext = canvas.getContext("2d");



// seltsamerweise muss eine Variable vom Typ Image img im Variablennamen haben 
/*
var BILD = new Image();
BILD.scr = 'FHDW_Logo.jpg';
*/
var g = new Image();
g.src = "FHDW_Logo.jpg";


drawLoop();



