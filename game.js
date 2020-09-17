var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { //needed for physics to work in game
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
      }
  },
  scene: [Scene1, Scene2, Scene3]
}

var score = 0;
var gameOver = false;

var game = new Phaser.Game(config);
