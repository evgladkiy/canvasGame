import {settings, getRandomInt} from  './settings'; 
import {pointsSound, kunaiInZombieSound } from './sources'; 

export class ObjectsSet {
    constructor() {
        this.data = [];
    };

    remove(item) {
        this.data.splice(this.data.indexOf(item), 1);
    };

    add(item) {
        this.data.push(item);
    };
};

class BonusKunai {
    constructor() {
        this.item = 'heart',
        this.standardWidth = 38;
        this.standardHeight = 38;
        this.width = 30;
        this.height = 30;
        this.positionXOnImage = 168;
        this.positionYOnImage = 2;
        this.positionX = canvas.width + 40;
        this.positionY = 300; 
    };
};

class BonusHeart {
    constructor() {
        this.item = 'kunai',
        this.standardWidth = 12;
        this.standardHeight = 48;
        this.width = 12;
        this.height = 48;
        this.positionXOnImage = 55;
        this.positionYOnImage = 2;
        this.positionX = canvas.width + 40;;
        this.positionY = 280;
    };
};

export class BonusesSet extends ObjectsSet {
    constructor() {
        super();
        this.canAddBonus = false;
    };

    createRandomBonus(hero) {
        let n = getRandomInt(1, 6);
        let newBonus;
        if (n === 5 && hero.maxHealth !== 1) {
            newBonus = new BonusKunai()
        } else {
            newBonus = new BonusHeart()
        }
        this.add(newBonus);
    };

    isHeroCatchBonus(bonus, hero) {
        return bonus.positionX - hero.positionX - hero.currentState.width + 30 <= 0
          && bonus.positionX + bonus.width - hero.positionX > 0
          && hero.currentState === hero.states.jumpState
          && hero.currentState.currentSpriteImg > 3
          && hero.currentState.currentSpriteImg < 7;
    };

    checkStatus(hero) {
        this.data.forEach((bonus) => {
            if (this.isHeroCatchBonus(bonus, hero)) {
                if (bonus.item === 'kunai') {
                    hero.kunaiCount += 10 - settings.difficulty * 2;
                    this.remove(bonus);
                    pointsSound.resetTime();
                    pointsSound.play();
                } else if (bonus.item === 'heart' && hero.health < hero.maxHealth) {
                    hero.health += 1;
                    this.remove(bonus);
                    pointsSound.resetTime();
                    pointsSound.play();
                } 
            } else if (bonus.positionX + bonus.width < 0) {
                this.remove(bonus);
            }
        })
    };

    checkOpportunityToCreateBonus(hero, game) {
        if (game.score >= settings.pointsForZombie * settings.randomBonusesTime 
          && game.score % (settings.pointsForZombie * settings.randomBonusesTime) === 0) {
            if(this.canAddBonus) {
                this.canAddBonus = false;
                this.createRandomBonus(hero);
            }
        } else {
            this.canAddBonus = true; 
        } 
    };
};

class Kunai {
    constructor(speed, isLeft, hero) {
        this.positionX = hero.positionX + 50;
        this.positionY = hero.positionY + 70;
        this.width = 48;
        this.height = 12;
        this.positionDx = speed;
        this.isLeft = isLeft; 
    };
};

export class KunaiSet extends ObjectsSet {
    constructor(){
        super();
    };

    changePosition() {
        this.data.forEach((item) => item.positionX += item.positionDx);
    };

    addKunai(hero) {
        if (hero.isLeft) {
           this.add(new Kunai(-settings.kunaiDx - settings.bgDx * 2, true, hero));
        } else {
            this.add(new Kunai(settings.kunaiDx, false, hero));
        }
        return this;
    };

    filterSet() {
        this.data = this.data.filter((item) => {
            return item.positionX < canvas.width && item.positionX + 42 > 0;
        });
    };

    isKunaiInZombie(kunai, zombie) {
        if(!zombie.isLeft) {
            return kunai.positionX - kunai.width > zombie.positionX 
              && kunai.positionX  < zombie.positionX + zombie.currentState.width + 40;
        } else { 
            return kunai.positionX - kunai.width > zombie.positionX 
              && kunai.positionX  < zombie.positionX + zombie.currentState.width + 30;
        };
    };

    isKunaiInBossZombie(kunai, boss, hero) {
        return (kunai.isLeft && hero.positionX > boss.positionX + 100 
          && kunai.positionX + 40 < boss.positionX + boss.currentState.width)
          || (!kunai.isLeft &&  boss.positionX < kunai.positionX 
          && kunai.positionX + 80 < boss.positionX + boss.currentState.width);
    };

    checkStatus(zombiesArr, boss, hero, game) {
        this.data.forEach((kunai) => {
            if(this.isKunaiInBossZombie(kunai, boss, hero)) {
                if (boss.currentHealth > 0) {
                    this.remove(kunai);
                    boss.isHurted = true;
                    boss.currentHealth -= 1;
                    kunaiInZombieSound.resetTime();
                    kunaiInZombieSound.play();
                    setTimeout(() => boss.isHurted = false, 50)  ;
                }
            }
            zombiesArr.data.forEach((zombie) => {
                if (this.isKunaiInZombie(kunai, zombie) && !zombie.fakeDead 
                  && !zombie.isDead && !zombie.isFell) {
                    this.remove(kunai);
                    zombie.makeDead(zombiesArr, game);
                }
            })
        });
    };
};
