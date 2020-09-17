class Scene1 extends Phaser.Scene{

  constructor(){
    super("startGame");
  }

  preload ()
  {
      this.load.image('sky', 'assets/sky.png'); //import all the assets :)
      this.load.image('sun', 'assets/sun.png');
      this.load.image('logo', 'assets/logo.png');
  }

  create()
  {
      this.add.image(400, 300, 'sky'); //load bg sky
      this.add.image(0, 0, 'sun').setOrigin(0,0); //load at center instead of middle
      this.add.image(400,300, 'logo').setScale(0.3);

      this.add.text(270,370, "press the screen to continue");
      this.input.on('pointerdown', () => this.scene.start("playGame"));
  }


}
