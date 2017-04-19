import {swordSound} from  './sources';

export function isButtonsPressed(btn, code) {
    return btn.codes.some((item => item === code))
};

export let buttons = {
    run: {
        codes: [39, 68],
        isPressed: false,
    },
    runLeft: {
        codes: [37, 65],
        isPressed: false,
    },
    jump: {
        codes: [38, 87],
        isPressed: false,
    }, 
    slide: {
        codes: [83, 98],
        isPressed: false,
    },
    swordAttack: {
        codes: [32],
        isPressed: false,
    },
    throw: {
        codes: [69],
        isPressed: false,
    },
    pause: {
        codes: [27],
        isPressed: false,
    }
};


function allKeydownCallback(e, hero, game, kunaiArr) {
    if (isButtonsPressed(buttons.run, e.keyCode)) {
        if ((hero.currentState !== hero.states.runState || hero.isLeft) 
          && !hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            hero.setCurrentState(hero.states.runState);
        };
        hero.isLeft = false;
        buttons.run.isPressed = true;
    } else if (isButtonsPressed(buttons.runLeft, e.keyCode)) {
        if((hero.currentState !== hero.states.runState || !hero.isLeft) 
          && !hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            hero.setCurrentState(hero.states.runState);
        };
        hero.isLeft = true;
        buttons.runLeft.isPressed = true;
    } else if (isButtonsPressed(buttons.jump, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            hero.setOneAction(hero.states.jumpState, 40, game, kunaiArr);
        };
        buttons.jump.isPressed = true;
    } else if (isButtonsPressed(buttons.slide, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused && !hero.slideTimer) { 
            hero.slideTimer = true;
            hero.setOneAction(hero.states.slideState, 40, game, kunaiArr);
            setTimeout(()=> hero.slideTimer = false, 1500)
        };
        buttons.slide.isPressed = true;
    } else if (isButtonsPressed(buttons.swordAttack, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && !game.isPaused) { 
            hero.setOneAction(hero.states.swordAttackState, 40, game, kunaiArr);
            swordSound.resetTime()
            swordSound.play(); 
        }
        buttons.swordAttack.isPressed = true;
    } else if (isButtonsPressed(buttons.throw, e.keyCode)) {
        if (!hero.isPerformSingleAction && !hero.isDead && hero.kunaiCount > 0 && !game.isPaused) { 
            hero.setOneAction(hero.states.throwState, 40, game, kunaiArr);  
        }
        buttons.throw.isPressed = true;
    };
};

function allKeyupCallback(e, hero, game) {
    if (isButtonsPressed(buttons.run, e.keyCode)) {
        if((!hero.isPerformSingleAction  && !hero.isDead
          && !buttons.runLeft.isPressed  && !game.isPaused))  {
            hero.setCurrentState(hero.states.stayState);
        };

        buttons.run.isPressed = false;
        if (buttons.runLeft.isPressed && !game.isPaused) {
            hero.isLeft = true;
        };
    } else if (isButtonsPressed(buttons.runLeft, e.keyCode)) {
        if(!hero.isPerformSingleAction && !hero.isDead 
          && !buttons.run.isPressed && !game.isPaused) {
            hero.setCurrentState(hero.states.stayState);
        };
        if (buttons.run.isPressed && !game.isPaused) {
            hero.isLeft = false;
        };
        buttons.runLeft.isPressed = false;
    } else if (isButtonsPressed(buttons.jump, e.keyCode)) {
        buttons.jump.isPressed = false;
    } else if (isButtonsPressed(buttons.slide, e.keyCode)) {
        buttons.slide.isPressed = false;
    } else if (isButtonsPressed(buttons.swordAttack, e.keyCode)) {
        buttons.swordAttack.isPressed = false;
    } else if (isButtonsPressed(buttons.throw, e.keyCode)) {
        buttons.throw.isPressed = false;
    };
};

export function setHeroKeydownListeners(game, hero, kunaiArr) {
    document.onkeydown = function(e) {
        allKeydownCallback(e, hero, game, kunaiArr)
    };
};

export function setHeroKeyupListeners(game, hero) {
    document.onkeyup = function(e) {
        allKeyupCallback(e, hero, game)
    };
};

export function removeHeroKeydownListeners() {
    document.onkeydown = undefined;
};

export function removeHeroKeyupListeners() {
    document.onkeyup = undefined;
};
