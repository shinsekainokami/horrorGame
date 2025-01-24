export default class WorldScene extends Phaser.Scene {
    constructor() {
      super('WorldScene');
      const possibleHidingPlaces = [
        "The big bag of food in the kitchen",
        "The cuckoo clock at the kitchen",
        "The dining table in the living room",
        "The statue at the living room",
        "The mirror at the bedroom",
        "The chest at the bedroom"
      ]
      this.hidingPlace = this.choose(possibleHidingPlaces)
      console.log("hiding place",this.hidingPlace)
    }

    choose(choices) {
        var index = Math.floor(Math.random() * choices.length);
        return choices[index];
      }
  
    preload() {
      this.load.image('roguelikeSheet_transparent', 'assets/roguelikeSheet_transparent.png');
      this.load.tilemapTiledJSON('map', 'assets/map.json');
      this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
      this.load.spritesheet('npc', 'assets/npc.png', { frameWidth: 32, frameHeight: 32 });
    }
  
    create() {
      console.log(this.cache.tilemap.get('map').data);
      const map = this.make.tilemap({ key: 'map' });
      const tileset = map.addTilesetImage('roguelikeSheet_transparent');
  
      map.createLayer('Floor', tileset);
      map.createLayer('Carpet', tileset);
      map.createLayer('Objects', tileset);
      map.createLayer('Details', tileset);

      map.setCollisionBetween(0,200,true,'Objects')
      
  
      this.player = this.physics.add.sprite(100, 100, 'player');
        this.npcs = this.physics.add.staticGroup();
        const npc = this.npcs.create(200, 200, 'npc');

        // Debugging
        this.physics.world.createDebugGraphic();
        
        // Collider
        this.physics.add.collider(this.player, npc, (player, npc) => {
            console.log('Collision Detected');
            this.startChat(player, npc);
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        }

    update() {
    const speed = 200;
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);
    }
  
    startChat(player, npc) {
      console.log("inicia chat")
      this.scene.start('ChatScene', { 
        npcId: 'Fred',
        npcPrompt: `
You are Fred, a helpful NPC in a treasure hunt investigation game,
your objective is to give the user hints about where the treasure is,
the map is a big mansion with a bedroom, a living room with a statue and a dining table,
and a kitchen, the hiding place is ${this.hidingPlace}.

You MUST only respond to the player with hints, never confirm to them where the treasure is.`
    });
    }
  }