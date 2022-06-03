// @param main scene for the game, ideally would be called a specific level, but I only have time to make one :)
class MainMenu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('playButton', 'assets/images/playButton.png');

        this.load.audio('switch1', 'assets/audio/switch01.mp3');
        this.load.audio('switch2', 'assets/audio/switch02.mp3');
    } //end preload

    create() {
        const skyBackground = this.add.image(0, 0, 'background').setOrigin(0);
        skyBackground.setScale(2, 1.4);

        const titleStyle = { font: 'bold 85px Arial', fill: '#fff' };

        const title = this.add.text(config.width / 2, 85, 'Level-Up', titleStyle).setOrigin(0.5);

        this.createButton();

        //audio
        this.switch1 = this.sound.add('switch1', { loop: false, volume: 0.05 });
        this.switch2 = this.sound.add('switch2', { loop: false, volume: 0.05 });

        const subTitleStyle = { font: 'bold 42px Arial', fill: '#000000' };
        const subtitleText = 'Get money and level-up skills to complete each level!';
        const subtitle = this.add.text(config.width / 2, 600, subtitleText, subTitleStyle).setOrigin(0.5);
        //
    } //end create

    update(time, delta) {} //end update

    createButton() {
        //Speed button
        this.playButton = this.add
            .image(config.width / 2, config.height / 2.2, 'playButton')
            .setOrigin(0.5)
            .setInteractive();
        this.playButton.input.alwaysEnabled = true;
        this.playButton.setAlpha(0.5);
        this.playButton.setScale(3);

        const titleStyle = { font: 'bold 24px Arial', fill: '#8b91d2' };

        const buttonText = this.add
            .text(this.playButton.x, this.playButton.y, 'PLAY', { font: 'bold 32px Arial', fill: '#fff' })
            .setOrigin(0.5);
        buttonText.setAlpha(0.5);

        //On mouse move in button
        this.playButton.on('pointerover', () => {
            this.playButton.setAlpha(0.9);
            buttonText.setAlpha(1);
        });

        //On mouse move out of button
        this.playButton.on('pointerout', () => {
            this.playButton.setAlpha(0.5);
            buttonText.setAlpha(0.5);
        });

        //Check if the player has enough money and the skill is not maxed
        this.playButton.on('pointerdown', () => {
            this.clickSound();
            this.scene.stop('MainMenu');
            //Start the game
            this.scene.start('StageOne');

            console.log('Switching to Stage One');
        });
    } //End button

    clickSound() {
        var randSound = Phaser.Math.Between(0, 1);

        switch (randSound) {
            case 0:
                this.switch1.play();
                break;
            case 1:
                this.switch1.play();
                break;
            default:
                console.log('no sound played');
                break;
        }
    }
}
