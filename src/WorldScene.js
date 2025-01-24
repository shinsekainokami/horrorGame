export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene");
  }

  preload() {
    this.load.image(
      "roguelikeSheet_transparent",
      "assets/roguelikeSheet_transparent.png"
    );
    this.load.tilemapTiledJSON("map", "assets/map2.json");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("npc", "assets/npc.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    console.log(this.cache.tilemap.get("map").data);
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("roguelikeSheet_transparent");

    map.createLayer("Floor", tileset).setScale(3);
    map.createLayer("Carpet", tileset).setScale(3);
    map.createLayer("Objects", tileset).setScale(3);
    map.createLayer("Details", tileset).setScale(3);

    map.setCollisionBetween(0, 200, true, "Objects");

    this.player = this.physics.add.sprite(100, 100, "player");
    this.npcs = this.physics.add.staticGroup();
    const npc = this.npcs.create(200, 200, "npc");

    // Debugging
    this.physics.world.createDebugGraphic();

    // Collider
    this.physics.add.collider(this.player, npc, (player, npc) => {
      console.log("Collision Detected");
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
    console.log("inicia chat");
    this.scene.start("ChatScene", { npcId: npc.name || "Unknown NPC" });
  }
}
