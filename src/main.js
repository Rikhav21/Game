import Phaser from 'phaser'

let player;
let cursors;
const config = {
    type: Phaser.AUTO,

    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.9,


    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

function preload() {
    this.load.image('triangle', 'imgs/triangle.png');
    this.load.image('circle', 'imgs/circle.png');
    this.load.image('square', 'imgs/square.png');
}

function create() {

    const worldWidth = config.width;
    const worldHeight = config.height;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.add.rectangle(
        worldWidth / 2,
        worldHeight / 2,
        worldWidth,
        worldHeight,
        0x222222
    );
    
    let score = 0;
    player = this.physics.add.sprite(100, 100, 'triangle');

    player.setCollideWorldBounds(true);
    player.setBounce(0);

    cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group();
    this.time.addEvent({
      delay:400,
      callback: spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.bullets = this.physics.add.group();
    this.time.addEvent({
      delay:200,
      callback: spawnBullets,
      callbackScope: this,
      loop: true
    });
    this.physics.add.overlap(
        this.bullets,
        this.enemies,
        bulletHitEnemy,
        null,
        this
    );
    this.physics.add.overlap(
        player,
        this.enemies,
        lost,
        null,
        this
    )
    this.scoreT = this.add.text(10,10,'Score: 0',{
        fontSize:'20px',
        color:'#ffffff'
    }).setScrollFactor(0);
}

function spawnEnemy(){
  var num = Math.floor(Math.random()*4);
  var x;
  var y;
  if(num === 0){
    x = 0; 
    y = Math.floor(Math.random()*config.height);
  }
  else if(num ===1){
    x =  config.width;
    y=Math.floor(Math.random()*config.height);
  }
  else if(num === 2){
    y = 0;
    x = Math.floor(Math.random()*config.width);
  }
  else{
    y = config.height;
    x = Math.floor(Math.random()*config.width);
  }
  const enemy = this.enemies.create(x,y,'square');
}

function lost(){
    this.physics.pause();
    this.add.text(
        config.width /2,
        config.height/2,
        'Game Over! You had '+score+" points!",
        {
            fontSize: '64px',
            color: '#ff0000'
        }
    ).setOrigin(0.5);

    const restartText = this.add.text(
        config.width/2,
        config.height/2+40,
        'RESTART',
        {
            fontSize:'32px',
            color: '#ffffff',
            backgroundColor: '#000000'
        }
    ).setOrigin(0.5);

    restartText.setInteractive();
    restartText.on('pointerdown',() =>{
        this.scene.restart();
    });
}

function spawnBullets(){
    const pointer = this.input.activePointer;
    const bullet = this.bullets.create(player.x, player.y, 'circle');
    const angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        pointer.x,
        pointer.y
    );
    bullet.setVelocityX(Math.sin(angle + Math.PI / 2) * 360);
    bullet.setVelocityY(-Math.cos(angle + Math.PI / 2) * 360);
    
}

function bulletHitEnemy(bullet, enemy){
    bullet.destroy();
    enemy.destroy();
    score+=1;
    this.scoreT.setText('Score: '+score);
}

function update() {

    const speed = 250;

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(speed);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(speed);
    }

    const pointer = this.input.activePointer;

    const angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        pointer.x,
        pointer.y
    );
    player.setRotation(angle + Math.PI / 2);
    this.enemies.getChildren().forEach((enemy)=>{
      this.physics.moveToObject(enemy,player,100);
    });
}
