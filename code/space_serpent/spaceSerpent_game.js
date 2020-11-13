'use strict';
/* ---- global section ---- */
/* keys */
var kspace = false;
var kleftA = false;
var krightA = false;
var kupA = false;
var kdownA = false;
var int = 1;
/* grid size scale */
var gridSizeScale = 50;
var gridSizey = 50;
var gridSizex = 50;
/* object_table */
var objectTable = {
    empty: 0, // empty
    food: 1,
    obstacle: 2,
    backpack: 3,
    bomb: 4,
    feather: 5,
    playerSerpent: 6
};
/* item table */
var items = [
    "clover",
    "backpack",
    "bomb",
    "book",
    "feather"
];
/* all objects src */
var objects = [
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
/* soundEffects table */
var soundEffects = [
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
/* loaded assets */
var globalassets = [];
/* ---- global section end ---- */

/* ---- class section ---- */
class Node {
    constructor(nodePosition, gCost, parent, goalPosition) {
        this.position = nodePosition;

        // the gCost is determined by the number of nodes that had to be travelles to reach this node
        this.gCost = gCost;

        // the hCost is the heuristic used to guess the remaining distance to the goal
        this.hCost = Math.abs(goalPosition.x - nodePosition.x) + Math.abs(goalPosition.y - nodePosition.y);

        // the fCost is the gCost and the hCost combined, representing the total cost for this node to get to the goal
        this.fCost = this.gCost + this.hCost;

        // in this interpretation of the aStar algorithm, a small random number is added, to prevent the algorithm from discovering multiple paths of the same cost. This improves the performance.
        let randomFloat = (Math.random() * (0.1 - 0) + 0);
        this.fCost += randomFloat;

        // the parent is the preceding node in the current path
        this.parent = parent;
    }
}
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}
class PriorityQueue {
    // the priority Queue is used to store the discovered nodes and their fCosts costs. The cheaper the costs, the better. Selecting the node with the lowest cost is done by applying the deqeue method.
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        var qElement = new QElement(element, priority);
        var contain = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        if (!contain) {
            this.items.push(qElement);
        }
    }

    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length == 0;
    }
}
/* item spritesheet */
class itemSpritesheet {
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
}
/* space serpent spritesheet */
class serpentSpritesheet {
    constructor(id, spritesheet) {
        this.id = id,
            this.spritesheet = spritesheet,
            this.name = "serpentSprite",
            this.spritesheetformatx = spritesheet[0].width, // size of one sprite x
            this.spritesheetformaty = spritesheet[0].height, // size of one sprite y
            this.width = gridSizex,
            this.height = gridSizey,
            this.frameSet = [
                0, // SnakeHead1
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
}
/* item */
class item {
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

}
/* playground */
class playground {
    resetPlayground() {
        for (var column = 0; column < this.xSize; column++) {
            this.fields[column] = [];
            for (var row = 0; row < this.ySize; row++) {
                this.fields[column][row] = objectTable.empty;
                // console.log(column, row);
            }
        }
    }
    addToPlayground(gridx, gridy, id) {
        this.fields[gridx][gridy] = id;
    }
    removeFromPlayground(gridx, gridy) {
        this.fields[gridx][gridy] = 0;
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


}
/* individual part of the serpent */
class serpentPart {
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
}
/* serpent */
class serpent {
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
            this.OldDx = 1,
            this.OldDy = 0,
            this.serpentParts = [],
            this.nextTarget = { objectID: 1, x: 0, y: 0 },
            this.foodEaten = 0,
            this.inventory = [],
            this.addSerpentPart(initSnakeParts)
    }
}

/* ----  state machine section  ---- */
class LevelConfig {
    constructor(name) {
        /* ---- init some variables ---- */
        this.name = name,
            this.bg_image = new Image(),
            this.img = new Image(),
            this.bg_universe = new Image(),
            this.bg_stars = new Image(),
            this.serpentSprites = [],
            this.playGroundLevel,
            this.serpentPlayer,
            this.serpent_sprite, // for testing
            //this.obstacleTable = null;
            this.aiSerpents = [],
            this.itemlist = [],
            this.sound;
        //this.foodList = []
        // this.loadRessources(objects, soundEffects, this.loadLevel);
    }
    loadLevel(assets) {
        console.log("assets", assets);
        this.serpentSprites = [assets.snake_head1, assets.snake_head2, assets.snake_head3, assets.snake_mid, assets.snake_downleft, assets.snake_downright, assets.snake_end];
        this.playGroundLevel = new playground(0, assets.serpent_sprite, assets.bg_Jupiter);
        this.serpent_sprite = assets.serpent_sprite;
        this.sound = assets.Touch;
        this.sound.volume = 0.1;
        //this.obstacleTable = new playground(1, null, null);
        this.bg_universe = assets.spr_planet02;
        this.bg_stars = assets.bg_stars;
        this.playGroundLevel.bgsound.volume = 0.1;
        this.playGroundLevel.bgsound.loop = true;
        this.serpentPlayer = new serpent(6, 5, 5, this.serpentSprites, 3);
        this.itemlist[0] = new item(1, "food", getRandomIntInclusive(3, 17), getRandomIntInclusive(3, 17), assets.clover);
        this.itemlist[1] = new item(1, "food", getRandomIntInclusive(3, 17), getRandomIntInclusive(3, 17), assets.clover);
        this.itemlist[2] = new item(1, "food", getRandomIntInclusive(3, 17), getRandomIntInclusive(3, 17), assets.clover);
        // this.itemlist[3] = new item(2, "backpack", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.backpack);
        // this.itemlist[4] = new item(3, "bomb", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.bomb);
        // this.itemlist[5] = new item(4, "book", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.book);
        // this.itemlist[6] = new item(5, "feather", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.feather);
        for (let i = 0; i < this.itemlist.length; i++) {
            this.playGroundLevel.addToPlayground(this.itemlist[i].gridx, this.itemlist[i].gridy, this.itemlist[i].id);
        }
        for (let i = 0; i <= 0; i++) {
            this.aiSerpents[i] = new serpent(i + 7, getRandomIntInclusive(3, 19), getRandomIntInclusive(1, 19), this.serpentSprites, 3);

            /* change color of serpents */
            let ctx = gameField.canvasContext;
            let imgData = ctx.getImageData(0, 0, this.aiSerpents[i].width, this.aiSerpents[i].height);
            console.log("beforecolorchange", imgData);
            imgData = invertColors(imgData);
            console.log("aftercolorchange", imgData);
            ctx.putImageData(imgData, 0, 0);
            // console.log(aiSerpents[i], aiSerpents[i].angle);
        }
    }
    StartLoading = function () {
        this.loadLevel(globalassets);
    }
}
class EmptyState {
    constructor(name) {
        this.name = name // Just to identify the State
    }
    update() { };
    render() { };
    onEnter() { };
    onExit() { };
    // Optionalb ut useful
    onPause() { };
    onResume() { };
}
class level {
    constructor(name, levelConfig) {
        this.name = name;
        this.levelConfig = levelConfig;
        /* keyboard listener */
        window.onkeydown = null;
        window.onkeyup = null;
        window.onDirectionChanged = null;
        /* animations */
        this.frame = 0;
        this.animationInterval = 0;
        this.animationdelay = 10;
        this.obstacleTable;


        this.KeyUpEvent = function (event) {
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
        };
    };

    KeyDownEvent(event) {

        var levelConfig = getCurrentLevelConfig();
        var playerDx = levelConfig.serpentPlayer.dx;
        var playerDy = levelConfig.serpentPlayer.dy;
        var currentMovingDirection = levelConfig.serpentPlayer.serpentParts[0].currentPointOfView;
        /* as there might be some support issues we have to check the property of the key pressed */
        levelConfig.playGroundLevel.bgsound.play();
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
            pauseGame();

        }
        else if ((characterCode == 37) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.east)) {
            kleftA = true;
            levelConfig.serpentPlayer.dx = -1;
            levelConfig.serpentPlayer.dy = 0;
            levelConfig.serpentPlayer.serpentParts[0].currentPointOfView = levelConfig.serpentPlayer.serpentParts[0].PointOfView.west;
        }
        else if ((characterCode == 39) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.west)) {
            krightA = true;
            levelConfig.serpentPlayer.dx = +1;
            levelConfig.serpentPlayer.dy = 0;
            levelConfig.serpentPlayer.serpentParts[0].currentPointOfView = levelConfig.serpentPlayer.serpentParts[0].PointOfView.east;
        }
        else if ((characterCode == 38) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.south)) {
            kupA = true;
            levelConfig.serpentPlayer.dx = 0;
            levelConfig.serpentPlayer.dy = -1;
            levelConfig.serpentPlayer.serpentParts[0].currentPointOfView = levelConfig.serpentPlayer.serpentParts[0].PointOfView.north;

        }
        else if ((characterCode == 40) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.north)) {
            kdownA = true;
            levelConfig.serpentPlayer.dx = 0;
            levelConfig.serpentPlayer.dy = +1;
            levelConfig.serpentPlayer.serpentParts[0].currentPointOfView = levelConfig.serpentPlayer.serpentParts[0].PointOfView.south;
        }

        if (characterCode == 32) {
            kspace = true;
        }
        if ((playerDx != levelConfig.serpentPlayer.dx) && (playerDy != levelConfig.serpentPlayer.dy)) {
            console.log("CORNERDRIFT");
            document.dispatchEvent(new CustomEvent("onChangeDirection", {
                detail: {
                    oldDeltax: playerDx,
                    oldDeltay: playerDy,
                    playerDeltax: levelConfig.serpentPlayer.dx,
                    playerDeltay: levelConfig.serpentPlayer.dy
                }
            }));
        }
    };
    /* on enter this state */
    onEnter() {
        console.log("onEnter triggered");
        /* direction changedListener */
        document.addEventListener("onChangeDirection", function (event) {
            var levelConfig = getCurrentLevelConfig();
            console.log(" changed corner", levelConfig);
            /* changing direction to the left */
            if ((event.detail.playerDeltax > 0) && (event.detail.oldDeltay > 0)
                || (event.detail.playerDeltay < 0) && (event.detail.oldDeltax > 0)
                || (event.detail.playerDeltax < 0) && (event.detail.oldDeltay < 0)
                || (event.detail.playerDeltay > 0) && (event.detail.oldDeltax < 0)) {
                levelConfig.serpentPlayer.serpentParts[0].currentCorner = 1;
                //console.log("direction changed left", levelConfig.serpentPlayer.serpentParts[0].currentCorner);
            }
            else {
                levelConfig.serpentPlayer.serpentParts[0].currentCorner = 2;
                //console.log("direction changed right", levelConfig.serpentPlayer.serpentParts[0].currentCorner);
            }
        });
        window.onkeydown = this.KeyDownEvent;
        window.onkeyup = this.KeyUpEvent;
    };
    /* if direction changes we need to delete the event listeners */
    /* on leave this state */
    onExit() {
        window.onkeydown = null;
        window.onkeyup = null;
    };
    /* update section */
    update() {
        //check if keylistener are not null 
        if (window.onkeydown == null && window.onkeyup == null) {
            window.onkeydown = this.KeyDownEvent;
            window.onkeyup = this.KeyUpEvent;
        }
        //console.log(this.levelConfig.playGroundLevel.fields);
        update(this.levelConfig.serpentPlayer, this.levelConfig.aiSerpents, this.levelConfig.playGroundLevel, this.levelConfig.itemlist, this.levelConfig.sound);
        animations(this.levelConfig.serpentPlayer);

    };
    /* draw section */
    render() {
        gameField.canvasContext.clearRect(0, 0, gameField.canvas.width, gameField.canvas.height);
        // console.log("stars", this.levelConfig.bg_stars, "bg", this.levelConfig.serpent_sprite, "serpent", this.levelConfig.serpentPlayer, "itemlist", this.levelConfig.itemlist, "aiserpent", this.levelConfig.aiSerpents);
        draw(this.levelConfig.bg_stars, this.levelConfig.bg_universe, this.levelConfig.serpentPlayer, this.levelConfig.itemlist, this.levelConfig.aiSerpents);
    };
    onPause() {
        window.onkeydown = null;
        window.onkeyup = null;
        this.levelConfig.playGroundLevel.bgsound.pause();
        let gameMode = getGameInstance();
        gameMode.push(new PauseMenu("PauseMenuLevel0"));
    };
    onResume() {
        window.onkeydown = this.KeyDownEvent;
        window.onkeyup = this.KeyUpEvent;
    };
    getCurrentLevelConfig() {
        return this.levelConfig
    };
}
class MainMenu {
    constructor(name) {
        this.name = name // Just to identify the State
        this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.backgroundColor = "#000",
            this.mainText = "Press Enter To Start",
            this.textColor = "rgb(0,0,0)", // Starts with black
            this.colorsArray = [], // our fade values
            this.colorIndex = 0;
        this.update = function () {
            // update values
            if (this.colorIndex == this.colorsArray.length) {
                this.colorIndex = 0;
            }
            this.textColor = "rgb(" + this.colorsArray[this.colorIndex] + "," + this.colorsArray[this.colorIndex] + "," + this.colorsArray[this.colorIndex] + ")";
            this.colorIndex++;
        };
    }
    onEnter() {
        let i = 1, l = 100, values = [];
        for (i; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        this.colorsArray = values;

        // When the Enter key is pressed go to the next state
        window.onkeydown = function (e) {
            let keyCode = e.keyCode;
            if (keyCode === 13) {
                // Go to next State
                let gameMode = getGameInstance();
                let levelConfig = new LevelConfig("level0", globalassets);
                levelConfig.StartLoading();
                gameMode.push(new level("level0", levelConfig));
                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
        };
    };
    onExit() {
        // clear the keydown event
        console.log("EVENT IS DELETED");
        window.onkeydown = null;
    };
    render() {
        // redraw
        console.log("menu");
        this.canvas.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.canvas.beginPath();
        this.canvas.fillStyle = this.backgroundColor;
        this.canvas.fillColor = this.backgroundColor;
        this.canvas.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
        this.canvas.fillStyle = this.textColor;
        this.canvas.font = "24pt Courier";
        this.canvas.fillText(this.mainText, 120, 100);
    };
}
class PauseMenu {
    constructor(name) {
        this.name = name // Just to identify the State
        this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.backgroundColor = "#000",
            this.mainText = "Press Escape To Continue",
            this.textColor = "rgb(0,0,0)", // Starts with black
            this.colorsArray = [], // our fade values
            this.colorIndex = 0;
        this.angle = 0;
        this.update = function () {
            // update values
            if (this.colorIndex == this.colorsArray.length) {
                this.colorIndex = 0;
            }
            this.textColor = "rgb(" + this.colorsArray[this.colorIndex] + "," + this.colorsArray[this.colorIndex] + "," + this.colorsArray[this.colorIndex] + ")";
            this.colorIndex++;
        };
    }
    onEnter() {
        resumeGame();
        var i = 1, l = 100, values = [];
        for (i; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        this.colorsArray = values;

        // When the Enter key is pressed go to the next state
        window.onkeydown = function (e) {
            var keyCode = e.keyCode;
            if (keyCode === 27) {
                // Go to next State
                var gameMode = getGameInstance();
                console.log("this state is: ", gameMode);
                gameMode.pop();
            }
        };
    };
    onExit() {
        // clear the keydown event
        window.onkeydown = null;
        console.log(" Pause Menu EVENT IS DELETED");

    };

    render() {
        this.canvas.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.angle += 1 * Math.PI / 180; // rotation speed
        this.canvas.save();
        // redraw
        this.canvas.translate(0, 0);
        this.canvas.rotate(this.angle);
        this.canvas.fillStyle = this.backgroundColor;
        this.canvas.fillColor = this.backgroundColor;
        this.canvas.fillRect(100 / -2, 100 / -2, 100, 100);
        this.canvas.fillStyle = this.textColor;
        this.canvas.font = "24pt Courier";
        this.canvas.fillText(this.mainText, 350, 350);
        this.canvas.restore();


        /*
        this.canvas.clearRect(0,0,this.dimensions.width,this.dimensions.height)
        this.canvas.beginPath();
        this.canvas.fillStyle = this.backgroundColor;
        this.canvas.fillColor = this.backgroundColor;
        this.canvas.fillRect(0,0,this.dimensions.width,this.dimensions.height);
        this.canvas.fillStyle = this.textColor;
        this.canvas.font = "24pt Courier";
        this.canvas.fillText(this.mainText, 120, 100);
        */
    };
    onPause() {

    };
    onResume() {
    };
}
class StateList {
    constructor() {
        this.states = []
    }
    pop() {
        return this.states.pop();
    };
    push(state) {
        console.log("pushed", state);
        this.states.push(state);
    };
    top() {
        return this.states[this.states.length - 1];
    }
}
class StateStack {
    constructor() {
        this.states = new StateList();

        /* adds an empty state to prevent errors */
        this.push(new EmptyState());
    }

    update() {
        var state = this.states.top();
        if (state) {
            state.update();
        }
    };
    render() {
        var state = this.states.top();
        if (state) {
            state.render();
        }
    };
    push(state) {
        this.change();
        this.states.push(state);
        state.onEnter();
    };
    pop() {
        var state = this.states.top();
        state.onExit();
        return this.states.pop();
    };
    pause() {
        var state = this.states.top();
        if (state.onPause) {
            state.onPause();
        }
    };
    change() {
        var state = this.states.top();
        if (state)
            state.onExit();
    };
    resume() {
        var state = this.states.top();
        if (state.onResume) {
            state.onResume();
        }
    };

}
/* ----  state machine section end ---- */

/* ---- class section end ---- */

/* GameField */
var gameField = {
    canvas: null,
    canvasContext: null,
    canvas_width: 1000,
    canvas_height: 1000,
    gameMode: new StateStack(),
    //then: null,
    //startTime: null,
    timer: null,
    FPS: 2,
    fpsInterval: null,
    update: function () {
        this.gameMode.update();
        this.gameMode.render();
    },
    startGame: function () {
        //loadRessources();
        this.gameMode.push(new MainMenu());
        //this.gameMode.push(new level0());
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
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;
        this.canvasContext = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // due to some loading issues with images and sprites w want to insert it before
        this.timer = 1000 / this.FPS;
        this.startGame();
    },
}

/* ----  load section  ---- */
function loadFromFiles(imagenames, soundnames, callback) {
    var n, imagename, m, soundname,
        result = {},
        count = imagenames.length,
        onload = function () {
            if (--count == 0) {
                console.log("LOADRESSOURCES", result);
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
function loadAssets(assets) {
    globalassets = assets;
    console.log("globalassets", globalassets);
    return assets;

}
/* ----  load section end ---- */

/* ----  global function section for gameField ---- */
/* triggers when page is loaded  */
window.onload = function () {
    window.getGameInstance = function () {
        return gameField.gameMode;
    };

    window.getContext = function () {
        return gameField.canvasContext;
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

    window.getContextElement = function () {
        return gameField.canvasContext;
    };

    window.getCurrentLevelConfig = function () {
        var gamemode = getGameInstance();
        var levelData = gamemode.states.top();
        return levelData.levelConfig;
    };
    /***** GAME STARTS HERE *****/

    window.loadRessources = function () {
        loadFromFiles(objects, soundEffects, loadAssets);
    }
    loadRessources();
    gameField.init();
}
/* ----  global function section for gameField end  ---- */

/* ----  draw section  ---- */
function drawbackground(img) {
    img.onload = function () {
        canvasContext.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}
function drawItems(itemlist) {
    for (var i = 0; i < itemlist.length; i++) {
        // itemlist[i].angle = itemlist[i].currentPointOfView * Math.PI / 180;
        itemlist[i].angle += 2 * Math.PI / 180;
        var ctx = null;
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
function drawSerpent(serpentPlayer) {
    var serpentPartbefore = [];
    var serpentPartafter = [];
    // console.log("drawPLAYER", serpentPlayer);
    for (var i = 0; i < serpentPlayer.serpentParts.length; i++) {
        serpentPlayer.serpentParts[i].angle = serpentPlayer.serpentParts[i].currentPointOfView * Math.PI / 180;
        var ctx = null;
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
            var ctx = null;
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
            var ctx = null;
            ctx = gameField.canvasContext;
            ctx.save();
            ctx.translate(serpentPlayer.serpentParts[i].x * gridSizeScale + (serpentPlayer.width / 2), serpentPlayer.serpentParts[i].y * gridSizeScale + (serpentPlayer.height / 2));
            ctx.rotate(serpentPlayer.serpentParts[i].angle);
            //console.log("head", serpentPartbefore, "end", serpentPartafter);

            /* if serpent takes corner we only need to change the second part of the serpent because we are deleting the last part everytime */
            if ((serpentPartbefore[0] != serpentPartafter[0]) && (serpentPartbefore[1] != serpentPartafter[1])) {
                var currentCornerSprite = new Image();
                if (serpentPlayer.serpentParts[i].currentCorner == 1) {
                    console.log("links");
                    currentCornerSprite = serpentPlayer.animation.spritesheet[5];
                }
                else {
                    console.log("rechts", serpentPlayer.serpentParts[i].currentCorner);
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
function drawKiSerpent(aiSerpents) {
    var serpentPartbefore = [];
    var serpentPartafter = [];
    for (var k = 0; k < aiSerpents.length; k++) {
        serpentPartbefore[k] = [];
        serpentPartafter[k] = [];
    }
    /* head */
    for (var i = 0; i < aiSerpents.length; i++) {
        for (var j = 0; j < aiSerpents[i].serpentParts.length; j++) {
            aiSerpents[i].serpentParts[j].angle = aiSerpents[i].serpentParts[j].currentPointOfView * Math.PI / 180;
            var ctx = gameField.canvasContext;
            ctx.save();
            /* serpent head */
            if (j == 0) {
                ctx.translate(aiSerpents[i].serpentParts[j].x * gridSizeScale + (aiSerpents[i].width / 2), aiSerpents[i].serpentParts[j].y * gridSizeScale + (aiSerpents[i].height / 2));
                ctx.rotate(aiSerpents[i].serpentParts[j].angle);
                ctx.drawImage(aiSerpents[i].animation.spritesheet[aiSerpents[i].animation.currentFrame],
                    0,    // position on image x
                    0,    // position on image y
                    aiSerpents[i].animation.spritesheetformatx, // part of image x
                    aiSerpents[i].animation.spritesheetformaty, // part of image y
                    aiSerpents[i].width / - 2, // position on canvas x
                    aiSerpents[i].height / - 2, // position on canvas y
                    aiSerpents[i].width, // strech to on x 
                    aiSerpents[i].height // strech to on y
                );
                /*
                let imgData = ctx.getImageData(0, 0, 1000, 1000); 
                console.log("beforecolorchange", imgData);
                imgData = invertColors(imgData);
                console.log("aftercolorchange", imgData);
                ctx.putImageData(imgData, 0, 0); 
                */
            }
            /* serpent end */
            else if (j == aiSerpents[i].serpentParts.length - 1) {
                ctx = gameField.canvasContext;
                ctx.save();
                ctx.translate(aiSerpents[i].serpentParts[j].x * gridSizeScale + (aiSerpents[i].width / 2), aiSerpents[i].serpentParts[j].y * gridSizeScale + (aiSerpents[i].height / 2));
                ctx.rotate(aiSerpents[i].serpentParts[j].angle);
                ctx.drawImage(aiSerpents[i].animation.spritesheet[6],
                    0,    // position on image x
                    0,    // position on image y
                    aiSerpents[i].animation.spritesheetformatx, // part of image x
                    aiSerpents[i].animation.spritesheetformaty, // part of image y
                    aiSerpents[i].width / - 2, // position on canvas x
                    aiSerpents[i].height / - 2, // position on canvas y
                    aiSerpents[i].width, // strech to on x 
                    aiSerpents[i].height // strech to on y
                );

            }
            /* serpent mid */
            else {
                serpentPartbefore[i] = [aiSerpents[i].serpentParts[j - 1].x, aiSerpents[i].serpentParts[j - 1].y]; //
                serpentPartafter[i] = [aiSerpents[i].serpentParts[j + 1].x, aiSerpents[i].serpentParts[j + 1].y]; //

                ctx = gameField.canvasContext;
                ctx.save();
                ctx.translate(aiSerpents[i].serpentParts[j].x * gridSizeScale + (aiSerpents[i].width / 2), aiSerpents[i].serpentParts[j].y * gridSizeScale + (aiSerpents[i].height / 2));
                ctx.rotate(aiSerpents[i].serpentParts[j].angle);
                //console.log("head", serpentPartbefore, "end", serpentPartafter);

                /* if serpent takes corner we only need to change the second part of the serpent because we are deleting the last part everytime */
                if ((serpentPartbefore[i][0] != serpentPartafter[i][0]) && (serpentPartbefore[i][1] != serpentPartafter[i][1])) {
                    var currentCornerSprite = new Image();
                    if (aiSerpents[i].serpentParts[j].currentCorner == 1) {

                        currentCornerSprite = aiSerpents[i].animation.spritesheet[5];
                    }
                    else {

                        currentCornerSprite = aiSerpents[i].animation.spritesheet[4];
                    }
                    ctx.drawImage(currentCornerSprite,
                        0,    // position on image x
                        0,    // position on image y
                        aiSerpents[i].animation.spritesheetformatx, // part of image x
                        aiSerpents[i].animation.spritesheetformaty, // part of image y
                        aiSerpents[i].width / - 2, // position on canvas x
                        aiSerpents[i].height / - 2, // position on canvas y
                        aiSerpents[i].width, // strech to on x 
                        aiSerpents[i].height // strech to on y
                    );
                }
                else {
                    ctx.drawImage(aiSerpents[i].animation.spritesheet[3],
                        0,    // position on image x
                        0,    // position on image y
                        aiSerpents[i].animation.spritesheetformatx, // part of image x
                        aiSerpents[i].animation.spritesheetformaty, // part of image y
                        aiSerpents[i].width / - 2, // position on canvas x
                        aiSerpents[i].height / - 2, // position on canvas y
                        aiSerpents[i].width, // strech to on x 
                        aiSerpents[i].height // strech to on y
                    );
                }
            }

            ctx.restore();
        }
    }
}
// created this function for visualization reasons
function drawBackground(bg_stars, bg_universe, serpentPlayer) {
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
}
function draw(bg_stars, bg_universe, serpentPlayer, itemlist, aiSerpents) {
    drawBackground(bg_stars, bg_universe, serpentPlayer);
    drawItems(itemlist);
    drawKiSerpent(aiSerpents);
    drawSerpent(serpentPlayer);
}
/* ----  draw section end ---- */

/* ----  AI section  ---- */
function calculateNextMove(obstaclesTable, currentPosition, itemPosition) {

    // aStar is the Pathfinding algorithm used to find a shortest path from the snakehead to the food
    var aStarResult = aStar(obstaclesTable, itemPosition, currentPosition);

    if (aStarResult.pathFound == true)
    // aStar can only find a path, if the food position is reacheable in the current state of the game
    {
        var nextNode = aStarResult.nextNode;
        if (nextNode.position.x > currentPosition.x) {
            //move right!
            return { dx: 1, dy: 0 };
        }
        if (nextNode.position.x < currentPosition.x) {
            //move left!
            return { dx: -1, dy: 0 };

        }
        if (nextNode.position.y > currentPosition.y) {
            //move down!
            return { dx: 0, dy: 1 };

        }
        if (nextNode.position.y < currentPosition.y) {
            //move up!
            return { dx: 0, dy: -1 };
        }
    }
    // if a Star can not find a valid path, an adjacent free field will be chosen
    else {
        if (currentPosition.y + 1 < obstaclesTable.length && obstaclesTable[currentPosition.x][currentPosition.y + 1] == 0) {
            //move down!
            return { dx: 0, dy: 1 };
        }

        if (currentPosition.y - 1 >= 0 && obstaclesTable[currentPosition.x][currentPosition.y - 1] == 0) {
            //move up!
            return { dx: 0, dy: -1 };
        }

        if (currentPosition.x + 1 < obstaclesTable.length && obstaclesTable[currentPosition.x + 1][currentPosition.y] == 0) {
            //move right!
            return { dx: 1, dy: 0 };
        }

        if (currentPosition.x - 1 >= 0 && obstaclesTable[currentPosition.x - 1][currentPosition.y] == 0) {
            //move left!
            return { dx: -1, dy: 0 };
        }
    }
}
function reconstruct_path(current) {
    while (current.parent != null) {
        if (current.parent.parent != null)
            current = current.parent;
        else {
            return current;
        }
    }
    return current;
}
function positionsAreEqual(fieldA, fieldB) {
    return fieldA.x == fieldB.x && fieldA.y == fieldB.y;
}
function aStar(obstaclesTable, goalPosition, startPosition) {
    // The closedTable describes, which elements have already been visited by the algorithm
    var closedTable = new playground(obstaclesTable.length, obstaclesTable.length).fields;
    var startField = new Node(startPosition, 0, null, goalPosition);

    // The open List represents the possible neighbouring fields which could be visited next.
    var openList = new PriorityQueue();

    // At first, the starting field is added to the open List
    openList.enqueue(startField, startField.fCost);

    // If there are no more entries in the openList, this means that the algorithm has visited
    // all possible fields without finding the goal along its path.
    for (let index = 0; !openList.isEmpty() && index < obstaclesTable.length * obstaclesTable.length * obstaclesTable.length; index++) {
        // The field with the shortest estimated costs (FCosts) towards the goal is removed from the open list
        var smallestFScoreField = openList.dequeue().element;

        let x = smallestFScoreField.position.x;
        let y = smallestFScoreField.position.y;

        // and then added to the closed list
        closedTable[x][y] = 1;

        // If this field has the same coordinates as the goal, the goal has been found.
        if (positionsAreEqual(smallestFScoreField.position, goalPosition)) {
            return { pathFound: true, nextNode: reconstruct_path(smallestFScoreField) };
        }

        //bottom neighbour
        if (y + 1 < obstaclesTable.length && obstaclesTable[x][y + 1] == 0 && closedTable[x][y + 1] == 0) {
            let neighbour = new Node({ x: x, y: y + 1 }, smallestFScoreField.gCost + 1, smallestFScoreField, goalPosition);
            openList.enqueue(neighbour, neighbour.fCost);
        }

        //upper neighbour
        if (y - 1 >= 0 && obstaclesTable[x][y - 1] == 0 && closedTable[x][y - 1] == 0) {
            let neighbour = new Node({ x: x, y: y - 1 }, smallestFScoreField.gCost + 1, smallestFScoreField, goalPosition);
            openList.enqueue(neighbour, neighbour.fCost);
        }

        //right neighbour
        if (x + 1 < obstaclesTable.length && obstaclesTable[x + 1][y] == 0 && closedTable[x + 1][y] == 0) {
            let neighbour = new Node({ x: x + 1, y: y }, smallestFScoreField.gCost + 1, smallestFScoreField, goalPosition);
            openList.enqueue(neighbour, neighbour.fCost);
        }

        //left neighbour
        if (x - 1 >= 0 && obstaclesTable[x - 1][y] == 0 && closedTable[x - 1][y] == 0) {
            let neighbour = new Node({ x: x - 1, y: y }, smallestFScoreField.gCost + 1, smallestFScoreField, goalPosition);
            openList.enqueue(neighbour, neighbour.fCost);
        }
    }
    return { pathFound: false, nextNode: null };
}

/* ----  add/Remove section  ---- */
function removeSnakeFromMatrix(aiSerpentPart, playField) {
    for (var i = 0; i < aiSerpentPart.serpentParts.length; i++) {
        removeSnakePart(aiSerpentPart.serpentParts[i], playField)
    }
}
function removeSnakePart(aiSerpentPart, playField) {
    if (aiSerpentPart.x < playField.fields.length && aiSerpentPart.y < playField.fields.length)
        playField.fields[aiSerpentPart.x][aiSerpentPart.y] = 0;
}
function addSnakeToMatrix(aiSerpentPart, playField) {
    for (var i = 0; i < aiSerpentPart.serpentPart.length; i++) {
        addSnakePart(aiSerpentPart.serpentPart[i], playField)
    }
}
function addSnakePart(aiSerpentPart, playField) {
    if (aiSerpentPart.x < playField.fields.length && aiSerpentPart.y < playField.fields.length)
        playField.fields[aiSerpentPart.x][aiSerpentPart.y] = 1;
}
/* ----  add/Remove section end ---- */

/* ----  AI section end ---- */

/* ----  movement section  ---- */
function movement(serpentPlayer, aiSerpents, playGroundLevel, items, sound) {
    //console.log("movement", items);
    moveAiSerpents(aiSerpents, playGroundLevel, items, sound);
    // console.log("movementafterki", items);
    moveSerpent(serpentPlayer, playGroundLevel, items, sound);
}

function getTargetPosition(aiSerpent, items, playField) {
    let targetStillExists = (playField.fields[aiSerpent.nextTarget.x][aiSerpent.nextTarget.y] == aiSerpent.nextTarget.objectID) ? true : false;
    if (!targetStillExists)
        aiSerpent.nextTarget = generateNewRandomTarget(items);
    return { x: aiSerpent.nextTarget.x, y: aiSerpent.nextTarget.y };
}

function generateNewRandomTarget(items) {
    let randomInt = getRandomIntInclusive(0, items.length - 1);
    let newTarget = items[randomInt];
    return { objectID: newTarget.id, x: newTarget.gridx, y: newTarget.gridy };
}

function createObstacleTable(aiSerpent) {
    let obstaclesTable = new playground();
    obstaclesTable.fields[aiSerpent.serpentParts[1].x][aiSerpent.serpentParts[1].y] = 1;
    return obstaclesTable;
}

function moveAiSerpents(aiSerpents, playField, items, sound) {
    for (let i = 0; i < aiSerpents.length; i++) {
        let nextTargetPosition = getTargetPosition(aiSerpents[i], items, playField);
        let obstaclesTable = createObstacleTable(aiSerpents[i]);

        let nextMovement = calculateNextMove(obstaclesTable.fields, { x: aiSerpents[i].serpentParts[0].x, y: aiSerpents[i].serpentParts[0].y }, { x: nextTargetPosition.x, y: nextTargetPosition.y });

        aiSerpents[i].OldDx = aiSerpents[i].dx;
        aiSerpents[i].OldDy = aiSerpents[i].dy;

        /* change direction for animation head */
        if (nextMovement.dy == -1)
            aiSerpents[i].serpentParts[0].currentPointOfView = aiSerpents[i].serpentParts[0].PointOfView.north;
        else if (nextMovement.dy == +1)
            aiSerpents[i].serpentParts[0].currentPointOfView = aiSerpents[i].serpentParts[0].PointOfView.south;
        else if (nextMovement.dx == -1)
            aiSerpents[i].serpentParts[0].currentPointOfView = aiSerpents[i].serpentParts[0].PointOfView.west;
        else if (nextMovement.dx == +1)
            aiSerpents[i].serpentParts[0].currentPointOfView = aiSerpents[i].serpentParts[0].PointOfView.east;

        /* change direction for animation body */
        if ((aiSerpents[i].OldDx == + 1 && aiSerpents[i].serpentParts[0].currentPointOfView == aiSerpents[i].serpentParts[0].PointOfView.north)
            || (aiSerpents[i].OldDy == + 1 && aiSerpents[i].serpentParts[0].currentPointOfView == aiSerpents[i].serpentParts[0].PointOfView.east)
            || (aiSerpents[i].OldDx == - 1 && aiSerpents[i].serpentParts[0].currentPointOfView == aiSerpents[i].serpentParts[0].PointOfView.south)
            || (aiSerpents[i].OldDy == - 1 && aiSerpents[i].serpentParts[0].currentPointOfView == aiSerpents[i].serpentParts[0].PointOfView.west)) {
            aiSerpents[i].serpentParts[0].currentCorner = 1;
        }
        else {
            aiSerpents[i].serpentParts[0].currentCorner = 2;
        }

        /* set movement */
        aiSerpents[i].dx = nextMovement.dx;
        aiSerpents[i].dy = nextMovement.dy;

        removeSnakeFromMatrix(aiSerpents[i], playField);
        moveSerpent(aiSerpents[i], playField, items, sound);
    }

}
function moveSerpent(serpent, playField, items, sound) {
    // Create the new Snake's head
    var newHead = new serpentPart(serpent.serpentParts[0].x + serpent.dx, serpent.serpentParts[0].y + serpent.dy);
    newHead.currentPointOfView = serpent.serpentParts[0].currentPointOfView;
    // Add the new head to the beginning of snake body
    serpent.serpentParts.unshift(newHead);
    // removes the last part of the serpent from playground
    
    const chasEatenFood = hasEatenFood(serpent, items, playField, sound);
    if (chasEatenFood) {

        console.log("eaten!!", newHead);
        generateNewItem(1, items, playField);
    }
    else {
        // Remove the last part of snake body
        playField.removeFromPlayground(serpent.serpentParts[serpent.serpentParts.length - 1].x, serpent.serpentParts[serpent.serpentParts.length - 1].y);
        // serpent.serpentParts[serpent.serpentParts.length - 1].removeFromPlayground();
        serpent.serpentParts.pop();
    }
}

function generateNewItem(ObjectType, itemlist, playField) {
    // if food
    if (ObjectType == 1) {
        var newFood = new item(1, "food", getRandomIntInclusive(3, 17), getRandomIntInclusive(3, 17), globalassets.clover);
        itemlist.push(newFood);
        playField.addToPlayground(newFood.gridx, newFood.gridy, 1);
        console.log("food generated", newFood, itemlist);
    }
    else if (ObjectType == 2) {
        var newBackpack = new item(2, "backpack", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.backpack);
        itemlist.push(newBackpack);
        playField.addToPlayground(newBackpack.gridx, newBackpack.gridy, 1);
        console.log("backpack generated", newBackpack, itemlist);
    }
    else if (ObjectType == 3) {
        var newBomb = new item(3, "bomb", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.bomb);
        itemlist.push(newBomb);
        playField.addToPlayground(newBomb.gridx, newBomb.gridy, 1);
        console.log("newBomb generated", newBomb, itemlist);
    }
    else if (ObjectType == 4) {
        var newBook = new item(4, "book", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.book);
        itemlist.push(newBook);
        playField.addToPlayground(newBook.gridx, newBook.gridy, 1);
        console.log("newBook generated", newBook, itemlist);
    }
    else if (ObjectType == 5) {
        var newFeather = new item(5, "feather", getRandomIntInclusive(1, 19), getRandomIntInclusive(1, 19), assets.feather);
        itemlist.push(newFeather);
        playField.addToPlayground(newFeather.gridx, newFeather.gridy, 1);
        console.log("newFeather generated", newFeather, itemlist);
    }
}
/* ----  movement section end ---- */


/* ----  update section  ---- */
function update(serpentPlayer, aiSerpents, playGroundLevel, items, sound) {
    //generateNewItem(item);
    updatePlayfieldfields()
    //console.log(playGroundLevel.fields, items);
    movement(serpentPlayer, aiSerpents, playGroundLevel, items, sound);
}
function updatePlayfieldfields() {

}
/* ----  update section end  ---- */

function ObjectCollision() {
    // 
}
function hasEatenFood(serpent, items, playField, sound) {
    for (let i = 0; i < items.length; i++) {
        console.log("haseatenfood", items, items[i], i);
        // if item == 1 , food is 1
        if (items[i].id == 1 && items[i] != null && items[i] != undefined) {
            // console.log("eatenfood", serpent.serpentParts[0].x, items[i].gridx);
            const chasEatenFood = serpent.serpentParts[0].x === items[i].gridx && serpent.serpentParts[0].y === items[i].gridy;
            // return if true 
            if (chasEatenFood) {
                eatFoodSoundeffect(sound);
                playField.removeFromPlayground(items[i].gridx, items[i].gridy);
                console.log("vorsplice", items, i);
                items.splice(i, 1);
                console.log("nachsplice", items, i);
                return chasEatenFood;
            }
        }
    }
    return false;
}

/* ----  animation section  ---- */
function animationPlayer(serpentPlayer) {
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
function animations(serpentPlayer) {
    animationPlayer(serpentPlayer);
    // animationFood();
}
/* ----  animation section  end ---- */


/* ----  soundeffect section  ---- */
function eatFoodSoundeffect(eatSound) {
    eatSound.pause();
    eatSound.currentTime = 0;
    eatSound.play();
}
/* ----  soundeffect section  ---- */
function cleanUp() {
}

/* ---- help functions section  */
function addToObjectTable(objectName, objectcode) {
    objectTable[objectName] = objectcode;
}
function copyObject(mainObj) {
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
function invertColors(imageData) {
    for (var i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = imageData.data[i] ^ 255; // Invert Red
        imageData.data[i + 1] = imageData.data[i + 1] ^ 255; // Invert Green
        imageData.data[i + 2] = imageData.data[i + 2] ^ 255; // Invert Blue
    }
    return imageData;
}
function invertColors2(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
        data[i + 3] = 255;
    }
    return data;
}
/* ---- help functions section end  */

