import {settings, getRandomInt, Timeout} from  './settings'; 
import {setBossStates, setZombiesStates} from  './drawStates'; 
import {zombieFemale, zombieMale, bossDeadSound, zombieAttackSound, kunaiInZombieSound,
  zombieReincarnationSound, winSound, zombieFellSound, playTheme} from  './sources';
import {removeHeroKeydownListeners, removeHeroKeyupListeners} from  './buttons';
import {ObjectsSet} from  './objectsSet'; 

export class ZombieBoss {
    constructor() {
        this.img = zombieFemale,
        this.startPositionX = -220;
        this.health = 15 + settings.difficulty * 5;
        this.positionX = 0;
        this.startXPosition = 0;
        this.maxXPosition = 0;
        this.currentHealth = 0;
        this.positionY = 205;
        this.isFastRun = false;
        this.isHurted = false;
        this.isAttack = false;
        this.isDead = false;
        this.timer = null;
        this.states = setBossStates();
    };

    changePosition(game, hero, zombiesArr) {
        if(!game.isStartDelayEnded) {
            this.startPositionX += 1.1; 
        };

        if (this.isAttack) {
            this.positionX -= game.bgDx * 2;
        } else if (this.isFastRun && this.positionX >= this.maxXPosition) {
            clearInterval(this.timer);
            this.startTimer(settings.bossSpeed, game, hero, zombiesArr);
            this.isFastRun = false;
        } else if (this.positionX < this.maxXPosition) {
            if (!this.isFastRun) {
                clearInterval(this.timer);
                this.startTimer(settings.bossSpeed - 30, game, hero, zombiesArr);
                this.isFastRun = true;  
            };
            this.positionX += 1;
        };
    };

    isZombieBossAttack(hero) {
        return hero.positionX < this.positionX + this.currentState.width - 70
          && !hero.isImmortal;
    };

    isCanKillHero(hero) {
        return !hero.isImmortal && this.states.attackState.currentSpriteImg == 3 
          && hero.currentState !== hero.states.deadState;
    };

    checkStatus(hero) {
        if (this.isZombieBossAttack(hero)) {
            this.currentState = this.states.attackState;
            this.isAttack = true;
        };
    
        if (this.currentHealth === 0 && this.currentState !== this.states.deadState) {
            if(this.currentState.currentSpriteImg === 1) {
                bossDeadSound.play();
            }
            this.currentState = this.states.deadState;
        };
    };

    startTimer(time, game, hero, zombiesArr) {
        this.timer = setInterval(() => {
            if (this.currentState.currentSpriteImg >= this.currentState.spriteCount -1) {
                if(this.currentState === this.states.deadState) {
                    this.isDead = true;
                    game.isWin = true;
                    game.score += 1500;
                    game.isPaused = true;
                    game.isEnded = true;
                    removeHeroKeydownListeners();
                    removeHeroKeyupListeners();
                    playTheme.stop();
                    winSound.play();
                } else {  
                    if(this.isAttack) {
                        this.isAttack = false;
                        this.states.attackState.currentSpriteImg = 0;
                        this.currentState = this.states.runState;
                    }
                    this.currentState.currentSpriteImg = 0;
                }
            } else {
                this.currentState.currentSpriteImg += 1; 
            }
           if (this.isCanKillHero(hero) && this.isZombieBossAttack(hero)) {
                hero.makeHeroDamage(zombiesArr, game);
            }
        }, time); 
    };
};

export class ZombiesSet extends ObjectsSet {
    constructor() {
        super();
        this.zombiesTimer = null;
    };

    addNewZombie(x, y, game, hero) {
        let num = getRandomInt(1, 6);
        let zombie = new Zombie(zombieMale, x, y);
        if (num === 5) {
            zombie.fakeDead = true;
            zombie.states.deadState.currentSpriteImg = zombie.states.deadState.spriteCount - 1;
            zombie.setInitSatate(zombie.states.deadState, game, hero);
        } else {
            zombie.setInitSatate(zombie.states.stayState, game, hero);
        };
    
        this.add(zombie);
    };

    changeZombiesPosition(bgDx) {
        this.data.forEach((zombie) => {
            if ((zombie.positionX + zombie.currentState.width  <= 0 && !zombie.isDead) 
              || (zombie.positionX  > canvas.width && !zombie.isLeft)) {
                this.remove(zombie);
            }
            if (!zombie.isLeft) {
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
    };

    changeLieZombiesPozition(bgDx) {
        this.data.forEach((zombie) => {
            zombie.positionX -= bgDx * 2;
        });      
    };

    isZombieAttack(zombie, hero) {
        return hero.positionX >= zombie.positionX - 20
          && hero.positionX <= zombie.positionX + zombie.currentState.width - 20
          && zombie.currentState !== zombie.states.deadState;
    };

    isCanKillHero(zombie, hero) {
        return !hero.isImmortal && zombie.states.attackState.currentSpriteImg == 3 
          && hero.currentState !== hero.states.deadState;
    };

    isSwordInZombie(zombie, hero) {
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

    isFakeDeadUp(zombie, hero) {
        return zombie.fakeDead 
          && zombie.positionX + zombie.currentState.width > hero.positionX - settings.zombieFeelHeroDistance
          && zombie.positionX < hero.positionX + hero.currentState.width + settings.zombieFeelHeroDistance;
    };

    isSlideUnderZombie(zombie, hero) {
        return hero.positionX >= zombie.positionX - zombie.currentState.width / 2 + 60
          && hero.positionX <= zombie.positionX + zombie.currentState.width;
    };

    checkZombiesStatus(hero, game, lieZombiesArr) {

        this.data.forEach((zombie) => {
            if(!zombie.isDead && !zombie.isFell) {
                if (hero.states.swordAttackState.isCurrent && this.isSwordInZombie(zombie, hero)) {
                    zombie.makeDead(this, game);
                } else if (hero.states.slideState.isCurrent &&  this.isSlideUnderZombie(zombie, hero)) {
                    zombie.currentState = zombie.states.deadState;
                    zombieFellSound.play();
                    zombie.isFell = true;
                    zombie.isDead = true;
                } else if (!hero.isImmortal && !hero.states.slideState.isCurrent && this.isZombieAttack(zombie, hero)) {
                    if(hero.positionX < zombie.positionX + 30) {
                        zombie.isLeft = true;
                    } else if(hero.positionX > zombie.positionX + 30) {
                        zombie.isLeft = false;
                    }

                    if (this.isCanKillHero(zombie, hero)) {
                        hero.makeHeroDamage(this, game);
                    } else if(!hero.isImmortal) {
                        zombie.makeAttack();
                    };
                };

                if (this.isFakeDeadUp(zombie, hero)) {
                    zombie.makeReincarnation(getRandomInt(1000, 2000), this, hero, lieZombiesArr);
                };
            };
        });
    };

    pauseLieZomnieTimer() {
        this.data.forEach((zombie) => {
            if((zombie.isDead && !zombie.isFell)) {
                zombie.timeout.pause();
            };
        });
    };

    pauseFakeDeadZomniesTimer() {
        this.data.forEach((zombie) => {
            if(zombie.isFell || zombie.fakeDead) {
                zombie.timeout.pause();
            };
        });
    };

    resumeLieZomniesTimer() {
        this.data.forEach((zombie) => {
            if((zombie.isDead && !zombie.isFell)) {
                zombie.timeout.resume();
            };
        });
    };

    resumeFakeDeadZomniesTimer() {
        this.data.forEach((zombie) => {
            if(zombie.isFell || zombie.fakeDead) {
                zombie.timeout.resume();
            };
        });
    };

    startZombieTimer(hero, lieZombiesArr) {
        this.zombiesTimer = setInterval(() => {
            this.data.forEach((zombie) => {
                if (zombie.currentState.currentSpriteImg >= zombie.currentState.spriteCount -1) {
                    if(zombie.isFell) {
                        zombie.makeReincarnation(getRandomInt(1000, 2000), this, hero, lieZombiesArr);
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
        }, settings.zombieSpeed); 
    };
};

class Zombie {
    constructor(image, x, y) {
        this.img = image;
        this.positionX = x;
        this.positionY = y;
        this.isDead = false;
        this.isAttack = false;
        this.isFell = false;
        this.fakeDead = false;
        this.isLeft = true;
        this.leftDy = 628;
        this.timeout = null;
        this.dx = 1;
        this.states = setZombiesStates();
           
    };

    setInitSatate(state, game, hero) {
        this.currentState = state;
        this.changeRandomSatate(game, hero);
    };

    changeRandomSatate(game, hero) {
        setInterval(() => {
            if (!this.isDead && !this.fakeDead && !game.isPaused) {
                if (hero.positionX - this.positionX < settings.zombieFeelHeroDistance 
                  && this.positionX - hero.positionX < settings.zombieFeelHeroDistance
                  && !hero.isImmortal) {
                    this.currentState = this.states.runState;
                    if(this.dx !== 2) {
                        this.dx = 2;  
                    };
                } else {
                    let randNum = getRandomInt(1, 4);
                    if(this.dx !== 1) {
                        this.dx = 1;  
                    };
                    if(randNum === 1) {
                        this.currentState = this.states.runState;
                    } else {
                        this.currentState = this.states.stayState;
                    }; 
                }; 
            };
        }, getRandomInt(400, 800));
    };

    makeAttack() {
        this.currentState = this.states.attackState;
        this.isAttack = true;
    };

    makeDead(zombiesArr, game) {
        zombieAttackSound.play();
        kunaiInZombieSound.resetTime();
        kunaiInZombieSound.play();
        this.isDead = true;
        this.currentState = this.states.deadState;
        game.score += settings.pointsForZombie;
    
        this.timeout = new Timeout(() => {
            zombiesArr.remove(this);
        }, settings.deadZombiesTime);
        this.timeout.init();
    };

    makeReincarnation(time, zombiesArr, hero, lieZombiesArr) {

        lieZombiesArr.add(this);
        zombiesArr.remove(this);

        function reincarnation() {
            if (this.states.deadState.currentSpriteImg === 0) {
                this.isFell = false;
                this.isDead = false;
                this.fakeDead = false;
                this.riseUp = false;
                if(this.positionX < hero.positionX) {
                    this.isLeft = false;
                } else {
                    this.isLeft = true;
                }
                this.currentState = this.states.stayState;
                zombiesArr.add(this);
                lieZombiesArr.remove(this);
            } else {
                if(this.states.deadState.currentSpriteImg === this.states.deadState.spriteCount - 1) {
                    zombieReincarnationSound.play();
                }
                this.currentState.currentSpriteImg -= 1;
                this.timeout = new Timeout(reincarnationWrapper, 100);
                this.timeout.init();
            }
        };

        let reincarnationWrapper = reincarnation.bind(this);
        this.timeout = new Timeout(reincarnationWrapper, time);
        this.timeout.init();
    };
};
