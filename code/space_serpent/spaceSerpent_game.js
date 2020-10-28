/* Canvas */
var gameField = {
    canvas : document.createElement("canvas"),
    init : function() {
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.canvasContext = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // due to some loading issues with images and sprites w want to insert it before
    }
    
}

/* keys */
let kspace = false;
let kleftA = false;
let krightA = false;
var int = 1;

/* grid size scale */
var gridSizeScale = 50;
var gridSizey = 50;
var gridSizex = 50;

/* object_table */

const objectTable = {
    empty: 0,
    obstacle: 1
};

/* animations */
var frame = 0;
var animationInterval = 0;
const animationdelay  = 250;


/* ---- class section ---- */

/* space serpent spritesheet */
var serpentSpritesheet = class {
    constructor(id, spritesheet) {
        this.id = id,
        this.spritesheet = spritesheet,
            this.name = "serpentSprite",
            this.spritesheetformatx = spritesheet.width * 0.33,// size of one sprite x
            this.spritesheetformaty = spritesheet.height * 0.34,// size of one sprite y
            this.width = gridSizex,
            this.height = gridSizey,
            this.frameSet = [[0, 0], // SnakeHead1
                             [0, 40], // SnakeHead2
                             [0, 80] // SnakeHead3
            ],
            this.currentFrame = 0, // init is 0
            this.framelength = this.frameSet.length // because we start at 0 :)
        }
};

/* space serpent spritesheet */
var itemSpritesheet = class {
    constructor(id, spritesheet) {
        this.id = id,
        this.spritesheet = spritesheet,
            this.name = "itemSprite",
            this.spritesheetformatx = spritesheet.width,// size of one sprite x
            this.spritesheetformaty = spritesheet.height,// size of one sprite y
            this.width = gridSizex,
            this.height = gridSizey,
            this.frameSet = 0,
            this.currentFrame = 0, // init is 0
            this.framelength = this.frameSet.length // because we start at 0 :)
        }
};

/* playground */
var playground = class {
    resetPlayground() {
        for (var column = 0; column < this.xSize; column++) {
            this.fields[column] = [];
            for (var row = 0; row < this.ySize; row++) {
                this.fields[column][row] = objectTable.empty;
                // console.log(column, row);
            }
        }
    }
    constructor(id, bg_img) {
        this.id = id,
            this.name = "playground",
            this.xSize = gameField.canvas.width / gridSizeScale,
            this.ySize = gameField.canvas.height / gridSizeScale,
            this.fields = [],
            this.bg_img = bg_img,
        this.resetPlayground();
    }
};

/* serpent */
var serpent = class {
    constructor(id, x, y, spritesheet) {
        this.id = id,
            this.name = "serpent",
            this.x = x * gridSizex, // init the serpents position regarding to the grid ex.: gridSizex = 20 ; x = gridnumber in row n;  25 * 20 = 500 -> the position is x = 500 on the canvas
            this.y = y * gridSizey,
            this.width = gridSizex,
            this.height = gridSizey,
            this.angle = 0,
            this.currentPointOfView = {north : 180,
                                east : 270,
                                south : 0, 
                                west : 90
                               },
            this.animation = new serpentSpritesheet(0, spritesheet),
            this.dx = 5,  /* speed x */
            this.dy = 5   /* speed y */
    }

};

/* ---- class section end ---- */


/* ---- init some variables ---- */

var bg_image = new Image();
var img = new Image();

var playGroundLevel;
var serpentPlayer;
var kiSerpents = [];



/* keyboard listener */
document.addEventListener("keydown", function (event) {
    /* as there might be some support issues we have to check the property of the key pressed */
    if (event.which || event.charCode || event.keyCode) {
        var characterCode = event.which || event.charCode || event.keyCode;
    }
    else if (event.key != undefined) {
        var characterCode = charCodeArr[event.key] || event.key.charCodeAt(0);
    }
    else {
        var characterCode = 0;
    }
    /* check saved key */
    if (characterCode == 37) {
        kleftA = true;
    }
    else if (characterCode == 39) {
        krightA = true;
    }
    if (characterCode == 32) {
        kspace = true;
    }
});

document.addEventListener("keyup", function (event) {
    /* as there might be some support issues we have to check the property of the key pressed */
    if (event.which || event.charCode || event.keyCode) {
        var characterCode = event.which || event.charCode || event.keyCode;
    }
    else if (event.key != undefined) {
        var characterCode = charCodeArr[event.key] || event.key.charCodeAt(0);
    }
    else {
        var characterCode = 0;
    }

    /* check saved key */
    if (characterCode == 37) {
        kleftA = false;
    }
    else if (characterCode == 39) {
        krightA = false;
    }
    if (characterCode == 32) {
        kspace = false;
    }
});


// playing around with canvas
function clearCanvasObject(object) {
    canvasContext.clearRect(object.x, object.y, object.width, object.height);
}


/* ---- draw section ---- */
function drawbackground(img) {
    img.onload = function () {
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

}

function drawSerpent() {
    var frame = 3; 
    serpentPlayer.angle += 1 * Math.PI / 180;
    ctx = gameField.canvasContext;
    ctx.save();    
    ctx.translate(serpentPlayer.x + (serpentPlayer.width / 2), serpentPlayer.y + (serpentPlayer.height / 2));
    ctx.rotate(serpentPlayer.angle);
    ctx.fillStyle = "red";
    ctx.fillRect(serpentPlayer.width / - 2, serpentPlayer.height / - 2, 50, 50);
    ctx.drawImage(serpentPlayer.animation.spritesheet,
        serpentPlayer.animation.frameSet[serpentPlayer.animation.currentFrame][0],    // position on image x
        serpentPlayer.animation.frameSet[serpentPlayer.animation.currentFrame][1],    // position on image y
        serpentPlayer.animation.spritesheetformatx, // part of image x
        serpentPlayer.animation.spritesheetformaty, // part of image y
        serpentPlayer.width / - 2, // position on canvas x
        serpentPlayer.height / - 2, // position on canvas y
        serpentPlayer.width, // strech to on x 
        serpentPlayer.height // strech to on y
                          );
   // console.log (serpentPlayer.x, serpentPlayer.angle);
    ctx.restore();

}

function drawKiSerpent() {

    for (var i = 1; i < kiSerpents.length; i++) {
        // console.log("draw", kiSerpents[i]); 
        kiSerpents[i].angle += i * Math.PI / 180; // rotation speed
        ctx = gameField.canvasContext;
        ctx.save();    
        ctx.translate(kiSerpents[i].x + (kiSerpents[i].width / 2), kiSerpents[i].y + (kiSerpents[i].height / 2));
        ctx.rotate(kiSerpents[i].angle);
        ctx.fillStyle = "red";
        ctx.fillRect(kiSerpents[i].width / - 2, kiSerpents[i].height / - 2, 50, 50);
        ctx.drawImage(kiSerpents[i].animation.spritesheet,
            kiSerpents[i].animation.frameSet[kiSerpents[i].animation.currentFrame][0],    // position on sprite x
            kiSerpents[i].animation.frameSet[kiSerpents[i].animation.currentFrame][1],    // position on sprite y
            kiSerpents[i].animation.spritesheetformatx, // part of sprite x
            kiSerpents[i].animation.spritesheetformaty, // part of sprite y
            kiSerpents[i].width / - 2, // position on canvas x 
            kiSerpents[i].height / - 2, // position on canvas y
            kiSerpents[i].width, // strech to width  
            kiSerpents[i].height // strech to height
            );
            // console.log (serpentPlayer.x, serpentPlayer.angle);
            ctx.restore();
    }    
}

// created this function for visualization reasons
function drawGrid() {
    var groundx = 0;
    var groundy = 0;
    for (var column = 0; column <= playGroundLevel.fields.length; column++) {
        for (var row = 0; row <= playGroundLevel.fields.length; row++) {

            gameField.canvasContext.beginPath();
            gameField.canvasContext.fillStyle = "grey";
            gameField.canvasContext.fillRect(groundx, groundy, gridSizex, gridSizey);
            gameField.canvasContext.strokeStyle = "blue";
            gameField.canvasContext.strokeRect(groundx, groundy, gridSizex, gridSizey);
            gameField.canvasContext.closePath();
            groundx += gridSizeScale;

            // console.log(column, row, groundy, groundx);

        }
        groundx = 0;
        groundy += gridSizeScale;
    }

         gameField.canvasContext.drawImage(playGroundLevel.bg_img,
            serpentPlayer.animation.currentFrame * playGroundLevel.bg_img.width / 4,
             0,
             playGroundLevel.bg_img.width / 4, // part of image x
             playGroundLevel.bg_img.height, // part of image y
             100, // position on canvas x
             100, // position on canvas y
             playGroundLevel.bg_img.width / 4, // strech to on x 
             playGroundLevel.bg_img.height // strech to on y
                               );

}
function draw() {
    drawGrid();
    drawKiSerpent();
    drawSerpent();
}

/* ----  draw section end ---- */

function movement() {

}

function update() {
    gameField.canvasContext.clearRect(0, 0, gameField.canvas.width, gameField.canvas.height);

}

/* ----  animation section  ---- */


function animationPlayer() {
    var vCurrentFrame = serpentPlayer.animation.currentFrame;


    if (vCurrentFrame < serpentPlayer.animation.framelength - 1 && animationInterval == animationdelay){   
        serpentPlayer.animation.currentFrame += 1;
        animationInterval= 0;
    }
    else if (vCurrentFrame >= serpentPlayer.animation.framelength - 1 && animationInterval == animationdelay) {
        animationInterval = 0;
        serpentPlayer.animation.currentFrame = 0;
    }

    animationInterval += 10;
    // console.log(serpentPlayer.animation.frameSet.length, serpentPlayer.animation.currentFrame, animationInterval);

}

function animationFood() {

}

function animations() {
    animationPlayer();
    animationFood();
}

/* ----  animation section  end ---- */

function gameLoop() {
    animations();
    update();
    draw();  
    requestAnimationFrame(gameLoop);
}


function loadLevel() {
    bg_image.src = "sprites/serpent_sprite.png";
    img.src = "sprites/Snake.png";


    playGroundLevel = new playground(0, bg_image);
    serpentPlayer = new serpent(0, 5, 5, img);

    for (var i = 0; i <= 10; i++) {
        kiSerpents[i] = new serpent(i, getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), img);
        console.log(kiSerpents[i],kiSerpents[i].angle );
    }
}


/* setup */
function main() { 
    gameField.init();
    loadLevel();
    //canvasContext.drawImage(bg_image, 10, 10,256,256);
    img.addEventListener("load", function(event) { // When the load event fires, do this:

        gameLoop();
       
        // document.addEventListener("DOMContentLoaded", gameLoop);
    
      });
}


function cleanUp() {
}

main();


/* ---- help functions section  */
function copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;

    for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---- help functions section end  */