/* keys */
let kspace = false;
let kleftA = false;
let krightA = false;
let kupA = false;
let kdownA = false;
var int = 1;

/* grid size scale */
var gridSizeScale = 50;
var gridSizey = 50;
var gridSizex = 50;

/* object_table */
const objectTable = {
    empty:    0,
    food:     1,
    obstacle: 2,
    backpack: 3,
    bomb:     4,
    feather:  5
};

/* items */
items = [
    "clover",
    "backpack",
    "bomb",
    "book",
    "feather"
];
/* objects and sprites src */
objects = [
    "clover",
    "backpack",
    "bomb",
    "book",
    "feather",
    "snake",
    "serpent_sprite",
    "snake_head1",
    "snake_head2",
    "snake_head3",
    "snake_mid",
    "snake_end",
    "snake_downright",
    "snake_downleft",
    "bg_stars",
    "spr_planet01",
    "spr_planet02",
    "spr_planet03",
    "spr_planet04",
    "spr_planet05",
    "spr_planet06",
    "spr_planet07"
];
/* objects and sprites src */
soundEffects = [
    "Explosion1.wav",
    "Explosion2.wav",
    "Explosion3.wav",
    "Explosion4.wav",
    "Explosion5.wav",
    "Explosion6.wav",
    "Touch.wav",
    "VictoryBig.wav",
    "VictorySmall.wav",
    "Wind.wav",
    "WindParticles.wav",
    "bg_Jupiter.mp3"
];

/* ---- class section ---- */
/* item spritesheet */
var itemSpritesheet = class {
    constructor(id, spritesheet) {
        this.id = id,
            this.spritesheet = spritesheet,
            this.name = "itemSpritesheet",
            this.spritesheetformatx = spritesheet.width, // size of one sprite x
            this.spritesheetformaty = spritesheet.height, // size of one sprite y
            this.width = gridSizex,
            this.height = gridSizey,
            this.frameSet = 0,
            this.currentFrame = 0, // init is 0
            this.framelength = 0 // because we start at 0 :)
    }
};
/* space serpent spritesheet */
var serpentSpritesheet = class {
    constructor(id, spritesheet) {
        this.id = id,
            this.spritesheet = spritesheet,
            this.name = "serpentSprite",
            this.spritesheetformatx = spritesheet[0].width, // size of one sprite x
            this.spritesheetformaty = spritesheet[0].height, // size of one sprite y
            this.width = gridSizex,
            this.height = gridSizey,
            this.frameSet = [0, // SnakeHead1
                1, // SnakeHead2
                2, // SnakeHead3
                3, // mid
                4, // downleft
                5, // downright
                6  // end
            ],
            this.currentFrame = 0, // init is 0
            this.framelength = 3,// because we start at 0 :)
            this.animationInterval = 0,
            this.animationdelay = 10
    }
};
/* item */
var item = class {
    constructor(id, name, x, y, itemSprite) {
        this.id = id,
            this.name = name,
            this.gridx = x, // init the serpents position regarding to the grid ex.: gridSizex = 20 ; x = gridnumber in row n;  25 * 20 = 500 -> the position is x = 500 on the canvas
            this.gridy = y,
            this.width = gridSizex,
            this.height = gridSizey,
            this.PointOfView = {
                north: 180,
                east: 270,
                south: 0,
                west: 90
            },
            this.angle = 0,
            this.currentPointOfView = this.PointOfView.south,
            this.angle = this.currentPointOfView,
            this.animation = new itemSpritesheet(0, itemSprite),
            this.dx = 0,  /* speed x */
            this.dy = 0   /* speed y */
    }
    addToPlayground () {
        playGroundLevel.fields[this.gridx][this.gridy] = this.id;    
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
    constructor(id, bg_img, bgsound) {
        this.id = id,
            this.name = "playground",
            this.xSize = gameField.canvas.width / gridSizeScale,
            this.ySize = gameField.canvas.height / gridSizeScale,
            this.fields = [],
            this.bg_img = bg_img,
            this.bgsound = bgsound,
            this.resetPlayground()
    }
};
/* individual part of the serpent */
var serpentPart = class {
    constructor(x, y) {
        this.name = "serpentPart",
            this.x = x, // init the serpents position regarding to the grid ex.: gridSizex = 20 ; x = gridnumber in row n;  25 * 20 = 500 -> the position is x = 500 on the canvas
            this.y = y,
            this.angle = 0,
            this.currentCorner = 0, // 0 = false, 1 = left, 2 = right
            this.PointOfView = {
                north: 180,
                east: 270,
                south: 0,
                west: 90
            },
            this.currentPointOfView = this.PointOfView.east
    }
};
/* serpent */
var serpent = class {
    addSerpentPart(amount) {
        for (var i = 0; i < amount; i++) {
            this.serpentParts.push(new serpentPart(this.gridx - i, this.gridy));
        }
    }
    constructor(id, x, y, spritesheet, initSnakeParts) {
        this.id = id,
            this.name = "serpent",
            this.gridx = x, // init the serpents position regarding to the grid ex.: gridSizex = 20 ; x = gridnumber in row n;  25 * 20 = 500 -> the position is x = 500 on the canvas
            this.gridy = y,
            this.width = gridSizex,
            this.height = gridSizey,
            this.animation = new serpentSpritesheet(0, spritesheet),
            this.dx = 1,  /* speed x */
            this.dy = 0,   /* speed y */
            this.serpentParts = [],
            this.addSerpentPart(initSnakeParts)
    }

};
/* ---- class section end ---- */

/* ---- init some variables ---- */
var bg_image = new Image();
var img = new Image();
var bg_universe = new Image();
var bg_stars = new Image();
var serpentSprites = [];
var playGroundLevel;
var serpentPlayer;
var serpentParts;
var kiSerpents = [];
var itemlist = [];

/*
this is the standard state 
var State = function () {
    this.name; // Just to identify the State
    this.update = function () { };
    this.render = function () { };
    this.onEnter = function () { };
    this.onExit = function () { };
    
    // Optionalb ut useful
    this.onPause = function () { };
    this.onResume = function () { };
};
*/

var EmptyState = function () {
    this.name = "EmptyState";
    this.onEnter = function () { };
    this.onExit = function () { };
    this.update = function () {
        // update values
    };
    this.render = function () {
        // redraw
    this.onPause = function () { };
    this.onResume = function () { };    
    };
};

/* level0 aka debuglevel */
var level0 = function () {
    this.name = "level0";
    
    /* animations */
    this.frame = 0;
    this.animationInterval = 0;
    this.animationdelay = 10;

    /* on enter this state */
    this.onEnter = function () {
        var pause = false;
        loadRessources(objects, soundEffects, loadLevel);
        /* direction changedListener */
        document.addEventListener("onChangeDirection", function (event) {
            /* changing direction to the left */
            if ((event.detail.playerDeltax > 0) && (event.detail.oldDeltay > 0)
                || (event.detail.playerDeltay < 0) && (event.detail.oldDeltax > 0)
                || (event.detail.playerDeltax < 0) && (event.detail.oldDeltay < 0)
                || (event.detail.playerDeltay > 0) && (event.detail.oldDeltax < 0)) {
                serpentPlayer.serpentParts[0].currentCorner = 1;
                console.log("direction changed left", serpentPlayer.serpentParts[0].currentCorner);
            }
            else {
                serpentPlayer.serpentParts[0].currentCorner = 2;
                console.log("direction changed right", serpentPlayer.serpentParts[0].currentCorner);
            }
        });
        /* keyboard listener */
        document.addEventListener("keydown", function (event) {
            var playerDx = serpentPlayer.dx;
            var playerDy = serpentPlayer.dy;
            /* as there might be some support issues we have to check the property of the key pressed */
            playGroundLevel.bgsound.play();
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
            if (characterCode == 27) {
                if (pause == false) {
                    pause = true;
                    pauseGame();
                }
                else {
                    pause = false;
                    resumeGame();
                }

                // gameMode.push(new Level1State());
            }
            else if (characterCode == 37) {
                kleftA = true;
                serpentPlayer.dx = -1;
                serpentPlayer.dy = 0;
                serpentPlayer.serpentParts[0].currentPointOfView = serpentPlayer.serpentParts[0].PointOfView.west;
            }
            else if (characterCode == 39) {
                krightA = true;
                serpentPlayer.dx = +1;
                serpentPlayer.dy = 0;
                serpentPlayer.serpentParts[0].currentPointOfView = serpentPlayer.serpentParts[0].PointOfView.east;
            }
            else if (characterCode == 38) {
                kupA = true;
                serpentPlayer.dx = 0;
                serpentPlayer.dy = -1;
                serpentPlayer.serpentParts[0].currentPointOfView = serpentPlayer.serpentParts[0].PointOfView.north;

            }
            else if (characterCode == 40) {
                kdownA = true;
                serpentPlayer.dx = 0;
                serpentPlayer.dy = +1;
                serpentPlayer.serpentParts[0].currentPointOfView = serpentPlayer.serpentParts[0].PointOfView.south;
            }

            if (characterCode == 32) {
                kspace = true;
            }
            if ((playerDx != serpentPlayer.dx) && (playerDy != serpentPlayer.dy)) {
                document.dispatchEvent(new CustomEvent("onChangeDirection", {
                    detail: {
                        oldDeltax: playerDx,
                        oldDeltay: playerDy,
                        playerDeltax: serpentPlayer.dx,
                        playerDeltay: serpentPlayer.dy
                    }
                }));
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
            else if (characterCode == 38) {
                kupA = false;
            }
            else if (characterCode == 40) {
                kdownA = false;
            }
            if (characterCode == 32) {
                kspace = false;
            }
        });
        
    };
    /* if direction changes we need*/
    /* on leave this state */
    this.onExit = function () {
    };
    /* update section */
    this.update = function () {
        animations();
        update();
    };
    /* draw section */
    this.render = function () {
        draw();
    };
    this.onPause = function () {
        var currentState = getGameInstance();
        console.log(currentState);
        //currentState.push(new MainMenuState());

    };
    this.onResume = function () {
    };

}

var StateList = function () {
    var states = [];
    this.pop = function () {
        return states.pop();
    };
    this.push = function (state) {
        states.push(state);
    };
    this.top = function () {
        return states[states.length - 1];
    }
};

var StateStack = function () {
    var states = new StateList();
    /* adds an empty state to prevent errors */
    states.push(new EmptyState());
    this.update = function () {
        var state = states.top();
        if (state) {
            state.update();
        }
    };
    this.render = function () {
        var state = states.top();
        if (state) {
            state.render();
        }
    };
    this.push = function (state) {
        states.push(state);
        state.onEnter();
    };
    this.pop = function () {
        var state = states.top();
        state.onExit();
        return states.pop();
    };
    this.pause = function () {
        var state = states.top();
        if (state.onPause) {
            state.onPause();
        }
    };

    this.resume = function () {
        var state = states.top();
        if (state.onResume) {
            state.onResume();
        }
    };
};

window.onload = function () {
    window.getGameInstance = function () {
        return gameField.gameMode;
    };

    window.getCanvas = function () {
        return gameField.canvas;
    };

    window.getGameDimensions = function () {
        return {
            width: gameField.canvas_width,
            height: gameField.canvas_height
        };
    };

    window.pauseGame = function () {
        gameField.gameMode.pause();
        gameField.pauseGame();
    };

    window.resumeGame = function () {
        gameField.resumeGame();
        gameField.gameMode.resume();
    };

    window.getCanvasElement = function () {
        return gameField.canvasElement;
    };

};

/* Canvas */
var gameField = {
    canvas: document.createElement("canvas"),
    gameMode: new StateStack(),
    //then: null,
    //startTime: null,
    timer: null,
    FPS: 10,
    fpsInterval: null,

    update: function () {
        // console.log(this.fpsInterval);
        this.gameMode.update();
        this.gameMode.render();
    },
    startGame: function () {
        // this.gameMode.push(new MainMenuState());
        this.gameMode.push(new level0());
        console.log(this.gameMode);
        this.fpsInterval = setInterval(this.update.bind(this), this.timer);
    },
    pauseGame: function () {
        clearInterval(this.fpsInterval);
        // console.log("pause", this.fpsInterval);
    },

    resumeGame: function () {
        this.fpsInterval = setInterval(this.update.bind(this), this.timer);
    },
    init: function () {
        //this.then = Date.now(),
        //this.startTime = this.then,
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.canvasContext = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // due to some loading issues with images and sprites w want to insert it before
        this.timer = 1000 / this.FPS;
        this.startGame();
    }
}

// playing around with canvas
function clearCanvasObject(object) {
    canvasContext.clearRect(object.x, object.y, object.width, object.height);
}

function drawbackground(img) {
    img.onload = function () {
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

function drawItems() {
    for (var i = 1; i < itemlist.length; i++) {
        // itemlist[i].angle = itemlist[i].currentPointOfView * Math.PI / 180;
        itemlist[i].angle += 2 * Math.PI / 180;
        ctx = gameField.canvasContext;
        ctx.save();
        ctx.translate(itemlist[i].gridx * gridSizeScale + (itemlist[i].width / 2), itemlist[i].gridy * gridSizeScale + (itemlist[i].height / 2));
        ctx.rotate(itemlist[i].angle);
        ctx.drawImage(itemlist[i].animation.spritesheet,
            itemlist[i].animation.frameSet,    // position on image x
            itemlist[i].animation.frameSet,    // position on image y
            itemlist[i].animation.spritesheetformatx, // part of image x
            itemlist[i].animation.spritesheetformaty, // part of image y
            itemlist[i].width / - 2, // position on canvas x
            itemlist[i].height / - 2, // position on canvas y
            itemlist[i].width, // strech to on x 
            itemlist[i].height // strech to on y         
        );
        // console.log (itemlist[i], itemlist[i].width / - 2, itemlist[i].height / - 2);
        ctx.restore();
    }
}

function drawSerpent() {
    var serpentPartbefore = [];
    serpentPartafter = [];
    for (var i = 0; i < serpentPlayer.serpentParts.length; i++) {
        serpentPlayer.serpentParts[i].angle = serpentPlayer.serpentParts[i].currentPointOfView * Math.PI / 180;
        ctx = gameField.canvasContext;
        ctx.save();
        /* serpent head */
        if (i == 0) {
            ctx.translate(serpentPlayer.serpentParts[i].x * gridSizeScale + (serpentPlayer.width / 2), serpentPlayer.serpentParts[i].y * gridSizeScale + (serpentPlayer.height / 2));
            ctx.rotate(serpentPlayer.serpentParts[i].angle);
            ctx.drawImage(serpentPlayer.animation.spritesheet[serpentPlayer.animation.currentFrame],
                0,    // position on image x
                0,    // position on image y
                serpentPlayer.animation.spritesheetformatx, // part of image x
                serpentPlayer.animation.spritesheetformaty, // part of image y
                serpentPlayer.width / - 2, // position on canvas x
                serpentPlayer.height / - 2, // position on canvas y
                serpentPlayer.width, // strech to on x 
                serpentPlayer.height // strech to on y
            );
        }
        /* serpent end */
        else if (i == serpentPlayer.serpentParts.length - 1) {
            ctx = gameField.canvasContext;
            ctx.save();
            ctx.translate(serpentPlayer.serpentParts[i].x * gridSizeScale + (serpentPlayer.width / 2), serpentPlayer.serpentParts[i].y * gridSizeScale + (serpentPlayer.height / 2));
            ctx.rotate(serpentPlayer.serpentParts[i].angle);

            ctx.drawImage(serpentPlayer.animation.spritesheet[6],
                0,    // position on image x
                0,    // position on image y
                serpentPlayer.animation.spritesheetformatx, // part of image x
                serpentPlayer.animation.spritesheetformaty, // part of image y
                serpentPlayer.width / - 2, // position on canvas x
                serpentPlayer.height / - 2, // position on canvas y
                serpentPlayer.width, // strech to on x 
                serpentPlayer.height // strech to on y
            );

        }
        /* serpent mid */
        else {
            serpentPartbefore = [serpentPlayer.serpentParts[i - 1].x, serpentPlayer.serpentParts[i - 1].y]; //
            serpentPartafter = [serpentPlayer.serpentParts[i + 1].x, serpentPlayer.serpentParts[i + 1].y]; //
            ctx = gameField.canvasContext;
            ctx.save();
            ctx.translate(serpentPlayer.serpentParts[i].x * gridSizeScale + (serpentPlayer.width / 2), serpentPlayer.serpentParts[i].y * gridSizeScale + (serpentPlayer.height / 2));
            ctx.rotate(serpentPlayer.serpentParts[i].angle);
            //console.log("head", serpentPartbefore, "end", serpentPartafter);

            /* if serpent takes corner we only need to change the second part of the serpent because we are deleting the last part everytime */
            if ((serpentPartbefore[0] != serpentPartafter[0]) && (serpentPartbefore[1] != serpentPartafter[1])) {
                var currentCornerSprite = new Image();
                if (serpentPlayer.serpentParts[i].currentCorner == 1) {

                    currentCornerSprite = serpentPlayer.animation.spritesheet[5];
                }
                else {

                    currentCornerSprite = serpentPlayer.animation.spritesheet[4];
                }
                ctx.drawImage(currentCornerSprite,
                    0,    // position on image x
                    0,    // position on image y
                    serpentPlayer.animation.spritesheetformatx, // part of image x
                    serpentPlayer.animation.spritesheetformaty, // part of image y
                    serpentPlayer.width / - 2, // position on canvas x
                    serpentPlayer.height / - 2, // position on canvas y
                    serpentPlayer.width, // strech to on x 
                    serpentPlayer.height // strech to on y
                );
            }
            else {
                ctx.drawImage(serpentPlayer.animation.spritesheet[3],
                    0,    // position on image x
                    0,    // position on image y
                    serpentPlayer.animation.spritesheetformatx, // part of image x
                    serpentPlayer.animation.spritesheetformaty, // part of image y
                    serpentPlayer.width / - 2, // position on canvas x
                    serpentPlayer.height / - 2, // position on canvas y
                    serpentPlayer.width, // strech to on x 
                    serpentPlayer.height // strech to on y
                );
            }



        }
        ctx.restore();
    }
}

function drawKiSerpent() {
    for (var i = 1; i < kiSerpents.length; i++) {
        for (var j = 0; j < kiSerpents[i].serpentParts.length; j++) {
            kiSerpents[i].serpentParts[j].angle += i * Math.PI / 180; // rotation speed
            ctx = gameField.canvasContext;
            ctx.save();
            ctx.translate(kiSerpents[i].serpentParts[j].x * gridSizeScale + (kiSerpents[i].width / 2), kiSerpents[i].serpentParts[j].y * gridSizeScale + (kiSerpents[i].height / 2));
            ctx.rotate(kiSerpents[i].serpentParts[j].angle);
            ctx.fillStyle = "red";
            ctx.fillRect(kiSerpents[i].width / - 2, kiSerpents[i].height / - 2, 50, 50);
            ctx.drawImage(kiSerpents[i].animation.spritesheet[kiSerpents[i].animation.currentFrame],
                0,    // position on sprite x
                0,    // position on sprite y
                kiSerpents[i].animation.spritesheetformatx, // part of sprite x
                kiSerpents[i].animation.spritesheetformaty, // part of sprite y
                kiSerpents[i].width / - 2, // position on canvas x 
                kiSerpents[i].height / - 2, // position on canvas y
                kiSerpents[i].width, // strech to width  
                kiSerpents[i].height // strech to height
            );
            ctx.restore();
        }
    }
}

// created this function for visualization reasons
function drawBackground() {
    /*
    var groundx = 0;
    var groundy = 0;
    
    for (var column = 0; column <= playGroundLevel.fields.length; column++) {
        for (var row = 0; row <= playGroundLevel.fields.length; row++) {
            gameField.canvasContext.beginPath();
            //gameField.canvasContext.fillStyle = "grey";
            gameField.canvasContext.fillRect(groundx, groundy, gridSizex, gridSizey);
            //gameField.canvasContext.strokeStyle = "grey";
            gameField.canvasContext.strokeRect(groundx, groundy, gridSizex, gridSizey);
            gameField.canvasContext.closePath();
            groundx += gridSizeScale;
            // console.log(column, row, groundy, groundx);
        }
        groundx = 0;
        groundy += gridSizeScale;
    }
    */
    gameField.canvasContext.drawImage(bg_universe, 50, 0);
    gameField.canvasContext.drawImage(bg_stars, 0, 0);
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
    drawBackground();
    drawItems();
    drawKiSerpent();
    drawSerpent();
}
/* ----  draw section end ---- */

function movement() {
    movePlayerSerpent();
    moveKISerpent();
}

function moveKISerpent(){

}
function movePlayerSerpent() {

    // Create the new Snake's head
    var newHead = new serpentPart(serpentPlayer.serpentParts[0].x + serpentPlayer.dx, serpentPlayer.serpentParts[0].y + serpentPlayer.dy);
    newHead.currentPointOfView = serpentPlayer.serpentParts[0].currentPointOfView;
    //console.log(newHead, serpentPlayer.dx, serpentPlayer.dy);
    // serpentPlayer.serpentParts = {​​​​​ x: snake[0].x + dx, y: snake[0].y + dy }​​​​​;
    // Add the new head to the beginning of snake body
    serpentPlayer.serpentParts.unshift(newHead);
    serpentPlayer.serpentParts.pop();

    //const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    /*
    if (has_eaten_food) {​​​​​
      // Increase score
      score += 10;
      // Display score on screen
      document.getElementById('score').innerHTML = score;
      // Generate new food location
      gen_food();
    }​​​​​ else {​​​​​
      // Remove the last part of snake body
    }​​​​​
    */
}

function generateNewItems() {

}

function update() {
    gameField.canvasContext.clearRect(0, 0, gameField.canvas.width, gameField.canvas.height);
    // generateNewItems();
    //console.log(playGroundLevel.fields);
    movement();
}

/* ----  animation section  ---- */
function animationPlayer() {
    var vCurrentFrame = serpentPlayer.animation.currentFrame;
    if (vCurrentFrame < serpentPlayer.animation.framelength - 1 && serpentPlayer.animation.animationInterval == serpentPlayer.animation.animationdelay) {
        serpentPlayer.animation.currentFrame += 1;
        serpentPlayer.animation.animationInterval = 0;
    }
    else if (vCurrentFrame >= serpentPlayer.animation.framelength - 1 && serpentPlayer.animation.animationInterval == serpentPlayer.animation.animationdelay) {
        serpentPlayer.animation.animationInterval = 0;
        serpentPlayer.animation.currentFrame = 0;
    }
    serpentPlayer.animation.animationInterval += 10;
    // console.log(serpentPlayer.animation.frameSet.length, serpentPlayer.animation.currentFrame, animationInterval);
}

function animationFood() {

}

function animations() {
    animationPlayer();
    animationFood();
}
/* ----  animation section  end ---- */
function loadRessources(imagenames, soundnames, callback) {
    var n, imagename, m, soundname,
        result = {},
        count = imagenames.length,
        onload = function () {
            if (--count == 0) {
                //console.log("resultSound", resultSound);
                callback(result);
            }
        };
    for (n = 0; n < imagenames.length; n++) {
        imagename = imagenames[n];
        result[imagename] = document.createElement('img');
        result[imagename].addEventListener('load', onload);
        result[imagename].src = "sprites/" + imagename + ".png";
    }
    for (m = 0; m < soundnames.length; m++) {
        soundname = soundnames[m].slice(0, soundnames[m].length - 4);
        result[soundname] = document.createElement('audio');
        result[soundname].addEventListener('onload', onload, false);
        result[soundname].src = "sounds/" + soundnames[m];
    }

}

function loadLevel(assets) {
    console.log("assets", assets);
    playGroundLevel = new playground(0, assets.serpent_sprite, assets.bg_Jupiter);
    bg_universe = assets.spr_planet02;
    bg_stars = assets.bg_stars;
    playGroundLevel.bgsound.volume = 0.1;
    playGroundLevel.bgsound.loop = true;
    serpentSprites = [assets.snake_head1, assets.snake_head2, assets.snake_head3, assets.snake_mid, assets.snake_downleft, assets.snake_downright, assets.snake_end];
    serpentPlayer = new serpent(0, 5, 5, serpentSprites, 20);
    console.log(serpentPlayer);
    itemlist[1] = new item(1, "clover", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), assets.clover);
    itemlist[2] = new item(2, "backpack", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), assets.backpack);
    itemlist[3] = new item(3, "bomb", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), assets.bomb);
    itemlist[4] = new item(4, "book", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), assets.book);
    itemlist[5] = new item(5, "feather", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), assets.feather);
    for (var i = 1; i < itemlist.length; i++) {
        itemlist[i].addToPlayground();
    }
    for (var i = 0; i <= 10; i++) {
        kiSerpents[i] = new serpent(i, getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), serpentSprites, 2);
        // console.log(kiSerpents[i], kiSerpents[i].angle);
    }
    console.log(playGroundLevel.fields);
}

function cleanUp() {

}

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

gameField.init();






















/*
function loadSound(soundnames, callback) {
    var m, soundname
        resultSound = {},
        countSound = soundnames.length,
        canplay = function() { if (--countSound == 0) callback(resultSound); };
        for(m = 0 ; m < soundnames.length ; m++) {
            soundname = soundnames[m].slice(0, soundnames[m].length - 4);
            resultSound[soundname] = document.createElement('audio');
            resultSound[soundname].addEventListener('canplay', canplay, false);
            resultSound[soundname].src = "sounds/" + soundnames[m];
        }
    // console.log(resultSound);
}

function loadImages(names, callback) {
        var n,name,
        result = {},
        count  = names.length,
        onload = function() { if (--count == 0) callback(result);  };
    for(n = 0 ; n < names.length ; n++) {
        name = names[n];
        result[name] = document.createElement('img');
        result[name].addEventListener('load', onload);
        result[name].src = "sprites/" + name + ".png";
    }


}



function loadObjectsImages(sprites) {
    //console.log("sprites", sprites);

    playGroundLevel = new playground(0, sprites.serpent_sprite);
    bg_universe = sprites.spr_planet02;
    bg_stars = sprites.bg_stars;
    serpentPlayer = new serpent(0, 5, 5, sprites.snake, 3);
    itemlist[2] = new item(2, "backpack", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),sprites.backpack);
    itemlist[3] = new item(3, "bomb", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),sprites.bomb);
    itemlist[4] = new item(4, "book", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),sprites.book);
    itemlist[5] = new item(5, "feather", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),sprites.feather);
    for (var i = 0; i <= 10; i++) {
        kiSerpents[i] = new serpent(i, getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), sprites.snake, 2);
       // console.log(kiSerpents[i], kiSerpents[i].angle);
    }

}

function loadObjectSound(sounds) {
    console.log("sounds", sounds);
    playGroundLevel.bgsound = sounds.bg_Jupiter;


    serpentPlayer = new serpent(0, 5, 5, objects.snake, 3);
    itemlist[2] = new item(2, "backpack", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),objects.backpack);
    itemlist[3] = new item(3, "bomb", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),objects.bomb);
    itemlist[4] = new item(4, "book", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),objects.book);
    itemlist[5] = new item(5, "feather", getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19),objects.feather);
    // console.log(itemlist);
    for (var i = 0; i <= 10; i++) {
        kiSerpents[i] = new serpent(i, getRandomIntInclusive(0, 19), getRandomIntInclusive(0, 19), objects.snake, 2);
       // console.log(kiSerpents[i], kiSerpents[i].angle);
    }

    }

*/