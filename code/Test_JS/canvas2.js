
// seltsamerweise muss eine Variable vom Typ Image img im Variablennamen haben 

var image = new Image();
image.scr = 'CjOn_MSWkAEqsIP.jpg';

var imga = new Image();
imga.src = "index.jpg";

const canvas2 = document.getElementById("ArkanoidCanvas2");
const canvasContext2 = canvas2.getContext("2d");
imga.onload = function () 
{
    canvasContext2.drawImage(imga, 0, 0, canvas2.width, canvas2.height);
};
