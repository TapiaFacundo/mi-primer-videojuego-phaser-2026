export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

    preload() {
        this.load.image("cielo", "./public/assets/Cielo.webp");
        this.load.image("platform", "./public/assets/platform.png");
        this.load.image("ninja", "./public/assets/Ninja.png");
        this.load.image("triangle", "./public/assets/triangle.png");
        this.load.image("square", "./public/assets/square.png");
        this.load.image("diamond", "./public/assets/diamond.png");
    }

    create() {
        this.score = 0;
        this.add.image(400, 300, "cielo").setDisplaySize(800, 600);
        this.ground = this.physics.add.staticImage(400, 580, "platform").setDisplaySize(800, 40).refreshBody();
        this.player = this.physics.add.image(400, 530, "ninja").setDisplaySize(60, 60);
        this.physics.add.collider(this.player, this.ground);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shapes = this.physics.add.group();
        this.physics.add.overlap(this.player, this.shapes, this.collectShape, null, this);
        this.collected = [];
        this.timeLeft = 60;

        this.scoreTxt = this.add.text(16, 16, "Puntaje: 0", {
            fontSize: "24px",
            color: "#ffffff"
        });

        this.time.addEvent({
            delay: 500,
            callback: this.spawnShape,
            callbackScope: this,
            loop: true
        });

        this.timerTxt = this.add.text(784, 16, "Tiempo: 60", {
            fontSize: "24px",
            color: "#ffffff"
        }).setOrigin(1, 0);

        this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: this.tickTimer,
        callbackScope: this,
        loop: true
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-200);
        }
        
        this.shapes.getChildren().forEach(figura => {
        if (figura.y > 650) {
            figura.destroy();
        }
        });
    }

    spawnShape() {
        const tipos = ["triangle", "square", "diamond"];
        const tipo = tipos[Phaser.Math.Between(0, 2)];
        const x = Phaser.Math.Between(50, 750);

        const figura = this.shapes.create(x, -30, tipo);
        figura.setDisplaySize(40, 40);
        figura.tipo = tipo;
        figura.setVelocityY(200);
    }

    collectShape(player, figura) {
        const puntos = { triangle: 20, square: 30, diamond: 50 };
        this.score += puntos[figura.tipo];
        this.scoreTxt.setText("Puntaje: " + this.score);
        this.collected.push(figura.tipo);
        this.checkWin();
        figura.destroy();
    }

    checkWin() {
        const triangles = this.collected.filter(t => t === "triangle").length;
        const squares = this.collected.filter(t => t === "square").length;
        const diamonds = this.collected.filter(t => t === "diamond").length;

        if (triangles >= 2 && squares >= 2 && diamonds >= 2 && this.score >= 100) {
            console.log("ganaste!");
        }
    }


    tickTimer() {
    this.timeLeft--;
    this.timerTxt.setText("Tiempo: " + this.timeLeft);

    if (this.timeLeft <= 0) {
        console.log("perdiste!");
    }
    }
}