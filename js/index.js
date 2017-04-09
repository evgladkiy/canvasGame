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

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const heroImg = createNewImg('./img/heroAll.png');
const zombieMale = createNewImg('./img/zombieAll.png');
const zombieFemale = createNewImg('./img/zombieAllF.png');
const background = createNewImg('./img/background.jpg', 1280, 630);
const road = createNewImg('./img/road.png', 1280, 240);
const otherImg = createNewImg('./img/other.png');

let heroLoad = false;
let zombieMaleLoad = false;
let zombieFemaleLoad = false;
let otherLoad = false;
let backgrounLoad = false;
let roadLoad = false;

heroImg.onload  = () => heroLoad = true;
zombieMale.onload  = () => zombieMaleLoad = true;
zombieFemale.onload  = () => zombieFemaleLoad = true;
otherImg.onload  = () => kunaiLoad = true;
background.onload  = () => backgrounLoad = true;
road.onload  = () => roadLoad = true;

function draw() {
    class Zombie {
        constructor(image, x, y) {
            this.img = image,
            this.positionX = x,
            this.positionY = y,
            this.isDead = false,
            this.isAtack = false;
            this.isFell = false;
            this.fakeDead = false;
            this.isLeft = true;
            this.leftDy = 628;
            this.timeout = null; 
            this.dx = 1;
            this.states = this.createNewZombieStates();
        }

        setInitSatate(state) {
            this.currentState = state;
            this.changeRandomSatate();
        }

        changeRandomSatate() {
            setInterval(() => {
                if (!this.isDead && !this.fakeDead) {
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

        createNewZombieStates() {
            return {
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
                atackState: {
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

        };
    };

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

    function createKunai() {
        if (hero.isLeft) {
           kunaiArr.push(new Kunai(-kunaiDx - bgDx * 2, true));
        } else {
            kunaiArr.push(new Kunai(kunaiDx, false));
        }
        return kunaiArr;
    };

    const pointsForZombie = 100;
    const randomBonusesTime = 10; 
    const kunaiDx = 7;
    const heroDx = 5;
    const mZombieDx = 1;
    const heroSpeed = 50;
    const heroDeadSpeed = 150;
    const mZombieSpeed = 75;
    const bossZombieSpeed = 100;
    const deadZombieTime = 2500;
    const checkStatusTime = 75;
    const zombieFeelHeroDistance = 300;
    const immortalTime = 120;

    let checkTimer; 
    let zombieTimer;
    let zombieBossTimer;
    let addZombieTimer;
    let gameId;
    let zombieArr = [];
    let lieZombieArr = [];
    let kunaiArr = [];
    let randomBonuses = [];
    let bgPosition = 0;
    let roadPosition = 0;
    let isOneAction;
    let score = 0;
    let bgDx = 1;
    let slideTimer = false;
    let canAddBonus = false;
    let currentImmortalTime = immortalTime;
    let game = {
        isPaused: false,
        isStarted: false,
    };

    function addNewZombie(x, y) {
        let num = getRandomInt(1, 6);
        let zombie = new Zombie(zombieMale, x, y);

        if (num === 5) {
            zombie.fakeDead = true;
            zombie.states.deadState.currentSpriteImg = zombie.states.deadState.spriteCount -1;
            zombie.setInitSatate(zombie.states.deadState)
        } else {
            zombie.setInitSatate(zombie.states.stayState);
        };

        zombieArr.push(zombie);
    };

    function isZombieAtack(zombie) {
        return hero.positionX >= zombie.positionX - 20
          && hero.positionX <= zombie.positionX + zombie.currentState.width - 20;
    };

    function isCanKillHero(zombie) {
        return !hero.isImmortal && zombie.states.atackState.currentSpriteImg == 3 
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
        score += pointsForZombie;

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

    function makeZombieAtack(zombie) {
        zombie.currentState = zombie.states.atackState;
        zombie.isAtack = true;
    };

    let hero = {
        img: heroImg,
        positionX: canvas.width / 2,
        positionY: 355,
        leftDy: 1011,
        isPerformSingleAction: false,
        isDead: false,
        isLeft: false,
        isImmortal: false,
        isInvisible: false,
        kunaiCount: 10,
        health: 3,
        maxHealth: 5,
        states: {
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
            swordAtackState: {
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
            },
        },
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
            removeHeroMoveListeners();
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

        let secondTimer = setInterval(function() {
            if (game.isPaused) {
                clearInterval(secondTimer)
            } else if(!hero.isDead) {
                if (hero.currentState.currentSpriteImg >= hero.currentState.spriteCount - 1) {
                    clearInterval(secondTimer)
                    hero.isPerformSingleAction = false;
                    startMainTimer();

                    if (buttons.jump.isPressed) {
                        setOneHeroAction(hero.states.jumpState, heroSpeed);
                    } else if (buttons.swordAtack.isPressed) {
                        setOneHeroAction(hero.states.swordAtackState, heroSpeed);
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

    let zombieBoss = {
        img: zombieFemale,
        positionX: 0,
        startXPosition: 0,
        maxXPosition: 0,
        positionY: 205,
        isFastRun: false,
        isHurted: false,
        isAtack: false,
        isDead: false,
        health: 30,
        currentHealth: 0,
        states: {
            atackState: {
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
        },
    };

    function isZombieBossAtack() {
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
        let n = getRandomInt(1, 4);
        let newBonus = {};
        if (n === 3) {
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
        if (score >= pointsForZombie * randomBonusesTime 
          && score % (pointsForZombie * randomBonusesTime) === 0) {
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
                    hero.kunaiCount += 7;
                    randomBonuses.splice(randomBonuses.indexOf(bonus), 1)
                } else if (bonus.item === 'heart' && hero.health < hero.maxHealth) {
                    hero.health += 1
                    randomBonuses.splice(randomBonuses.indexOf(bonus), 1)
                }   
            }
        })
    };

    function checkZombieBossStatus() {
        if (isZombieBossAtack()) {
            zombieBoss.currentState = zombieBoss.states.atackState;
            zombieBoss.isAtack = true;
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
                if (hero.states.swordAtackState.isCurrent && isSwordInZombie(zombie)) {
                    makeZombieDead(zombie);
                } else if (hero.states.slideState.isCurrent &&  isSlideUnderZombie(zombie)) {
                    zombie.currentState = zombie.states.deadState;
                    zombie.isFell = true;
                    zombie.isDead = true;
                } else if (!hero.isImmortal && !hero.states.slideState.isCurrent && isZombieAtack(zombie)) {
                    if(hero.positionX < zombie.positionX + 30) {
                        zombie.isLeft = true;
                    } else if(hero.positionX > zombie.positionX + 30) {
                        zombie.isLeft = false;
                    }
                    if (isCanKillHero(zombie)) {
                        makeHeroDamage();
                    } else if(!hero.isImmortal) {
                        makeZombieAtack(zombie);
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
        setHeroMoveListeners();
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
           addZombieTimer = setTimeout(addZombie, getRandomInt(500, 2000));
        }, time);
    };

    function startZombieTimer() {
        zombieTimer = setInterval(function () {
        zombieArr.forEach((zombie) => {
            if (zombie.currentState.currentSpriteImg >= zombie.currentState.spriteCount -1) {
                if(zombie.isFell) {
                    makeZombieReincarnation(zombie, getRandomInt(1000, 2000));
                } else if(!zombie.isDead && !zombie.fakeDead) {
                    if(zombie.isAtack) {
                        zombie.isAtack = false;
                        zombie.states.atackState.currentSpriteImg = 0;
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
                    stopGame();
                } else {  
                    if(zombieBoss.isAtack) {
                        zombieBoss.isAtack = false;
                        zombieBoss.states.atackState.currentSpriteImg = 0;
                        zombieBoss.currentState = zombieBoss.states.runState;
                    }
                    zombieBoss.currentState.currentSpriteImg = 0;
                }
            } else {
                zombieBoss.currentState.currentSpriteImg += 1; 
            }
           if (isCanKillHero(zombieBoss) && isZombieBossAtack()) {
                makeHeroDamage();
            }
        }, time) 
    };

    let buttons = {
        run: {
            isPressed: false,
            codes: [39, 68],
        },
        runLeft: {
            isPressed: false,
            codes: [37, 65],
        },
        jump: {
            isPressed: false,
            codes: [38, 87],
        }, 
        slide: {
            isPressed: false,
            codes: [83, 98],
        },
        swordAtack: {
            isPressed: false,
            codes: [32],
        },
        throw: {
            isPressed: false,
            codes: [69],
        },
        pause: {
            codes: [27],
        }
    }

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

        lieZombieArr.forEach((zombie)=> {
            if(zombie.isFell || zombie.fakeDead) {
                zombie.timeout.pause();
            }
        });
    };

    function gamePauseKeydownCallback(e) {
        if (isButtonsPressed(buttons.pause, e.keyCode) && !hero.isDead && !zombieBoss.isDead) {
            let stateCopy;
            if (!game.isPaused) {
                stopGame();
                pauseLieZomnieTimer();
                if (hero.isImmortal) {
                    clearTimeout(immortalTimer);
                }
                if (hero.isPerformSingleAction) {
                    isOneAction = true;
                }
                stateCopy = Object.assign({}, hero.currentState);
                game.isPaused = true;
                drawMenubg();
            } else {
                startGame();
                resumeLieZomnieTimer();
                game.isPaused = false;
                if (isOneAction) {
                    setOneHeroAction(stateCopy, heroSpeed); 
                }
                if(hero.isImmortal ) {
                    makeHeroImortal(immortalTime);
                }
                isOneAction = false; 
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

    function drawText() {
        ctx.font = "32px serif";
        ctx.fillStyle = '#eeeeee';
        ctx.fillText(`Score: ${score}`, 1050, 63);
    }

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
        for (let i = 0; i <= 4; i++) {
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
        if (zombieBoss.isHurted) {
            ctx.globalAlpha = 0.5; 
        }
        ctx.drawImage(zombieBoss.img, zombieBoss.currentState.startX + (zombieBoss.currentState.width *
          zombieBoss.currentState.currentSpriteImg), zombieBoss.currentState.startY, 
          zombieBoss.currentState.width, zombieBoss.currentState.height, zombieBoss.positionX + 
          zombieBoss.currentState.dx, zombieBoss.positionY + zombieBoss.currentState.dy,
          zombieBoss.currentState.width, zombieBoss.currentState.height);

        if (ctx.globalAlpha !== 1) {
            ctx.globalAlpha = 1; 
        }
    };

    let lingrad = ctx.createLinearGradient(0,0,0, 130);
    lingrad.addColorStop(0, '#fff');
    lingrad.addColorStop(0.5, '#dd2108');
    lingrad.addColorStop(1, '#fff');

    function drawBossHealth() {
        ctx.lineWidth = 0.5;
        ctx.fillStyle = lingrad;
        ctx.fillRect(450, 40, (380 / zombieBoss.health) * zombieBoss.currentHealth, 25);
        ctx.strokeRect(450, 40, 380, 25);
    }

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

            bonus.positionX -= bgDx * 2;
        });
    };

    function drawMenubg() {
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.6; 
        ctx.fillRect(0, 0, 1280, 640);
        ctx.globalAlpha = 1;
    }

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
            }
        } else if (hero.states.jumpState.isCurrent && buttons.runLeft.isPressed) {
            if (hero.positionX > 5) {
                hero.positionX -= heroDx;       
            }
        } else if (hero.states.runState.isCurrent && !hero.isLeft) {
           if (hero.positionX + hero.currentState.width < canvas.width + 5) {
               hero.positionX += heroDx -bgDx * 2;      
           }
        } else if (hero.states.runState.isCurrent  && hero.isLeft) {
            if (hero.positionX > 5) {
                hero.positionX -= heroDx;       
            }
       } else if (hero.states.slideState.isCurrent && !hero.isLeft) {
           if (hero.positionX + hero.currentState.width < canvas.width) {
               hero.positionX += heroDx - bgDx * 2;       
           }
        } else if (hero.states.slideState.isCurrent  && hero.isLeft) {
            if (hero.positionX > 5) {
                hero.positionX -= heroDx;       
            }
        } else {
            if (hero.positionX > 5){
                hero.positionX -= bgDx * 2;
            }
       }
    }

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
        if (zombieBoss.isAtack) {
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
        drawKunai();
        drawZomieBoss();
        drawRandomBonuses();
        drawHero();
        drawZombies(zombieArr);
        drawZombies(lieZombieArr);
        drawText();
        drawHeroStatus();
        drawBossHealth();
        if (!game.isPaused) {
            changeZombiesPosition();
            changeHeroPosition();
            changeBgPosition();
            changeKunaiPosition();
            changeZombieBossPosition();
        }
        gameId = requestAnimationFrame(gameEngine);
	}

    function firstStartGame() {
        if (!gameId) {
            setCurrentHeroState(hero.states.stayState);
            zombieBoss.currentState = zombieBoss.states.runState;
            zombieBoss.currentHealth = zombieBoss.health;
            game.isStarted = true;
            startAllTimer();
            startAddZombieTimer(2000);
            gameEngine();
        }
    }

    function startGame() {
        if (!gameId) {
            startAllTimer();
            startAddZombieTimer(500);
            gameEngine();
        }
    }

    function stopGame() {
        if (gameId) {
            stopAllTimer();
            window.cancelAnimationFrame(gameId);
            gameId = undefined;
        }
    }

    function resetGame() {
        removeHeroMoveListeners();
        stopAllTimer();
    }

/// run listener callback
    function runKeydownCallback(e) {
        if (isButtonsPressed(buttons.run, e.keyCode)) {
            if ((hero.currentState !== hero.states.runState || hero.isLeft) 
              && !hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
                setCurrentHeroState(hero.states.runState);
            }
            hero.isLeft = false;
            buttons.run.isPressed = true;
        }
    };

    function runKeyupCallback(e) {
        if (isButtonsPressed(buttons.run, e.keyCode)) {
            if(!hero.isPerformSingleAction && !hero.isDead 
              && !buttons.runLeft.isPressed && !hero.isDead && !game.isPaused) {
                setCurrentHeroState(hero.states.stayState);
            }
            buttons.run.isPressed = false;
            if (buttons.runLeft.isPressed) {
                hero.isLeft = true;
            }
        }
    };

/// run left listener callback
    function runLeftKeydownCallback(e) {
        if (isButtonsPressed(buttons.runLeft, e.keyCode)) {
            if((hero.currentState !== hero.states.runState || !hero.isLeft) 
              && !hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
                setCurrentHeroState(hero.states.runState);
            }
            hero.isLeft = true;
            buttons.runLeft.isPressed = true;
        }
    };

    function runLeftKeyupCallback(e) {
        if (isButtonsPressed(buttons.runLeft, e.keyCode)) {
            if(!hero.isPerformSingleAction && !hero.isDead 
              && !buttons.run.isPressed && !game.isPaused) {
                setCurrentHeroState(hero.states.stayState);
            }
            if (buttons.run.isPressed) {
                hero.isLeft = false;
            }
            buttons.runLeft.isPressed = false;
        }
    };

/// jump listener callback
    function jumKeydownCallback(e) {
        if (isButtonsPressed(buttons.jump, e.keyCode)) {
            if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
                setOneHeroAction(hero.states.jumpState, 40);
            }
            buttons.jump.isPressed = true;
        }
    };

    function jumpKeyupCallback(e) {
        if (isButtonsPressed(buttons.jump, e.keyCode)) {
            buttons.jump.isPressed = false;
        }
    };

/// slide listener callback
    function slideKeydownCallback(e) {
        if (isButtonsPressed(buttons.slide, e.keyCode)) {
            if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused && !slideTimer) { 
                slideTimer = true;
                setOneHeroAction(hero.states.slideState, 40);
                setTimeout(()=> slideTimer = false, 1500)
            }
            buttons.slide.isPressed = true;
        }
    };

    function slideKeyupCallback(e) {
        if (isButtonsPressed(buttons.slide, e.keyCode)) {
            buttons.slide.isPressed = false;
        }
    };

/// sword atack listener callback
    function swordAtackKeydownCallback(e) {
        if (isButtonsPressed(buttons.swordAtack, e.keyCode)) {
            if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
                setOneHeroAction(hero.states.swordAtackState, 40);   
            }
            buttons.swordAtack.isPressed = true;
        }
    };

    function swordAtackKeyupCallback(e) {
        if (isButtonsPressed(buttons.swordAtack, e.keyCode)) {
            buttons.swordAtack.isPressed = false;
        }
    };

/// throw atack listener callback
    function throwKeydownCallback(e) {
        if (isButtonsPressed(buttons.throw, e.keyCode)) {
            if (!hero.isPerformSingleAction && !hero.isDead && hero.kunaiCount > 0 && !game.isPaused) { 
                setOneHeroAction(hero.states.throwState, 40);   
            }
            buttons.throw.isPressed = true;
        }
    }

    function throwKeyupCallback(e) {
        if (isButtonsPressed(buttons.throw, e.keyCode)) {
            buttons.throw.isPressed = false;
        }
    };

    function setHeroMoveListeners() {
        window.addEventListener('keydown', runKeydownCallback);
        window.addEventListener('keydown', slideKeydownCallback);
        window.addEventListener('keydown', jumKeydownCallback);
        window.addEventListener('keydown', swordAtackKeydownCallback);
        window.addEventListener('keydown', throwKeydownCallback);
        window.addEventListener('keydown', runLeftKeydownCallback);
        window.addEventListener('keydown', gamePauseKeydownCallback);
        window.addEventListener('keyup', runKeyupCallback);
        window.addEventListener('keyup', jumpKeyupCallback);
        window.addEventListener('keyup', slideKeyupCallback);
        window.addEventListener('keyup', swordAtackKeyupCallback);
        window.addEventListener('keyup', throwKeyupCallback);
        window.addEventListener('keyup', runLeftKeyupCallback); 
    };

    function removeHeroMoveListeners() {
        window.removeEventListener('keydown', runKeydownCallback);
        window.removeEventListener('keydown', slideKeydownCallback);
        window.removeEventListener('keydown', jumKeydownCallback);
        window.removeEventListener('keydown', swordAtackKeydownCallback);
        window.removeEventListener('keydown', throwKeydownCallback);
        window.removeEventListener('keydown', runLeftKeydownCallback);
        window.removeEventListener('keyup', jumpKeyupCallback);
        window.removeEventListener('keyup', slideKeyupCallback);
        window.removeEventListener('keyup', swordAtackKeyupCallback);
        window.removeEventListener('keyup', throwKeyupCallback);
        window.removeEventListener('keyup', runLeftKeyupCallback);
    };

    function stopAllTimer() {
        clearInterval(mainTimer);
        clearInterval(zombieTimer);
        clearInterval(zombieBossTimer);
        clearInterval(checkTimer);
        clearTimeout(addZombieTimer);
    };

    function startAllTimer() {
        startMainTimer();
        startZombieTimer();
        checkAllStatuses();
        startBossZombieTimer(bossZombieSpeed);
    };

    let startTimer = setInterval(function() {
        if(heroLoad && zombieMaleLoad && zombieFemaleLoad && kunaiLoad && backgrounLoad && roadLoad) {
           clearInterval(startTimer)
           firstStartGame();
        }
    }, 50);
};

draw();
