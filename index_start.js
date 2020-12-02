var startGame = false;
var counter = 0;

var gameAutomat = {
    gameAutomatImage: null,
    gameAnimation: null,
    startButton: null,
    currentElement: null,
    instructions: null,
    counter: 0,

    
    init: function(){
        this.loadCanvas();
        this.gameAutomatCanvasContext.clearRect(0,0,this.gameAutomatCanvas.width, this.gameAutomatCanvas.height);
        this.gameAutomatCanvasContext.beginPath();
        this.loadImage();
        this.loadAnimation();
        this.instructions();
        this.loadButton();
    },

    loadCanvas: function (){
        this.gameAutomatCanvas = document.createElement("canvas");
        this.gameAutomatCanvas.id = "Gameautomat";
        this.gameAutomatCanvas.width = window.innerHeight;
        this.gameAutomatCanvas.height = window.innerHeight;
        this.gameAutomatCanvas.style.border = "2px solid black";
        this.gameAutomatCanvasContext = this.gameAutomatCanvas.getContext("2d");
        this.currentElement = document.getElementById("div_gamingAutomat");
        this.currentElement.insertBefore(this.gameAutomatCanvas, this.currentElement.childNodes[0]);
    },

    instructions: function(){
        this.gameAutomatCanvasContext.beginPath();
        this.gameAutomatCanvasContext.fillStyle = "aqua";
        this.gameAutomatCanvasContext.font = this.gameAutomatCanvas.height / 50 + "pt Courier";
        this.gameAutomatCanvasContext.fillText("Press SPACE or ENTER to start!", this.gameAutomatCanvas.height/3.75, this.gameAutomatCanvas.height/2.5);
        this.gameAutomatCanvasContext.closePath();

    },


    startGame: function(){
        this.gameAutomatCanvasContext.clearRect(0,0,this.gameAutomatCanvas.width, this.gameAutomatCanvas.height);
        this.loadImage();
        this.loadAnimation();
        this.startButton.src= "img_folder/buttonPressed.png",
        this.gameAutomatCanvasContext.drawImage(this.startButton,this.gameAutomatCanvas.height/2.5 ,this.gameAutomatCanvas.height/1.18, this.gameAutomatCanvas.height/6, this.gameAutomatCanvas.height/6);
        sleep(2000);
        window.location.href = "code/space_serpent/space_serpent_main.html";
    },

    loadButton: function(){
        this.startButton = new Image();
        this.startButton.src = "img_folder/buttonUnpressed.png";
        this.gameAutomatCanvasContext.drawImage(this.startButton, this.gameAutomatCanvas.height/2.5 ,this.gameAutomatCanvas.height/1.18, this.gameAutomatCanvas.height/6, this.gameAutomatCanvas.height/6);
    },

    loadAnimation:function(){
        this.gameAnimation = new Image();
        this.gameAnimation.src = "img_folder/animation1.png";
        this.gameAutomatCanvasContext.drawImage(this.gameAnimation, this.gameAutomatCanvas.height/7 ,this.gameAutomatCanvas.height/3.3, this.gameAutomatCanvas.height/1.41, this.gameAutomatCanvas.height/1.67);
    },

    loadImage: function(){
        this.gameAutomatImage = new Image();
        this.gameAutomatImage.src = "img_folder/gamingautomat.png";
        this.gameAutomatCanvasContext.drawImage(this.gameAutomatImage, 0, 0, this.gameAutomatCanvas.height, this.gameAutomatCanvas.height);
    },

    resize: function(){
        this.currentElement = document.getElementById("div_gamingAutomat");
        this.currentElement.removeChild(this.gameAutomatCanvas);
        this.gameAutomatCanvas = null;
        this.init();
    }

    

    
}

window.onload = function(){
    gameAutomat.init();
    window.onkeydown = null;
    window.resize = null;
    window.addEventListener("keydown",KeyDown);
    window.addEventListener("resize", resizeScreen);
    
    
}

function resizeScreen(event){
    if(window.innerHeight != this.gameAutomat.gameAutomatCanvas.height){
        gameAutomat.resize();
    }
    window.resize = null;
}

function KeyDown(event){
    let characterCode = event.keyCode;
    if(characterCode == 13 || characterCode == 32){
        this.gameAutomat.startGame();
        
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}