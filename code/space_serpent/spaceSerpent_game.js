
/* Canvas */
var canvas, canvasContext;
canvas = document.getElementById("SpaceSerpent");
canvasContext = canvas.getContext("2d");

/* keys */
let kspace = false;
let kleftA = false;
let krightA = false;
var int = 1;

/* background */
var bg_img;

/* class */
var serpent = class {
    constructor(id, x, y, width, height)
    {
        this.id          = id,
        this.identifier  = "serpent",
        this.x           = x,
        this.y           = y,
        this.width       = ,
        this.height      = 
    }
};



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

function draw() {
    canvasContext.drawImage(bg_img, 0, 0, canvas.width, canvas.height);
}

/* ----  draw section end ---- */
function movement() {

}
function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}


function copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;

    for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
}

function loadLevel() {

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* setup */
function main() {

    loadLevel();
    bg_img = new Image();
    bg_img.src = "../img_folder/background_pattern1.jpg";
    document.addEventListener("DOMContentLoaded", gameLoop);
}

function cleanUp() {

}

main();

