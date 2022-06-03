// @param main scene for the game, ideally would be called a specific level, but I only have time to make one :)
class StageOne extends Phaser.Scene {
    constructor() {
        super('StageOne');
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('point', 'assets/images/point.png');
        this.load.image('water', 'assets/images/water.png');
        this.load.image('confetti', 'assets/images/confetti.png');
        this.load.image('finish', 'assets/images/finishLine.png');

        // At last image must be loaded with its JSON
        this.load.atlas('player', 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json');
        this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');

        //audio
        this.load.audio('collect1', 'assets/audio/Bag-of-Coins-B.mp3');
        this.load.audio('collect2', 'assets/audio/Collecting-Money-Coins-F.mp3');
        this.load.audio('collect3', 'assets/audio/Collecting-Money-Coins-B.mp3');

        this.player;
        this.finish;
        this.points;
        this.waters;
    } //end preload

    create() {
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        backgroundImage.setScale(5, 1.5);

        //call and run the HUD
        this.scene.run('Hud');
        hud = this.scene.get('Hud');

        //audio
        this.collect1 = this.sound.add('collect1', { loop: false, volume: 0.15 });
        this.collect2 = this.sound.add('collect2', { loop: false, volume: 0.15 });
        this.collect3 = this.sound.add('collect3', { loop: false, volume: 0.15 });

        map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tempTileset', 'tiles');
        grounds = map.createLayer('Grounds', tileset, 0, 0);
        grounds.setCollisionByExclusion(-1, true);

        // set the boundaries of our game world to be the same as the Tiled map
        this.physics.world.bounds.width = grounds.width;
        this.physics.world.bounds.height = grounds.height;

        //SpawnPoint
        spawnPoint = map.findObject('ObjectsOther', (obj) => obj.name === 'SpawnPoint');

        //FinishLine
        finishLine = map.findObject('ObjectsOther', (obj) => obj.name === 'Finish');

        this.createFinishLine();

        this.createPlayer();
        this.createWater();
        this.createPoints();

        this.physics.add.collider(this.player, this.points, this.playerHit, null, this);

        this.physics.add.collider(this.player, this.waters, this.touchWater, null, this);
    } //end create

    update(time, delta) {
        this.player.update(time, delta);

        this.checkFinished();
    } //end update

    checkFinished() {
        if (this.player.isColliding(this.finish)) {
            console.log('Finished!!');
            hud.countdown.stop();
            hud.confettiOnWin();

            this.time.addEvent({
                delay: 6000,
                callback: () => {
                    this.scene.start('Finished');
                    this.scene.stop('Hud');
                    this.scene.stop('SkillMenu');
                    this.scene.stop('StageOne');
                },
                loop: false,
            });
        }
    }

    createPlayer() {
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player').setDepth(1).setOrigin(0.5);

        this.physics.add.collider(this.player, grounds);
        //this.player.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(this.player.width - 25);
        //this.player.body.setSize(20, 20);

        //this.cameras.main.setZoom(0.25);
        this.cameras.main.startFollow(this.player.body);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    createFinishLine() {
        this.finish = new FinishLine(this, finishLine.x, finishLine.y, 'finish').setDepth(1).setOrigin(0.5);
        this.physics.add.collider(this.finish, grounds);
    }

    playerHit(player, point) {
        money += skillBonus;

        hud.refreshMoney();

        var randSound = Phaser.Math.Between(0, 2);

        switch (randSound) {
            case 0:
                this.collect1.play();
                break;
            case 1:
                this.collect2.play();
                break;
            case 2:
                this.collect3.play();
                break;
            default:
                console.log('no sound played');
                break;
        }

        point.destroy();
    }

    createPoints() {
        // Create a point group for all points
        this.points = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        map.getObjectLayer('Points').objects.forEach((point) => {
            // Add new points to our points group
            const pointSprite = this.points.create(point.x, point.y - point.height, 'point').setOrigin(0);
            pointSprite.body.setSize(point.width - 32, point.height - 32);
        });
    }

    createWater() {
        // Create water group for all water points
        this.waters = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        map.getObjectLayer('Water').objects.forEach((water) => {
            // Add new water to our waters group
            const waterSprite = this.waters.create(water.x, water.y - water.height, 'water').setOrigin(0);
        });
    }

    touchWater() {
        this.player.setPosition(spawnPoint.x, spawnPoint.y);
    }
}
