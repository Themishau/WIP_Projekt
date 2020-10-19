// information about canvas
function drawRect(x, y){
    canvasContext.fillStyle = "#FF0000"; // red
    canvasContext.fillRect(x,y,50,20);
}

// get Canvas
const canvas = document.getElementById("ArkanoidCanvas");

// choose method properties
const canvasContext = canvas.getContext("2d");
drawRect(100, 200);


// playing around with canvas

