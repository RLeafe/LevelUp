//@param Main is the configuration for the game, it also connects different scenes to the same game
var physicsConfig = {
    default: 'arcade',
    arcade: {
        gravity: { y: 500 },
        debug: false,
    },
};

var config = {
    type: Phaser.AUTO,
    width: 20 * 64,
    height: 12 * 64,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'phaser-game',
    physics: physicsConfig,
    scene: [MainMenu, StageOne, SkillMenu, Hud, Finished],
};

var game = new Phaser.Game(config);

//Variables for all
var money = 0,
    attempts = 0,
    currentUser;

//Varables for levels
var map, hud, grounds, waterPoint, spawnPoint, finishLine;
var cannon1, cannon2;

//Variables for the HUD
var hudMoney, hudTime, hudAttempts;

//Globals access skill variablses
var skillTime = 6000,
    skillSpeed = 175,
    skillJump = 220,
    skillBonus = 2;

//Data variables for the skill Menu

//Speed
var speedCost = 11,
    speedAdd = 0.09,
    speedCounter = 0,
    speedTotal = 4;

//Time
var timeCost = 10,
    timeAdd = 3000,
    timeCounter = 0,
    timeTotal = 12;

//Jump
var jumpCost = 12,
    jumpAdd = 0.15,
    jumpCounter = 0,
    jumpTotal = 3;

//Bonus
var bonusCost = 25,
    bonusAdd = 2,
    bonusCounter = 0,
    bonusTotal = 4;
