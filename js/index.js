function Timeout(callback, delay) {
    let timerId;
    let start;
    let remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createNewImg(src, width, height) {
    let newImg = new Image();
    newImg.src = src;
    newImg.height = height;
    newImg.width = width;        
    return newImg;
}

class Hero {
    constructor() {
        this.img = heroImg;
        this.positionX = canvas.width / 2;
        this.positionY = 355;
        this.leftDy = 1011;
        this.isPerformSingleAction = false;
        this.isDead = false;
        this.isLeft = false;
        this.isImmortal = false;
        this.isInvisible = false;
        this.kunaiCount = 10 - game.difficulty * 2;
        this.health = 3;
        this.maxHealth = 5 - game.difficulty;
        this.states = {    
            deadState: {
                width: 145,
                height: 149,
                startX: 0,
                startY: 0,
                dx: 0,
                dy: -10,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: -60,
            },
            jumpState: {
                width: 109,
                height: 200,
                startX: 0,
                startY: 149,
                dx: -20,
                dy: -60,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: 0,
            },
            runState: {
                width: 109,
                height: 137,
                startX: 0,
                startY: 349,
                dx: -10,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: 0,
            },
            stayState: {
                width: 72,
                height: 132,
                startX: 0,
                startY: 487,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: 5,
            },
            swordAttackState: {
                width: 161,
                height: 149,
                startX: 0,
                startY: 620,
                dx: -10,
                dy: -3,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: -65,
            },
            throwState: {
                width: 113,
                height: 135,
                startX: 0,
                startY: 769,
                dx: -26,
                dy: -1,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: 14,
            },
            slideState: {
                width: 112,
                height: 105,
                startX: 0,
                startY: 904,
                dx: -35,
                dy: 39,
                currentSpriteImg: 0,
                spriteCount: 10,
                isCurrent: false,
                correctLeftDx: 0,
            }
        }
    }
};

class Zombie {
    constructor(image, x, y, hero, game) {
        this.img = image,
        this.positionX = x,
        this.positionY = y,
        this.isDead = false,
        this.isAttack = false;
        this.isFell = false;
        this.fakeDead = false;
        this.isLeft = true;
        this.leftDy = 628;
        this.timeout = null; 
        this.dx = 1;
        this.states = {
            stayState: {
                width: 129,
                height: 156,
                startX: 0,
                startY: 156,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 15,
                correctLeftDx: 40,
            },
            runState: {
                width: 129,
                height: 156,
                startX: 0,
                startY: 469,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 10,
                correctLeftDx: 40,
            },
            attackState: {
                width: 129,
                height: 156,
                startX: 0,
                startY: 312,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 8,
                correctLeftDx: 39,
            },
            deadState: {
                width: 189,
                height: 158,
                startX: 0,
                startY: 0 ,
                dx: -45,
                dy: 15,
                currentSpriteImg: 0,
                spriteCount: 12,
                correctLeftDx: 75,
            },
        }
    }

    setInitSatate(state) {
        this.currentState = state;
        this.changeRandomSatate();
    }

    changeRandomSatate() {
        setInterval(() => {
            if (!this.isDead && !this.fakeDead && !game.isPaused) {
                if (hero.positionX - this.positionX < zombieFeelHeroDistance 
                  && this.positionX - hero.positionX < zombieFeelHeroDistance
                  && !hero.isImmortal) {
                    this.currentState = this.states.runState;
                    if(this.dx !== 2) {
                        this.dx = 2;  
                    }
                } else {
                    let randNum = getRandomInt(1, 4);
                    if(this.dx !== 1) {
                        this.dx = 1;  
                    }
                    if(randNum === 1) {
                        this.currentState = this.states.runState;
                    } else {
                        this.currentState = this.states.stayState;
                    }  
                } 
            }
        }, getRandomInt(400, 800));
    };
};

class ZombieBoss {
    constructor() {
        this.img = zombieFemale,
        this.startPositionX = -220;
        this.positionX = 0;
        this.startXPosition = 0;
        this.maxXPosition = 0;
        this.positionY = 205;
        this.isFastRun = false;
        this.isHurted = false;
        this.isAttack = false;
        this.isDead = false;
        this.health = 15 + game.difficulty * 5;
        this.currentHealth = 0;
        this.states = {            
            attackState: {
                width: 261,
                height: 288,
                startX: 0,
                startY: 0,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 8,
            },
            runState: {
                width: 261,
                height: 288,
                startX: 0,
                startY: 288,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 10,
            },
            deadState: {
                width: 342,
                height: 314,
                startX: 0,
                startY: 576,
                dx: 0,
                dy: 0,
                currentSpriteImg: 0,
                spriteCount: 12,
            },
        }
    }
}

class Kunai {
    constructor(speed, isLeft) {
        this.positionX = hero.positionX + 50;
        this.positionY = hero.positionY + 70;
        this.width = 48;
        this.height = 12;
        this.positionDx = speed;
        this.isLeft = isLeft; 
    };
};


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const heroImg = createNewImg('./img/heroAll.png');
const zombieMale = createNewImg('./img/zombieAll.png');
const zombieFemale = createNewImg('./img/zombieAllF.png');
const background = createNewImg('./img/background.jpg', 1280, 630);
const road = createNewImg('./img/road.png', 1280, 240);
const otherImg = createNewImg('./img/other.png');
const pauseMenu = createNewImg('./img/menu1.png');
const control = createNewImg('./img/control.png');

let heroLoad = false;
let zombieMaleLoad = false;
let zombieFemaleLoad = false;
let otherLoad = false;
let backgrounLoad = false;
let roadLoad = false;

heroImg.onload  = () => heroLoad = true;
zombieMale.onload  = () => zombieMaleLoad = true;
zombieFemale.onload  = () => zombieFemaleLoad = true;
otherImg.onload  = () => otherLoad = true;
background.onload  = () => backgrounLoad = true;
road.onload  = () => roadLoad = true;

const canvasTopPosition = canvas.getBoundingClientRect().top;
const canvasLeftposition = canvas.getBoundingClientRect().left;
const pointsForZombie = 100;
const randomBonusesTime = 10; 
const kunaiDx = 7;
const heroDx = 5;
const heroSpeed = 50;
const heroDeadSpeed = 150;
const mZombieSpeed = 75;
const bossZombieSpeed = 100;
const deadZombieTime = 2500;
const checkStatusTime = 75;
const zombieFeelHeroDistance = 300;
const immortalTime = 120;

let currentImmortalTime = immortalTime;

let bgPosition = 0;
let roadPosition  = 0;
let hero;
let zombieBoss;
let zombieArr;
let lieZombieArr;
let kunaiArr;
let randomBonuses;
let slideTimer;
let checkTimer; 
let zombieTimer;
let zombieBossTimer;
let addZombieTimer;
let oneActionTimer;
let bgDx;
let isOneAction;
let canAddBonus;

let buttons = {
    run: {
        codes: [39, 68],
    },
    runLeft: {
        codes: [37, 65],
    },
    jump: {
        codes: [38, 87],
    }, 
    slide: {
        codes: [83, 98],
    },
    swordAttack: {
        codes: [32],
    },
    throw: {
        codes: [69],
    },
    pause: {
        codes: [27],
    }
};

let game = {
    isStarted: false,
    isShowMainMenu: true,
    menuId: undefined,
    startDelay: undefined,
    isStartDelayEnded: false,
    delayTime: 3,
    difficulty: 1,
}

function newGameReset() {
    hero = new Hero;
    zombieBoss = new ZombieBoss();
    zombieArr = [];
    lieZombieArr = [];
    kunaiArr = [];
    randomBonuses = [];
    bgPosition = 0;
    roadPosition = 0;
    isOneAction = false;
    bgDx = 1;
    slideTimer = false;
    canAddBonus = false;
    game.gameId = undefined;
    game.isPaused = false;
    game.isStarted = false;
    game.isShowDifficultyMenu = false;
    game.isShowControl = false;
    game.isShowMainMenu = false;
    game.isEnded = false;
    game.isWin = false;
    game.score = 0;
    game.startDelay = undefined;
    game.isStartDelayEnded = false;
    game.delayTime = 3;

    for (let button in buttons) {
        button.isPressed = false;
    }
}

function createKunai() {
    if (hero.isLeft) {
       kunaiArr.push(new Kunai(-kunaiDx - bgDx * 2, true));
    } else {
        kunaiArr.push(new Kunai(kunaiDx, false));
    }
    return kunaiArr;
};

function addNewZombie(x, y) {
    let num = getRandomInt(1, 6);
    let zombie = new Zombie(zombieMale, x, y, hero, game);

    if (num === 5) {
        zombie.fakeDead = true;
        zombie.states.deadState.currentSpriteImg = zombie.states.deadState.spriteCount -1;
        zombie.setInitSatate(zombie.states.deadState)
    } else {
            zombie.setInitSatate(zombie.states.stayState);
    };

    zombieArr.push(zombie);
};

function isZombieAttack(zombie) {
    return hero.positionX >= zombie.positionX - 20
      && hero.positionX <= zombie.positionX + zombie.currentState.width - 20
      && zombieBoss.currentState !== zombieBoss.states.deadState;
};

function isCanKillHero(zombie) {
    return !hero.isImmortal && zombie.states.attackState.currentSpriteImg == 3 
      && hero.currentState !== hero.states.deadState;
};

function isSwordInZombie(zombie) {
    if((hero.isLeft &&  hero.positionX > zombie.positionX) 
      || (!hero.isLeft && hero.positionX < zombie.positionX + 80)) {
        if(zombie.isLeft) {
            return hero.positionX >= zombie.positionX - zombie.currentState.width / 2 - 20
              && hero.positionX <= zombie.positionX + zombie.currentState.width + 20;
        } else {
            return hero.positionX >= zombie.positionX - zombie.currentState.width / 2 + 10
              && hero.positionX <= zombie.positionX + zombie.currentState.width + 50;
        }; 
    };
};

function isKunaiInZombie(kunaiItem, zombie) {
    if(!zombie.isLeft) {
        return kunaiItem.positionX - kunaiItem.width > zombie.positionX 
          && kunaiItem.positionX  < zombie.positionX + zombie.currentState.width + 40;
    } else { 
        return kunaiItem.positionX - kunaiItem.width > zombie.positionX 
          && kunaiItem.positionX  < zombie.positionX + zombie.currentState.width + 30;
    };
};

function isFakeDeadUp(zombie) {
    return zombie.fakeDead 
      && zombie.positionX + zombie.currentState.width > hero.positionX - zombieFeelHeroDistance
      && zombie.positionX < hero.positionX + hero.currentState.width + zombieFeelHeroDistance;
};

function isSlideUnderZombie(zombie) {
    return hero.positionX >= zombie.positionX - zombie.currentState.width / 2 + 60
      && hero.positionX <= zombie.positionX + zombie.currentState.width;
};

function makeZombieDead(zombie) {
    zombie.isDead = true;
    zombie.currentState = zombie.states.deadState;
    game.score += pointsForZombie;

    zombie.timeout = new Timeout(() => {
        zombieArr.splice(zombieArr.indexOf(zombie), 1)
    }, deadZombieTime);
};

function makeZombieReincarnation(zombie, time) {
    zombieArr.splice(zombieArr.indexOf(zombie), 1);
    lieZombieArr.push(zombie);

    zombie.timeout = new Timeout(function reincarnationCallback() {
        if (zombie.states.deadState.currentSpriteImg === 0) {
            zombie.isFell = false;
            zombie.isDead = false;
            zombie.fakeDead = false;
            zombie.riseUp = false;
            if(zombie.positionX < hero.positionX) {
                zombie.isLeft = false;
            } else {
                zombie.isLeft = true;
            }
            zombie.currentState = zombie.states.stayState;
            zombieArr.push(zombie);
            lieZombieArr.splice(lieZombieArr.indexOf(zombie), 1);
        } else {
            zombie.currentState.currentSpriteImg -= 1;
            zombie.timeout = new Timeout(reincarnationCallback, 100);   
        }
    }, time); 
};

function makeZombieAttack(zombie) {
    zombie.currentState = zombie.states.attackState;
    zombie.isAttack = true;
};

function setCurrentHeroState(newState) {
    for (let state in hero.states) {
        hero.states[state].isCurrent = false;
        if (hero.states[state] === newState) {
            newState.currentSpriteImg = 0;
            newState.isCurrent = true;
            hero.currentState = newState; 
        }
    }
};

function makeHeroImortal(time) {
    immortalTimer = setTimeout(function immortalTimerFunction() {
        hero.isInvisible = !hero.isInvisible;
        if (currentImmortalTime <= 0) {
            currentImmortalTime = immortalTime;
            hero.isImmortal = false;
            zombieArr.forEach((zombie) => {
                if (!zombie.isDead && zombie.isLeft 
                  && hero.positionX - zombie.positionX < zombieFeelHeroDistance
                  && hero.positionX - zombie.positionX > 0) {
                    zombie.isLeft = false;
                } else if(!zombie.isDead && !zombie.isLeft
                  && zombie.positionX - hero.positionX < zombieFeelHeroDistance
                  && zombie.positionX - hero.positionX > 0) {
                    zombie.isLeft = true;
                }
            });
            clearTimeout(immortalTimer);
        } else {
            currentImmortalTime -= 5;
            immortalTimer = setTimeout(immortalTimerFunction, currentImmortalTime);    
        }
    }, time)
};

function makeHeroDamage() {
    hero.health -= 1;
    if (hero.health <= 0) {
        makeHeroDead();
    } else {
        hero.isImmortal = true;
        hero.isInvisible = true;
        makeHeroImortal(currentImmortalTime)
    } 
};

function makeHeroDead() {
    hero.isDead = true;
    setCurrentHeroState(hero.states.deadState);
    clearInterval(mainTimer);
    let heroDeadTimer = setInterval(function() {
        removeHeroKeydownListeners();
        removeHeroKeyupListeners();
        if (hero.currentState.currentSpriteImg >= hero.currentState.spriteCount - 1) {
            clearInterval(heroDeadTimer);
            stopGame();
        } else {
            hero.currentState.currentSpriteImg += 1;
        }
    }, heroDeadSpeed);
};

function setOneHeroAction(state, time){
    clearInterval(mainTimer);
    hero.isPerformSingleAction = true;
    setCurrentHeroState(state);

    oneActionTimer = setInterval(function() {
        if (game.isPaused) {
            clearInterval(oneActionTimer)
        } else if(!hero.isDead) {
            if (hero.currentState.currentSpriteImg >= hero.currentState.spriteCount - 1) {
                clearInterval(oneActionTimer)
                hero.isPerformSingleAction = false;
                startMainTimer();
                setHeroKeydownListeners();
                setHeroKeyupListeners();

                if (buttons.jump.isPressed) {
                    setOneHeroAction(hero.states.jumpState, heroSpeed);
                } else if (buttons.swordAttack.isPressed) {
                    setOneHeroAction(hero.states.swordAttackState, heroSpeed);
                } else if (buttons.throw.isPressed && hero.kunaiCount > 0) {
                    setOneHeroAction(hero.states.throwState, heroSpeed);
                } else if (buttons.run.isPressed || buttons.runLeft.isPressed) {
                    setCurrentHeroState(hero.states.runState)
                } else {
                    setCurrentHeroState(hero.states.stayState);
                }
            } else {
                if (hero.currentState.currentSpriteImg == 2 
                  && hero.states.throwState === hero.currentState 
                  && hero.kunaiCount > 0 ) {
                   createKunai(); 
                   hero.kunaiCount -= 1;
                }
                hero.currentState.currentSpriteImg += 1;
            }
        };
    }, time);
};

function isZombieBossAttack() {
    return hero.positionX < zombieBoss.positionX + zombieBoss.currentState.width - 70
      && !hero.isImmortal;
};

function isKunaiInBossZombie(kunaiItem) {
    return (kunaiItem.isLeft && hero.positionX > zombieBoss.positionX + 100 
      && kunaiItem.positionX + 40 < zombieBoss.positionX + zombieBoss.currentState.width)
      || (!kunaiItem.isLeft &&  zombieBoss.positionX < kunaiItem.positionX 
      && kunaiItem.positionX + 80 < zombieBoss.positionX + zombieBoss.currentState.width);
};

function createRandomBonus() {
    let n = getRandomInt(1, 6);
    let newBonus = {};
    if (n === 5) {
        newBonus.item = 'heart',
        newBonus.standardWidth = 38;
        newBonus.standardHeight = 38;
        newBonus.width = 30;
        newBonus.height = 30;
        newBonus.positionXOnImage = 168;
        newBonus.positionYOnImage = 2;
        newBonus.positionX = canvas.width + 40;
        newBonus.positionY = 300;
    } else {
        newBonus.item = 'kunai',
        newBonus.standardWidth = 12;
        newBonus.standardHeight = 48;
        newBonus.width = 12;
        newBonus.height = 48;
        newBonus.positionXOnImage = 55;
        newBonus.positionYOnImage = 2;
        newBonus.positionX = canvas.width + 40;;
        newBonus.positionY = 280;
    }
    randomBonuses.push(newBonus)
};

function isHeroCatchBonus(bonus) {
    return bonus.positionX - hero.positionX - hero.currentState.width +30 <= 0
      && bonus.positionX + bonus.width - hero.positionX > 0
      && hero.currentState === hero.states.jumpState
      && hero.currentState.currentSpriteImg > 3
      && hero.currentState.currentSpriteImg < 7;
};

function checkOpportunityToCreateBonus() {
    if (game.score >= pointsForZombie * randomBonusesTime 
      && game.score % (pointsForZombie * randomBonusesTime) === 0) {
        if(canAddBonus) {
            canAddBonus = false;
            createRandomBonus();
        }
    } else {
        canAddBonus = true; 
    } 
};

function checkBonusesStatus() {
    randomBonuses.forEach((bonus) => {
        if (isHeroCatchBonus(bonus) || bonus.positionX + bonus.width < 0) {
            if (bonus.item === 'kunai') {
                hero.kunaiCount += 10 - game.difficulty * 2;
                randomBonuses.splice(randomBonuses.indexOf(bonus), 1)
            } else if (bonus.item === 'heart' && hero.health < hero.maxHealth) {
                hero.health += 1
                randomBonuses.splice(randomBonuses.indexOf(bonus), 1)
            }   
        }
    })
};

function checkZombieBossStatus() {
    if (isZombieBossAttack()) {
        zombieBoss.currentState = zombieBoss.states.attackState;
        zombieBoss.isAttack = true;
    };

    if (zombieBoss.currentHealth === 0 && zombieBoss.currentState !== zombieBoss.states.deadState) {
        zombieBoss.currentState = zombieBoss.states.deadState;
    };

    kunaiArr.forEach((kunaiItem, index) => {
        if(isKunaiInBossZombie(kunaiItem, index)) {
            if (zombieBoss.currentHealth > 0) {
                kunaiArr.splice(index, 1);
                zombieBoss.isHurted = true;
                zombieBoss.currentHealth -= 1;
                setTimeout(() => zombieBoss.isHurted = false, 50)  ;
            }
        }
    });
}

function checkZombiesStatus() {
    zombieArr.forEach((zombie) => {
        if(!zombie.isDead && !zombie.isFell) {
            if (hero.states.swordAttackState.isCurrent && isSwordInZombie(zombie)) {
                makeZombieDead(zombie);
            } else if (hero.states.slideState.isCurrent &&  isSlideUnderZombie(zombie)) {
                zombie.currentState = zombie.states.deadState;
                zombie.isFell = true;
                zombie.isDead = true;
            } else if (!hero.isImmortal && !hero.states.slideState.isCurrent && isZombieAttack(zombie)) {
                if(hero.positionX < zombie.positionX + 30) {
                    zombie.isLeft = true;
                } else if(hero.positionX > zombie.positionX + 30) {
                    zombie.isLeft = false;
                }
                if (isCanKillHero(zombie)) {
                    makeHeroDamage();
                } else if(!hero.isImmortal) {
                    makeZombieAttack(zombie);
                }
            };
            if (isFakeDeadUp(zombie)) {
                makeZombieReincarnation(zombie, getRandomInt(1000, 2000));
            };

            kunaiArr.forEach((kunaiItem, index) => {
                if (isKunaiInZombie(kunaiItem, zombie) && !zombie.fakeDead) {
                    kunaiArr.splice(index, 1)
                    makeZombieDead(zombie); 
                }
            })
        }
    });
};

function checkAllStatuses() {
    checkTimer = setInterval(function () {
        checkZombiesStatus();
        checkZombieBossStatus();
        checkBonusesStatus();
        checkOpportunityToCreateBonus();
    }, checkStatusTime) 
};

function startMainTimer() {
    mainTimer = setInterval(function() {
        if (hero.currentState.currentSpriteImg >= hero.currentState.spriteCount - 1) {
            hero.currentState.currentSpriteImg = 0;
        } else {
            hero.currentState.currentSpriteImg += 1; 
        }
    }, heroSpeed) 
};

function startAddZombieTimer(time) {
    addZombieTimer = setTimeout(function addZombie() {
       addNewZombie(canvas.width + 40, 333)
       addZombieTimer = setTimeout(addZombie, getRandomInt(1000 - game.difficulty * 400, 2500 - game.difficulty * 700));
    }, time);
};

function startZombieTimer() {
    zombieTimer = setInterval(function () {
    zombieArr.forEach((zombie) => {
        if (zombie.currentState.currentSpriteImg >= zombie.currentState.spriteCount -1) {
            if(zombie.isFell) {
                makeZombieReincarnation(zombie, getRandomInt(1000, 2000));
            } else if(!zombie.isDead && !zombie.fakeDead) {
                if(zombie.isAttack) {
                    zombie.isAttack = false;
                    zombie.states.attackState.currentSpriteImg = 0;
                    zombie.currentState = zombie.states.runState;
                }
                zombie.currentState.currentSpriteImg = 0;
            }
        } else {
            zombie.currentState.currentSpriteImg += 1; 
        }
    }) 
    }, mZombieSpeed) 
};

function startBossZombieTimer(time) {
    zombieBossTimer = setInterval(function () {
        if (zombieBoss.currentState.currentSpriteImg >= zombieBoss.currentState.spriteCount -1) {
            if(zombieBoss.currentState === zombieBoss.states.deadState) {
                zombieBoss.isDead = true;
                game.isWin = true;
                game.score += 1500;
                removeHeroKeydownListeners();
                removeHeroKeyupListeners();
                stopGame();
            } else {  
                if(zombieBoss.isAttack) {
                    zombieBoss.isAttack = false;
                    zombieBoss.states.attackState.currentSpriteImg = 0;
                    zombieBoss.currentState = zombieBoss.states.runState;
                }
                zombieBoss.currentState.currentSpriteImg = 0;
            }
        } else {
            zombieBoss.currentState.currentSpriteImg += 1; 
        }
       if (isCanKillHero(zombieBoss) && isZombieBossAttack()) {
            makeHeroDamage();
        }
    }, time) 
};

function isButtonsPressed(btn, code) {
    return btn.codes.some((item => item === code))
}

function resumeLieZomnieTimer() {
    zombieArr.forEach((zombie) =>{
        if((zombie.isDead && !zombie.isFell)) {
            zombie.timeout.resume();
        }
    });

    lieZombieArr.forEach((zombie) => {
        if(zombie.isFell || zombie.fakeDead) {
            zombie.timeout.resume();
        }
    });
};

function pauseLieZomnieTimer() {
    zombieArr.forEach((zombie) =>{
        if((zombie.isDead && !zombie.isFell)) {
            zombie.timeout.pause();
        }
    });

    lieZombieArr.forEach((zombie) => {
        if(zombie.isFell || zombie.fakeDead) {
            zombie.timeout.pause();
        }
    });
};

function showPauseMenu() {
    pauseGame();
    addMenuListeners(makePauseMenuHovered, pauseMenuClickCallback);
    pauseLieZomnieTimer();

    if (hero.isImmortal) {
        clearTimeout(immortalTimer);
    }
    if (hero.isPerformSingleAction) {
        isOneAction = true;
    }
    stateCopy = Object.assign({}, hero.currentState);
    game.isPaused = true;
};

function closePauseMenu() {
    if(!isOneAction && !buttons.runLeft.isPressed && !buttons.run.isPressed){
        setCurrentHeroState(hero.states.stayState);
    }
    removeMenuListeners(makePauseMenuHovered, pauseMenuClickCallback);
    resumeLieZomnieTimer();
    resumeGame();
    game.isPaused = false;
    if (isOneAction) {
        setOneHeroAction(stateCopy, heroSpeed); 
    }
    if(hero.isImmortal ) {
        makeHeroImortal(immortalTime);
    }
    isOneAction = false; 
};

function gamePauseKeydownCallback(e) {
    if (game.isStarted && game.isStartDelayEnded && isButtonsPressed(buttons.pause, e.keyCode) && !hero.isDead 
      && !zombieBoss.isDead) {
        let stateCopy;
        if (!game.isPaused) {
            showPauseMenu();
        } else {
            closePauseMenu();
        }
    }
};

function drawBg(img, bgPosition) {
    ctx.drawImage(img, 0 - bgPosition, 0, canvas.width, 480);
    ctx.drawImage(img, 0, 0, img.width, img.height, canvas.width - bgPosition, 0, canvas.width, 480);
};

function drawRoad(img, bgPosition) {
    ctx.drawImage(img, 0 -roadPosition, 450, canvas.width, 200);
    ctx.drawImage(img, 0, 0, img.width, img.height, canvas.width -roadPosition, 450, canvas.width, 200);
};

function drawHero() {
    if (hero.isInvisible) {
        ctx.globalAlpha = 0.5; 
    }
    if (hero.isLeft) {
        ctx.drawImage(hero.img, hero.currentState.startX + (hero.currentState.width * 
          hero.currentState.currentSpriteImg), hero.currentState.startY + hero.leftDy, 
          hero.currentState.width, hero.currentState.height, hero.positionX + 
          hero.currentState.dx + hero.currentState.correctLeftDx, hero.positionY +
          hero.currentState.dy, hero.currentState.width, hero.currentState.height)
    } else {
        ctx.drawImage(hero.img, hero.currentState.startX + (hero.currentState.width *
          hero.currentState.currentSpriteImg), hero.currentState.startY, hero.currentState.width,
          hero.currentState.height, hero.positionX + hero.currentState.dx, hero.positionY +
          hero.currentState.dy, hero.currentState.width, hero.currentState.height)
    }
    if (ctx.globalAlpha !== 1) {
        ctx.globalAlpha = 1; 
    }
};

function drawHeroStatus() {
    ctx.beginPath();
    ctx.arc(70, 70, 45, 0, Math.PI * 2, true);
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.4; 
    ctx.fill();
    ctx.globalAlpha = 1; 
    ctx.beginPath();
    ctx.arc(70, 70, 45, 0, Math.PI * 2, true);
    ctx.lineWidth = 1.5
    ctx.fillStyle = '#fff'
    ctx.stroke();
    ctx.drawImage(otherImg, 72, 2, 93, 93, 33, 31, 80, 80); //hero icon
    ctx.drawImage(otherImg, 0, 14, 48, 12, 130, 85, 48, 12); //kunai icon
    ctx.font = 'bold 18px serif';
    ctx.fillStyle = '#111';
    ctx.fillText(`x ${hero.kunaiCount}`, 185, 96); // kunai count
    for (let i = 0; i <= hero.maxHealth - 1; i++) {
        if (i < hero.health) {
            ctx.drawImage(otherImg, 3, 45, 38, 38, 130 + (i * 35), 40, 25, 25); // health
        }
        ctx.drawImage(otherImg, 168, 44, 40, 40, 127 + (i * 35), 37, 31, 31); // health border
    }
};
   
function drawZombies(zombies) {
    if (Array.isArray(zombies)) {
        zombies.forEach((zombie) => {
            if(!zombie.isLeft) {
                ctx.drawImage(zombie.img, zombie.currentState.startX + (zombie.currentState.width *
                  zombie.currentState.currentSpriteImg), zombie.currentState.startY + zombie.leftDy,
                  zombie.currentState.width, zombie.currentState.height, zombie.positionX + 
                  zombie.currentState.dx + zombie.currentState.correctLeftDx, zombie.positionY + 
                  zombie.currentState.dy, zombie.currentState.width, zombie.currentState.height)
            } else {
                ctx.drawImage(zombie.img, zombie.currentState.startX + (zombie.currentState.width *
                  zombie.currentState.currentSpriteImg), zombie.currentState.startY, 
                  zombie.currentState.width, zombie.currentState.height, zombie.positionX +
                  zombie.currentState.dx, zombie.positionY + zombie.currentState.dy, 
                  zombie.currentState.width, zombie.currentState.height);
            }
        })
    } 
};

function drawZomieBoss() {
    if (!game.isStartDelayEnded) {
        ctx.drawImage(zombieBoss.img, zombieBoss.currentState.startX + (zombieBoss.currentState.width *
          zombieBoss.currentState.currentSpriteImg), zombieBoss.currentState.startY, 
          zombieBoss.currentState.width, zombieBoss.currentState.height, zombieBoss.startPositionX + 
          zombieBoss.currentState.dx, zombieBoss.positionY + zombieBoss.currentState.dy,
          zombieBoss.currentState.width, zombieBoss.currentState.height);
    } else {
        if (zombieBoss.isHurted) {
            ctx.globalAlpha = 0.5; 
        };

        ctx.drawImage(zombieBoss.img, zombieBoss.currentState.startX + (zombieBoss.currentState.width *
          zombieBoss.currentState.currentSpriteImg), zombieBoss.currentState.startY, 
          zombieBoss.currentState.width, zombieBoss.currentState.height, zombieBoss.positionX + 
          zombieBoss.currentState.dx, zombieBoss.positionY + zombieBoss.currentState.dy,
          zombieBoss.currentState.width, zombieBoss.currentState.height);

        if (ctx.globalAlpha !== 1) {
            ctx.globalAlpha = 1; 
        };
    }
};

function drawBossHealth() {
    ctx.lineWidth = 0.5;
    ctx.fillStyle = lingrad;
    ctx.fillRect(450, 40, (380 / zombieBoss.health) * zombieBoss.currentHealth, 25);
    ctx.strokeRect(450, 40, 380, 25);
};

let lingrad = ctx.createLinearGradient(0,0,0, 130);
lingrad.addColorStop(0, '#fff');
lingrad.addColorStop(0.5, '#dd2108');
lingrad.addColorStop(1, '#fff');

function drawKunai() {
    kunaiArr = kunaiArr.filter((item) => {
        return item.positionX < background.width && item.positionX + 42 > 0;
    });

    kunaiArr.forEach((item) => {  
        if (item.isLeft) {
            ctx.drawImage(otherImg, 0, 2, item.width, item.height,
              item.positionX - 100, item.positionY, item.width, item.height);
        } else {
            ctx.drawImage(otherImg, 0, 14, item.width, item.height,
              item.positionX, item.positionY, item.width, item.height);
        }
    })
};

function drawRandomBonuses() {
    randomBonuses.forEach((bonus) => {
        ctx.drawImage(otherImg, bonus.positionXOnImage, bonus.positionYOnImage,
        bonus.standardWidth, bonus.standardHeight, bonus.positionX, bonus.positionY,
        bonus.width, bonus.height);
        if(!game.isPaused) {
            bonus.positionX -= bgDx * 2;
        }
    });
};

function drawText() {
    ctx.font = "32px serif";
    ctx.fillStyle = '#eeeeee';
    ctx.fillText(`Score: ${game.score}`, 1050, 63);
}

function drawWinConditions() {
    ctx.font = "36px serif";
    ctx.fillStyle = '#eeeeee';
    ctx.fillText('Survive and kill the Boss!', 450, 150);
    ctx.fillText(`${game.delayTime}`, 620, 200);
}

/// draw menu

function drawMenubg() {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.4; 
    ctx.fillRect(0, 0, 1280, 640);
    ctx.globalAlpha = 1;
}

let pauseMenuButtons =  {
    replay: {
        hovered: false,
        positionX: 483,
        positionY: 250,
        positionXOnSprite: 368,
        positionYOnSprite: 0,
    },
    replayEnd: {
        hovered: false,
        positionX: 645,
        positionY: 250,
        positionXOnSprite: 368,
        positionYOnSprite: 0,
    },
    continue: {
        hovered: false,
        positionX: 645,
        positionY: 250,
        positionXOnSprite: 0,
        positionYOnSprite: 0,
    },
    exit: {
        hovered: false,
        positionX: 483,
        positionY: 250,
        positionXOnSprite: 735,
        positionYOnSprite: 0,
    },
    settings: {   
        nextImageDist: 184,
        widthOnSprite: 185,
        heightOnSprite: 93,
        width: 145,
        height: 73,
    }
};

let mainMenuButtons = {
    play: {
        hovered: false,
        positionX: 512,
        positionY: 210,
        positionXOnSprite: 575,
        positionYOnSprite: 244,
    },
    difficulty: {
        hovered: false,
        positionX: 512,
        positionY: 300,
        positionXOnSprite: 575,
        positionYOnSprite: 170,
    },
    control: {
        hovered: false,
        positionX: 512,
        positionY: 390,
        positionXOnSprite: 575,
        positionYOnSprite: 96,
    },
    babyMode: {
        hovered: false,
        isActive: false,
        positionX: 512,
        positionY: 150,
        positionXOnSprite: 2,
        positionYOnSprite: 400,
    },
    normal: {
        hovered: false,
        isActive: true,
        positionX: 512,
        positionY: 240,
        positionXOnSprite: 2,
        positionYOnSprite: 548,
    },
    hellMode: {
        hovered: false,
        isActive: false,
        positionX: 512,
        positionY: 330,
        positionXOnSprite: 2,
        positionYOnSprite: 474,
    },
    mainMenu: {
        hovered: false,
        positionX: 512,
        positionY: 420,
        positionXOnSprite: 575,
        positionYOnSprite: 318,
    },
    settings: {   
        nextImageDist: 254,
        widthOnSprite: 250,
        heightOnSprite: 70,
        width: 250,
        height: 70,
    }
};

let controlMenuButtons = {
    mainMenuControl: {
        hovered: false,
        positionX:547,
        positionY: 450,
        positionXOnSprite: 575,
        positionYOnSprite: 318,
    },
    settings: {   
        nextImageDist: 254,
        widthOnSprite: 250,
        heightOnSprite: 70,
        width: 175,
        height: 49,
    },
};

function drawButton(button, buttonsSettings) {
    if (button.isActive) {
        ctx.drawImage(pauseMenu, button.positionXOnSprite + buttonsSettings.nextImageDist * 2,
          button.positionYOnSprite, buttonsSettings.widthOnSprite, buttonsSettings.heightOnSprite,
          button.positionX, button.positionY,buttonsSettings.width, buttonsSettings.height); 
    } else if (button.hovered) {
        ctx.drawImage(pauseMenu, button.positionXOnSprite + buttonsSettings.nextImageDist,
          button.positionYOnSprite, buttonsSettings.widthOnSprite, buttonsSettings.heightOnSprite,
          button.positionX, button.positionY,buttonsSettings.width, buttonsSettings.height); 
    } else {
        ctx.drawImage(pauseMenu, button.positionXOnSprite, button.positionYOnSprite,
          buttonsSettings.widthOnSprite, buttonsSettings.heightOnSprite, button.positionX,
          button.positionY,buttonsSettings.width, buttonsSettings.height); 
    } 
};

function drawMainMenu() {
    ctx.drawImage(pauseMenu, 760, 400, 430, 440, 420, 120, 430, 440);
    drawButton(mainMenuButtons.play, mainMenuButtons.settings)
    drawButton(mainMenuButtons.difficulty, mainMenuButtons.settings)
    drawButton(mainMenuButtons.control, mainMenuButtons.settings)
};

 function drawDifficultyMenu() {
    ctx.drawImage(pauseMenu, 760, 400, 430, 440, 420, 60, 430, 530);
    drawButton(mainMenuButtons.babyMode , mainMenuButtons.settings);
    drawButton(mainMenuButtons.normal, mainMenuButtons.settings);
    drawButton(mainMenuButtons.hellMode, mainMenuButtons.settings);
    drawButton(mainMenuButtons.mainMenu, mainMenuButtons.settings);
};

function drawControlMenu() {
    ctx.drawImage(pauseMenu, 761, 400, 430, 440, 375, 60, 530, 530);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#eeeeee';
    ctx.fillText('Control:', 585, 160);

    ctx.drawImage(control, 0, 0, 450, 330, 470, 170,  360, 264); 
    drawButton(controlMenuButtons.mainMenuControl, controlMenuButtons.settings);

};

function drawPauseMenu() {
    ctx.drawImage(pauseMenu, 2, 95, 573, 304, 415, 150, 458, 243);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#eeeeee';
    ctx.fillText('Pause!', 595, 235);
    drawButton(pauseMenuButtons.replay, pauseMenuButtons.settings)
    drawButton(pauseMenuButtons.continue, pauseMenuButtons.settings);
};


function drawEndMenu() {
    ctx.drawImage(pauseMenu, 2, 95, 573, 304, 415, 150, 458, 243);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#eeeeee';
    if (game.isWin) {
        ctx.fillText('You Win!', 573, 235);
    } else {
        ctx.fillText('You Lose! Try Again!', 490, 235); 
    }
    drawButton(pauseMenuButtons.exit, pauseMenuButtons.settings)
    drawButton(pauseMenuButtons.replayEnd, pauseMenuButtons.settings)
    //ctx.font = 'bold 26px serif';
    //ctx.fillText('Score:', 515, 275); // kunai count
    //ctx.fillText(game.score, 515, 310); // kunai count
};

function changeBgPosition() {
    if(zombieBoss.currentState === zombieBoss.states.deadState) {
        bgDx = 0;
    };
    if (bgPosition >= background.width) {
        bgPosition = bgDx;
    } else {
        bgPosition += bgDx;    
    };
    if (roadPosition >= background.width) {
        roadPosition = bgDx * 2;
    } else {
        roadPosition += bgDx * 2;    
    };
};

function changeHeroPosition() {
    if (hero.states.jumpState.isCurrent && buttons.run.isPressed) {
        if (hero.positionX + hero.currentState.width < canvas.width + 10) {
            hero.positionX += heroDx - bgDx * 2;       
        };
    } else if (hero.states.jumpState.isCurrent && buttons.runLeft.isPressed) {
        if (hero.positionX > 5) {
            hero.positionX -= heroDx;       
        };
    } else if (hero.states.runState.isCurrent && !hero.isLeft) {
       if (hero.positionX + hero.currentState.width < canvas.width + 5) {
           hero.positionX += heroDx -bgDx * 2;      
       };
    } else if (hero.states.runState.isCurrent  && hero.isLeft) {
        if (hero.positionX > 5) {
            hero.positionX -= heroDx;       
        };
   } else if (hero.states.slideState.isCurrent && !hero.isLeft) {
       if (hero.positionX + hero.currentState.width < canvas.width) {
           hero.positionX += heroDx - bgDx * 2;       
       };
    } else if (hero.states.slideState.isCurrent  && hero.isLeft) {
        if (hero.positionX > 5) {
            hero.positionX -= heroDx;       
        };
    } else {
        if (hero.positionX > 5){
            hero.positionX -= bgDx * 2;
        };
   };
};

function changeZombiesPosition() {
    zombieArr.forEach((zombie) => {
        if ((zombie.positionX + zombie.currentState.width  <= 0 && !zombie.isDead) 
          || (zombie.positionX  > canvas.width && !zombie.isLeft)) {
            zombieArr.splice(zombieArr.indexOf(zombie), 1);
        }
        if(!zombie.isLeft) {
            if (zombie.currentState === zombie.states.runState) {
                zombie.positionX += 1.5 * zombie.dx;
            }
        } else {
            if (zombie.currentState === zombie.states.runState) {
                zombie.positionX -= zombie.dx;
            }
        }
        zombie.positionX -= bgDx * 2;
    })

    lieZombieArr.forEach((zombie) => {
        zombie.positionX -= bgDx * 2;
    })        
};
    
function changeZombieBossPosition() {
    if(!game.isStartDelayEnded) {
        zombieBoss.startPositionX += 1.1; 
    }
    if (zombieBoss.isAttack) {
        zombieBoss.positionX -= bgDx * 2;
    } else if (zombieBoss.isFastRun && zombieBoss.positionX >= zombieBoss.maxXPosition) {
        clearInterval(zombieBossTimer);
        startBossZombieTimer(bossZombieSpeed);
        zombieBoss.isFastRun = false;
    } else if (zombieBoss.positionX < zombieBoss.maxXPosition) {
        if (!zombieBoss.isFastRun) {
            clearInterval(zombieBossTimer);
            startBossZombieTimer(bossZombieSpeed - 30);
            zombieBoss.isFastRun = true;  
        }
        zombieBoss.positionX += 1;
    }
};

function changeKunaiPosition() {
    kunaiArr.forEach((item) => item.positionX += item.positionDx);
};

function gameEngine() {
    ctx.clearRect(0, 0, 1280, 640);
    drawBg(background, bgPosition);
    drawRoad(road, bgPosition*2);
    if(!game.isStartDelayEnded) {
        drawWinConditions();
    }
    drawKunai();
    drawBossHealth();
    drawRandomBonuses();
    drawZomieBoss();
    drawHero();
    drawZombies(zombieArr);
    drawZombies(lieZombieArr);
    drawText();
    drawHeroStatus();

    if (!game.isPaused && game.isStarted ) {
        if (game.isStartDelayEnded) {
           changeZombiesPosition();
           changeHeroPosition();
           changeBgPosition();
           changeKunaiPosition();
        }
        changeZombieBossPosition();
    }

    if (game.isPaused) {
        drawMenubg();
        if (game.isEnded) {
            drawEndMenu();
        } else {
            drawPauseMenu();
        }
    }
    game.gameId = requestAnimationFrame(gameEngine);
};

function mainMenuEngine() {
    ctx.clearRect(0, 0, 1280, 640);
    drawBg(background, bgPosition);
    drawRoad(road, bgPosition*2);
    drawMenubg();
    if (game.isShowMainMenu) {
        drawMainMenu();
    }
    if (game.isShowDifficultyMenu){
        drawDifficultyMenu();
    }
    if (game.isShowControl) {
        drawControlMenu();
    }
    game.menuId = requestAnimationFrame(mainMenuEngine);
};

function startGame() {
    newGameReset();
    setCurrentHeroState(hero.states.stayState);
    zombieBoss.currentState = zombieBoss.states.runState;
    zombieBoss.currentHealth = zombieBoss.health;
    gameEngine();
    startMainTimer();
    startBossZombieTimer(bossZombieSpeed);
    game.startDelay = setInterval(() => {
    game.isStarted = true;
        if(game.delayTime > 0 ){
            game.delayTime -= 1;
        } else {
            startZombieTimer();
            checkAllStatuses();
            startAddZombieTimer(2000);
            game.isStartDelayEnded = true;
            setHeroKeydownListeners();
            setHeroKeyupListeners();
            zombieBoss.positionX = zombieBoss.startPositionX;
            zombieBoss.maxXPosition = zombieBoss.startPositionX;
            clearInterval(game.startDelay);
        }
    }, 1000); 
};

function resumeGame() {
    if (game.gameId) {
        startAllTimer();
        setHeroKeydownListeners();
        startAddZombieTimer(500);
    };
};

function pauseGame() {
    if (game.gameId) {
        stopAllTimer();
        removeHeroKeydownListeners();
    }
};

function stopGame() {
    pauseLieZomnieTimer();
    stopAllTimer();
    addMenuListeners(makeReplayEndButtonHovered, replayEndClickCallback);
    game.isPaused = true;
    game.isEnded = true;
};

function resetGame() {
    removeHeroKeydownListeners();
    removeHeroKeyupListeners();
    stopAllTimer();
    cancelAnimationFrame(game.gameId);
    startGame();
};

/// run listener callback
function runKeydownCallback(e) {
    if (isButtonsPressed(buttons.run, e.keyCode)) {
        if ((hero.currentState !== hero.states.runState || hero.isLeft) 
          && !hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            setCurrentHeroState(hero.states.runState);
        };

        hero.isLeft = false;
        buttons.run.isPressed = true;
    };
};

function runKeyupCallback(e) {
    if (isButtonsPressed(buttons.run, e.keyCode)) {
        if((!hero.isPerformSingleAction  && !hero.isDead
          && !buttons.runLeft.isPressed  && !game.isPaused))  {
            setCurrentHeroState(hero.states.stayState);
        };

        buttons.run.isPressed = false;
        if (buttons.runLeft.isPressed && !game.isPaused) {
            hero.isLeft = true;
        };
    };
};

/// run left listener callback
function runLeftKeydownCallback(e) {
    if (isButtonsPressed(buttons.runLeft, e.keyCode)) {
        if((hero.currentState !== hero.states.runState || !hero.isLeft) 
          && !hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            setCurrentHeroState(hero.states.runState);
        };
        hero.isLeft = true;
        buttons.runLeft.isPressed = true;
    };
};

function runLeftKeyupCallback(e) {
    if (isButtonsPressed(buttons.runLeft, e.keyCode)) {
        if(!hero.isPerformSingleAction && !hero.isDead 
          && !buttons.run.isPressed && !game.isPaused) {
            setCurrentHeroState(hero.states.stayState);
        };
        if (buttons.run.isPressed && !game.isPaused) {
            hero.isLeft = false;
        };
        buttons.runLeft.isPressed = false;
    };
};

/// jump listener callback
function jumKeydownCallback(e) {
    if (isButtonsPressed(buttons.jump, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            setOneHeroAction(hero.states.jumpState, 40);
        };
        buttons.jump.isPressed = true;
    };
};

function jumpKeyupCallback(e) {
    if (isButtonsPressed(buttons.jump, e.keyCode)) {
        buttons.jump.isPressed = false;
    };
};

/// slide listener callback
function slideKeydownCallback(e) {
    if (isButtonsPressed(buttons.slide, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused && !slideTimer) { 
            slideTimer = true;
            setOneHeroAction(hero.states.slideState, 40);
            setTimeout(()=> slideTimer = false, 1500)
        };
        buttons.slide.isPressed = true;
    };
};

function slideKeyupCallback(e) {
    if (isButtonsPressed(buttons.slide, e.keyCode)) {
        buttons.slide.isPressed = false;
    };
};

/// sword attack listener callback
function swordAttackKeydownCallback(e) {
    if (isButtonsPressed(buttons.swordAttack, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            setOneHeroAction(hero.states.swordAttackState, 40);   
        }
        buttons.swordAttack.isPressed = true;
    };
};

function swordAttackKeyupCallback(e) {
    if (isButtonsPressed(buttons.swordAttack, e.keyCode)) {
        buttons.swordAttack.isPressed = false;
    };
};

/// throw attack listener callback
function throwKeydownCallback(e) {
    if (isButtonsPressed(buttons.throw, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && hero.kunaiCount > 0 && !game.isPaused) { 
            setOneHeroAction(hero.states.throwState, 40);   
        }
        buttons.throw.isPressed = true;
    };
};

function throwKeyupCallback(e) {
    if (isButtonsPressed(buttons.throw, e.keyCode)) {
        buttons.throw.isPressed = false;
    };
};

//mainMenu logic
function isButtonHovered(e, button, buttonsSettings) { 
    return e.pageX >= button.positionX + canvasLeftposition 
      && e.pageX  <=  button.positionX + buttonsSettings.width + canvasLeftposition 
      && e.pageY >= button.positionY + canvasTopPosition 
      && e.pageY  <= button.positionY + buttonsSettings.height + canvasTopPosition;
};

function makeButtonHovered(button) {
    if (!button.hovered) {
        button.hovered = true;
        canvas.style.cursor = 'pointer';   
    };
};

function resetHoverHoverMenuButtons(buttons) {
    for (let button in buttons) {
        if(buttons[button].hovered === true) {
            buttons[button].hovered = false;
        }
    };
    canvas.style.cursor = 'default';
};

function setActiveDifficulty(activeButton) {
    for (let button in mainMenuButtons) {
        mainMenuButtons[button].isActive = false
        if (mainMenuButtons[button] === activeButton) {
            mainMenuButtons[button].isActive = true;
        }
    };
};

function goTomeinMenu(hideMenu, buttons, hoverListener, clickListener) {
    resetHoverHoverMenuButtons(mainMenuButtons);
    removeMenuListeners(hoverListener, clickListener);
    game[hideMenu] = false;
    game.isShowMainMenu = true;
    addMenuListeners(makeMainMenuHovered, mainMenuClickCallback);
};

/// menu liseteners
function makeMainMenuHovered(e) {
    if (isButtonHovered(e, mainMenuButtons.play, mainMenuButtons.settings)) {
        makeButtonHovered(mainMenuButtons.play)
    } else if (isButtonHovered(e, mainMenuButtons.difficulty, mainMenuButtons.settings)) {
        makeButtonHovered( mainMenuButtons.difficulty)
    } else if (isButtonHovered(e, mainMenuButtons.control, mainMenuButtons.settings)) {
        makeButtonHovered( mainMenuButtons.control)
    } else if (mainMenuButtons.play.hovered 
      || mainMenuButtons.difficulty.hovered
      || mainMenuButtons.control.hovered) {
        resetHoverHoverMenuButtons(mainMenuButtons);
    };
};
    
function mainMenuClickCallback(e) {
    if (isButtonHovered(e,mainMenuButtons.play, mainMenuButtons.settings)) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
        removeMenuListeners(makeMainMenuHovered, mainMenuClickCallback);
        cancelAnimationFrame(game.menuId);
        startGame();
    } else if (isButtonHovered(e, mainMenuButtons.difficulty, mainMenuButtons.settings)){
        resetHoverHoverMenuButtons(pauseMenuButtons);
        removeMenuListeners(makeMainMenuHovered, mainMenuClickCallback);
        game.isShowMainMenu = false;
        game.isShowDifficultyMenu = true;
        addMenuListeners(makeDifficultyMenuHovered, difficultyMenuClickCallback);
    } else if (isButtonHovered(e, mainMenuButtons.control, mainMenuButtons.settings)) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
        removeMenuListeners(makeMainMenuHovered, mainMenuClickCallback);
        game.isShowMainMenu = false;
        game.isShowControl = true;
        addMenuListeners(makeControlMenuHovered, controlMenuClickCallback);
    };
};

function makeControlMenuHovered(e) {
    if (isButtonHovered(e, controlMenuButtons.mainMenuControl, controlMenuButtons.settings)) {
        makeButtonHovered(controlMenuButtons.mainMenuControl)
    } else if (controlMenuButtons.mainMenuControl.hovered) {
        resetHoverHoverMenuButtons(controlMenuButtons);
    };
};

function controlMenuClickCallback(e) {
    if (isButtonHovered(e, controlMenuButtons.mainMenuControl, controlMenuButtons.settings)) {
        goTomeinMenu ('isShowControl', mainMenuButtons,
        makeControlMenuHovered, controlMenuClickCallback);
    } 
};

function makeDifficultyMenuHovered(e) {
    if (isButtonHovered(e, mainMenuButtons.babyMode, mainMenuButtons.settings)) {
        makeButtonHovered(mainMenuButtons.babyMode)
    } else if (isButtonHovered(e, mainMenuButtons.normal, mainMenuButtons.settings)) {
        makeButtonHovered(mainMenuButtons.normal)
    } else if (isButtonHovered(e, mainMenuButtons.hellMode, mainMenuButtons.settings)) {
        makeButtonHovered(mainMenuButtons.hellMode)
    } else if (isButtonHovered(e, mainMenuButtons.mainMenu, mainMenuButtons.settings)) {
        makeButtonHovered(mainMenuButtons.mainMenu)
    } else if (mainMenuButtons.babyMode.hovered || mainMenuButtons.normal.hovered
      || mainMenuButtons.hellMode.hovered || mainMenuButtons.mainMenu.hovered) {
        resetHoverHoverMenuButtons(mainMenuButtons);
    };
};

function difficultyMenuClickCallback(e) {
    if (isButtonHovered(e, mainMenuButtons.babyMode, mainMenuButtons.settings)) {
        setActiveDifficulty(mainMenuButtons.babyMode);
        game.difficulty = 0;
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        makeDifficultyMenuHovered, difficultyMenuClickCallback);
    } else if (isButtonHovered(e, mainMenuButtons.normal, mainMenuButtons.settings)){
        setActiveDifficulty(mainMenuButtons.normal);
        game.difficulty = 1;
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        makeDifficultyMenuHovered, difficultyMenuClickCallback);
    } else if (isButtonHovered(e, mainMenuButtons.hellMode, mainMenuButtons.settings)) {
        setActiveDifficulty(mainMenuButtons.hellMode);
        game.difficulty = 2;
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        makeDifficultyMenuHovered, difficultyMenuClickCallback);
    } else if (isButtonHovered(e, mainMenuButtons.mainMenu, mainMenuButtons.settings)) {
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        makeDifficultyMenuHovered, difficultyMenuClickCallback);
    }
};

function makePauseMenuHovered(e) {
    if (isButtonHovered(e, pauseMenuButtons.replay, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.replay)
    } else if (isButtonHovered(e, pauseMenuButtons.continue, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.continue)
    } else if (pauseMenuButtons.replay.hovered || pauseMenuButtons.continue.hovered) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
    };
};

function pauseMenuClickCallback(e) {
    if (isButtonHovered(e, pauseMenuButtons.replay, pauseMenuButtons.settings)) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
        removeMenuListeners(makePauseMenuHovered, pauseMenuClickCallback);
        resetGame();
    } else if (isButtonHovered(e, pauseMenuButtons.continue, pauseMenuButtons.settings)){
        resetHoverHoverMenuButtons(pauseMenuButtons);
        closePauseMenu();
    };
};

function makeReplayEndButtonHovered(e) {
    if (isButtonHovered(e, pauseMenuButtons.replayEnd, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.replayEnd)   
    } else if (isButtonHovered(e, pauseMenuButtons.exit, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.exit) 
    } else if(pauseMenuButtons.replayEnd || pauseMenuButtons.exit ) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
    };
};


function replayEndClickCallback(e) {
    if (isButtonHovered(e, pauseMenuButtons.replayEnd, pauseMenuButtons.settings)) {
        removeMenuListeners(makeReplayEndButtonHovered, replayEndClickCallback)
        resetHoverHoverMenuButtons(pauseMenuButtons);
        resetGame();
    } else if (isButtonHovered(e, pauseMenuButtons.exit, pauseMenuButtons.settings)){
        goTomeinMenu('isStarted', pauseMenuButtons,
        makeReplayEndButtonHovered, replayEndClickCallback);
        cancelAnimationFrame(game.gameId);
        removeHeroKeydownListeners();
        removeHeroKeyupListeners();
        mainMenuEngine();
    }
}; 

function addMenuListeners(mouseMoveCallback, clickCallback) {
    canvas.addEventListener('mousemove', mouseMoveCallback);
    canvas.addEventListener('click', clickCallback);
}
function removeMenuListeners(mouseMoveCallback, clickCallback) {
    canvas.removeEventListener('mousemove', mouseMoveCallback);
    canvas.removeEventListener('click', clickCallback);
}

window.addEventListener('keydown', gamePauseKeydownCallback);

function setHeroKeydownListeners() {
    window.addEventListener('keydown', runKeydownCallback);
    window.addEventListener('keydown', slideKeydownCallback);
    window.addEventListener('keydown', jumKeydownCallback);
    window.addEventListener('keydown', swordAttackKeydownCallback);
    window.addEventListener('keydown', throwKeydownCallback);
    window.addEventListener('keydown', runLeftKeydownCallback);
}

function setHeroKeyupListeners() {
    window.addEventListener('keyup', runKeyupCallback);
    window.addEventListener('keyup', jumpKeyupCallback);
    window.addEventListener('keyup', slideKeyupCallback);
    window.addEventListener('keyup', swordAttackKeyupCallback);
    window.addEventListener('keyup', throwKeyupCallback);
    window.addEventListener('keyup', runLeftKeyupCallback); 
};


function removeHeroKeydownListeners() {
    window.removeEventListener('keydown', runKeydownCallback);
    window.removeEventListener('keydown', slideKeydownCallback);
    window.removeEventListener('keydown', jumKeydownCallback);
    window.removeEventListener('keydown', swordAttackKeydownCallback);
    window.removeEventListener('keydown', throwKeydownCallback);
    window.removeEventListener('keydown', runLeftKeydownCallback);
};

function removeHeroKeyupListeners() {
    window.removeEventListener('keyup', runKeyupCallback);
    window.removeEventListener('keyup', jumpKeyupCallback);
    window.removeEventListener('keyup', slideKeyupCallback);
    window.removeEventListener('keyup', swordAttackKeyupCallback);
    window.removeEventListener('keyup', throwKeyupCallback);
    window.removeEventListener('keyup', runLeftKeyupCallback);
}

function stopAllTimer() {
    clearInterval(mainTimer);
    clearInterval(zombieTimer);
    clearInterval(zombieBossTimer);
    clearInterval(checkTimer);
    clearInterval(oneActionTimer);
    clearTimeout(addZombieTimer);
};

function startAllTimer() {
    startMainTimer();
    startZombieTimer();
    checkAllStatuses();
    startBossZombieTimer(bossZombieSpeed);
};


let spiner = document.getElementById('loading');

let startTimer = setInterval(function() {
    if(heroLoad && zombieMaleLoad && zombieFemaleLoad && otherLoad && backgrounLoad && roadLoad) {
        spiner.style.display = 'none';
        clearInterval(startTimer)
        mainMenuEngine();
        addMenuListeners(makeMainMenuHovered, mainMenuClickCallback);

    };
}, 50);

