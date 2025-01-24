import WorldScene from './WorldScene.js';
import ChatScene from './ChatScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [WorldScene, ChatScene],
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
