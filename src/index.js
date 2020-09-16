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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var platforms;
var cursors;
var score = 0;
var scoreText;
var gameOverText;
var gameOver = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png'); //import all the assets :)
    this.load.image('sun', 'assets/sun.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky'); //load bg sky
    this.add.image(0, 0, 'sun').setOrigin(0,0); //load at center instead of middle

    platforms = this.physics.add.staticGroup(); //create platforms

    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //bottom platform

    platforms.create(60, 300, 'ground').setScale(0.5).refreshBody(); //tiny platform on left
    platforms.create(400, 425, 'ground').setScale(0.75).refreshBody(); //med platform in mi
    platforms.create(220, 150, 'ground').setScale(0.5).refreshBody(); //tiny platform on top
    platforms.create(750, 220, 'ground').setScale(1.4).refreshBody(); //large platform on right

    player = this.physics.add.sprite(100, 450, 'dude'); //create player

    player.setBounce(0.2); //bouncy boy
    player.setCollideWorldBounds(true); //stays inside screen
    player.body.setGravityY(30); //gravityyy

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

    stars = this.physics.add.group({ //create stars
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) { //make em bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group(); //create bombs

    this.physics.add.collider(player, platforms); //collider between player & ground
    this.physics.add.collider(stars, platforms); //collider between ground & stars
    this.physics.add.collider(bombs, platforms); //collider between ground & bombs

    this.physics.add.overlap(player, stars, collectStar, null, this); //trigger between player & stars
    this.physics.add.collider(player, bombs, hitBomb, null, this); //trigger between player & bombs

    scoreText = this.add.text(575, 16, 'score: 0', { fontSize: '32px', fill: '#000' }); //ui score
    gameOverText = this.add.text(250, 350, ' ', { fontSize: '42px', fill: '#000' });
    cursors = this.input.keyboard.createCursorKeys(); //ability to move :)
}

function update ()
{
  if (gameOver)
  {
    return;
  }
  //check for player movement inputs!
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
      player.anims.play('right', true);
  }
  else
  {
      player.setVelocityX(0);
      player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-330);
  }
}

function collectStar (player, star)
{
    star.disableBody(true, true); //'destroy' star when picked up
    score += 10;
    scoreText.setText('score: ' + score);

    if (stars.countActive(true) === 0) //if all stars are collected
    {
      stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true); //turn stars on again

    });
      //make bombs
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  }

}
function hitBomb (player, bomb)
{
    this.physics.pause(); //stop everything
    player.setTint(0xff0000); //turn player red
    player.anims.play('turn');
    gameOverText.setText('game over :(');
    gameOver = true; //game over :(
}
