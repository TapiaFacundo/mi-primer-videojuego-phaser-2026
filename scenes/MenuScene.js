export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image("fondo-menu", "./public/assets/FondoMenu.jpg");
    }

    create() {
        this.add.image(400, 300, "fondo-menu").setDisplaySize(800, 600);

        this.add.text(400, 150, "NINJA MONCHO", {
        fontSize: "64px",
        color: "#ffffff"
        }).setOrigin(0.5);

        const boton = this.add.text(400, 350, "JUGAR", {
        fontSize: "32px",
        color: "#ffffff"
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        boton.on("pointerdown", () => {
        this.scene.start("GameScene");
        });
    }
}