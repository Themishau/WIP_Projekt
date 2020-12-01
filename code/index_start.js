var startGame = false;

var gameAutomat = {
    gameAutomatImage: null,
    gameAnimation: null,
    startButton: null,
    currentElement: null,
    counter: 0,

    
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
        this.gameAutomatCanvasContext.drawImage(this.gameAnimation,125 ,this.gameAutomatCanvas.height/3.3, this.gameAutomatCanvas.height/1.41, this.gameAutomatCanvas.height/1.67);
    },

    loadImage: function(){
        this.gameAutomatImage = new Image();
        this.gameAutomatImage.src = "img_folder/gamingautomat.png";
        this.gameAutomatCanvasContext.drawImage(this.gameAutomatImage, 0, 0, this.gameAutomatCanvas.height, this.gameAutomatCanvas.height);
    },

    animate: function(){
        this.gameAutomatCanvasContext.clearRect(this.gameAnimation,125 ,this.gameAutomatCanvas.height/3.3, this.gameAutomatCanvas.height/1.41, this.gameAutomatCanvas.height/1.67);
        switch(this.counter){
            case 0: this.gameAnimation.src="img_folder/animation1.png";
                    this.counter++;
                    break;
            case 1: this.gameAnimation.src ="img_folder/animation2.png";
                    this.counter++;
                    break;
            case 2: this.gameAnimation.src = "img_folder/animation3.png";
                    this.counter = 0;
                    break;
            default: this.counter = 0;
        }
        this.gameAutomatCanvasContext.drawImage(this.gameAnimation,125 ,this.gameAutomatCanvas.height/3.3, this.gameAutomatCanvas.height/1.41, this.gameAutomatCanvas.height/1.67);
    }
}

window.onload = function(){
    gameAutomat.init();
    while(this.startGame == false){
        this.gameAutomat.animate();
        setTimeout(3000);
    }

    
}

function sleep(timestamp) {
    let date = Date.now();
    let currentDate = timestamp;
    if(currentDate-date <3000){
        window.requestAnimationFrame(sleep(currentDate));
    }
}