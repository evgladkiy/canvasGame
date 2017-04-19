export let promisesArr = [];

class newAudio {
    constructor() {
        this.audioElement = new Audio();
    };

    play() {
        this.audioElement.play();
    };

    pause() {
        this.audioElement.pause();
    };

    stop() {
        this.audioElement.currentTime = 0;
        this.audioElement.pause();
    };

    resetTime() {
        this.audioElement.currentTime = 0;
    };

    init(src, vol, isLoope) {
        let source = document.createElement('source');
        source.src = src;
        this.audioElement.appendChild(source);
        this.audioElement.volume = vol || 1;
        this.audioElement.loop = isLoope || false;
    };
};

function createNewAudio(src, vol, isLoope) {
    let audio = new newAudio(vol, isLoope);
    audio.init(src, vol, isLoope);

    let promise = new Promise((resolve, reject) => {
        audio.audioElement.oncanplay = () => resolve();
    });

    promisesArr.push(promise);
    return audio;
};

function createNewImg(src) {
    let newImg = new Image();
    newImg.src = src;

    let promise = new Promise((resolve, reject) => {
        newImg.onload = () => resolve();
    });
    
    promisesArr.push(promise);
    return newImg;
};

export const heroImg = createNewImg('./img/heroAll.png');
export const zombieMale = createNewImg('./img/zombieAll.png');
export const zombieFemale = createNewImg('./img/zombieAllF.png');
export const background = createNewImg('./img/background.jpg');
export const road = createNewImg('./img/road.png');
export const otherImg = createNewImg('./img/other.png');
export const pauseMenu = createNewImg('./img/menu1.png');
export const control = createNewImg('./img/control.png');

export const playTheme = createNewAudio('./sounds/playTheme.ogg', 0.2, true);
export const mainMenuTheme = createNewAudio('./sounds/Loop.mp3', 0.2, true);
export const throwSound = createNewAudio('./sounds/swing.mp3', 0.6);
export const heroDeadSound = createNewAudio('./sounds/scream.mp3', 0.3);
export const swordSound = createNewAudio('./sounds/sword.ogg', 0.6);
export const kunaiInZombieSound = createNewAudio('./sounds/splat3.mp3');
export const pointsSound = createNewAudio('./sounds/points.mp3');
export const zombieAttackSound = createNewAudio('./sounds/yuck.mp3', 0.3);
export const bossDeadSound = createNewAudio('./sounds/yuck2.mp3', 0.3);
export const pauseSound = createNewAudio('./sounds/pause.mp3', 0.5);
export const clickMenuSound = createNewAudio('./sounds/puff.mp3', 0.8);
export const loseSound = createNewAudio('./sounds/losemusic.mp3', 0.6);
export const winSound = createNewAudio('./sounds/winmusic.mp3', 0.6);
export const heroHurted = createNewAudio('./sounds/scream2.mp3', 0.4);
export const zombieFellSound = createNewAudio('./sounds/zombie_falling_1.mp3', 0.8);
export const zombieReincarnationSound = createNewAudio('./sounds/groan4.mp3', 0.8);

