class Scene2 extends Phaser.Scene{
  constructor(){
    super("playGame");
  }

  preload()
  {
    this.load.image('sky', 'assets/sky.png'); //import all the assets :)
    this.load.image('sun', 'assets/sun.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create()
  {
    this.add.image(400, 300, 'sky'); //load bg sky
    this.add.image(0, 0, 'sun').setOrigin(0,0); //load at center instead of middle

    this.platforms = this.physics.add.staticGroup(); //create platforms

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //bottom platform

    this.platforms.create(60, 300, 'ground').setScale(0.5).refreshBody(); //tiny platform on left
    this.platforms.create(400, 425, 'ground').setScale(0.75).refreshBody(); //med platform in mi
    this.platforms.create(220, 150, 'ground').setScale(0.5).refreshBody(); //tiny platform on top
    this.platforms.create(750, 220, 'ground').setScale(1.4).refreshBody(); //large platform on right

    this.player = this.physics.add.sprite(100, 450, 'dude'); //create player

    this.player.setBounce(0.2); //bouncy boy
    this.player.setCollideWorldBounds(true); //stays inside screen
    this.player.body.setGravityY(30); //gravityyy

    this.anims.create({ //make the left animation
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1 //loop animation
    });

    this.anims.create({ //make the center frame
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({ //create right animation
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.stars = this.physics.add.group({ //create stars
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function (child) { //make em bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.bombs = this.physics.add.group(); //create bombs

    this.physics.add.collider(this.player, this.platforms); //collider between player & ground
    this.physics.add.collider(this.stars, this.platforms); //collider between ground & stars
    this.physics.add.collider(this.bombs, this.platforms); //collider between ground & bombs

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this); //trigger between player & stars
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this); //trigger between player & bombs

    this.scoreText = this.add.text(575, 16, 'score: 0', { fontSize: '32px' }); //ui score

    this.cursors = this.input.keyboard.createCursorKeys(); //ability to move :)

    //this.input.on('pointerdown', () => this.scene.start("endGame")); //debugging scenes
  }

  update ()
  {
    if (gameOver)
    {
      setTimeout(() => {
        this.scene.start("endGame");
      }, 2000);
    }
    //check for player movement inputs!
    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    }
    else
    {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
        this.player.setVelocityY(-330);
    }
  }

  collectStar (player, star)
  {
      star.disableBody(true, true); //'destroy' star when picked up
      score += 10;
      this.scoreText.setText('score: ' + score);

      if (this.stars.countActive(true) === 0) //if all stars are collected
      {
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true); //turn stars on again

      });
        //make bombs
        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }

  }

  hitBomb (player, bomb)
  {
      this.physics.pause(); //stop everything
      this.player.setTint(0xff0000); //turn player red
      this.player.anims.play('turn');
      this.add.text(250, 350, 'game over :(', { fontSize: '42px' })
      gameOver = true; //game over :(
  }
}
