import Phaser from 'phaser';
import bg from './assets/bg.png'
import cat from './assets/cat.png'
import rainbow from './assets/rainbow.png'
import box from './assets/crate.png'
import texturePNG from './assets/objectsTexture.png'
import textureJSON from './assets/objectsTexture.json'
import hearts from './assets/hearts.png'
import button from './assets/button.png'

class MyScene extends Phaser.Scene {

  constructor(config) {
    super(config);
  }

  catFail() {
    this.cat.destroy();
    if (this.heartsCount < this.hearts.length) {
      this.hearts[this.heartsCount].setFrame(1);
      this.heartsCount++;
      this.cat = this.matter.add.sprite(100, 550, 'cat').setScale(2);
      this.cat.name = 'cat'
    } else {
      this.matter.pause();
      this.add.text(150, 200, 'GAME OVER', {fontSize: '300px'});
      this.add.image(900, 600, 'button')
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () => this.scene.restart());
      this.add.text(815, 585, 'RESTART', {fontSize: '40px'});
    }
  }
  successGame() {
    this.matter.pause();
    this.add.text(180, 200, 'WIN!!!!', {fontSize: '300px'});
    this.add.image(900, 600, 'button')
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => this.scene.restart());
    this.add.text(815, 585, 'RESTART', {fontSize: '40px'});
  }

  collisionHandler(bodyA, bodyB) {
    const bodyAType = bodyA.gameObject ? bodyA.gameObject.name : bodyA.name;
    const bodyBType = bodyB.gameObject ? bodyB.gameObject.name : bodyB.name;;

    if (!bodyAType || !bodyBType) return;
    const bodyTypes = [bodyAType, bodyBType];

    if (bodyTypes.includes('cat') && bodyTypes.includes('bounds')) this.catFail();

    if (bodyBType === 'box' && bodyTypes.includes('bounds')) {
      bodyB.gameObject.destroy()
      this.boxCount--;
    }
    if (bodyAType === 'box' && bodyTypes.includes('bounds')) {
      bodyA.gameObject.destroy()
      this.boxCount--;
    }
    if (this.boxCount === 0) this.successGame();
  }

  preload() {
    this.load.image('bg', bg);
    this.load.spritesheet('cat', cat, {frameWidth: 97, frameHeight: 59});
    this.load.image('rainbow', rainbow);
    this.load.image('box', box);
    this.load.spritesheet('heart', hearts, {frameWidth: 200, frameHeight: 200});
    this.load.atlas('objects', texturePNG, textureJSON);
    this.load.image('button', button);
  }

  create() {
    this.hearts = [];
    this.heartsCount = 0;
    this.boxCount = 5;

    // interface
    this.add.image(400, 300, 'bg');
    this.add.image(1200, 300, 'bg');
    this.add.image(2000, 300, 'bg');
    this.add.image(400, 900, 'bg');
    this.add.image(1200, 900, 'bg');
    this.add.image(2000, 900, 'bg')

    for (let i = 0; i <= 2; i++) {
      const heart = this.add.image(40 + i * 60, 30, 'heart').setScale(0.25);
      this.hearts.push(heart);
    }

    this.matter.world.setBounds(0, 0, 1920, 1080, 2000, true, false, true, false);

    this.cat = this.matter.add.sprite(100, 550, 'cat')
      .setScale(2)
      .setBounce(2);
    this.cat.name = 'cat'
    this.cat.setFrictionAir(0.02);

    this.platform = this.matter.add.image(-150, 750, 'rainbow').setStatic(true);

    this.platform2 = this.matter.add.image(1750, 422, 'objects', 'wood.png');
    this.platform2.setRandomPosition(1500, 500, 200, 500);
    this.platform2.setScale(0.8, 0.2);
    this.platform2.setStatic(true);

    this.matter.add.image(this.platform2.x + 50, this.platform2.y - 100, 'box').setBody('rectangle', {
      restitution: 0.5,
      ignorePointer: true,
    }).name = 'box';
    this.matter.add.image(this.platform2.x + 50, this.platform2.y - 100, 'box').setBody('rectangle', {
      restitution: 0.5,
      ignorePointer: true,
    }).name = 'box';
    this.matter.add.image(this.platform2.x, this.platform2.y - 200, 'box').setBody('rectangle', {
      restitution: 0.5,
      ignorePointer: true,
    }).name = 'box';
    this.matter.add.image(this.platform2.x + 50, this.platform2.y - 300, 'box').setBody('rectangle', {
      restitution: 0.5,
      ignorePointer: true,
    }).name = 'box';
    this.matter.add.image(this.platform2.x - 13, this.platform2.y - 400, 'box').setBody('rectangle', {
      restitution: 0.5,
      ignorePointer: true,
    }).name = 'box';

    this.matter.add.mouseSpring({
      damping: 0.3,
    });


    const colliderH = this.matter.add.rectangle(1000, 1450, 4000, 900, {
      isSensor: true,
      isStatic: true
    });
    colliderH.name = 'bounds'
    const colliderV = this.matter.add.rectangle(2500, 1000, 1200, 2000, {
      isSensor: true,
      isStatic: true
    });
    colliderV.name = 'bounds'
    this.matter.world.on('collisionstart', (_, bodyA, bodyB) => this.collisionHandler(bodyA, bodyB));
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: {
        showBody: true,
        showStaticBody: true
      },
    },
  },
  scene: MyScene
};

const game = new Phaser.Game(config);
