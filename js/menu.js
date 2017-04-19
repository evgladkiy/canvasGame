import {pauseMenuButtons, controlMenuButtons, mainMenuButtons} from  './drawStates';
import {clickMenuSound, mainMenuTheme, pauseSound} from  './sources'; 
import {canvas} from './drawGame'

const canvasTopPosition = canvas.getBoundingClientRect().top;
const canvasLeftposition = canvas.getBoundingClientRect().left;

export function isButtonHovered(e, button, buttonsSettings) { 
    return e.pageX >= button.positionX + canvasLeftposition 
      && e.pageX  <=  button.positionX + buttonsSettings.width + canvasLeftposition 
      && e.pageY >= button.positionY + canvasTopPosition 
      && e.pageY  <= button.positionY + buttonsSettings.height + canvasTopPosition;
};

export function makeButtonHovered(button) {
    if (!button.hovered) {
        button.hovered = true;
        canvas.style.cursor = 'pointer';   
    };
};

export function resetHoverHoverMenuButtons(buttons) {
    for (let button in buttons) {
        if(buttons[button].hovered === true) {
            buttons[button].hovered = false;
        }
    };
    canvas.style.cursor = 'default';
};

export function setActiveDifficulty(activeButton) {
    for (let button in mainMenuButtons) {
        mainMenuButtons[button].isActive = false
        if (mainMenuButtons[button] === activeButton) {
            mainMenuButtons[button].isActive = true;
        }
    };
};

export function goTomeinMenu(hideMenu, buttons, hoverListener, clickListener) {
    resetHoverHoverMenuButtons(mainMenuButtons);
    removeMenuListeners(hoverListener, clickListener);
    game[hideMenu] = false;
    game.isShowMainMenu = true;
    addMenuListeners(makeMainMenuHovered, mainMenuClickCallback);
};

export function goFromeMenu(newMenu, buttons, newHoverListener, newClickListener) {
    resetHoverHoverMenuButtons(buttons);
    removeMenuListeners(makeMainMenuHovered, mainMenuClickCallback);
    game.isShowMainMenu = false;
    game[newMenu] = true;
    addMenuListeners(newHoverListener, newClickListener);
    clickMenuSound.play();
};

export function makeMainMenuHovered(e) {
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

export function makeControlMenuHovered(e) {

    if (isButtonHovered(e, controlMenuButtons.mainMenuControl, controlMenuButtons.settings)) {
        makeButtonHovered(controlMenuButtons.mainMenuControl)
    } else if (controlMenuButtons.mainMenuControl.hovered) {
        resetHoverHoverMenuButtons(controlMenuButtons);
    };
};

export function makeDifficultyMenuHovered(e) {
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

export function makePauseMenuHovered(e) {
    if (isButtonHovered(e, pauseMenuButtons.replay, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.replay)
    } else if (isButtonHovered(e, pauseMenuButtons.continue, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.continue)
    } else if (pauseMenuButtons.replay.hovered || pauseMenuButtons.continue.hovered) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
    };
};

export function makeReplayEndButtonHovered(e) {
    if (isButtonHovered(e, pauseMenuButtons.replayEnd, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.replayEnd)   
    } else if (isButtonHovered(e, pauseMenuButtons.exit, pauseMenuButtons.settings)) {
        makeButtonHovered(pauseMenuButtons.exit) 
    } else if(pauseMenuButtons.replayEnd || pauseMenuButtons.exit) {
        resetHoverHoverMenuButtons(pauseMenuButtons);
    };
};

