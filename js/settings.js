class Timeout {
    constructor(callback, delay) {
        this.callback = callback;
        this.timerId = null;
        this.start = null;
        this.remaining = delay;
    };

    pause() {
        clearTimeout(this.timerId);
        this.remaining -= new Date() - this.start;
    };

    resume() {
        this.start = new Date();
        clearTimeout(this.timerId);
        this.timerId = setTimeout(this.callback, this.remaining);
    };

    init() {
        this.resume();
    };
};

class Game {
    constructor() {
        this.delayTime = 3;
        this.score = 0;
        this.bgPosition = 0;
        this.roadPosition = 0;
        this.bgDx = settings.bgDx;
        this.isStarted = false;
        this.isPaused = false;
        this.isStartDelayEnded = false;
        this.isShowMainMenu = true;
        this.isShowDifficultyMenu = false;
        this.isShowControl = false;
        this.isEnded = false;
        this.isWin = false;
        this.menuId = null;
        this.gameId = null;
        this.startDelay = null;
        this.addZombieTimer = null;
    };    
};

const settings = {
    pointsForZombie: 100,
    randomBonusesTime: 10,
    kunaiDx: 7,
    heroDx: 5,
    bgDx: 1,
    heroSpeed: 50,
    heroDeadSpeed: 150,
    zombieSpeed: 75,
    bossSpeed: 100,
    deadZombiesTime: 2500,
    checkStatusTime: 75,
    zombieFeelHeroDistance: 300,
    immortalTime: 120,
    difficulty: 1,
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

export {settings, Timeout, getRandomInt, Game};
