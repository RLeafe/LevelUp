// @param main scene for the game, ideally would be called a specific level, but I only have time to make one :)
class Hud extends Phaser.Scene {
    constructor() {
        super('Hud');
    }

    /** @type {CountdownController} */
    countdown;

    preload() {
        this.load.audio('bang', 'assets/audio/FireWorks-Double-Pop.mp3');
        this.load.audio('fizz', 'assets/audio/FireWorks-Rocket-Whistles.mp3');
    } //end preload

    create() {
        //call and run the HUD
        this.stageOne = this.scene.get('StageOne');

        this.createParticles();

        var style = { font: 'bold 24px Arial', fill: '#000000' };

        var timeTile = this.add.text(config.width / 2, 15, 'T I M E', {
            font: 'bold 30px Arial',
            fill: '#000000',
        });

        hudMoney = this.add.text(25, 25, '£ ' + money, style);
        hudAttempts = this.add.text(23, 50, 'Tries: ' + attempts, style);

        //audio
        this.bang = this.sound.add('bang', { loop: false, volume: 0.15 });
        this.fizz = this.sound.add('fizz', { loop: false, volume: 0.15 });

        this.winner = this.add
            .text(config.width / 2, config.height / 2, 'WINNER', {
                font: 'bold 132px Arial',
                fill: '#000000',
            })
            .setOrigin(0.5);
        this.winner.alpha = 0;

        ////////////
        // Countdown
        this.timerLabel = this.add
            .text(config.width * 0.538, 60, '45', { font: 'bold 28px Arial', fill: '#000000' })
            .setOrigin(0.5);

        this.countdown = new CountdownController(this, this.timerLabel);
        this.countdown.start(this.handleCountdownFinished.bind(this), skillTime);
    } //end create

    update(time, delta) {
        this.countdown.update();
    } //end update

    handleCountdownFinished() {
        //Restart the scene when the player 'dies'
        this.stageOne = this.scene.stop('StageOne');
        attempts += 1;
        this.scene.stop('Hud');
        this.scene.start('SkillMenu');

        console.log('Switching to Skill Menu');
    }

    refreshMoney() {
        hudMoney.setText('£ ' + money);
    }

    //Particles
    createParticles() {
        cannon1 = this.add.particles('confetti');
        cannon2 = this.add.particles('confetti');

        cannon1.createEmitter({
            x: 0,
            y: 770,
            lifespan: 3500,
            speed: { min: 50, max: 400 },
            angle: 295,
            gravityY: 220,
            scale: { start: 0.5, end: 0 },
            quantity: 2,
        });

        cannon2.createEmitter({
            x: config.width,
            y: 770,
            lifespan: 3500,
            speed: { min: 50, max: 400 },
            angle: 245,
            gravityY: 220,
            scale: { start: 0.5, end: 0 },
            quantity: 2,
        });

        cannon1.pause();
        cannon2.pause();
    }

    confettiOnWin() {
        cannon1.resume();
        cannon2.resume();

        this.winner.alpha = 1;

        this.bang.play();
        this.fizz.play();
    }
}
