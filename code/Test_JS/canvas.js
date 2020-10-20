
/* Canvas */
var canvas, canvasContext;
canvas = document.getElementById("ArkanoidCanvas");
canvasContext = canvas.getContext("2d");
let kspace = false;
let kleftA = false;
let krightA = false;
var int = 1;
/* background */
var bg_img;

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
var paddel =  {
                    id     : 0,
                    name   : "paddel",
                    x      : canvas.width/2 - paddel_width/2,
                    y      : canvas.height - paddel_height/0.3,
                    width  : paddel_width,
                    height : paddel_height,
                    dx     : 6 // speed of movement right and left 
                };


/* ball */



var ball = class {
    constructor(id, identifier, x, y, radius, dx, dy)
    {
        this.id          = id,
        this.identifier  = identifier,
        this.x           = x,
        this.y           = y,
        this.radius      = radius,
        this.dx          = dx, // speed of movement right and left 
        this.dy          = dy  // speed of movement right and left
    }
};

const RESET_BALL = new ball(-1,
                            "reset_ball",
                            345 ,
                            345,
                            10,
                            5, // speed of movement right and left 
                            -7 // speed of movement right and left
                           );
                           
var player_ball = new ball(1,
                            "player_ball",
                            345,
                            345,
                            10,
                            5, // speed of movement right and left 
                            -7 // speed of movement right and left
                           );





function drawBall()
{   
    canvasContext.beginPath();
    canvasContext.arc(player_ball.x, player_ball.y, player_ball.radius, 0, Math.PI*2);
    canvasContext.fillStyle = "blue";
    canvasContext.fill();

    canvasContext.closePath();


}
/* because = is just the pointer on the object, but i want to copy it*/
function copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;
  
    for (key in mainObj) {
      objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
  }
// draws paddel
function drawpaddel()
{   

    canvasContext.beginPath();
    canvasContext.fillStyle = "grey";
    canvasContext.fillRect(paddel.x, paddel.y, paddel.width, paddel.height); 
    canvasContext.closePath();  
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

function objectPosition(ball)
{
    console.log("gameloop", ball);

}

function drawbackground(img)
{
  /*  img.onload = function () 
                    {
                     canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
  */
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
function collisionDetection()
{


    if(player_ball.y > paddel.y + 60)
    {

        console.log("vor set", player_ball);
        player_ball = copy(RESET_BALL);
        player_ball.identifier = "player_ball";
        player_ball.id = int;

        console.log("player_ball.y set", player_ball, RESET_BALL);
        int = int + 1;
        
    }
    //console.log(player_ball, paddel.x + paddel_width, player_ball.x ,paddel.x <= player_ball.x , (paddel.x + paddel_width) > player_ball.x, paddel.y == player_ball.y - 5);
    else if ( paddel.x <= player_ball.x 
              && (paddel.x + paddel_width) > player_ball.x 
              && paddel.y > player_ball.y - 10 && paddel.y < player_ball.y + 5)
    {
        
        player_ball.dy *= -1;
    }

}

function ballmovement()
{
    if ( (player_ball.x >= canvas.width) || player_ball.x <= 0) player_ball.dx *= -1;
    if (player_ball.y >= canvas.height || player_ball.y <= 0) player_ball.dy *= -1;

    player_ball.x += 1 * player_ball.dx;
    player_ball.y += 1 * player_ball.dy;


}
function movement()
{ 
    paddelmovement();
    ballmovement();

}
function updatescreen()
{ 
    canvasContext.clearRect(0,0, canvas.width, canvas.height);
    collisionDetection();
    movement();
 
    

}
function draw()
{   
   canvasContext.drawImage(bg_img, 0, 0, canvas.width, canvas.height);
   drawBall();
   drawpaddel();
  
}
function gameLoop()
{
   //objectPosition(player_ball); 

   updatescreen();
   draw();
   // objectPosition(paddel);
   
   
   requestAnimationFrame(gameLoop);
} 

function main()
{

    bg_img = new Image();
    bg_img.src = "../img_folder/background_pattern1.jpg";
    document.addEventListener("DOMContentLoaded", gameLoop);
}
main();

