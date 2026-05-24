import GameScene from "./scenes/GameScene.js";
import EndScene from "./scenes/EndScene.js";

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: [GameScene, EndScene]
  };

new Phaser.Game(config);