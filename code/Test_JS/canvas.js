/* Canvas */
const canvas = document.getElementById("ArkanoidCanvas");
const canvasContext = canvas.getContext("2d");
let kspace = false;
let kleftA = false;
let krightA = false;

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
/* background */
const bgImg = new Image();

bgImg.src = "FHDW_Logo.jpg";


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
    clearCanvasRect();
    drawpaddel();
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

    /*
    playing around with canvas
    drawRect(100, 200);
    drawRect(100, 250);
    drawRect(100, 300);
    */
   // drawbackground(bgImg);
    
    paddelmovement();

    updatescreen();
    
    requestAnimationFrame(drawLoop);
}

// choose method properties

// seltsamerweise muss eine Variable vom Typ Image img im Variablennamen haben 
/*
var BILD = new Image();
BILD.scr = 'FHDW_Logo.jpg';
*/

// window.onload = drawLoop;

function main()
{
    document.addEventListener("DOMContentLoaded", drawLoop);
}
main();

