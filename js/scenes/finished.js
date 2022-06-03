class Finished extends Phaser.Scene {
    constructor() {
        super('Finished');
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('banner', 'assets/images/winnerBanner.png');
    } //end preload

    create() {
        const skyBackground = this.add.image(0, 0, 'background').setOrigin(0);
        skyBackground.setScale(2, 1.4);

        const titleStyle = { font: 'bold 64px Arial', fill: '#fff' };
        const title = this.add
            .text(config.width / 2, config.height / 2.4, 'thanks for playing :)', titleStyle)
            .setOrigin(0.5);

        const subtitleStyle = { font: 'bold 20px Arial', fill: '#fff' };
        const subtitle = this.add
            .text(config.width / 2, config.height / 2, "*i didn't have time to make other maps*", subtitleStyle)
            .setOrigin(0.5);
    } //end create
}
