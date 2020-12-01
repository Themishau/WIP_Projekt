'use strict';
/* ---- global section ---- */
var int = 1;
/* grid size scale */
var gridSizeScale = 40;
var gridSizey = 40; // 1000 / gridSizeScale = 
var gridSizex = 40; // 1000 % gridSizeScale
var gridfield = 25;
var gSoundVolume = 0.05;
// Decimal round
const round10 = (value, exp) => decimalAdjust('round', value, exp);
// Decimal floor
const floor10 = (value, exp) => decimalAdjust('floor', value, exp);
// Decimal ceil
const ceil10 = (value, exp) => decimalAdjust('ceil', value, exp);

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

var names = [
    "Bumble",
    "Lord V.",
    "Smaug",
    "Naruto",
    "Iron Man",
    "Mufasa",
    "Robin",
]
/* all objects src */
var objects = [
    "clover",
    "backpack",
    "bomb",
    "book",
    "feather",
    "keyarrows",
    "snake_head_b_1",
    "snake_head_b_2",
    "snake_head_b_3",
    "snake_mid_b",
    "snake_end_b",
    "snake_downright_b",
    "snake_downleft_b",
    "snake_head_r_1",
    "snake_head_r_2",
    "snake_head_r_3",
    "snake_mid_r",
    "snake_end_r",
    "snake_downright_r",
    "snake_downleft_r",
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
    "spr_planet07",
    "spr_planet08",
    "spr_planet09",
    "spr_planet10",
    "spr_planet11",
    "spr_planet12",
    "spr_planet13",
    "spr_planet14",
    "Space001",
    "Space002",
    "Space003",
    "Space004",
    "Space005"
];
/* soundEffects table */
var soundEffects = [
    "powerUp.wav",
    "food.wav",
    "explosion.wav",
    "foodPlayer.wav",
    "lost.wav",
    "loseSound.wav",
    "backpack.wav",
    "wibl001.wav",
    "Debris1.wav",
    "blip003.wav",
    "blip001.wav",
    "bg_Jupiter.mp3",
    "sfx_menu_select3.wav",
    "menuSelect.wav",
    "menuSelect_long.wav",
    "intro.mp3",
    "Prologue.mp3",
    "Jumpshot.mp3",
    "underclocked.mp3",
    "Arpanauts.mp3",
    "allofus.mp3"

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

    constructor(id, bgSpace, bg_img, bgsound) {
        this.id = id,
            this.name = "playground",
            this.xSize = Math.ceil(gameField.canvas.height / gridSizeScale),
            this.ySize = Math.ceil(gameField.canvas.height / gridSizeScale),
            this.fields = [],
            this.bg_img = bg_img,
            this.bgSpace = bgSpace,
            this.angle = 0,
            this.anglePlanet2 = 0,
            this.anglePlanet3 = 0,
            this.bg_imgCurrentX = getRandomIntInclusive(-300, 500),
            this.bg_imgCurrentY = getRandomIntInclusive(-300, 500),
            this.currentCanvasX = getRandomIntInclusive(0, 1000),
            this.currentCanvasY = getRandomIntInclusive(0, 1000),
            this.bg_imgCurrentTranslate = 2,
            this.scrollSpeedBackground = getRandomIntInclusive(1, 3),
            this.scrollAcce = 0.5,
            this.scrollDirection = [-0.4, 0.4],
            this.bg_starCurrentX = getRandomIntInclusive(-50, 50),
            this.bg_starCurrentY = getRandomIntInclusive(-50, 50),
            this.bg_starScrollSpeedBackgroundX = getRandomIntInclusive(2, 5),
            this.bg_starScrollSpeedBackgroundY = getRandomIntInclusive(2, 4),
            this.currentImage = getRandomIntInclusive(0, 11),
            this.bgsound = bgsound,
            this.resetPlayground()
    }
    changeCurrentImage(imageNumber) {
        this.currentImage = imageNumber;
    }
    changeCurrent(x, y, cX, cY) {
        this.bg_imgCurrentX = x;
        this.bg_imgCurrentY = y;
        this.currentCanvasX = cX;
        this.currentCanvasY = cY;
    }
    changeCurrentTranslate() {
        this.bg_imgCurrentTranslate = 2;
    }
    changeCurrentbgStarX(x, y) {
        this.bg_starCurrentX = x;
        this.bg_starCurrentY = y;

    }


}
/* individual part of the serpent */
class serpentPart {
    constructor(x, y, currentPointOfView) {
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
            this.currentPointOfView = currentPointOfView
    }
}
/* serpent */
class serpent {
    addSerpentPart(amount) {
        for (var i = 0; i < amount; i++) {
            this.serpentParts.push(new serpentPart(this.gridx - i, this.gridy, 270));
        }
    }
    removeAllSerpentParts() {
        this.serpentParts = [];
    }
    constructor(id, name, x, y, spritesheet, initSnakeParts) {
        this.id = id,
            this.alive = true,
            this.name = name,
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

class MenuConfig {
    constructor(name) {
        /* ---- init some variables ---- */
        this.name = name,
            this.serpentSprites = [],
            this.sound = [],
            this.scrollSpeedBackground = 1;
        this.backgroundColor = "#000",
            this.mainText = "Space Serpent",
            this.backgroundImageY = 0,
            this.backgroundImage = new Image(),
            this.scrollSound = new Audio,
            this.selectSound = new Audio,
            this.afterGameScreenMusic = new Audio,
            this.menuMusic = new Audio,
            this.creditsMusik = new Audio,
            this.textColor = "rgb(0,0,0)", // Starts with black
            this.colorsArray = [], // our fade values
            this.colorIndex = 0,
            this.textColorSelected = "rgb(0,0,0)",
            this.colorsArraySelected = [], // our fade values
            this.colorIndexSelected = 0

        //this.foodList = []
        // this.loadRessources(objects, soundEffects, this.loadLevel);
    }
    loadLevel(assets) {

        this.serpentSprites = [assets.snake_head1, assets.snake_head_b_1, assets.snake_head_r_1];
        this.sound[1] = assets.blip003;
        this.sound[1].volume = gSoundVolume;
        this.sound[2] = assets.blip001;
        this.sound[2].volume = gSoundVolume;
        this.sound[3] = assets.wibl001;
        this.sound[3].volume = gSoundVolume;
        this.backgroundImage = assets.bg_stars;
        this.scrollSound = assets.menuSelect;
        this.scrollSound.volume = gSoundVolume;
        this.selectSound = assets.menuSelect_long;
        this.selectSound.volume = gSoundVolume;
        this.menuMusic = assets.intro;
        this.menuMusic.volume = gSoundVolume;
        this.afterGameScreenMusic = assets.Prologue;
        this.afterGameScreenMusic.volume = gSoundVolume;
        this.creditsMusic = assets.Jumpshot;
        this.creditsMusic.volume = gSoundVolume;
    }
    StartLoading = function () {
        this.loadLevel(globalassets);
    }
    changeMenuConfig(mainText, backgroundImage) {
        if (mainText != null)
            this.mainText = mainText;
        if (backgroundImage != null)
            this.backgroundImage = backgroundImage;
    }
    setSoundVolume() {
        if (this.sound != undefined)
            this.sound.forEach(sound => {
                sound.volume = gSoundVolume;
            });
        this.scrollSound.volume = gSoundVolume;
        this.selectSound.volume = gSoundVolume;
        this.menuMusic.volume = gSoundVolume;
        this.afterGameScreenMusic.volume = gSoundVolume;
        this.creditsMusic.volume = gSoundVolume;
    }
}
/* ----  state machine section  ---- */
class LevelConfig {
    constructor(name, playerName, level, levelOption) {
        /* ---- init some variables ---- */
        this.name = name,
            this.level = level,
            this.playerName = playerName,
            this.levelOption = levelOption,
            this.backGroudSpace = [],
            this.bg_image = new Image(),
            this.img = new Image(),
            this.bg_universe = new Image(),
            this.bg_stars = new Image(),
            this.serpentSpritesGreen = [],
            this.serpentSpritesBlue = [],
            this.serpentSpriteRed = [],
            this.serpent_sprites = [],
            this.playGroundLevel,
            this.playGroundBGMusic,
            this.backGroundSprites,
            this.serpentPlayer,
            this.highestEnemy = 0,
            this.speed = 0,
            this.playMode = this.levelOption.winCondition.playType,
            //this.obstacleTable = null;
            this.aiSerpents = [],
            this.itemlist = [],
            this.sound = [];
        //this.foodList = []
        // this.loadRessources(objects, soundEffects, this.loadLevel);
    }
    loadLevel(assets) {

        let canvasDimensions = getGameDimensions();
        if (this.levelOption.playGroundSize == 2) {
            console.log(canvasDimensions.height + "/" + 50 + "=" + canvasDimensions.height / 50);
            gridfield = 50;
            gridSizeScale = canvasDimensions.height / gridfield;
            gridSizey = canvasDimensions.height / gridfield; // 1000 / gridSizeScale = 
            gridSizex = canvasDimensions.height / gridfield; // 1000 % gridSizeScale

        }
        else if (this.levelOption.playGroundSize == 1) {
            gridfield = 35;
            gridSizeScale = canvasDimensions.height / gridfield;
            gridSizey = canvasDimensions.height / gridfield; // 1000 / gridSizeScale = 
            gridSizex = canvasDimensions.height / gridfield; // 1000 % gridSizeScale

        }
        else if (this.levelOption.playGroundSize == 0) {
            gridfield = 25;
            gridSizeScale = canvasDimensions.height / gridfield;
            gridSizey = canvasDimensions.height / gridfield; // 1000 / gridSizeScale = 
            gridSizex = canvasDimensions.height / gridfield; // 1000 % gridSizeScale


        }
        console.log("assets", assets, gridSizeScale, gridfield);
        if (this.levelOption.movementAcc == 2) {
            this.speed = 0.35;
        }
        else if (this.levelOption.movementAcc == 1) {
            this.speed = 0.20;
        }
        else if (this.levelOption.movementAcc == 0) {
            this.speed = 0.15;
        }
        this.serpent_sprites[0] = [assets.snake_head1, assets.snake_head2, assets.snake_head3, assets.snake_mid, assets.snake_downleft, assets.snake_downright, assets.snake_end]; // for testing
        this.serpent_sprites[1] = [assets.snake_head_b_1, assets.snake_head_b_2, assets.snake_head_b_3, assets.snake_mid_b, assets.snake_downleft_b, assets.snake_downright_b, assets.snake_end_b];
        this.serpent_sprites[2] = [assets.snake_head_r_1, assets.snake_head_r_2, assets.snake_head_r_3, assets.snake_mid_r, assets.snake_downleft_r, assets.snake_downright_r, assets.snake_end_r];
        this.serpentSpritesGreen = this.serpent_sprites[0];
        this.serpentSpritesBlue = this.serpent_sprites[1];
        this.serpentSpriteRed = this.serpent_sprites[2];
        this.backGroudSpace = [null, assets.Space001, assets.Space002, assets.Space003, assets.Space004, assets.Space005],
            this.backGroundSprites = [assets.spr_planet01,
            assets.spr_planet02,
            assets.spr_planet03,
            assets.spr_planet04,
            assets.spr_planet05,
            assets.spr_planet06,
            assets.spr_planet07,
            assets.spr_planet08,
            assets.spr_planet09,
            assets.spr_planet10,
            assets.spr_planet11,
            assets.spr_planet12,
            assets.spr_planet13,
            assets.spr_planet14,
            ];
        this.playGroundBGMusic = [assets.underclocked, assets.Jumpshot, assets.Arpanauts, assets.allofus];
        this.playGroundLevel = new playground(0, this.backGroudSpace[getRandomIntInclusive(0, 5)], this.backGroundSprites, this.playGroundBGMusic[getRandomIntInclusive(0, this.playGroundBGMusic.length - 1)]);
        this.serpent_sprite = assets.serpent_sprite;
        this.sound[0] = assets.food;
        this.sound[0].volume = gSoundVolume;
        this.sound[1] = assets.foodPlayer;
        this.sound[1].volume = gSoundVolume;
        this.sound[2] = assets.backpack;
        this.sound[2].volume = gSoundVolume;
        this.sound[3] = assets.explosion;
        this.sound[3].volume = gSoundVolume;
        this.sound[4] = assets.blip001;
        this.sound[4].volume = gSoundVolume;
        this.sound[5] = assets.wibl001;
        this.sound[5].volume = gSoundVolume;
        this.sound[6] = assets.sfx_menu_select3;
        this.sound[6].volume = gSoundVolume;
        this.sound[7] = assets.lost;
        this.sound[7].volume = gSoundVolume;
        this.sound[8] = assets.loseSound;
        this.sound[8].volume = gSoundVolume;
        //this.obstacleTable = new playground(1, null, null);
        // this.bg_universe = assets.spr_planet02;
        this.bg_stars = assets.bg_stars;
        this.playGroundLevel.bgsound.volume = gSoundVolume;
        this.playGroundLevel.bgsound.loop = true;
        this.serpentPlayer = new serpent(6, this.playerName, 5, 5, this.serpent_sprites[this.levelOption.serpentSpriteColor], 3);
        // delete the sprite from the list
        this.serpent_sprites.splice(this.levelOption.serpentSpriteColor, 1);
        this.itemlist[0] = new item(1, "food", getRandomIntInclusive(3, gridfield - 3), getRandomIntInclusive(3, gridfield - 3), assets.clover);
        this.itemlist[1] = new item(1, "food", getRandomIntInclusive(3, gridfield - 3), getRandomIntInclusive(3, gridfield - 3), assets.clover);
        this.itemlist[2] = new item(1, "food", getRandomIntInclusive(3, gridfield - 3), getRandomIntInclusive(3, gridfield - 3), assets.clover);
        this.itemlist[3] = new item(3, "bomb", getRandomIntInclusive(1, gridfield - 3), getRandomIntInclusive(1, gridfield - 3), assets.bomb);
        this.itemlist[4] = new item(5, "feather", getRandomIntInclusive(1, gridfield - 3), getRandomIntInclusive(1, gridfield - 3), assets.feather);
        /*
        this.itemlist[3] = new item(2, "backpack", getRandomIntInclusive(1, gridfield - 3), getRandomIntInclusive(1, gridfield - 3), assets.backpack);
        this.itemlist[5] = new item(4, "book", getRandomIntInclusive(1, gridfield - 3), getRandomIntInclusive(1, gridfield - 3), assets.book);
        
        */

        for (let i = 0; i < this.itemlist.length; i++) {
            this.playGroundLevel.addToPlayground(this.itemlist[i].gridx, this.itemlist[i].gridy, this.itemlist[i].id);
        }

        for (let i = 0; i <= this.levelOption.aiEnemys - 1; i++) {
            this.aiSerpents[i] = new serpent(i + 7, names[getRandomIntInclusive(0, names.length - 1)], getRandomIntInclusive(3, gridfield - 3), getRandomIntInclusive(3, gridfield - 3), this.serpent_sprites[getRandomIntInclusive(0, 1)], 3);
            /*
            if (i % 2 == 0)
                this.aiSerpents[i] = new serpent(i + 7, getRandomIntInclusive(3, gridfield - 3), getRandomIntInclusive(3, gridfield - 3), this.serpent_sprites[1], 3);
            else if (i % 2 == 1)
                this.aiSerpents[i] = new serpent(i + 7, getRandomIntInclusive(3, gridfield - 3), getRandomIntInclusive(3, gridfield - 3), this.serpent_sprites[0], 3);
            */
            /* change color of serpents */
            /*
            let ctx = gameField.canvasContext;
            let imgData = ctx.getImageData(0, 0, this.aiSerpents[i].width, this.aiSerpents[i].height);
            imgData = invertColors(imgData);

            ctx.putImageData(imgData, 0, 0);
            */
            // console.log(aiSerpents[i], aiSerpents[i].angle);
        }
    }
    StartLoading = function () {
        this.loadLevel(globalassets);
    }
    setSoundVolume() {
        if (this.sound != undefined)
            this.sound.forEach(sound => {
                sound.volume = gSoundVolume;
            });
        this.playGroundLevel.bgsound.volume = gSoundVolume;
    }
}
/* settings like difficulty the player can choose from */
class LevelOption {
    constructor(name, movementAcc, playGroundSize, aiEnemys, serpentSpriteColor, backGround, itemSlots, winCondition) {
        /* ---- init some variables ---- */
        this.name = name,
            this.backGround = backGround,
            this.playGroundSize = playGroundSize,
            this.movementAcc = movementAcc,
            this.serpentSpriteColor = serpentSpriteColor, // for testing
            //this.obstacleTable = null;
            this.aiEnemys = aiEnemys,
            this.itemSlots = itemSlots,
            this.winCondition = winCondition
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
class MenuButton {
    constructor(name, text, img, buttonX, buttonY, buttonWidth, buttonHeight, font, fillStyle) {
        /* ---- init some variables ---- */
        this.name = name,
            this.text = text,
            this.img = [],
            this.img = img,
            this.buttonX = buttonX, // for testing
            this.buttonY = buttonY,
            this.buttonWidth = buttonWidth,
            this.buttonHeight = buttonHeight,
            this.font = font,
            this.fillStyle = fillStyle
    }
}
class level {
    constructor(name, levelConfig, menuconfig) {
        this.name = name;
        this.canvas = getContext();
        this.gameMode = getGameInstance();
        this.menuconfig = menuconfig;
        this.levelConfig = levelConfig;
        this.buttons = [];
        /* keyboard listener */
        window.onkeydown = null;
        /* game speed timers */
        this.globalDeltaLast = Date.now();
        this.globalDeltaNow = Date.now();
        this.globalDelta = 0;
        this.currentDeltaFrame = 0;
        this.speed = this.levelConfig.speed / getGameDeltaTime();
        /* animation timers */
        this.animationInterval = 0;
        this.animationdelay = 100;
        this.obstacleTable;
        this.playMode = levelConfig.playMode;
        this.timeStart = Date.now();
        this.timePauseStart = Date.now();
        this.timePauseEnd = Date.now();
        this.timePauseSum = 0;
        this.gameTime = 0;
        this.playerLose = false;
        this.playerWin = false;
    };

    KeyDownEvent(event) {
        let gameMode = getGameInstance();
        let levelConfig = getCurrentLevelConfig();
        let currentMovingDirection = levelConfig.serpentPlayer.serpentParts[0].currentPointOfView;
        let characterCode = event.keyCode;
        levelConfig.serpentPlayer.OldDx = levelConfig.serpentPlayer.dx;
        levelConfig.serpentPlayer.OldDy = levelConfig.serpentPlayer.dy;
        /* check saved key */
        if (characterCode == 27) {
            gameMode.pause();

        }
        else if ((characterCode == 37) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.east)) {
            levelConfig.serpentPlayer.dx = -1;
            levelConfig.serpentPlayer.dy = 0;
        }
        else if ((characterCode == 39) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.west)) {
            levelConfig.serpentPlayer.dx = +1;
            levelConfig.serpentPlayer.dy = 0;
        }
        else if ((characterCode == 38) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.south)) {
            levelConfig.serpentPlayer.dx = 0;
            levelConfig.serpentPlayer.dy = -1;
        }
        else if ((characterCode == 40) && (currentMovingDirection != levelConfig.serpentPlayer.serpentParts[0].PointOfView.north)) {
            levelConfig.serpentPlayer.dx = 0;
            levelConfig.serpentPlayer.dy = +1;
        }
    };
    /* on enter this state */
    onEnter() {
        this.levelConfig.setSoundVolume();
        this.levelConfig.playGroundLevel.bgsound.pause();
        this.levelConfig.playGroundLevel.bgsound.currentTime = 0;
        this.levelConfig.playGroundLevel.bgsound.play();

        window.onkeydown = this.KeyDownEvent;
        this.buttons.push(new MenuButton("LOST", "YOU DIED!", null, 100, 500, 100, 50, "100pt Courier", "red"));
    };
    /* if direction changes we need to delete the event listeners */
    /* on leave this state */
    onExit() {
        window.onkeydown = null;
        window.onkeyup = null;
    };
    /* update section */
    update() {
        if (window.innerWidth <= 1500)
            this.gameMode.pause();

        this.gameTime = Date.now() - this.timeStart - this.timePauseSum;
        if (round10(getStateData().gameTime / 1000, -1) % 10 == 0)
            generateNewItem(3, this.levelConfig.itemlist, this.levelConfig.playGroundLevel, generateRandomPosition(this.levelConfig.playGroundLevel, this.levelConfig.serpentPlayer, true));

        //check if keylistener are not null 
        if (window.onkeydown == null && window.onkeyup == null) {
            window.onkeydown = this.KeyDownEvent;
            window.onkeyup = this.KeyUpEvent;
        }
        highScoreTable.update();
        instruction.update();
        //easy win condition
        for (let k = 0; k < this.levelConfig.aiSerpents.length; k++) {
            if (this.levelConfig.aiSerpents[k].foodEaten >= this.levelConfig.highestEnemy)
                this.levelConfig.highestEnemy = this.levelConfig.aiSerpents[k].foodEaten;
        }
        // Food Mode 
        if (this.playMode == 0) {
            if (this.levelConfig.serpentPlayer.foodEaten == this.levelConfig.levelOption.winCondition.condition)
                this.playerWin = true;
            else if (this.levelConfig.highestEnemy == this.levelConfig.levelOption.winCondition.condition || this.levelConfig.serpentPlayer.alive == false)
                this.playerLose = true;
        }
        // Time Mode
        else if (this.playMode == 1) {
            //console.log(this.timeStart - this.gameTime);
            //console.log(this.gameTime, this.levelConfig.levelOption.winCondition.condition);

            if ((this.levelConfig.serpentPlayer.foodEaten > this.levelConfig.highestEnemy) && this.gameTime >= this.levelConfig.levelOption.winCondition.condition)
                this.playerWin = true;
            else if (((this.levelConfig.serpentPlayer.foodEaten < this.levelConfig.highestEnemy) && this.gameTime >= this.levelConfig.levelOption.winCondition.condition) || this.levelConfig.serpentPlayer.alive == false)
                this.playerLose = true;
        }
        // Endless Mode
        else if (this.playMode == 2) {
            if (this.levelConfig.serpentPlayer.alive == false)
                this.playerLose = true;
        }
        if (this.playerWin == true) {
            this.levelConfig.playGroundLevel.bgsound.pause();
            victorySoundeffect(this.levelConfig.sound);
            let gameMode = getGameInstance();
            this.menuconfig.changeMenuConfig("You Won!", null);
            gameMode.push(new AfterGameScreen("AfterGameScreen", this.levelConfig, this.currentOption, this.menuconfig));
        }
        else if (this.playerLose == true) {
            //else if (this.levelConfig.highestEnemy == this.levelConfig.levelOption.winCondition || this.levelConfig.serpentPlayer.isAlive == false) {    
            this.levelConfig.playGroundLevel.bgsound.pause();
            this.levelConfig.playGroundLevel.bgsound.currentTime = 0;
            this.levelConfig.sound[7].play();
            //victorySoundeffect(this.levelConfig.sound);
            let gameMode = getGameInstance();

            this.canvas.font = this.buttons[0].font;
            this.canvas.fillStyle = this.buttons[0].fillStyle;
            this.canvas.fillText(this.buttons[0].text, this.buttons[0].buttonX, this.buttons[0].buttonY);
            this.menuconfig.changeMenuConfig("You Lost!", null);
            gameMode.push(new AfterGameScreen("AfterGameScreen", this.levelConfig, this.currentOption, this.menuconfig));
            sleep(2000);
        }

        moveLevelBackground(this.levelConfig.playGroundLevel);
        this.globalDeltaLast = this.globalDeltaNow;
        this.globalDeltaNow = Date.now();
        this.globalDelta = this.globalDeltaNow - this.globalDeltaLast;
        this.currentDeltaFrame += this.globalDelta * this.speed;
        //this.currentDeltaFrame += round10((this.globalDelta * this.speed), -1);

        // if (Math.ceil(this.currentDeltaFrame) == 1) {

        if (round10((this.currentDeltaFrame), -1) >= 1) {
            this.currentDeltaFrame = 0;
            update(this.levelConfig.serpentPlayer, this.levelConfig.aiSerpents, this.levelConfig.playGroundLevel, this.levelConfig.itemlist, this.levelConfig.sound);
        }
        animations(this.levelConfig.serpentPlayer);
    };
    /* draw section */
    render() {
        gameField.canvasContext.clearRect(0, 0, gameField.canvas.width, gameField.canvas.height);
        draw(this.levelConfig.bg_stars, this.levelConfig.playGroundLevel, this.levelConfig.serpentPlayer, this.levelConfig.itemlist, this.levelConfig.aiSerpents);

    };
    onPause() {
        window.onkeydown = null;
        this.levelConfig.playGroundLevel.bgsound.pause();
        this.levelConfig.sound[6].play();
        let gameMode = getGameInstance();
        this.timePauseStart = Date.now();
        if (window.innerWidth <= 1500)
            gameMode.push(new PauseMenu("WindowTooSmall", true));
        else
            gameMode.push(new PauseMenu("PauseMenuLevel0", false));
    };
    onResume() {
        console.log("onResume");
        console.log(this.levelConfig.playGroundLevel);
        this.levelConfig.playGroundLevel.bgsound.play();
        this.levelConfig.sound[4].play();
        window.onkeydown = this.KeyDownEvent;
        this.timePauseEnd = Date.now();
        this.timePauseSum += this.timePauseEnd - this.timePauseStart;
    };
    getCurrentLevelConfig() {
        return this.levelConfig
    };
}
class MainMenu {
    constructor(name, menuconfig) {
        this.name = name // Just to identify the State
        this.menuconfig = menuconfig,
            this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.buttons = [],
            this.buttonStartSize = this.dimensions.width / 40 + "pt Courier",
            this.buttonSize = this.dimensions.width / 50 + "pt Courier",
            this.creditButtonSize = this.dimensions.width / 70 + "pt Courier",
            this.creditNamePosition = this.dimensions.width / 2,
            this.buttonNamePosition = this.dimensions.width / 7,
            this.buttonDataPosition = this.dimensions.width / 2,
            this.startPositionSettings = 590,
            this.padding = 50,
            this.selectedButton = 9,
            this.playType = 2, // 0 = Food, 1 = Time, 2 = Endless
            this.playerName = names[getRandomIntInclusive(0, names.length - 1)],
            this.currentOption = [],
            this.currentOption[0] = 0, // PlayerSprite
            this.currentOption[1] = 0, // Enemies
            this.currentOption[2] = 0, // Playfieldsize
            this.currentOption[3] = 0, // Speed
            this.currentOption[4] = 1, // Food
            this.currentOption[5] = 1,  // Time
            this.winCondition = {
                playType: 0,  // food mode
                condition: 10 // ten Food
            }

        /* keyboard listener */
        window.onkeydown = null;
        this.KeyDownEvent = function (e) {
            let stateData = getStateData();
            let keyCode = e.keyCode;
            stateData.menuconfig.menuMusic.play();
            if ((keyCode === 13) && (stateData.selectedButton === 0)) {
                // stateData.addCustomName();
            }
            if ((keyCode === 13) && (stateData.selectedButton === 9)) {
                // Go to next State
                stateData.menuconfig.selectSound.pause();
                stateData.menuconfig.selectSound.currentTime = 0;
                stateData.menuconfig.selectSound.play();
                stateData.menuconfig.menuMusic.pause();
                let gameMode = getGameInstance();
                // get winCondition 
                if (stateData.playType == 0) {
                    stateData.winCondition.playType = 0;
                    stateData.winCondition.condition = stateData.currentOption[4];
                }
                else if (stateData.playType == 1) {
                    stateData.winCondition.playType = 1;
                    stateData.winCondition.condition = stateData.currentOption[5] * 60 * 1000;
                }
                else if (stateData.playType == 2) {
                    stateData.winCondition.playType = 2;
                    stateData.winCondition.condition = 10000;
                }
                console.log("options", stateData.currentOption[2], stateData.currentOption[1], stateData.currentOption[0], stateData.menuconfig, stateData.winCondition);
                let levelConfig = new LevelConfig("level" + 1, stateData.playerName, 1, new LevelOption("level" + 1, stateData.currentOption[3], stateData.currentOption[2], stateData.currentOption[1], stateData.currentOption[0], null, null, stateData.winCondition));
                levelConfig.StartLoading();
                gameMode.push(new level("level" + (levelConfig.level), levelConfig, stateData.menuconfig));
                highScoreTable.init(stateData);
                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
            if ((keyCode === 13) && (stateData.selectedButton === 10)) {
                // Go to next State
                stateData.menuconfig.selectSound.pause();
                stateData.menuconfig.selectSound.currentTime = 0;
                stateData.menuconfig.selectSound.play();
                stateData.menuconfig.menuMusic.pause();
                let gameMode = getGameInstance();
                stateData.menuconfig.changeMenuConfig("Credits", null);
                gameMode.push(new CreditScreen("CreditsScreen", stateData.menuconfig));
                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
            // left
            else if (keyCode === 37) {
                if (stateData.selectedButton == 5) {
                    stateData.playType--;
                    if (stateData.playType < 0)
                        stateData.playType = 2;

                }
                else if (stateData.selectedButton == 0) {
                    stateData.playerName = names[getRandomIntInclusive(0, names.length - 1)];
                    stateData.buttons[11].text = stateData.playerName;
                }
                //playerSprite         
                else if (stateData.selectedButton == 1) {
                    stateData.currentOption[0]--;
                    if (stateData.currentOption[0] < 0)
                        stateData.currentOption[0] = 2;

                }
                //enemies
                else if (stateData.selectedButton == 2) {
                    stateData.currentOption[1]--;
                    if (stateData.currentOption[1] < 0)
                        stateData.currentOption[1] = 0;

                    // enemies
                    stateData.buttons[13].text = stateData.currentOption[1];
                }
                //fieldsize
                else if (stateData.selectedButton == 3) {
                    stateData.currentOption[2]--;
                    if (stateData.currentOption[2] < 0)
                        stateData.currentOption[2] = 0;
                }
                else if (stateData.selectedButton == 4) {
                    stateData.currentOption[3]--;
                    if (stateData.currentOption[3] < 0)
                        stateData.currentOption[3] = 0;
                }
                else if (stateData.selectedButton == 6) {
                    stateData.currentOption[4]--;
                    if (stateData.currentOption[4] < 1)
                        stateData.currentOption[4] = 1;

                    stateData.buttons[17].text = stateData.currentOption[4];
                }
                else if (stateData.selectedButton == 7) {
                    stateData.currentOption[5]--;
                    if (stateData.currentOption[5] < 1)
                        stateData.currentOption[5] = 1;

                    stateData.buttons[18].text = stateData.currentOption[5] + " minute(s)";
                }
                else if (stateData.selectedButton == 8) {
                    gSoundVolume = round10(gSoundVolume - 0.01, -2);
                    if (gSoundVolume <= 0.0)
                        gSoundVolume = 0.0;

                    stateData.menuconfig.setSoundVolume();
                    stateData.menuconfig.menuMusic.volume = gSoundVolume;
                    stateData.buttons[19].text = 1000 * gSoundVolume;
                }
            }
            // right
            else if (keyCode === 39) {
                if (stateData.selectedButton == 5) {
                    stateData.playType++;
                    if (stateData.playType > 2)
                        stateData.playType = 0;
                }
                else if (stateData.selectedButton == 0) {
                    stateData.playerName = names[getRandomIntInclusive(0, names.length - 1)];
                    stateData.buttons[11].text = stateData.playerName;
                }
                //playerSprite
                else if (stateData.selectedButton == 1) {
                    stateData.currentOption[0]++;
                    if (stateData.currentOption[0] > 2)
                        stateData.currentOption[0] = 0;
                }
                //enemies
                else if (stateData.selectedButton == 2) {
                    stateData.currentOption[1]++;
                    if (stateData.currentOption[1] > 5)
                        stateData.currentOption[1] = 5;

                    stateData.buttons[13].text = stateData.currentOption[1];
                }

                else if (stateData.selectedButton == 3) {
                    stateData.currentOption[2]++;
                    if (stateData.currentOption[2] > 2)
                        stateData.currentOption[2] = 2;
                }
                else if (stateData.selectedButton == 4) {
                    stateData.currentOption[3]++;
                    if (stateData.currentOption[3] > 2)
                        stateData.currentOption[3] = 2;
                }
                else if (stateData.selectedButton == 6) {
                    stateData.currentOption[4]++;
                    if (stateData.currentOption[4] > 50)
                        stateData.currentOption[4] = 50;

                    stateData.buttons[17].text = stateData.currentOption[4];
                }
                else if (stateData.selectedButton == 7) {
                    stateData.currentOption[5]++;
                    if (stateData.currentOption[5] > 10)
                        stateData.currentOption[5] = 10;

                    stateData.buttons[18].text = stateData.currentOption[5] + " minute(s)";
                }
                else if (stateData.selectedButton == 8) {
                    gSoundVolume = round10(gSoundVolume + 0.01, -2); // 0.05
                    if (gSoundVolume >= 0.1)
                        gSoundVolume = 0.1;

                    stateData.menuconfig.setSoundVolume();
                    stateData.menuconfig.menuMusic.volume = gSoundVolume;
                    stateData.buttons[19].text = 1000 * gSoundVolume;


                }
            }
            // up
            else if (keyCode === 38) {
                stateData.selectedButton--;

                if ((stateData.playType == 0 && stateData.selectedButton == 7) || stateData.playType == 1 && stateData.selectedButton == 6) {
                    stateData.selectedButton--;
                }
                else if (stateData.playType == 2 && (stateData.selectedButton == 6 || stateData.selectedButton == 7))
                    stateData.selectedButton = stateData.selectedButton - 2;
                if (stateData.selectedButton < 0)
                    stateData.selectedButton = 0;
            }
            // down
            else if (keyCode === 40) {
                stateData.selectedButton++;

                if ((stateData.playType == 0 && stateData.selectedButton == 7) || stateData.playType == 1 && stateData.selectedButton == 6) {
                    stateData.selectedButton++;
                }
                else if (stateData.playType == 2 && (stateData.selectedButton == 6 || stateData.selectedButton == 7))
                    stateData.selectedButton = stateData.selectedButton + 2;

                if (stateData.selectedButton > 10)
                    stateData.selectedButton = 10;
            }
            stateData.menuconfig.scrollSound.pause();
            stateData.menuconfig.scrollSound.currentTime = 0;
            stateData.menuconfig.scrollSound.play();
        };
    }
    onEnter() {
        this.addToButtons();
        window.onkeydown = this.KeyDownEvent;
        let i = 1, l = 100, values = [];
        for (i; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        let j = 1, m = 10, valuesSelected = [];
        for (j; j <= m; j++) {
            valuesSelected.push(Math.round(Math.sin(Math.PI * j / 10) * 255));
        }
        this.menuconfig.colorsArraySelected = valuesSelected;
        this.menuconfig.colorsArray = values;

        // When the Enter key is pressed go to the next state
    };
    onExit() {
        // clear the keydown event
        this.menuconfig.menuMusic.pause();
        console.log("EVENT IS DELETED");
        window.onkeydown = null;

    };
    render() {
        // redraw
        this.canvas.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.canvas.beginPath();
        if (this.menuconfig.colorIndex == this.menuconfig.colorsArray.length) {
            this.menuconfig.colorIndex = 0;
        }
        this.menuconfig.textColor = "rgb(" + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + "," + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + "," + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + ")";
        this.menuconfig.colorIndex++;
        this.canvas.fillStyle = this.menuconfig.backgroundColor;
        this.canvas.fillColor = this.menuconfig.backgroundColor;
        this.canvas.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
        this.canvas.fillStyle = this.menuconfig.textColor;
        this.canvas.drawImage(this.menuconfig.backgroundImage, 0, this.menuconfig.backgroundImageY);
        this.canvas.font = this.dimensions.width / 14 + "pt Courier";
        this.canvas.fillText(this.menuconfig.mainText, this.dimensions.width / 8, this.dimensions.width / 7);
        //this.canvas.strokeStyle = "blue";
        //this.canvas.strokeRect(this.dimensions.width / 2 - 265, 150, 500, 100);
        this.canvas.beginPath();

        for (let i = 0; i <= 10; i++) {
            if (i == this.selectedButton) {
                if (this.menuconfig.colorIndexSelected == this.menuconfig.colorsArraySelected.length) {
                    this.menuconfig.colorIndexSelected = 0;
                }
                this.menuconfig.textColorSelected = "rgb(" + this.menuconfig.colorsArraySelected[this.menuconfig.colorIndexSelected] / 3 + "," + this.menuconfig.colorsArraySelected[this.menuconfig.colorIndexSelected] + "," + this.menuconfig.colorsArraySelected[this.menuconfig.colorIndexSelected] / 2 + ")";
                this.menuconfig.colorIndexSelected++;
                this.canvas.font = this.buttons[i].font;
                this.canvas.fillStyle = this.menuconfig.textColorSelected;
                this.canvas.fillText(this.buttons[i].text, this.buttons[i].buttonX, this.buttons[i].buttonY);
                this.canvas.closePath();
            }
            else {
                if ((this.playType == 0 && i != 7) || (this.playType == 1 && i != 6) || (this.playType == 2 && i != 6 && i != 7)) {
                    this.canvas.beginPath();
                    this.canvas.fillStyle = this.buttons[i].fillStyle;
                    this.canvas.font = this.buttons[i].font;
                    this.canvas.fillText(this.buttons[i].text, this.buttons[i].buttonX, this.buttons[i].buttonY);
                    this.canvas.closePath();
                }
            }

            this.canvas.beginPath();
            // playerName
            this.canvas.fillStyle = this.buttons[11].fillStyle;
            this.canvas.font = this.buttons[11].font;
            this.canvas.fillText(this.buttons[11].text, this.buttons[11].buttonX, this.buttons[11].buttonY);
            // playerSprite
            this.canvas.drawImage(this.buttons[12].img[this.currentOption[0]], this.buttons[12].buttonX, this.buttons[12].buttonY);
            // enemies
            this.canvas.fillStyle = this.buttons[13].fillStyle;
            this.canvas.font = this.buttons[13].font;
            this.canvas.fillText(this.buttons[13].text, this.buttons[13].buttonX, this.buttons[13].buttonY);
            // field size
            this.canvas.fillStyle = this.buttons[14].fillStyle;
            this.canvas.font = this.buttons[14].font;
            this.canvas.fillText(this.buttons[14].text[this.currentOption[2]], this.buttons[14].buttonX, this.buttons[14].buttonY);
            // speed
            this.canvas.fillStyle = this.buttons[15].fillStyle;
            this.canvas.font = this.buttons[15].font;
            this.canvas.fillText(this.buttons[15].text[this.currentOption[3]], this.buttons[15].buttonX, this.buttons[15].buttonY);
            // game mode
            this.canvas.fillStyle = this.buttons[16].fillStyle;
            this.canvas.font = this.buttons[16].font;
            this.canvas.fillText(this.buttons[16].text[this.playType], this.buttons[16].buttonX, this.buttons[16].buttonY);
        }
        //highscore mode
        if (this.playType == 0) {
            //food button
            this.canvas.fillStyle = this.buttons[17].fillStyle;
            this.canvas.font = this.buttons[17].font;
            this.canvas.fillText(this.buttons[17].text, this.buttons[17].buttonX, this.buttons[17].buttonY);
            this.canvas.closePath();
        }
        //time mode
        else if (this.playType == 1) {
            //time button
            this.canvas.fillStyle = this.buttons[18].fillStyle;
            this.canvas.font = this.buttons[18].font;
            this.canvas.fillText(this.buttons[18].text, this.buttons[18].buttonX, this.buttons[18].buttonY);
            this.canvas.closePath();
        }
        else if (this.playType == 2) {
            this.currentOption[4] = 10000; // we set food to 10.000 
            this.canvas.closePath();
        }
        // credits
        this.canvas.beginPath();
        this.canvas.fillStyle = this.buttons[19].fillStyle;
        this.canvas.font = this.buttons[19].font;
        this.canvas.fillText(this.buttons[19].text, this.buttons[19].buttonX, this.buttons[19].buttonY);

        this.canvas.fillStyle = this.buttons[20].fillStyle;
        this.canvas.font = this.buttons[20].font;
        this.canvas.fillText(this.buttons[20].text, this.buttons[20].buttonX, this.buttons[20].buttonY);
        this.canvas.closePath();
    };
    update() {
        // update values
        this.menuconfig.backgroundImageY = moveMenuBackground(this.menuconfig.backgroundImageY, this.menuconfig.scrollSpeedBackground);
        //check if keylistener are not null 
        if (window.onkeydown == null) {
            window.onkeydown = this.KeyDownEvent;
        }
    };
    addToButtons() {


        this.buttons.push(new MenuButton("playerName", "Player Name:", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("ChoosePlayer", "Player:", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 2, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Enemies", "Enemies: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 3, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("playfieldsize", "Field Size: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 4, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Speed", "Speed: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 5, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("WinCondition", "Game Mode: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 6, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Food", "Food: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 7, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Time", "Time: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 7, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Volume", "Volume: ", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 9, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("startText", "Start Game", null, this.buttonNamePosition, this.dimensions.height - this.startPositionSettings + this.padding * 10, 100, 50, this.buttonStartSize, "white"));
        this.buttons.push(new MenuButton("Credits", "See Credits", null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 11 - 20, 100, 50, this.buttonSize, "white"));

        // 11+
        console.log(this.playerName);
        this.buttons.push(new MenuButton("playerName", this.playerName, null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Player", "Player:", this.menuconfig.serpentSprites, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 2 - 25, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Enemy", this.currentOption[1], null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 3, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("fieldSize", ["small", "normal", "big"], null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 4, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Speed", ["slow", "normal", "fast"], null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 5, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("WinCondition", ["Highscore", "Time", "Endless"], null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 6, 100, 50, this.buttonSize, "yellow"));
        this.buttons.push(new MenuButton("Food", 1, null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 7, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Time", 1 + " minute(s)", null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 7, 100, 50, this.buttonSize, "white"));
        this.buttons.push(new MenuButton("Volume", 1000 * gSoundVolume, null, this.buttonDataPosition, this.dimensions.height - this.startPositionSettings + this.padding * 9, 100, 50, this.buttonSize, "yellow"));
        this.buttons.push(new MenuButton("Credit", "Copyright (c) 2020 KaBra, MaSiPi, MaZa", null, this.creditNamePosition, this.dimensions.height - 30, 100, 50, this.creditButtonSize, "blue"));

    };
    addCustomName() {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "text");
        x.setAttribute("value", "HI!");
        document.body.appendChild(x);
        this.playerName = x.value;

    }

}
class PauseMenu {
    constructor(name, bWindowTooSmall) {
        this.name = name // Just to identify the State
        this.canvas = getContext(),
            this.bWindowTooSmall = bWindowTooSmall,
            this.dimensions = getGameDimensions(),
            this.backgroundColor = "#000",
            this.mainText = "Press Escape To Continue",
            this.mainText2 = "Or Press Space To Return To Main Menu",
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
        //resumeGame();
        var i = 1, l = 100, values = [];
        for (i; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        this.colorsArray = values;

        // When the Enter key is pressed go to the next state
        window.onkeydown = function (e) {
            var keyCode = e.keyCode;
            var gameMode = getGameInstance();
            if (keyCode === 27) {
                // Go to next State

                console.log("this state is: ", gameMode);
                gameMode.pop();
                gameMode.resume();
            }
            if (keyCode === 32) {
                let mainMenu = new MainMenu("MainMenu", new MenuConfig("MainMenu"));
                mainMenu.menuconfig.StartLoading();
                gameMode.push(mainMenu);
                this.highScoreTable.clear();
            }

        };
    };
    onExit() {
        // clear the keydown event
        window.onkeydown = null;
        console.log(" Pause Menu EVENT IS DELETED");
    };

    render() {
        let buttonSize = this.dimensions.width / 50 + "pt Courier";
        let creditButtonSize = this.dimensions.width / 70 + "pt Courier";
        let creditNamePosition = this.dimensions.width / 2;
        let buttonNamePosition = this.dimensions.width / 7;
        let buttonDataPosition = this.dimensions.width / 2;
        this.canvas.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        // redraw
        this.canvas.fillStyle = this.backgroundColor;
        this.canvas.fillColor = this.backgroundColor;
        this.canvas.fillRect(100 / -2, 100 / -2, 100, 100);
        this.canvas.fillStyle = this.textColor;
        this.canvas.font = buttonSize;
        this.canvas.fillText(this.mainText, 200, 350);
        this.canvas.fillText(this.mainText2, 200, 400);
        this.canvas.font = this.dimensions.width / 14 + "pt Courier";
        if (this.bWindowTooSmall === true) {
            this.canvas.font = this.dimensions.width / 30 + "pt Courier";
            this.canvas.fillText("Maximize Screen to Continue", this.dimensions.width / 7, this.dimensions.width / 7);
        }
        else {
            this.canvas.font = this.dimensions.width / 14 + "pt Courier";
            this.canvas.fillText("Pause Menu", this.dimensions.width / 5.5, this.dimensions.width / 7);
        }



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
class AfterGameScreen {
    constructor(name, levelConfig, currentOption, menuconfig) {
        this.name = name // Just to identify the State
        this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.menuconfig = menuconfig,
            this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.buttons = [],
            this.selectedButton = 4,
            this.currentOption = currentOption,
            this.levelConfig = levelConfig

    }
    onEnter() {
        console.log(this.menuconfig);
        this.menuconfig.afterGameScreenMusic.pause();
        this.menuconfig.afterGameScreenMusic.currentTime = 0;
        this.menuconfig.afterGameScreenMusic.play();
        this.addToButtons();
        let i = 1, l = 100, values = [];
        for (i; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        let j = 1, m = 10, valuesSelected = [];
        for (j; j <= m; j++) {
            valuesSelected.push(Math.round(Math.sin(Math.PI * j / 10) * 255));
        }
        this.menuconfig.colorsArraySelected = valuesSelected;
        this.menuconfig.colorsArray = values;

        // When the Enter key is pressed go to the next state
        window.onkeydown = function (e) {
            let stateData = getStateData();
            let gameMode = getGameInstance();
            let keyCode = e.keyCode;
            if ((keyCode === 13)) {
                // Go to next State
                stateData.menuconfig.selectSound.pause();
                stateData.menuconfig.selectSound.currentTime = 0;
                stateData.menuconfig.selectSound.play();

                let levelConfig = getCurrentLevelConfig();
                stateData.menuconfig.afterGameScreenMusic.pause();
                stateData.menuconfig.afterGameScreenMusic.currentTime = 0;
                let newlevelconfig = new LevelConfig("level" + (levelConfig.level + 1), stateData.levelConfig.playerName, levelConfig.level + 1, new LevelOption("level" + (levelConfig.level + 1), levelConfig.levelOption.movementAcc, levelConfig.levelOption.playGroundSize, levelConfig.levelOption.aiEnemys, levelConfig.levelOption.serpentSpriteColor, null, null, levelConfig.levelOption.winCondition));
                newlevelconfig.StartLoading();
                gameMode.push(new level("level" + (levelConfig.level + 1), newlevelconfig, stateData.menuconfig));
                this.highScoreTable.clear();
                this.highScoreTable.init();
                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
            if (keyCode === 32) {
                // Go to next State
                stateData.menuconfig.selectSound.pause();
                stateData.menuconfig.selectSound.currentTime = 0;
                stateData.menuconfig.selectSound.play();
                stateData.menuconfig.afterGameScreenMusic.pause();
                stateData.menuconfig.afterGameScreenMusic.currentTime = 0;
                let mainMenu = new MainMenu("MainMenu", new MenuConfig("MainMenu"));
                mainMenu.menuconfig.StartLoading();
                gameMode.push(mainMenu);
                this.highScoreTable.clear();
            }
            stateData.menuconfig.scrollSound.pause();
            stateData.menuconfig.scrollSound.currentTime = 0;
            stateData.menuconfig.scrollSound.play();
        };
    };

    onExit() {
        // clear the keydown event
        this.menuconfig.afterGameScreenMusic.pause();
        window.onkeydown = null;
        console.log(" AfterGameScreen Menu EVENT IS DELETED");


    };

    render() {
        // redraw
        this.canvas.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.canvas.beginPath();
        if (this.menuconfig.colorIndex == this.menuconfig.colorsArray.length) {
            this.menuconfig.colorIndex = 0;
        }
        this.menuconfig.textColor = "rgb(" + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + "," + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + "," + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + ")";
        this.menuconfig.colorIndex++;
        this.canvas.fillStyle = this.menuconfig.backgroundColor;
        this.canvas.fillColor = this.menuconfig.backgroundColor;
        this.canvas.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
        this.canvas.fillStyle = this.menuconfig.textColor;
        this.canvas.drawImage(this.menuconfig.backgroundImage, 0, this.menuconfig.backgroundImageY);
        this.canvas.font = this.dimensions.width / 14 + "pt Courier";
        this.canvas.fillText(this.menuconfig.mainText, this.dimensions.width / 5, this.dimensions.width / 7);
        this.canvas.beginPath();
        for (let i = 0; i <= 4; i++) {
            if (i == -1) {
                if (this.menuconfig.colorIndexSelected == this.menuconfig.colorsArraySelected.length) {
                    this.menuconfig.colorIndexSelected = 0;
                }
                this.menuconfig.textColorSelected = "rgb(" + this.menuconfig.colorsArraySelected[this.menuconfig.colorIndexSelected] / 3 + "," + this.menuconfig.colorsArraySelected[this.menuconfig.colorIndexSelected] + "," + this.menuconfig.colorsArraySelected[this.menuconfig.colorIndexSelected] / 2 + ")";
                this.menuconfig.colorIndexSelected++;
                this.canvas.font = this.buttons[i].font;
                this.canvas.fillStyle = this.menuconfig.textColorSelected;
                this.canvas.fillText(this.buttons[i].text, this.buttons[i].buttonX, this.buttons[i].buttonY);
                this.canvas.closePath();
                // console.log(this.menuconfig.serpentSprites);
            }
            else {
                this.canvas.beginPath();
                this.canvas.fillStyle = this.buttons[i].fillStyle;
                this.canvas.font = this.buttons[i].font;
                this.canvas.fillText(this.buttons[i].text, this.buttons[i].buttonX, this.buttons[i].buttonY);
            }
        }
        this.canvas.fillStyle = this.buttons[5].fillStyle;
        this.canvas.font = this.buttons[5].font;
        this.canvas.fillText(this.buttons[5].text, this.buttons[5].buttonX, this.buttons[5].buttonY);
        this.canvas.fillStyle = this.buttons[6].fillStyle;
        this.canvas.font = this.buttons[6].font;
        this.canvas.fillText(this.buttons[6].text, this.buttons[6].buttonX, this.buttons[6].buttonY);
    };
    update() {
        // update values
        this.menuconfig.backgroundImageY = moveMenuBackground(this.menuconfig.backgroundImageY, this.menuconfig.scrollSpeedBackground);
    };
    addToButtons() {
        let buttonSize = this.dimensions.width / 50 + "pt Courier";
        let creditButtonSize = this.dimensions.width / 70 + "pt Courier";
        let creditNamePosition = this.dimensions.width / 2;
        let buttonNamePosition = this.dimensions.width / 7;
        let buttonDataPosition = this.dimensions.width / 2;
        this.buttons.push(new MenuButton("Credit", "Copyright (c) 2020 KaBra, MaSiPi, MaZa", null, this.dimensions.width - 500, this.dimensions.height - 30, 100, 50, "14pt Courier", "blue"));

        this.buttons.push(new MenuButton("Your Score:", "Your Highscore", null, buttonNamePosition, this.dimensions.height - 400, 100, 50, buttonSize, "white"));
        this.buttons.push(new MenuButton("Enemy's Highscore:", "Enemy's Highscore", null, buttonNamePosition, this.dimensions.height - 450, 100, 50, buttonSize, "white"));

        this.buttons.push(new MenuButton("Continue", "Press Enter To Start Next Round", null, creditNamePosition - 300, this.dimensions.height - 300, 50, buttonSize, "white"));
        this.buttons.push(new MenuButton("Leave", "Or Press Space To Return To Main Menu", null, creditNamePosition - 300, this.dimensions.height - 250, 100, 50, buttonSize, "white"));

        this.buttons.push(new MenuButton("Food Eaten Player", this.levelConfig.serpentPlayer.foodEaten, null, buttonDataPosition, this.dimensions.height - 400, 100, 50, buttonSize, "white"));
        if (this.levelConfig.highestEnemy != undefined || this.levelConfig.highestEnemy != null)
            this.buttons.push(new MenuButton("Food Eaten Player", this.levelConfig.highestEnemy, null, buttonDataPosition, this.dimensions.height - 450, 100, 50, buttonSize, "white"));
    };
}
class CreditScreen {
    constructor(name, menuconfig) {
        this.name = name // Just to identify the State
        this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.menuconfig = menuconfig,
            this.canvas = getContext(),
            this.dimensions = getGameDimensions(),
            this.buttons = [],
            this.selectedButton = 4
    }
    onEnter() {
        console.log(this.menuconfig);
        this.menuconfig.creditsMusic.pause();
        this.menuconfig.creditsMusic.currentTime = 0;
        this.menuconfig.creditsMusic.play();
        this.addToButtons();
        let i = 1, l = 100, values = [];
        for (i; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        let j = 1, m = 10, valuesSelected = [];
        for (j; j <= m; j++) {
            valuesSelected.push(Math.round(Math.sin(Math.PI * j / 10) * 255));
        }
        this.menuconfig.colorsArraySelected = valuesSelected;
        this.menuconfig.colorsArray = values;

        // When the Enter key is pressed go to the next state
        window.onkeydown = function (e) {
            let stateData = getStateData();
            let keyCode = e.keyCode;
            if ((keyCode === 13)) {
                // Go to next State
                stateData.menuconfig.selectSound.pause();
                stateData.menuconfig.selectSound.currentTime = 0;
                stateData.menuconfig.selectSound.play();
                let gameMode = getGameInstance();
                stateData.menuconfig.changeMenuConfig("Space Serpent", null);
                gameMode.pop();
                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
            stateData.menuconfig.scrollSound.pause();
            stateData.menuconfig.scrollSound.currentTime = 0;
            stateData.menuconfig.scrollSound.play();
        };
    };

    onExit() {
        // clear the keydown event
        this.menuconfig.creditsMusic.pause();
        this.menuconfig.menuMusic.play();
        window.onkeydown = null;
        console.log(" AfterGameScreen Menu EVENT IS DELETED");

    };

    render() {
        // redraw
        this.canvas.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
        this.canvas.beginPath();
        if (this.menuconfig.colorIndex == this.menuconfig.colorsArray.length) {
            this.menuconfig.colorIndex = 0;
        }
        this.menuconfig.textColor = "rgb(" + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + "," + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + "," + this.menuconfig.colorsArray[this.menuconfig.colorIndex] + ")";
        this.menuconfig.colorIndex++;
        this.canvas.fillStyle = this.menuconfig.backgroundColor;
        this.canvas.fillColor = this.menuconfig.backgroundColor;
        this.canvas.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
        this.canvas.fillStyle = this.menuconfig.textColor;
        this.canvas.drawImage(this.menuconfig.backgroundImage, 0, this.menuconfig.backgroundImageY);
        this.canvas.font = "64pt Courier";
        this.canvas.fillText(this.menuconfig.mainText, this.dimensions.height / 4, 200);
        this.canvas.beginPath();
        for (let i = 0; i < this.buttons.length; i++) {
            this.canvas.beginPath();
            this.canvas.fillStyle = this.buttons[i].fillStyle;
            this.canvas.font = this.buttons[i].font;
            this.canvas.fillText(this.buttons[i].text, this.buttons[i].buttonX, this.buttons[i].buttonY);

        }
    };
    update() {
        // update values
        this.menuconfig.backgroundImageY = moveMenuBackground(this.menuconfig.backgroundImageY, this.menuconfig.scrollSpeedBackground);
    };
    addToButtons() {
        this.buttons.push(new MenuButton("Credit", "Music: Eric Skiff - All Of Us - Resistor Anthems - Available at http://EricSkiff.com/music", null, 20, 380, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Music: Eric Skiff - Jumpshot - Resistor Anthems - Available at http://EricSkiff.com/music", null, 20, 400, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Music: Eric Skiff - HHavok-intro - Resistor Anthems - Available at http://EricSkiff.com/music", null, 20, 420, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Music: Eric Skiff - Underclocked - Resistor Anthems - Available at http://EricSkiff.com/music", null, 20, 440, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Music: Eric Skiff - Prologue - Resistor Anthems - Available at http://EricSkiff.com/music", null, 20, 460, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Music: Eric Skiff - Arpanauts - Resistor Anthems - Available at http://EricSkiff.com/music", null, 20, 480, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "SubspaceAudio - https://opengameart.org/content/512-sound-effects-8-bit-style - CC by 0", null, 20, 500, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Ctskelgysth Inauaruat - Ctskelgysth: https://opengameart.org/content/8-bit-sound-effects-0", null, 20, 520, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Bonsaiheldin - https://opengameart.org/content/colorful-planets-0 - CC by 0", null, 20, 540, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Bonsaiheldin - https://opengameart.org/content/stars-parallax-backgrounds - CC by 0", null, 20, 560, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "AhNinniah - https://opengameart.org/content/free-game-items-pack-2 - CC by 3.0", null, 20, 580, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Soluna Software - https://opengameart.org/content/space-backgrounds-with-stars-and-nubular - CC by 0", null, 20, 60, 100, 50, "8pt Courier", "white"));
        this.buttons.push(new MenuButton("Credit", "Press Enter To Leave", null, 300, 900, 100, 50, "20pt Courier", "white"));
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
        this.push(new EmptyState("empty"));
        /* start loading assets*/
        loadFromFiles(objects, soundEffects, loadAssets);
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
        //this.change();
        this.states.push(state);
        console.log("state ", state, " pushed");
        state.onEnter();
    };
    pop() {
        var state = this.states.top();
        console.log("state ", state, " deleted");
        state.onExit();
        return this.states.pop();
    };
    pause() {
        var state = this.states.top();
        if (state.onPause) {
            console.log("state ", state, " paused");
            state.onPause();
        }
    };
    /*
    change() {
        var state = this.states.top();
        if (state){
            console.log("state ", state, " changed");
            state.onExit();
        }
    };
    */
    resume() {
        var state = this.states.top();
        if (state.onResume) {
            console.log("state ", state, " resumed");
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
    canvas_width: null,
    canvas_height: null,
    gameMode: new StateStack(),
    //then: null,
    //startTime: null,
    timer: null,
    FPS: 30,
    deltaTime: 0,
    fpsInterval: null,
    update: function () {
        //this.resizeCanvas();
        this.gameMode.update();
        this.gameMode.render();
    },
    startGame: async function () {
        //loadRessources();
        let mainMenu = new MainMenu("MainMenu", new MenuConfig("MainMenu"));
        mainMenu.menuconfig.StartLoading();
        this.gameMode.push(mainMenu);
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
        this.canvas.id = "game";
        this.resizeCanvas();
        this.canvasContext = this.canvas.getContext("2d");
        //document.body.style.background = 'url("sprites/Space003.png") no-repeat center center'
        //this.canvas.style.border = "1px solid white";
        //this.deltaTime = (0.35 / (1000/this.FPS));
        this.deltaTime = (1000 / this.FPS);
        document.body.insertBefore(this.canvas, document.body.childNodes[1]); // due to some loading issues with images and sprites w want to insert it before
        this.timer = 1000 / this.FPS;
        this.startGame();
    },
    resizeCanvas: function () {
        this.canvas_width = Math.ceil(window.innerWidth);
        this.canvas_height = Math.ceil(window.innerHeight);
        this.canvas.width = Math.ceil(this.canvas_height - this.canvas_height / 4);
        this.canvas.height = Math.ceil(this.canvas_height - this.canvas_height / 4);
        this.canvas_width = this.canvas.width;
        this.canvas_height = this.canvas.height;
    }
}

var highScoreTable = {
    highScoreCanvas: null,
    highScoreCanvasContext: null,
    gamePosition: null,
    highScoreCanvasWidth: 480, //Auch window.innerWidth verwendebar
    highScoreCanvasHeight: 540,
    //highScoreCanvasRight: "2%",
    //highScoreCanvasTop: "",
    //highScoreCanvasPosition: "right",
    serpentRanking: null,
    serpentRank: 0,
    sizeToSmall: false,
    stateData: null,
    timeButton: null,
    highScoreCanvasButtons: [],
    playerNameButtons: [],
    playerScoreButtons: [],
    headButtonSize: null,
    itemButtonSize: null,
    creditNamePosition: null,
    buttonNamePosition: null,
    buttonDataPosition: null,

    clear: function () {
        //this.highScoreCanvasContext.clearRect(0,0, this.highScoreCanvasWidth, this.highScoreCanvasHeight);
        if (this.sizeToSmall == false && this.highScoreCanvas != null) {
            document.body.removeChild(this.highScoreCanvas);
            this.highScoreCanvas = null;
            this.playerNameButtons = [];
            this.playerScoreButtons = [];
        }
    },

    update: function () {
        if (window.innerWidth >= 1500) {
            if (this.highScoreCanvas == null) {
                this.init();
            }
            this.sync();
            let time = Math.ceil(this.stateData);
            this.timeButton.text = time;
            // Bubblesort auf die Serpentlist -> vergleicht die Nachbarn jeweils darauf, ob foodEaten < als der Nachfolger ist
            for (let n = this.serpentRanking.length - 1; n > 0; n--) {
                for (let i = 0; i < n; i++) {
                    if (this.serpentRanking[i].foodEaten < this.serpentRanking[i + 1].foodEaten) {
                        //wenn "foodEaten" des Nachfolgers größer ist dann folgt ein Swap
                        if (i == this.serpentRank) {
                            this.serpentRank = i + 1;
                        } else if (i + 1 == this.serpentRank) {
                            this.serpentRank = i;
                        }
                        this.temp = this.serpentRanking[i];
                        this.serpentRanking[i] = this.serpentRanking[i + 1];
                        this.serpentRanking[i + 1] = this.temp;
                    }
                }
            }
            //HighScoreTable aktualisieren (machen)
            for (let i = 0; i < this.serpentRanking.length || i < this.playerNameButtons.length; i++) {

                if (this.playerNameButtons[i] != undefined) {
                    this.playerNameButtons[i].text = this.serpentRanking[i].name;
                    this.playerScoreButtons[i].text = this.serpentRanking[i].foodEaten;
                }
            }
            this.renderButtons();
        } else {
            this.clear();
            this.sizeToSmall = true;
        }
    },

    sync: function () {
        this.stateData = round10(getStateData().gameTime / 1000, -1);
        this.copyAiSerpents = getStateData().levelConfig.aiSerpents.slice(0, getStateData().levelConfig.aiSerpents.length);
        this.serpentRanking = this.copyAiSerpents;
        for (let i = 0; i < this.serpentRanking.length; i++) {
            if (getStateData().levelConfig.aiSerpents[i].alive == false) {
                this.serpentRanking.splice(i, 1);
            }
        }

        //console.log(this.serpentRanking, "this.stateData", this.stateData, "this.timebutton",this.timeButton);
        this.copySerpent = copyObject(getStateData().levelConfig.serpentPlayer);
        this.serpentRanking.push(this.copySerpent);
        this.serpentRank = this.serpentRanking.length - 1;
        //console.log(this.serpentRanking);
    },

    renderButtons: function () {
        this.highScoreCanvasContext.clearRect(0, 0, this.highScoreCanvasWidth, this.highScoreCanvasHeight);
        this.highScoreCanvasContext.beginPath();
        this.highScoreCanvasContext.fillStyle = "yellow";
        this.highScoreCanvasContext.fillText(this.timeButton.text, this.timeButton.buttonX, this.timeButton.buttonY);
        for (let i = 0; i < this.highScoreCanvasButtons.length; i++) {
            this.highScoreCanvasContext.font = this.highScoreCanvasButtons[i].font;
            this.highScoreCanvasContext.fillText(this.highScoreCanvasButtons[i].text, this.highScoreCanvasButtons[i].buttonX, this.highScoreCanvasButtons[i].buttonY);
        }
        for (let i = 0; i < this.playerNameButtons.length; i++) {
            //this.highScoreCanvasContext.strokeRect(this.highScoreCanvasButtons[i].buttonX, this.highScoreCanvasButtons[i].buttonY,this.highScoreCanvasButtons[i].buttonWidth, this.highScoreCanvasButtons[i].buttonHeight)
            if (i == this.serpentRank) {
                this.highScoreCanvasContext.fillStyle = "aqua";
            } else {
                this.highScoreCanvasContext.fillStyle = "white";
            }
            this.highScoreCanvasContext.font = this.playerNameButtons[i].font;
            this.highScoreCanvasContext.fillText(this.playerNameButtons[i].text, this.playerNameButtons[i].buttonX, this.playerNameButtons[i].buttonY);
            this.highScoreCanvasContext.fillText(this.playerScoreButtons[i].text, this.playerScoreButtons[i].buttonX, this.playerScoreButtons[i].buttonY);
        }
    },

    popScoreSheetButtons: function () {
        if (this.sizeToSmall == false) {
            this.temp = getStateData().levelConfig.serpentPlayer.alive;
            if (getStateData().levelConfig.serpentPlayer.alive == true) {
                this.playerNameButtons.pop();
                this.playerScoreButtons.pop();
            }
        }
    },

    init: function () {
        if (window.innerWidth >= 1500) {
            //alle Schlangen in ein lokales Array packen, welches über die Update-Funktion sortiert wird
            this.sync();
            this.sizeToSmall = false;
            this.gamePosition = getGameDimensions();
            this.highScoreCanvasWidth = 480; //Auch window.innerWidth verwendebar
            this.highScoreCanvasHeight = 540;
            // button sizes
            this.headButtonSize = this.highScoreCanvasWidth / 17 + "pt Courier";
            this.itemButtonSize = this.highScoreCanvasWidth / 30 + "pt Courier";
            this.buttonHeadPosition = this.highScoreCanvasWidth / 5;
            this.buttonNamePosition = this.highScoreCanvasWidth / 9;
            this.buttonOtherPosition = this.highScoreCanvasWidth / 9;
            this.buttonDataPosition = this.highScoreCanvasWidth / 2;
            this.buttonVerticalPosition = this.highScoreCanvasHeight;
            this.buttonTime = this.highScoreCanvasWidth / 3;
            //Definition und Inititalisierung des Highscore-Canvas
            this.highScoreCanvas = document.createElement("canvas");
            this.highScoreCanvas.id = "highScore";
            this.highScoreCanvas.width = this.highScoreCanvasWidth;
            this.highScoreCanvas.height = this.highScoreCanvasHeight;
            //this.highScoreCanvas.position = this.highScoreCanvasPosition;
            //this.highScoreCanvas.style.marginRight = this.highScoreCanvasRight;
            //this.highScoreCanvas.style.marginTop = this.highScoreCanvasTop;
            //this.highScoreCanvas.style.border = "2px solid white";
            this.highScoreCanvasContext = this.highScoreCanvas.getContext("2d");
            document.body.insertBefore(this.highScoreCanvas, document.body.childNodes[2]);

            //Einfügen der Buttons zur Darstellung der Highscore-Tabelle
            this.highScoreCanvasButtons.push(new MenuButton("Time", "Time ", null, this.buttonOtherPosition, this.buttonVerticalPosition - 70, 100, 50, this.itemButtonSize, "white"));
            this.highScoreCanvasButtons.push(new MenuButton("Head", "ScoreTable", null, this.buttonHeadPosition, this.buttonVerticalPosition - 490, 100, 50, this.headButtonSize, "white"));
            this.highScoreCanvasButtons.push(new MenuButton("Player", "Player", null, this.buttonNamePosition, this.buttonVerticalPosition - 440, 100, 50, this.itemButtonSize, "white"));
            this.highScoreCanvasButtons.push(new MenuButton("Score", "Score", null, this.buttonDataPosition, this.buttonVerticalPosition - 440, 100, 50, this.itemButtonSize, "white"));

            //Einfügen des Rankings
            this.timeButton = new MenuButton(1, "0", null, this.buttonTime, this.buttonVerticalPosition - 70, 50, 30, this.itemButtonSize, "white");
            for (let i = 0; i < this.serpentRanking.length; i++) {
                //console.log(this.highScoreCanvasButtons);
                this.playerNameButtons.push(new MenuButton(i, this.serpentRanking[i].name, null, this.buttonDataPosition, this.buttonVerticalPosition - 390 + (i * 50), 50, 30, this.itemButtonSize, "white"));
                this.playerScoreButtons.push(new MenuButton(i, this.serpentRanking[i].foodEaten, null, this.buttonNamePosition, this.buttonVerticalPosition - 390 + (i * 50), 50, 30, this.itemButtonSize, "white"));
            }
            this.renderButtons();
        } else {
            this.sizeToSmall = true;
        }
    },
}

var instruction = {
    instructionCanvas: null,
    instructionCanvasContext: null,
    gamePosition: null,
    instructionCanvasWidth: 400, //window.innerWidth
    instructionCanvasHeight: 540,
    //instructionCanvasLeft: "auto",
    //instructionCanvasTop: "auto",
    //instructionCanvasPosition: "fixed",
    instructionButtons: [],
    headButtonSize: null,
    itemButtonSize: null,
    creditNamePosition: null,
    buttonNamePosition: null,
    buttonDataPosition: null,
    feather: new Image(),
    bomb: new Image(),
    clover: new Image(),
    arrows: new Image(),

    update: function () {
        if (window.innerWidth < 1500) {
            if (this.instructionCanvas != null) {
                this.clear();
            }
        } else {
            if (this.instructionCanvas == null) {
                this.init();
            }
        }
    },

    clear: function () {
        for (let i = 0; i < this.instructionButtons.length; i++) {
            this.instructionButtons.pop();
        }
        document.body.removeChild(this.instructionCanvas);
        this.instructionCanvas = null;
    },

    init: function () {
        if (window.innerWidth >= 1500) {
            console.log(this.headButtonSize, this.itemButtonSize);
            this.gamePosition = getGameDimensions();
            this.instructionCanvasWidth = 400; //Auch window.innerWidth verwendebar
            this.instructionCanvasHeight = 540;
            this.headButtonSize = this.instructionCanvasWidth / 17 + "pt Courier";
            this.itemButtonSize = this.instructionCanvasWidth / 30 + "pt Courier";
            this.buttonHeadPosition = this.instructionCanvasWidth / 5;
            this.buttonNamePosition = this.instructionCanvasWidth / 9;
            this.buttonOtherPosition = this.instructionCanvasWidth / 6;
            this.buttonDataPosition = this.instructionCanvasWidth / 4;
            this.buttonVerticalPosition = this.instructionCanvasHeight;
            this.buttonKeysPosition = this.instructionCanvasWidth / 3;
            this.instructionCanvas = document.createElement("canvas");
            this.instructionCanvas.id = "instruction";
            this.instructionCanvas.width = this.instructionCanvasWidth;
            this.instructionCanvas.height = this.instructionCanvasHeight;
            //this.instructionCanvas.position = this.instructionCanvasPosition;
            //this.instructionCanvas.style.marginLeft = this.instructionCanvasLeft;
            //this.instructionCanvas.style.marginTop = this.instructionCanvasTop;
            //this.instructionCanvas.style.border = "2px solid white";
            this.instructionCanvasContext = this.instructionCanvas.getContext("2d");
            document.body.insertBefore(this.instructionCanvas, document.body.childNodes[0]);

            this.instructionButtons.push(new MenuButton("head", "Instructions", null, this.buttonHeadPosition, this.buttonVerticalPosition - 510, 150, 20, this.headButtonSize, "yellow"));
            this.instructionButtons.push(new MenuButton("feather", "fly through your own body", null, this.buttonDataPosition, this.buttonVerticalPosition - 450, 150, 20, this.itemButtonSize, "white"));
            this.instructionButtons.push(new MenuButton("clover", "increases score", null, this.buttonDataPosition, this.buttonVerticalPosition - 380, 150, 20, this.itemButtonSize, "white"));
            this.instructionButtons.push(new MenuButton("bomb", "do not touch it!", null, this.buttonDataPosition, this.buttonVerticalPosition - 305, 150, 20, this.itemButtonSize, "white"));
            this.instructionButtons.push(new MenuButton("keyarrows", "keyarrows for movement", null, this.buttonOtherPosition, this.buttonVerticalPosition - 140, 150, 20, this.itemButtonSize, "white"));
            this.instructionButtons.push(new MenuButton("Escape", "press Escape to pause", null, this.buttonOtherPosition, this.buttonVerticalPosition - 110, 150, 20, this.itemButtonSize, "white"));

            this.feather.src = 'sprites/feather.png';
            this.clover.src = 'sprites/clover.png';
            this.bomb.src = 'sprites/bomb.png';
            this.arrows.src = 'sprites/keyarrows.png';

            this.render();
        } else {
            window.alert("Screen is too small - Please load the game on a bigger screen")
        }
    },

    render: function () {
        this.instructionCanvasContext.clearRect(0, 0, this.instructionCanvasWidth, this.instructionCanvasHeight);
        this.instructionCanvasContext.beginPath();

        this.instructionCanvasContext.drawImage(this.feather, this.buttonNamePosition, this.buttonVerticalPosition - 480, 50, 50);
        this.instructionCanvasContext.drawImage(this.clover, this.buttonNamePosition, this.buttonVerticalPosition - 410, 50, 50);
        this.instructionCanvasContext.drawImage(this.bomb, this.buttonNamePosition, this.buttonVerticalPosition - 340, 50, 50);
        this.instructionCanvasContext.drawImage(this.arrows, this.buttonKeysPosition, this.buttonVerticalPosition - 270, 100, 100);


        this.instructionCanvasContext.fillStyle = "yellow";
        for (let i = 0; i < this.instructionButtons.length; i++) {
            this.instructionCanvasContext.font = this.instructionButtons[i].font;
            this.instructionCanvasContext.fillText(this.instructionButtons[i].text, this.instructionButtons[i].buttonX, this.instructionButtons[i].buttonY);
        }
    }
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
    window.getGameDeltaTime = function () {
        return gameField.deltaTime;
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
    window.getStateData = function () {
        var gamemode = getGameInstance();
        var StateData = gamemode.states.top();
        return StateData;
    };
    window.getCurrentLevelConfig = function () {
        var gamemode = getGameInstance();
        var levelData = gamemode.states.top();
        return levelData.levelConfig;
    };
    /***** GAME STARTS HERE *****/
    sleep(5000);
    gameField.init();
    instruction.init();

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
                    //console.log("links");
                    currentCornerSprite = serpentPlayer.animation.spritesheet[5];
                }
                else {
                    //console.log("rechts", serpentPlayer.serpentParts[i].currentCorner);
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
function drawBackground(bg_stars, playGroundImage) {




    let canvasDimensions = getGameDimensions();

    if (playGroundImage.bgSpace != null)
        gameField.canvasContext.drawImage(playGroundImage.bgSpace,
            0,
            0,
            canvasDimensions.height,
            canvasDimensions.width
        );
    playGroundImage.angle = playGroundImage.angle - 0.5 * Math.PI / 180;
    var ctxPlanet1 = null;
    ctxPlanet1 = gameField.canvasContext;
    ctxPlanet1.save();
    ctxPlanet1.translate(playGroundImage.bg_imgCurrentX + 500 / playGroundImage.bg_imgCurrentTranslate, playGroundImage.bg_imgCurrentY + 500 / playGroundImage.bg_imgCurrentTranslate);
    ctxPlanet1.rotate(playGroundImage.angle);
    ctxPlanet1.drawImage(playGroundImage.bg_img[playGroundImage.currentImage],
        0,
        0,
        884,
        884,
        884 / -2,
        884 / -2,
        playGroundImage.bg_imgCurrentX * 1.75,
        playGroundImage.bg_imgCurrentX * 1.75
    );
    ctxPlanet1.drawImage(bg_stars,
        0,
        0,
        2560,
        2560,
        1000 / 2,
        1000 / 2,
        3500 + playGroundImage.bg_imgCurrentX * 2.75,
        3500 + playGroundImage.bg_imgCurrentX * 2.75,
    );
    //ctx.drawImage(playGroundImage.bg_img[playGroundImage.currentImage], playGroundImage.bg_imgCurrentX, 0, playGroundImage.currentCanvasX, playGroundImage.currentCanvasY);
    ctxPlanet1.restore();

    playGroundImage.anglePlanet2 = playGroundImage.anglePlanet2 + 0.9 * Math.PI / 180;
    var ctxPlanet2 = null;
    ctxPlanet2 = gameField.canvasContext;
    ctxPlanet2.save();
    ctxPlanet2.translate(100 + playGroundImage.currentCanvasX, 100 + playGroundImage.currentCanvasY);
    ctxPlanet2.rotate(playGroundImage.anglePlanet2);
    ctxPlanet2.drawImage(playGroundImage.bg_img[playGroundImage.currentImage + 1],
        0,
        0,
        1000,
        1000,
        playGroundImage.bg_imgCurrentX * -2,
        playGroundImage.bg_imgCurrentX * -2,
        50 + playGroundImage.bg_imgCurrentX * 1.5,
        50 + playGroundImage.bg_imgCurrentX * 1.5
    );
    ctxPlanet2.drawImage(bg_stars,
        0,
        0,
        playGroundImage.bg_imgCurrentX + 1000,
        playGroundImage.bg_imgCurrentX + 1000,
        2000 / -2,
        2000 / -2,
        800 + playGroundImage.bg_imgCurrentX * 1.1,
        800 + playGroundImage.bg_imgCurrentX * 1.1,
    );
    //ctx.drawImage(playGroundImage.bg_img[playGroundImage.currentImage], playGroundImage.bg_imgCurrentX, 0, playGroundImage.currentCanvasX, playGroundImage.currentCanvasY);
    ctxPlanet2.restore();

    playGroundImage.anglePlanet3 = playGroundImage.anglePlanet3 + 0.5 * Math.PI / 180;
    var ctxPlanet3 = null;
    ctxPlanet3 = gameField.canvasContext;
    ctxPlanet3.save();
    ctxPlanet3.translate(playGroundImage.currentCanvasX, playGroundImage.currentCanvasY);
    ctxPlanet3.rotate(playGroundImage.anglePlanet3);
    //ctxPlanet3.fillStyle = "red";
    //ctxPlanet3.fillRect(200 / -2, 200 / -2, 200, 200); 
    ctxPlanet3.drawImage(playGroundImage.bg_img[playGroundImage.currentImage + 2],
        0,
        0,
        884,
        884,
        playGroundImage.bg_imgCurrentX / -2,
        playGroundImage.bg_imgCurrentX / -2,
        300 + playGroundImage.bg_imgCurrentX,
        300 + playGroundImage.bg_imgCurrentX
    );
    /*
       ctxPlanet3.drawImage(playGroundImage.bg_img[playGroundImage.currentImage + 2],
        0,
        0,
        884 / -2,
        884 / -2,
        884,
        884,        
        playGroundImage.bg_imgCurrentX * 1.9,
        playGroundImage.bg_imgCurrentX * 1.9
    ); 
    */
    ctxPlanet3.drawImage(bg_stars,
        0,
        0,
        1800,
        1800,
        playGroundImage.bg_imgCurrentX,
        playGroundImage.bg_imgCurrentX,
        3500 + playGroundImage.bg_imgCurrentX * 2,
        3500 + playGroundImage.bg_imgCurrentX * 2,
    );
    //ctx.drawImage(playGroundImage.bg_img[playGroundImage.currentImage], playGroundImage.bg_imgCurrentX, 0, playGroundImage.currentCanvasX, playGroundImage.currentCanvasY);
    ctxPlanet3.restore();

    gameField.canvasContext.drawImage(bg_stars,
        playGroundImage.bg_starCurrentX,
        playGroundImage.bg_starCurrentY,
        1800,
        1800,
        -1230,
        -1230,
        3500,
        3500
    );
    //console.log("planet", playGroundImage.bg_imgCurrentX, playGroundImage.bg_imgCurrentY);
    //playGroundImage.bg_starCurrentX,
    //playGroundImage.bg_starCurrentY,

    /*
    var groundx = 0;
    var groundy = 0;

    for (var column = 0; column <= playGroundImage.fields.length; column++) {
        for (var row = 0; row <= playGroundImage.fields.length; row++) {
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
}
function moveMenuBackground(backgroundY, speed) {
    backgroundY -= speed;
    if (backgroundY == -1 * gameField.canvas_height) {
        backgroundY = 0;
    }
    return backgroundY;
}

function moveLevelBackground(image) {
    image.changeCurrent(image.bg_imgCurrentX + image.scrollSpeedBackground + image.scrollAcce, image.bg_imgCurrentX + image.scrollSpeedBackground + image.scrollAcce * 0.75, image.currentCanvasX - image.scrollSpeedBackground, image.currentCanvasY - image.scrollSpeedBackground);
    image.changeCurrentbgStarX(image.bg_starCurrentX + image.bg_starScrollSpeedBackgroundX, image.bg_starCurrentY + image.bg_starScrollSpeedBackgroundY)
    if (image.bg_imgCurrentX == 0 || image.bg_imgCurrentX == 1 || image.bg_imgCurrentX == -1 || image.bg_imgCurrentX == 2 || image.bg_imgCurrentX == -2) {
        if (image.currentImage > 10) {
            image.scrollSpeedBackground = image.scrollDirection[getRandomIntInclusive(0, 1)] * image.scrollSpeedBackground;
            image.scrollAcce = 0.35 * image.scrollDirection[getRandomIntInclusive(0, 1)];
            image.changeCurrentImage(getRandomIntInclusive(0, 11));
            image.changeCurrent(0, 0, getRandomIntInclusive(-50, 500), getRandomIntInclusive(-50, 500));
            image.changeCurrentTranslate();
            console.log(image.bg_imgCurrentX);

        }
        else {
            image.scrollSpeedBackground = image.scrollDirection[getRandomIntInclusive(0, 1)];
            image.scrollAcce = 0.5 * image.scrollDirection[getRandomIntInclusive(0, 1)];
            image.changeCurrentImage(getRandomIntInclusive(0, 11));
            image.changeCurrent(0, 0, getRandomIntInclusive(-50, 500), getRandomIntInclusive(-50, 500));
            image.changeCurrentTranslate();
            //console.log(image.bg_imgCurrentX);
        }
    }
    else if (image.bg_imgCurrentX >= 1200 || image.bg_imgCurrentX <= -1500) {
        image.scrollSpeedBackground = image.scrollSpeedBackground * -1;
        image.scrollAcce = image.scrollAcce * - 0.25;
    }



    if (image.bg_starCurrentX >= 1000 || image.bg_starCurrentX <= -1000 || image.bg_starCurrentY >= 1000 || image.bg_starCurrentY <= -1000) {
        if (image.bg_starCurrentX >= 1050 || image.bg_starCurrentX <= -1050) {
            image.bg_starScrollSpeedBackgroundX = image.scrollDirection[getRandomIntInclusive(0, 1)] * image.bg_starScrollSpeedBackgroundX;
            image.bg_starScrollSpeedBackgroundY = image.scrollDirection[getRandomIntInclusive(0, 1)] * image.bg_starScrollSpeedBackgroundY;
            image.changeCurrentbgStarX(999, 999);
            // console.log(image.bg_starCurrentX, image.bg_starCurrentX);
        }
        else {
            image.bg_starScrollSpeedBackgroundX = image.scrollDirection[getRandomIntInclusive(0, 1)] * image.bg_starScrollSpeedBackgroundX;
            image.bg_starScrollSpeedBackgroundY = image.scrollDirection[getRandomIntInclusive(0, 1)] * image.bg_starScrollSpeedBackgroundY;
            image.changeCurrentbgStarX(image.bg_starCurrentX * -1, image.bg_starCurrentX * -1);
            //console.log(image.bg_starCurrentX, image.bg_starCurrentX); 
        }
    }
}
function draw(bg_stars, playGroundImage, serpentPlayer, itemlist, aiSerpents) {
    drawBackground(bg_stars, playGroundImage, serpentPlayer);
    drawItems(itemlist);
    drawKiSerpent(aiSerpents);
    drawSerpent(serpentPlayer);
}
/* ----  draw section end ---- */

/* ----  AI section  ---- */
function calculateNextMove(obstaclesTable, currentPosition, itemPosition, serpent) {

    // aStar is the Pathfinding algorithm used to find a shortest path from the snakehead to the food
    var aStarResult = aStar(obstaclesTable, itemPosition, currentPosition);

    if (aStarResult.pathFound == true)
    // aStar can only find a path, if the food position is reacheable in the current state of the game
    {
        var nextNode = aStarResult.nextNode;
        if (nextNode.position.x > currentPosition.x) {
            //move right!
            return { movementIsPossible: true, direction: { dx: 1, dy: 0 } };
        }
        if (nextNode.position.x < currentPosition.x) {
            //move left!
            return { movementIsPossible: true, direction: { dx: -1, dy: 0 } };

        }
        if (nextNode.position.y > currentPosition.y) {
            //move down!
            return { movementIsPossible: true, direction: { dx: 0, dy: 1 } };

        }
        if (nextNode.position.y < currentPosition.y) {
            //move up!
            return { movementIsPossible: true, direction: { dx: 0, dy: -1 } };
        }
    }
    // if aStar can not find a valid path, an adjacent free field will be chosen
    else {
        if (currentPosition.y + 1 < obstaclesTable.length && obstaclesTable[currentPosition.x][currentPosition.y + 1] == 0) {
            //move down!
            return { movementIsPossible: true, direction: { dx: 0, dy: 1 } };
        }

        if (currentPosition.y - 1 >= 0 && obstaclesTable[currentPosition.x][currentPosition.y - 1] == 0) {
            //move up!
            return { movementIsPossible: true, direction: { dx: 0, dy: -1 } };
        }

        if (currentPosition.x + 1 < obstaclesTable.length && obstaclesTable[currentPosition.x + 1][currentPosition.y] == 0) {
            //move right!
            return { movementIsPossible: true, direction: { dx: 1, dy: 0 } };
        }

        if (currentPosition.x - 1 >= 0 && obstaclesTable[currentPosition.x - 1][currentPosition.y] == 0) {
            //move left!
            return { movementIsPossible: true, direction: { dx: -1, dy: 0 } };
        }
        return { movementIsPossible: false, direction: { dx: 1, dy: 0 } };
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
function positionsAreEqual(positionA, positionB) {
    return positionA.x == positionB.x && positionA.y == positionB.y;
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
    for (let index = 0; !openList.isEmpty() && index < (obstaclesTable.length * obstaclesTable.length) * 2; index++) {
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
/* ----  AI section end ---- */

/* ----  movement section  ---- */
function moveSerpents(serpentPlayer, aiSerpents, playGroundLevel, items, sound) {
    if (serpentPlayer.alive)
        executeSerpentMovement(serpentPlayer, playGroundLevel, items, sound);
    moveAiSerpents(aiSerpents, playGroundLevel, items, sound);
}
function getTargetPosition(aiSerpent, items, playField, serpentHeadPosition) {
    let targetStillExists = (playField.fields[aiSerpent.nextTarget.x][aiSerpent.nextTarget.y] == aiSerpent.nextTarget.objectID) ? true : false;
    if (!targetStillExists || positionsAreEqual({ x: aiSerpent.nextTarget.x, y: aiSerpent.nextTarget.y }, serpentHeadPosition))
        aiSerpent.nextTarget = generateNewTarget(items);
    return { x: aiSerpent.nextTarget.x, y: aiSerpent.nextTarget.y };
}
function generateNewTarget(items) {
    let targets = [];
    items.forEach(goodItem => {
        if (goodItem.id == 1)
            targets.push(goodItem);
    });
    //console.log("target:", targets);
    let randomInt = getRandomIntInclusive(0, targets.length - 1);
    let newTarget = targets[randomInt];
    return { objectID: newTarget.id, x: newTarget.gridx, y: newTarget.gridy };
}
function createObstaclesTable(aiSerpent, playField) {
    let obstaclesTable = new playground();
    for (var column = 0; column < obstaclesTable.xSize; column++) {
        for (var row = 0; row < obstaclesTable.ySize; row++) {
            if (playField.fields[column][row] >= 6 || // serpents
                playField.fields[column][row] == 3) // bombs
                obstaclesTable.fields[column][row] = 1;
        }
    }
    obstaclesTable.fields[aiSerpent.serpentParts[1].x][aiSerpent.serpentParts[1].y] = 1;
    return obstaclesTable;
}
function moveAiSerpents(aiSerpents, playField, items, sound) {
    for (let i = 0; i < aiSerpents.length; i++) {
        if (aiSerpents[i].alive) {

            const obstaclesTable = createObstaclesTable(aiSerpents[i], playField);
            const serpentHeadPosition = { x: aiSerpents[i].serpentParts[0].x, y: aiSerpents[i].serpentParts[0].y };
            const nextTargetPosition = getTargetPosition(aiSerpents[i], items, playField, serpentHeadPosition);

            const nextMovement = calculateNextMove(obstaclesTable.fields, serpentHeadPosition, nextTargetPosition, aiSerpents[i]);

            if (nextMovement.movementIsPossible == false) {
                killSerpent(aiSerpents[i], playField, items, sound);
                return;
            }

            aiSerpents[i].OldDx = aiSerpents[i].dx;
            aiSerpents[i].OldDy = aiSerpents[i].dy;
            /* set movement */
            aiSerpents[i].dx = nextMovement.direction.dx;
            aiSerpents[i].dy = nextMovement.direction.dy;

            executeSerpentMovement(aiSerpents[i], playField, items, sound);
        }
    }

}

function killSerpent(serpent, playField, itemlist, sound) {
    serpent.alive = false;
    sound[8].play();
    for (let serpentPartIndex = 0; serpentPartIndex < serpent.serpentParts.length; serpentPartIndex++) {
        playField.removeFromPlayground(serpent.serpentParts[serpentPartIndex].x, serpent.serpentParts[serpentPartIndex].y)
    }

    for (let i = 0; i < 3; i++) {
        generateNewItem(3, itemlist, playField, generateRandomPosition(playField, serpent, true));
    }
    serpent.removeAllSerpentParts();
    serpent.dx = 0;
    serpent.dy = 0;
    highScoreTable.popScoreSheetButtons();
    // ist hier ein bug, denke ich
}

function changeCurrentPointOfView(serpent) {
    /* change direction for animation head */
    if (serpent.dy == -1)
        serpent.serpentParts[0].currentPointOfView = serpent.serpentParts[0].PointOfView.north;
    else if (serpent.dy == +1)
        serpent.serpentParts[0].currentPointOfView = serpent.serpentParts[0].PointOfView.south;
    else if (serpent.dx == -1)
        serpent.serpentParts[0].currentPointOfView = serpent.serpentParts[0].PointOfView.west;
    else if (serpent.dx == +1)
        serpent.serpentParts[0].currentPointOfView = serpent.serpentParts[0].PointOfView.east;
}
function changeBodyDirectionAnimation(serpent) {
    /* change direction for animation body */
    if ((serpent.OldDx == + 1 && serpent.serpentParts[0].currentPointOfView == serpent.serpentParts[0].PointOfView.north)
        || (serpent.OldDy == + 1 && serpent.serpentParts[0].currentPointOfView == serpent.serpentParts[0].PointOfView.east)
        || (serpent.OldDx == - 1 && serpent.serpentParts[0].currentPointOfView == serpent.serpentParts[0].PointOfView.south)
        || (serpent.OldDy == - 1 && serpent.serpentParts[0].currentPointOfView == serpent.serpentParts[0].PointOfView.west)) {
        serpent.serpentParts[0].currentCorner = 1;
    }
    else {
        serpent.serpentParts[0].currentCorner = 2;
    }
}

function getNextXPosition(serpent, playField) {

    let nextXPosition = serpent.serpentParts[0].x + serpent.dx;

    if (nextXPosition < 0)
        nextXPosition = playField.fields.length - 1;
    if (nextXPosition == playField.fields.length)
        nextXPosition = 0;
    return nextXPosition;
}
function getNextYPosition(serpent, playField) {
    let nextYPosition = serpent.serpentParts[0].y + serpent.dy;
    if (nextYPosition < 0)
        nextYPosition = playField.fields.length - 1;
    if (nextYPosition == playField.fields.length)
        nextYPosition = 0;
    return nextYPosition;
}

function serpentLost(serpent, playField, items, nextXPosition, nextYPosition, sound) {

    let featherInBackpack = false;
    serpent.inventory.forEach(item => {
        if (item.name == "feather")
            featherInBackpack = true;
    });

    let touchesSelf = (playField.fields[nextXPosition][nextYPosition] == serpent.id) ? true : false;
    let touchesEnemySerpent = (playField.fields[nextXPosition][nextYPosition] >= 6 && playField.fields[nextXPosition][nextYPosition] != serpent.id) ? true : false;
    let touchesBomb = (playField.fields[nextXPosition][nextYPosition] == 3) ? true : false;
    if (touchesEnemySerpent || touchesBomb || (touchesSelf && !featherInBackpack)) {
        killSerpent(serpent, playField, items, sound);
        return true;
    }
    return false;
}

function executeSerpentMovement(serpent, playField, items, sound) {

    changeCurrentPointOfView(serpent);

    let nextXPosition = getNextXPosition(serpent, playField);
    let nextYPosition = getNextYPosition(serpent, playField);

    if (serpentLost(serpent, playField, items, nextXPosition, nextYPosition, sound))
        return;

    var newHead = new serpentPart(nextXPosition, nextYPosition, serpent.serpentParts[0].currentPointOfView);

    changeBodyDirectionAnimation(serpent);
    serpent.serpentParts.unshift(newHead);

    for (let serpentPartIndex = 0; serpentPartIndex < serpent.serpentParts.length; serpentPartIndex++) {
        playField.addToPlayground(serpent.serpentParts[serpentPartIndex].x, serpent.serpentParts[serpentPartIndex].y, serpent.id);
    }

    itemCollision(serpent, items, playField, sound);
}

function itemCollision(serpent, items, playField, sound) {

    let hasEatenFood = false;

    for (let i = 0; i < items.length; i++) {
        playField.addToPlayground(items[i].gridx, items[i].gridy, items[i].id);

        if (positionsAreEqual({ x: serpent.serpentParts[0].x, y: serpent.serpentParts[0].y }, { x: items[i].gridx, y: items[i].gridy })) {

            if (items[i].name == "food")
                hasEatenFood = true;
            eatItem(serpent, i, items, playField, sound);

            break;
        }
    }
    if (!hasEatenFood) {
        let lastSerpentPart = serpent.serpentParts[serpent.serpentParts.length - 1];
        playField.removeFromPlayground(lastSerpentPart.x, lastSerpentPart.y);
        serpent.serpentParts.pop();
    }
}

function eatItem(serpent, itemIndex, items, playField, sound) {
    switch (items[itemIndex].name) {
        case "food":
            eatFoodSoundeffect(sound);
            serpent.foodEaten++;

            for (let i = 0; i < serpent.inventory.length; i++) {
                if (serpent.inventory[i].name == "feather"){
                    serpent.inventory.splice(i, 1);
                    generateNewItem(5, items, playField, generateRandomPosition(playField, serpent, true));
                }
                break;
            }

            generateNewItem(items[itemIndex].id, items, playField, generateRandomPosition(playField, serpent, true));
            break;

        case "bomb":
            eatBombSoundeffect(sound);
            return;

        case "feather":
            eatFeatherSoundeffect(sound);
            serpent.inventory.push(items[itemIndex]);
            break;

        default:
            break;
    }
    items.splice(itemIndex, 1);
}


function generateRandomPosition(playField, serpent, bgenerateItem) {
    let randomPosition = { x: getRandomIntInclusive(3, gridfield - 3), y: getRandomIntInclusive(3, gridfield - 3) };
    if (playField.fields[randomPosition.x][randomPosition.y] != 0) {
        return generateRandomPosition(playField, serpent, bgenerateItem);
    }
    // when we are generating new items we do not want them to be generated in front of the serpents
    // we need to check whether the serpent already died or not 
    if (serpent.serpentParts[0] != undefined && bgenerateItem === true)
        if ((serpent.serpentParts[0].x + 1 == randomPosition.x
            || serpent.serpentParts[0].x - 1 == randomPosition.x
            || serpent.serpentParts[0].y - 1 == randomPosition.y
            || serpent.serpentParts[0].y + 1 == randomPosition.y))
            return generateRandomPosition(playField, serpent, bgenerateItem);

    return randomPosition;
}

function generateNewItem(ObjectType, itemlist, playField, position) {

    if (ObjectType == 1) {
        var newFood = new item(1, "food", position.x, position.y, globalassets.clover);
        itemlist.push(newFood);
        playField.addToPlayground(newFood.gridx, newFood.gridy, 1);
    }
    else if (ObjectType == 2) {
        var newBackpack = new item(2, "backpack", position.x, position.y, globalassets.backpack);
        itemlist.push(newBackpack);
        playField.addToPlayground(newBackpack.gridx, newBackpack.gridy, 2);
    }
    else if (ObjectType == 3) {
        var newBomb = new item(3, "bomb", position.x, position.y, globalassets.bomb);
        itemlist.push(newBomb);
        playField.addToPlayground(newBomb.gridx, newBomb.gridy, 3);
        console.log("BOMB EATEN");
    }
    else if (ObjectType == 4) {
        var newBook = new item(4, "book", position.x, position.y, globalassets.book);
        itemlist.push(newBook);
        playField.addToPlayground(newBook.gridx, newBook.gridy, 4);
    }
    else if (ObjectType == 5) {
        var newFeather = new item(5, "feather", position.x, position.y, globalassets.feather);
        itemlist.push(newFeather);
        playField.addToPlayground(newFeather.gridx, newFeather.gridy, 5);
    }
    //console.log("newItem generated", itemlist);
}
/* ----  movement section end ---- */


/* ----  update section  ---- */
function update(serpentPlayer, aiSerpents, playGroundLevel, items, sound) {
    //generateNewItem(item);
    updatePlayfieldfields()
    //console.log(playGroundLevel.fields, items);
    moveSerpents(serpentPlayer, aiSerpents, playGroundLevel, items, sound);
}
function updatePlayfieldfields() {

}
/* ----  update section end  ---- */




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
    serpentPlayer.animation.animationInterval += 1;
    // console.log(serpentPlayer.animation.frameSet.length, serpentPlayer.animation.currentFrame, animationInterval);
}
function animations(serpentPlayer) {
    animationPlayer(serpentPlayer);
    // animationFood();
}
/* ----  animation section  end ---- */


/* ----  soundeffect section  ---- */
function eatFoodSoundeffect(eatFoodSound) {
    eatFoodSound[getRandomIntInclusive(0, 1)].pause();
    eatFoodSound[getRandomIntInclusive(0, 1)].currentTime = 0;
    eatFoodSound[getRandomIntInclusive(0, 1)].play();
}
function eatFeatherSoundeffect(eatFeatherSound) {
    eatFeatherSound[4].pause();
    eatFeatherSound[4].currentTime = 0;
    eatFeatherSound[4].play();
}
function eatBombSoundeffect(eatBombSound) {
    eatBombSound[3].pause();
    eatBombSound[3].currentTime = 0;
    eatBombSound[3].play();
}
function eatBackpackSoundeffect(eatBackpackSound) {
    eatBackpackSound[1].pause();
    eatBackpackSound[1].currentTime = 0;
    eatBackpackSound[1].play();
}
function eatBookSoundeffect(eatBookSound) {
    eatBookSound[3].pause();
    eatBookSound[3].currentTime = 0;
    eatBookSound[3].play();
}
function victorySoundeffect(victorySound) {
    victorySound[5].pause();
    victorySound[5].currentTime = 0;
    victorySound[5].play();
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
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
function precise(x) {
    return Number.parseFloat(x).toPrecision(2);
}

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}


/* ---- help functions section end  */


