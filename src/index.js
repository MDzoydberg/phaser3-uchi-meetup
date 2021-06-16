import Phaser from 'phaser';
import bg from './assets/bg.png'
import cat from './assets/cat.png'
import rainbow from './assets/rainbow.png'
import box from './assets/crate.png'
import texturePNG from './assets/objectsTexture.png'
import textureJSON from './assets/objectsTexture.json'

class MyScene extends Phaser.Scene
{
  constructor(config)
  {
    super(config);
  }

  init() {

  }

  preload () {
  }

  create () {

  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  scale: {
    width: 1920,
    height: 1080,
  },
  scene: MyScene
};

const game = new Phaser.Game(config);
