import {heroStates, setZombiesStates, bossStates} from  './drawStates'; 
import {settings, getRandomInt, Timeout, Game} from  './settings'; 
import {Hero} from  './hero'; 
import * as menu from './menu';
import * as draw from './drawGame';
import {BonusesSet, KunaiSet} from  './objectsSet';
import {ZombieBoss, ZombiesSet} from  './zombies';
import {pauseMenuButtons, controlMenuButtons, mainMenuButtons} from  './drawStates';
import {promisesArr, background, road, playTheme, mainMenuTheme, pauseSound,clickMenuSound} from  './sources';
import {buttons, setHeroKeyupListeners, setHeroKeydownListeners,
  removeHeroKeydownListeners, removeHeroKeyupListeners, isButtonsPressed} from  './buttons';

let kunaiArr = new KunaiSet();
let game = new Game();
let hero = new Hero();
let zombieBoss = new ZombieBoss();
let randomBonuses = new BonusesSet();
let zombiesArr = new ZombiesSet();
let lieZombiesArr = new ZombiesSet();

function checkAllStatuses() {
    zombiesArr.checkZombiesStatus(hero, game, lieZombiesArr);
    zombieBoss.checkStatus(hero);
    randomBonuses.checkStatus(hero);
    kunaiArr.checkStatus(zombiesArr, zombieBoss, hero, game);
    randomBonuses.checkOpportunityToCreateBonus(hero, game);

    if (game.isPaused && game.isEnded && hero.mainTimer) {
        zombiesArr.pauseLieZomnieTimer();
        lieZombiesArr.pauseFakeDeadZomniesTimer();
        stopAllTimer()
        addMenuListeners(menu.makeReplayEndButtonHovered, replayEndClickCallback);
    };
};

function startAddZombieTimer(time) {
    game.addZombieTimer = setTimeout(function addZombie() {
       zombiesArr.addNewZombie(draw.canvas.width + 40, 333, game, hero);
       game.addZombieTimer = setTimeout(addZombie, getRandomInt(1000 - settings.difficulty * 400, 2500 - settings.difficulty * 700));
    }, time);
};

function changeBgPosition() {
    if (zombieBoss.currentState === zombieBoss.states.deadState) {
        game.bgDx = 0;
    };

    if (game.bgPosition >= draw.canvas.width) {
        game.bgPosition = game.bgDx;
    } else {
        game.bgPosition += game.bgDx;    
    };

    if (game.roadPosition >= draw.canvas.width) {
        game.roadPosition = game.bgDx * 2;
    } else {
        game.roadPosition += game.bgDx * 2;    
    };
};

function gameEngine() {
    checkAllStatuses()
    draw.clearCanvas();
    draw.drawBg(background, game.bgPosition);
    draw.drawRoad(road, game.roadPosition);
    if(!game.isStartDelayEnded) {
        draw.drawWinConditions(game);
    };
    draw.drawKunai(kunaiArr);
    draw.drawBossHealth(zombieBoss);
    draw.drawRandomBonuses(game, randomBonuses);
    draw.drawZomieBoss(game, zombieBoss);
    draw.drawHero(hero);
    draw.drawZombies(zombiesArr);
    draw.drawZombies(lieZombiesArr);
    draw.drawScore(game);
    draw.drawHeroStatus(hero);

    if (!game.isPaused && game.isStarted ) {
        if (game.isStartDelayEnded) {
           zombiesArr.changeZombiesPosition(game.bgDx);
           lieZombiesArr.changeLieZombiesPozition(game.bgDx);
           hero.changePosition(game.bgDx);
           changeBgPosition();
           kunaiArr.changePosition();
        }
        zombieBoss.changePosition(game, hero, zombiesArr);
    }

    if (game.isPaused) {
        draw.drawMenubg();
        if (game.isEnded) {
            draw.drawEndMenu(game);
        } else {
            draw.drawPauseMenu();
        };
    };

    game.gameId = requestAnimationFrame(gameEngine);
};

function mainMenuEngine() {
    draw.clearCanvas();
    draw.drawBg(background, game.bgPosition);
    draw.drawRoad(road, game.roadPosition);
    draw.drawMenubg();

    if (game.isShowMainMenu) {
        draw.drawMainMenu();
    };

    if (game.isShowDifficultyMenu){
        draw.drawDifficultyMenu();
    };

    if (game.isShowControl) {
        draw.drawControlMenu();
    };

    game.menuId = requestAnimationFrame(mainMenuEngine);
};

function startGame() {
    newGameReset();
    hero.setCurrentState(hero.states.stayState);
    gameEngine();
    hero.startMainTimer();
    zombieBoss.startTimer(settings.bossSpeed, game, hero, zombiesArr);
    game.startDelay = setInterval(() => {
        game.isStarted = true;
        playTheme.play();

        if (game.delayTime > 0){
            game.delayTime -= 1;
        } else {
            zombiesArr.startZombieTimer(hero, lieZombiesArr);
            startAddZombieTimer(500);
            game.isStartDelayEnded = true;
            zombieBoss.positionX = zombieBoss.startPositionX;
            zombieBoss.maxXPosition = zombieBoss.startPositionX;
            setHeroKeydownListeners(game, hero, kunaiArr);
            setHeroKeyupListeners(game, hero);
            clearInterval(game.startDelay);
        };
    }, 1000); 
};

function stopAllTimer() {
    clearInterval(hero.mainTimer);
    clearInterval(zombiesArr.zombiesTimer);
    clearInterval(zombieBoss.timer);
    clearInterval(hero.oneActionTimer);
    clearTimeout(game.addZombieTimer);
};

function startAllTimer() {
    hero.startMainTimer();
    zombiesArr.startZombieTimer(hero, lieZombiesArr);
    zombieBoss.startTimer(settings.bossSpeed, game, hero, zombiesArr);
};

function resumeGame() {
    if (game.gameId) {
        startAllTimer();
        setHeroKeydownListeners(game, hero, kunaiArr);
        startAddZombieTimer(500);
    };
};

function pauseGame() {
    if (game.gameId) {
        stopAllTimer();
        removeHeroKeydownListeners();
    };
};

function stopGame() {
    zombiesArr.pauseLieZomnieTimer();
    lieZombiesArr.pauseFakeDeadZomniesTimer();
    stopAllTimer();
    addMenuListeners(menu.makeReplayEndButtonHovered, replayEndClickCallback);
    game.isPaused = true;
    game.isEnded = true;
};

function resetGame() {
    playTheme.resetTime();
    removeHeroKeydownListeners();
    removeHeroKeyupListeners();
    stopAllTimer();
    cancelAnimationFrame(game.gameId);
    startGame();
};

function newGameReset() {
    hero = new Hero();
    zombieBoss = new ZombieBoss();
    kunaiArr = new KunaiSet();
    randomBonuses = new BonusesSet();
    zombiesArr = new ZombiesSet();
    lieZombiesArr = new ZombiesSet();
    game = new Game();

    if (hero.health > hero.maxHealth) {
        hero.health = hero.maxHealth;
    }
    zombieBoss.currentState = zombieBoss.states.runState;
    zombieBoss.currentHealth = zombieBoss.health;

    for (let button in buttons) {
        buttons[button].isPressed = false;
    }
};

function goTomeinMenu(hideMenu, buttons, hoverListener, clickListener) {
    menu.resetHoverHoverMenuButtons(mainMenuButtons);
    removeMenuListeners(hoverListener, clickListener);
    game[hideMenu] = false;
    game.isShowMainMenu = true;
    addMenuListeners(menu.makeMainMenuHovered, mainMenuClickCallback);
};

function goFromeMenu(newMenu, buttons, newHoverListener, newClickListener) {
    menu.resetHoverHoverMenuButtons(buttons);
    removeMenuListeners(menu.makeMainMenuHovered, mainMenuClickCallback);
    game.isShowMainMenu = false;
    game[newMenu] = true;
    addMenuListeners(newHoverListener, newClickListener);
    clickMenuSound.play();
};
    
function mainMenuClickCallback(e) {
    if (menu.isButtonHovered(e,mainMenuButtons.play, mainMenuButtons.settings)) {
        menu.resetHoverHoverMenuButtons(pauseMenuButtons);
        removeMenuListeners(menu.makeMainMenuHovered, mainMenuClickCallback);
        cancelAnimationFrame(game.menuId);
        startGame();
        clickMenuSound.play();
        mainMenuTheme.stop();
    } else if (menu.isButtonHovered(e, mainMenuButtons.difficulty, mainMenuButtons.settings))  {
        goFromeMenu('isShowDifficultyMenu', pauseMenuButtons,
          menu.makeDifficultyMenuHovered, difficultyMenuClickCallback);
    } else if (menu.isButtonHovered(e, mainMenuButtons.control, mainMenuButtons.settings)) {
        goFromeMenu('isShowControl', pauseMenuButtons, menu.makeControlMenuHovered, controlMenuClickCallback)
    };
};


function controlMenuClickCallback(e) {
    if (menu.isButtonHovered(e, controlMenuButtons.mainMenuControl, controlMenuButtons.settings)) {
        goTomeinMenu ('isShowControl', mainMenuButtons,
        menu.makeControlMenuHovered, controlMenuClickCallback);
        pauseSound.play();
    } 
};

function difficultyMenuClickCallback(e) {
    if (menu.isButtonHovered(e, mainMenuButtons.babyMode, mainMenuButtons.settings)) {
        menu.setActiveDifficulty(mainMenuButtons.babyMode);
        settings.difficulty = 0;
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        menu.makeDifficultyMenuHovered, difficultyMenuClickCallback);
        clickMenuSound.play();
    } else if (menu.isButtonHovered(e, mainMenuButtons.normal, mainMenuButtons.settings)){
        menu.setActiveDifficulty(mainMenuButtons.normal);
        settings.difficulty = 1;
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        menu.makeDifficultyMenuHovered, difficultyMenuClickCallback);
        clickMenuSound.play();
    } else if (menu.isButtonHovered(e, mainMenuButtons.hellMode, mainMenuButtons.settings)) {
        menu.setActiveDifficulty(mainMenuButtons.hellMode);
        settings.difficulty = 2;
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        menu.makeDifficultyMenuHovered, difficultyMenuClickCallback);
        clickMenuSound.play();
    } else if (menu.isButtonHovered(e, mainMenuButtons.mainMenu, mainMenuButtons.settings)) {
        goTomeinMenu ('isShowDifficultyMenu', mainMenuButtons,
        menu.makeDifficultyMenuHovered, difficultyMenuClickCallback);
        pauseSound.play();
    };
};

function pauseMenuClickCallback(e) {
    if (menu.isButtonHovered(e, pauseMenuButtons.replay, pauseMenuButtons.settings)) {
        menu.resetHoverHoverMenuButtons(pauseMenuButtons);
        removeMenuListeners(menu.makePauseMenuHovered, pauseMenuClickCallback);
        clickMenuSound.play();
        resetGame();
    } else if (menu.isButtonHovered(e, pauseMenuButtons.continue, pauseMenuButtons.settings)){
        menu.resetHoverHoverMenuButtons(pauseMenuButtons);
        closePauseMenu();
        clickMenuSound.play();
    };
};

function replayEndClickCallback(e) {
    if (menu.isButtonHovered(e, pauseMenuButtons.replayEnd, pauseMenuButtons.settings)) {
        removeMenuListeners(menu.makeReplayEndButtonHovered, replayEndClickCallback);
        menu.resetHoverHoverMenuButtons(pauseMenuButtons);
        resetGame();
        clickMenuSound.play();
    } else if (menu.isButtonHovered(e, pauseMenuButtons.exit, pauseMenuButtons.settings)) {
        goTomeinMenu('isStarted', pauseMenuButtons,
        menu.makeReplayEndButtonHovered, replayEndClickCallback);
        cancelAnimationFrame(game.gameId);
        removeHeroKeydownListeners();
        removeHeroKeyupListeners();
        mainMenuEngine();
        clickMenuSound.play();
        mainMenuTheme.play();
    };
}; 

function addMenuListeners(mouseMoveCallback, clickCallback) {
    draw.canvas.addEventListener('mousemove', mouseMoveCallback);
    draw.canvas.addEventListener('click', clickCallback);
};

function removeMenuListeners(mouseMoveCallback, clickCallback) {
    draw.canvas.removeEventListener('mousemove', mouseMoveCallback);
    draw.canvas.removeEventListener('click', clickCallback);
};

function showPauseMenu() {
    pauseGame();
    addMenuListeners(menu.makePauseMenuHovered, pauseMenuClickCallback);
    zombiesArr.pauseLieZomnieTimer();
    lieZombiesArr.pauseFakeDeadZomniesTimer();
    game.isPaused = true;

    if (hero.isImmortal) {
        clearTimeout(hero.immortalTimer);
    };

    if (hero.isPerformSingleAction) {
        hero.isOneAction = true;
        hero.stateCopy = Object.assign({}, hero.currentState);
    };
};


function closePauseMenu() {
    if (!hero.isOneAction && !buttons.runLeft.isPressed && !buttons.run.isPressed) {
        hero.setCurrentState(hero.states.stayState);
    };

    removeMenuListeners(menu.makePauseMenuHovered, pauseMenuClickCallback);
    menu.resetHoverHoverMenuButtons(pauseMenuButtons);
    zombiesArr.resumeLieZomniesTimer();
    lieZombiesArr.resumeFakeDeadZomniesTimer();
    resumeGame();
    game.isPaused = false;

    if (hero.isOneAction) {
        hero.setOneAction(hero.stateCopy, settings.heroSpeed, game, kunaiArr); 
        hero.isOneAction = false; 
    };

    if(hero.isImmortal) {
        hero.makeHeroImortal(hero.immortalTime, zombiesArr);
    };

};

function gamePauseKeydownCallback(e) {
    if (game.isStarted && game.isStartDelayEnded && isButtonsPressed(buttons.pause, e.keyCode) 
      && !hero.isDead && !zombieBoss.isDead) {
        pauseSound.resetTime();
        pauseSound.play();
        let stateCopy;

        if (!game.isPaused) {
            showPauseMenu();
        } else {
            closePauseMenu();
        };
    };
};

window.addEventListener('keydown', gamePauseKeydownCallback);

const spiner = document.getElementById('loading');

Promise.all(promisesArr).then(() => {
    spiner.style.display = 'none';
    mainMenuTheme.play();
    mainMenuEngine();
    addMenuListeners(menu.makeMainMenuHovered, mainMenuClickCallback);
});
