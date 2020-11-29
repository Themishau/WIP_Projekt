var startGame = false;

var gameAutomat = {
    gameAutomatImage: null,
    gameAnimation: null,
    startButton: null,
    currentElement: null,

    
    init: function(){
        this.loadImage();
        this.loadAnimation();
        this.loadButton();
    },

    startGame: function(){
        window.location.href = "space_serpent/space_serpent_main.html";
    },

    loadButton: function(){
        this.startButton = document.createElement("img");
        this.startButton.onclick = this.startGame();
    },

    loadAnimation:function(){
        this.gameAnimation = document.createElement("img");
        this.gameAnimation.height = window.innerHeight/5;
        this.gameAnimation.width = window.innerHeight/5;
        this.currentElement = document.getElementById("gameDiv");
        this.currentElement.insertBefore(this.gameAnimation, this.currentElement.childNodes[0]);
    },

    loadImage: function(){
        this.gameAutomatImage = document.createElement("img");
        this.gameAutomatImage.src = "img_folder/gamingautomat.png";
        this.gameAutomatImage.height = window.innerHeight;
        this.currentElement = document.getElementById("div_gamingAutomat");
        this.currentElement.insertBefore(this.gameAutomatImage, this.currentElement.childNodes[0]);
    }
}

window.onload = function(){
    gameAutomat.init();
    if(startGame == false){

    }else{

    }
}