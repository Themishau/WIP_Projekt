var startGame = false;

var gameAutomat = {
    gameAutomatImage: null,
    gameAnimation: null,
    startButton: null,
    currentElement: null,

    
    init: function(){
        this.loadCanvas();
        this.gameAutomatCanvasContext.clearRect(0,0,this.gameAutomatCanvas.width, this.gameAutomatCanvas.height);
        this.gameAutomatCanvasContext.beginPath();
        this.loadImage();
        this.loadAnimation();
        this.loadButton();
    },

    loadCanvas: function (){
        this.gameAutomatCanvas = document.createElement("canvas");
        this.gameAutomatCanvas.id = "Gameautomat";
        this.gameAutomatCanvas.width = 1000;
        this.gameAutomatCanvas.height = window.innerHeight;
        this.gameAutomatCanvas.style.border = "2px solid black";
        this.gameAutomatCanvasContext = this.gameAutomatCanvas.getContext("2d");
        this.currentElement = document.getElementById("div_gamingAutomat");
        this.currentElement.insertBefore(this.gameAutomatCanvas, this.currentElement.childNodes[0]);
    },

    startGame: function(){
        window.location.href = "space_serpent/space_serpent_main.html";
    },

    loadButton: function(){
       
    },

    loadAnimation:function(){
        this.gameAnimation = new Image();
        this.gameAnimation.src = "img_folder/animation1.png";
        this.gameAutomatCanvasContext.drawImage(this.gameAnimation, 0, 0, this.gameAutomatCanvas.height/5, this.gameAutomatCanvas.height/5);
    },

    loadImage: function(){
        this.gameAutomatImage = new Image();
        this.gameAutomatImage.src = "img_folder/gamingautomat.png";
        this.gameAutomatCanvasContext.drawImage(this.gameAutomatImage, 0, 0, this.gameAutomatCanvas.height, this.gameAutomatCanvas.height/2);
    }
}

window.onload = function(){
    gameAutomat.init();
    if(startGame == false){

    }else{

    }
}