export default class ChatScene extends Phaser.Scene {
    constructor() {
      super('ChatScene');
    }
  
    init(data) {
      this.npcId = data.npcId;
    }
  
    create() {
      this.add.text(400, 100, `Talking to ${this.npcId}`, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
  
      this.input.keyboard.on('keydown-ENTER', () => {
        this.scene.start('WorldScene');
      });
    }
  }
  