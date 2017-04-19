import {settings} from  './settings'; 
import {heroStates} from  './drawStates'; 
import {buttons, setHeroKeyupListeners, setHeroKeydownListeners,
  removeHeroKeydownListeners, removeHeroKeyupListeners} from  "./buttons"; 
import {heroImg, throwSound, swordSound, heroHurted, 
  heroDeadSound, playTheme, loseSound} from  "./sources"; 

export class Hero {
    constructor() {
        this.img = heroImg;
        this.positionX = canvas.width / 2;
        this.positionY = 355;
        this.leftDy = 1011;
        this.kunaiCount = 10 - settings.difficulty * 2;
        this.health = 3;
        this.maxHealth = 5 - settings.difficulty * 2;
        this.immortalTime = settings.immortalTime;
        this.isPerformSingleAction = false;
        this.isDead = false;
        this.isLeft = false;
        this.isImmortal = false;
        this.isInvisible = false;
        this.isOneAction = false;
        this.immortalTimer = null;
        this.oneActionTimer = null;
        this.stateCopy = null;
        this.slideTimer = null;
        this.mainTimer = null;
        this.states = Object.assign({}, heroStates);
    };

    setCurrentState(newState) {
        for (let state in this.states) {
            this.states[state].isCurrent = false;
            if (this.states[state] === newState) {
                newState.currentSpriteImg = 0;
                newState.isCurrent = true;
                this.currentState = newState; 
            };
        };
    };

    throwKunai(kunaiArr) {
        throwSound.resetTime();
        throwSound.play()
        kunaiArr.addKunai(this);
        this.kunaiCount -= 1;
    };

    setOneAction(state, time, game, kunaiArr) {
        clearInterval(this.mainTimer);
        this.isPerformSingleAction = true;
        this.setCurrentState(state);

        this.oneActionTimer = setInterval(() => {
            if (game.isPaused) {
                clearInterval(this.oneActionTimer)
            } else if(!this.isDead) {
                if (this.currentState.currentSpriteImg >= this.currentState.spriteCount - 1) {
                    clearInterval(this.oneActionTimer)
                    this.isPerformSingleAction = false;
                    this.startMainTimer();
                    setHeroKeydownListeners(game, this, kunaiArr);
                    setHeroKeyupListeners(game, this);

                    if (buttons.jump.isPressed) {
                        this.setOneAction(this.states.jumpState, settings.heroSpeed, game, kunaiArr);
                    } else if (buttons.swordAttack.isPressed) {
                        this.setOneAction(this.states.swordAttackState, settings.heroSpeed, game, kunaiArr);
                        swordSound.resetTime()
                        swordSound.play(); 
                    } else if (buttons.throw.isPressed && this.kunaiCount > 0) {
                        this.setOneAction(this.states.throwState, settings.heroSpeed, game, kunaiArr);
                    } else if (buttons.run.isPressed || buttons.runLeft.isPressed) {
                        this.setCurrentState(this.states.runState)
                    } else {
                        this.setCurrentState(this.states.stayState);
                    }
                } else {
                    if (this.currentState.currentSpriteImg == 2 
                      && this.states.throwState === this.currentState 
                      && this.kunaiCount > 0 ) {
                        this.throwKunai(kunaiArr)
                    }
                    this.currentState.currentSpriteImg += 1;
                }
            };
        }, time);
    };

    makeHeroDamage(zombiesArr, game) {
        this.health -= 1;
        if (this.health <= 0) {
            this.makeHeroDead(game);
        } else {
            this.isImmortal = true;
            this.isInvisible = true;
            heroHurted.play();
            this.makeHeroImortal(this.immortalTime, zombiesArr)
        } 
    };

    makeHeroImortal(time, zombiesArr) {
        function immortalTimerFunction() {
            this.isInvisible = !this.isInvisible;
            if (this.immortalTime <= 0) {
                this.immortalTime = settings.immortalTime;
                this.isImmortal = false;
                zombiesArr.data.forEach((zombie) => {
                    if (!zombie.isDead && zombie.isLeft 
                      && this.positionX - zombie.positionX < settings.zombieFeelHeroDistance
                      && this.positionX - zombie.positionX > 0) {
                        zombie.isLeft = false;
                    } else if(!zombie.isDead && !zombie.isLeft
                      && zombie.positionX - this.positionX < settings.zombieFeelHeroDistance
                      && zombie.positionX - this.positionX > 0) {
                        zombie.isLeft = true;
                    }
                });
                clearTimeout(this.immortalTimer);
            } else {
                this.immortalTime -= 5;
                this.immortalTimer = setTimeout(immortalTimerWrapper, this.immortalTime);    
            }
        }
        this.immortalTimer = setTimeout(immortalTimerFunction, time);
        let immortalTimerWrapper = immortalTimerFunction.bind(this)
    };

    makeHeroDead(game) {
        this.isDead = true;
        this.setCurrentState(this.states.deadState);
        clearInterval(this.mainTimer);
        heroDeadSound.play();
        let heroDeadTimer = setInterval(() => {
            removeHeroKeydownListeners();
            removeHeroKeyupListeners();
            if (this.currentState.currentSpriteImg >= this.currentState.spriteCount - 1) {
                clearInterval(heroDeadTimer);
                game.isPaused = true;
                game.isEnded = true;
                playTheme.stop();
                loseSound.play();
            } else {
                this.currentState.currentSpriteImg += 1;
            }
        }, settings.heroDeadSpeed);
    };

    changePosition(bgDx) {
        if (this.states.jumpState.isCurrent && buttons.run.isPressed) {
            if (this.positionX + this.currentState.width < canvas.width + 10) {
                this.positionX += settings.heroDx - bgDx * 2;       
            };
        } else if (this.states.jumpState.isCurrent && buttons.runLeft.isPressed) {
            if (this.positionX > 5) {
                this.positionX -= settings.heroDx;       
            };
        } else if (this.states.runState.isCurrent && !this.isLeft) {
           if (this.positionX + this.currentState.width < canvas.width + 5) {
               this.positionX += settings.heroDx - bgDx * 2;      
           };
        } else if (this.states.runState.isCurrent  && this.isLeft) {
            if (this.positionX > 5) {
                this.positionX -= settings.heroDx;       
            };
       } else if (this.states.slideState.isCurrent && !this.isLeft) {
           if (this.positionX + this.currentState.width < canvas.width) {
               this.positionX += settings.heroDx - bgDx * 2;       
           };
        } else if (this.states.slideState.isCurrent  && this.isLeft) {
            if (this.positionX > 5) {
                this.positionX -= settings.heroDx;       
            };
        } else {
            if (this.positionX > 5){
                this.positionX -= bgDx * 2;
            };
       };
    };

    startMainTimer() {
        this.mainTimer = setInterval(() => {
            if (this.currentState.currentSpriteImg >= this.currentState.spriteCount - 1) {
                this.currentState.currentSpriteImg = 0;
            } else {
                this.currentState.currentSpriteImg += 1; 
            }
        }, settings.heroSpeed) 
    };
};
