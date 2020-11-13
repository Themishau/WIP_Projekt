
       //Globale Variablen
       var canvas, ctx;

       var mouseX = 0;
       var mouseY = 0;

       var xpos = 60;
       var ypos = 100;

       var directionX = 1; //1=rechts -1=links
       var directionY = 1; //1=unten -1=oben

       //Arrays
       var mouseArray = [];

       //Hintergrund

       var background = new Image();
       background.src = "../img_folder/background_pattern1.jpg";

       //Aduio
       var audioPlayer;

       //Ufo
       var player;
       var frame = 0; //Slowdown Animation time 10

       //End Globale Variablen

       function init(){
           console.log("init called");

           canvas = document.getElementById("myCanvas");
           canvas.style.border ="red 1px solid";
           ctx = canvas.getContext("2d");

           // background = document.getElementById("imgBackground");
           audioPlayer = document.getElementById("audio1");
           player = document.getElementById("ufo");

           setInterval(gameLoop,40);
       }

       function gameLoop() {
           update();
           draw();
       }

       function update(){
           updateBall();
       }

       function updateBall(){
           if ( (xpos >= canvas.width) || xpos <= 0) directionX *= -1;
           if (ypos >= canvas.height || ypos <= 0) directionY *= -1;

           xpos += 5 * directionX;
           ypos += 5 * directionY;
       }

       function draw(){
           //Canvas löschen
           ctx.clearRect(0,0,canvas.width,canvas.height);
           drawBackground();
           drawWorld();
           drawMouse();
           drawBall();
           drawPlayer();
       }

       function drawPlayer() {
           var playercenter = player.width / 4 / 2;
           frame += 0.2; //Slowdown Animation

           ctx.drawImage(player, Math.floor(frame % 4) * player.width / 4, 0,
               player.width / 4, player.height,
               mouseX - playercenter, mouseY-player.height,
               player.width / 4, player.height);
       }

       function drawBackground(){
           ctx.drawImage(background, 0, 0);
       }

       function drawMouse(){
           for (let i = 0; i < mouseArray.length; i++) {
               drawRect(mouseArray[i].x, mouseArray[i].y, 50, 50,mouseArray[i].style);
           } 
       }

       function drawWorld(){
           drawRect(0,0,50,50);
           //drawHintergrund
           //DrawWorld
           //DrawNPC
           //DrawPlayer

           ctx.moveTo(100,100);
           ctx.lineTo(200,200);
           //ctx.stroke();

           ctx.beginPath();
           ctx.arc(95,50,40,0,2* Math.PI);
           ctx.stroke();

           //ctx.font = "50px Arial";
           ctx.font = "bold 60px Tangerine";
           ctx.fillText("Hello World", 200, 50);

       }

       function drawBall(){
           ctx.beginPath();
           ctx.arc(xpos, ypos, 40, 0, 2 * Math.PI);
           ctx.stroke();
       }


       function drawRect(rx, ry, rw, rh, rstyle = "#0000FF"){
           ctx.fillStyle = rstyle;
           ctx.fillRect(rx,ry,rw,rh);

       }

       function MouseClicked(ev){
           console.log("Mouse clicked");
      
           drawRect(mouseX,mouseY,50,50,"#FF0000");

           mouseArray.push({
               x: ev.clientX - canvas.offsetLeft,
               y: ev.clientY - canvas.offsetTop,
               style: "#FF0000"
           });

           playAudio();
       }

       function playAudio() {
           audioPlayer.pause();
           audioPlayer.currentTime = 0;

           audioPlayer.play();
       }

       function MouseMoved(ev){
           console.log("mouse moved");
           mouseX = ev.clientX - canvas.offsetLeft;
           mouseY = ev.clientY - canvas.offsetTop;
       }

       function Tastatur(ev){
           console.log("Teast gedrueckt");
           var key_press = String.fromCharCode(ev.keyCode);
           console.log(key_press);
           
           if(key_press == "A"){
               drawRect(mouseX,mouseY,50,50, "#00FF00");
           
               mouseArray.push({
                   x: mouseX,
                   y: mouseY,
                   style: "#00FF00"
               });
           }



       }

       document.addEventListener("mousemove",MouseMoved);
       document.addEventListener("keydown",Tastatur);
       document.addEventListener("mousedown",MouseClicked);
       document.addEventListener("DOMContentLoaded", init);