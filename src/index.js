import Phaser from 'phaser';
import bg from './assets/bg.png'
import cat from './assets/cat.png'
import rainbow from './assets/rainbow.png'
import box from './assets/crate.png'
import texturePNG from './assets/objectsTexture.png'
import textureJSON from './assets/objectsTexture.json'
import hearts from './assets/hearts.png'
import buttom from  './assets/button.png'
class MyScene extends Phaser.Scene
{
  constructor(config)
  {
    super(config);
  }

  collisionHandler(bodyA, bodyB) {
    const nameBodyA = bodyA.gameObject ? bodyA.gameObject.name : bodyA.name;
    const nameBodyB = bodyB.gameObject ? bodyB.gameObject.name : bodyB.name;
    const bodyNames = [nameBodyA, nameBodyB];
    if(!nameBodyA || !nameBodyB)  return;
    if(bodyNames.includes('cat') && bodyNames.includes('bounds')) this.catFail();
    if(bodyNames.includes('bounds') && nameBodyA==='box') {
      this.blockDestroy(bodyA.gameObject)
    }
    if(bodyNames.includes('bounds') && nameBodyB==='box') {
      this.blockDestroy(bodyB.gameObject)
    }
  }

  catFail() {
    this.cat.destroy();
    if (this.heartCount < this.hearts.length) {
      this.hearts[this.heartCount].setFrame(1);
      this.heartCount++;
      this.cat = this.matter.add.sprite(100, 550, 'cat').setScale(2).setBounce(1.1);
      this.cat.name = 'cat';
      const catAnimation = this.anims.create({
        key: 'dance',
        frames: this.anims.generateFrameNumbers('cat', {
          start: 0,
          end: 5
        }),
        frameRate: 11,
        repeat: -1,
      });
    } else {
      this.matter.pause();
      this.add.text(150, 200, 'GAME OVER', {fontSize: '300px', color: 'red'});
      this.add.image(900, 600, 'button')
        .setInteractive({cursor: 'pointer'})
        .on('pointerdown', () => this.scene.restart());
      this.add.text(815, 585, 'RESTART', {fontSize: '40px'});
    }
  }

  successGame() {
    this.add.text(150, 200, 'WIN !!!!!', {fontSize: '300px'});
    this.matter.pause();
    this.add.image(900, 600, 'button')
      .setInteractive({cursor: 'pointer'})
      .on('pointerdown', () => this.scene.restart());
    this.add.text(815, 585, 'RESTART', {fontSize: '40px'});
  }

  blockDestroy(object) {
    object.destroy();
    this.boxes.pop();
    if(!this.boxes.length) this.successGame();
  }

  init() {
  }

  preload () {
    this.load.image('bg', bg);
    this.load.image('box',box);
    this.load.spritesheet('cat', cat, {frameWidth: 97, frameHeight: 59});
    this.load.atlas('objects', texturePNG, textureJSON);
    this.load.image('rainbow', rainbow);
    this.load.spritesheet('hearts', hearts, {frameWidth: 200, frameHeight: 200});
    this.load.image('button', buttom);
  }

  create () {
    this.hearts = [];
    this.boxes = [];
    this.heartCount = 0;
    this.add.image(400, 300, 'bg');
    this.add.image(1200, 300, 'bg');
    this.add.image(2000, 300, 'bg');
    this.add.image(400, 900, 'bg');
    this.add.image(1200, 900, 'bg');
    this.add.image(2000, 900, 'bg');

    for(let i =0; i <= 2; i++) {
      const heart = this.add.image(40 + i * 50, 30, 'hearts').setScale(0.25);
      this.hearts.push(heart)
    }

    const catAnimation = this.anims.create({
      key: 'dance',
      frames: this.anims.generateFrameNumbers('cat', {
        start: 0,
        end: 5
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.cat = this.matter.add.sprite(100, 550, 'cat').setScale(2).setBounce(1.1);
    this.cat.name = 'cat';
    this.cat.animationDance = catAnimation;
    this.matter.add.image(-150, 750, 'rainbow').setStatic(true)

    this.matter.add.mouseSpring(
      {
        damping: 0.5,
      }
    );

    this.platform = this.matter.add.image(1750, 922, 'objects', 'wood.png');
    this.platform.setStatic(true);
    this.platform.setScale(0.8, 0.2);
    this.platform.setRandomPosition(1500, 500, 200, 500);

    for (let i=0; i<5; i++) {
      const box = this.matter.add.image(this.platform.x + 50 - i*5, this.platform.y - 100 - i*100, 'box', ).setBody('rectangle', {
        restitution: 0.5,
        ignorePointer: true,
        mass: 100,
      }).name = 'box';
      this.boxes.push(box);
    }

    this.matter.world.setBounds(0, 0, 1920, 1080, 2000, true, false, true, false);

    const colliderV = this.matter.add.rectangle(2500, 1000, 1200, 2000, {
      isSensor: true,
      isStatic: true,
    });
    colliderV.name = 'bounds';
    const colliderH = this.matter.add.rectangle(1000, 1450, 4000, 900, {
      isSensor: true,
      isStatic: true,
    });
    colliderH.name = 'bounds';
    this.matter.world.on('collisionstart', (_, bodyA, bodyB) => this.collisionHandler(bodyA, bodyB));
    this.matter.world.on('dragstart', () => this.cat.play('dance'));
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
    }
  },
  scene: MyScene
};

const game = new Phaser.Game(config);
