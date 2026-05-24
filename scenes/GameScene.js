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
        this.collected = [];
        this.timeLeft = 10;

        this.add.image(400, 300, "cielo").setDisplaySize(800, 600);

        this.ground = this.physics.add.staticImage(400, 580, "platform").setDisplaySize(800, 40).refreshBody();
        this.platform1 = this.physics.add.staticImage(100, 450, "platform").setDisplaySize(200, 20).refreshBody();
        this.platform2 = this.physics.add.staticImage(700, 450, "platform").setDisplaySize(200, 20).refreshBody();
        this.platform3 = this.physics.add.staticImage(400, 320, "platform").setDisplaySize(200, 20).refreshBody();

        this.player = this.physics.add.image(400, 530, "ninja").setDisplaySize(60, 60);

        this.shapes = this.physics.add.group();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platform1);
        this.physics.add.collider(this.player, this.platform2);
        this.physics.add.collider(this.player, this.platform3);

        this.physics.add.collider(this.shapes, this.ground, this.onBounce, null, this);
        this.physics.add.collider(this.shapes, this.platform1, this.onBounce, null, this);
        this.physics.add.collider(this.shapes, this.platform2, this.onBounce, null, this);
        this.physics.add.collider(this.shapes, this.platform3, this.onBounce, null, this);

        this.physics.add.overlap(this.player, this.shapes, this.collectShape, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreTxt = this.add.text(16, 16, "Puntaje: 0", {
        fontSize: "24px",
        color: "#ffffff"
        });

        this.timerTxt = this.add.text(784, 16, "Tiempo: 60", {
        fontSize: "24px",
        color: "#ffffff"
        }).setOrigin(1, 0);

        this.time.addEvent({
        delay: 500,
        callback: this.spawnShape,
        callbackScope: this,
        loop: true
        });

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
        this.player.setVelocityY(-430);
        }

        this.shapes.getChildren().forEach(figura => {
        if (figura.y > 650) {
            figura.destroy();
        }
        });
    }

    spawnShape() {
        const tipos = ["triangle", "square", "diamond", "bomb"];
        const tipo = tipos[Phaser.Math.Between(0, 3)];
        const x = Phaser.Math.Between(50, 750);
        const puntos = { triangle: 20, square: 30, diamond: 50, bomb: -40 };

        const figura = this.shapes.create(x, -30, tipo === "bomb" ? "square" : tipo);
        figura.setDisplaySize(40, 40);
        figura.tipo = tipo;
        figura.hp = puntos[tipo];
        figura.setVelocityY(200);
        figura.setBounce(0.6);

        if (tipo === "bomb") {
        figura.setTint(0xff0000);
        figura.rebotes = 0;
        }
    }

    collectShape(player, figura) {
        this.score += figura.hp;
        this.scoreTxt.setText("Puntaje: " + this.score);
        this.collected.push(figura.tipo);
        figura.destroy();
        this.checkWin();
    }

    checkWin() {
        const triangles = this.collected.filter(t => t === "triangle").length;
        const squares = this.collected.filter(t => t === "square").length;
        const diamonds = this.collected.filter(t => t === "diamond").length;

        if (triangles >= 2 && squares >= 2 && diamonds >= 2 && this.score >= 100) {
        this.scene.start("EndScene", { won: true, score: this.score });
        }
    }

    tickTimer() {
        this.timeLeft--;
        this.timerTxt.setText("Tiempo: " + this.timeLeft);

        if (this.timeLeft <= 0) {
        this.scene.start("EndScene", { won: false, score: this.score });
        }
    }

    onBounce(ground, figura) {
        if (figura.tipo === "bomb") {
        figura.rebotes++;
        if (figura.rebotes >= 3) {
            figura.destroy();
        }
        return;
        }
        figura.hp -= 5;
        if (figura.hp <= 0) {
        figura.destroy();
        }
    }
}