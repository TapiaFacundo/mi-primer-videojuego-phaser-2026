export default class EndScene extends Phaser.Scene {
    constructor() {
        super("EndScene");
    }

    init(data) {
        this.won = data.won;
        this.score = data.score;
    }

    preload() {
        this.load.image("fondo-menu", "./public/assets/FondoMenu.jpg");
    }

    create() {
        this.add.image(400, 300, "fondo-menu").setDisplaySize(800, 600);

        const titulo = this.won ? "¡GANASTE!" : "PERDISTE";
        const color = this.won ? "#00ff00" : "#ff0000";

        this.add.text(400, 200, titulo, {
            fontSize: "64px",
            color: color
        }).setOrigin(0.5);

        this.add.text(400, 300, "Puntaje: " + this.score, {
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5);

        const boton = this.add.text(400, 400, "REINTENTAR", {
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
    }

}