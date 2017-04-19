import {otherImg, pauseMenu, control} from  './sources';
import {pauseMenuButtons, controlMenuButtons, mainMenuButtons} from './drawStates';

export const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

export function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export function drawHero(hero) {
    if (hero.isInvisible) {
        ctx.globalAlpha = 0.5;
    };
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
    };
    if (ctx.globalAlpha !== 1) {
        ctx.globalAlpha = 1; 
    };
};

export function drawHeroStatus(hero) {
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
    ctx.drawImage(otherImg, 0, 14, 48, 12, 130, 82, 60, 15); //kunai icon
    ctx.font = 'bold 24px serif';
    ctx.fillStyle = '#111';
    ctx.fillText(`x ${hero.kunaiCount}`, 195, 95); // kunai count
    for (let i = 0; i <= hero.maxHealth - 1; i++) {
        if (i < hero.health) {
            ctx.drawImage(otherImg, 3, 45, 38, 38, 130 + (i * 35), 40, 25, 25); // health
        }
        ctx.drawImage(otherImg, 168, 44, 40, 40, 127 + (i * 35), 37, 31, 31); // health border
    }
};
   
export function drawZombies(zombies) {
    if (Array.isArray(zombies.data)) {
        zombies.data.forEach((zombie) => {
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

export function drawZomieBoss(game, zombieBoss) {
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

export function drawBossHealth(zombieBoss) {
    ctx.lineWidth = 0.5;
    ctx.fillStyle = lingrad;
    ctx.fillRect(450, 40, (380 / zombieBoss.health) * zombieBoss.currentHealth, 25);
    ctx.strokeRect(450, 40, 380, 25);
};

export function drawBg(img, bgPosition) {
    ctx.drawImage(img, 0 - bgPosition, 0, canvas.width, 480);
    ctx.drawImage(img, 0, 0, 1280, 630, canvas.width - bgPosition, 0, canvas.width, 480);
};

export function drawRoad(img, roadPosition) {
    ctx.drawImage(img, 0 - roadPosition, 450, canvas.width, 200);
    ctx.drawImage(img, 0, 0, 1280, 240, canvas.width - roadPosition, 450, canvas.width, 200);
};

let lingrad = ctx.createLinearGradient(0,0,0, 130);
lingrad.addColorStop(0, '#fff');
lingrad.addColorStop(0.5, '#dd2108');
lingrad.addColorStop(1, '#fff');

export function drawKunai(kunaiArr) {
    kunaiArr.filterSet();

    kunaiArr.data.forEach((item) => {  
        if (item.isLeft) {
            ctx.drawImage(otherImg, 0, 2, item.width, item.height,
              item.positionX - 100, item.positionY, item.width, item.height);
        } else {
            ctx.drawImage(otherImg, 0, 14, item.width, item.height,
              item.positionX, item.positionY, item.width, item.height);
        }
    });
};

export function drawRandomBonuses(game, randomBonuses) {
    randomBonuses.data.forEach((bonus) => {
        ctx.drawImage(otherImg, bonus.positionXOnImage, bonus.positionYOnImage,
        bonus.standardWidth, bonus.standardHeight, bonus.positionX, bonus.positionY,
        bonus.width, bonus.height);
        if(!game.isPaused) {
            bonus.positionX -= game.bgDx * 2;
        };
    });
};

export function drawScore(game) {
    ctx.font = "32px serif";
    ctx.fillStyle = '#eeeeee';
    ctx.fillText(`Score: ${game.score}`, 1050, 63);
};

export function drawMenubg() {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.4; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
};

export function drawWinConditions(game) {
    ctx.font = "36px serif";
    ctx.fillStyle = '#eeeeee';
    ctx.fillText('Survive and kill the Boss!', 450, 150);
    if (game.delayTime > 0) {
        ctx.fillText(`${game.delayTime}`, 620, 200);
    }
    if (game.delayTime === 0) {
        ctx.fillText(`Run!`, 600, 200);
    }
};

export function drawPauseMenu() {
    ctx.drawImage(pauseMenu, 2, 95, 573, 304, 415, 150, 458, 243);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#eeeeee';
    ctx.fillText('Pause!', 595, 235);
    drawButton(pauseMenuButtons.replay, pauseMenuButtons.settings);
    drawButton(pauseMenuButtons.continue, pauseMenuButtons.settings);
};


export function drawEndMenu(game) {
    ctx.drawImage(pauseMenu, 2, 95, 573, 304, 415, 150, 458, 243);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#eeeeee';
    if (game.isWin) {
        ctx.fillText('You Win!', 483, 235);
        ctx.font = 'bold 28px serif';
        ctx.fillText(`Score: ${game.score}!`, 625, 235);
    } else {
        ctx.fillText('You Lose! Try Again!', 490, 235); 
    }
    drawButton(pauseMenuButtons.exit, pauseMenuButtons.settings);
    drawButton(pauseMenuButtons.replayEnd, pauseMenuButtons.settings);
};

/// draw menu

export function drawButton(button, buttonsSettings) {
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
    };
};

export function drawMainMenu() {
    ctx.drawImage(pauseMenu, 760, 400, 430, 440, 420, 120, 430, 440);
    drawButton(mainMenuButtons.play, mainMenuButtons.settings)
    drawButton(mainMenuButtons.difficulty, mainMenuButtons.settings)
    drawButton(mainMenuButtons.control, mainMenuButtons.settings)
};

export function drawDifficultyMenu() {
    ctx.drawImage(pauseMenu, 760, 400, 430, 440, 420, 60, 430, 530);
    drawButton(mainMenuButtons.babyMode , mainMenuButtons.settings);
    drawButton(mainMenuButtons.normal, mainMenuButtons.settings);
    drawButton(mainMenuButtons.hellMode, mainMenuButtons.settings);
    drawButton(mainMenuButtons.mainMenu, mainMenuButtons.settings);
};

export function drawControlMenu() {
    ctx.drawImage(pauseMenu, 761, 400, 430, 440, 375, 60, 530, 530);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#eeeeee';
    ctx.fillText('Controls:', 580, 160);
    ctx.drawImage(control, 0, 0, 450, 330, 470, 170,  360, 264); 
    drawButton(controlMenuButtons.mainMenuControl, controlMenuButtons.settings);
};
