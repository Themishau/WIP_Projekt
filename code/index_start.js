window.onload = function(){
    
}

var gameAutomat = {
    gameAutomatImage: null,
    currentElement: null,

    
    init: function(){
        this.gameAutomatImage = document.createElement("img");
        this.gameAutomatImage.src = "img_folder/gamingautomat.png";
        this.gameAutomatImage.height = window.innerHeight;
        this.currentElement = document.getElementById("div_gamingAutomat");
        console.log(this.currentElement, this.gameAutomatImage);
        this.currentElement.insertBefore(this.gameAutomatImage, this.currentElement.childNodes[1]);

    }
}