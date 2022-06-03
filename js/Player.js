//Information and stats about the player sprite and how it functions.
class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'robo_player_0' }],
            frameRate: 10,
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'robo_player_1' }],
            frameRate: 10,
        });

        ////////////////
        // input
        const { LEFT, RIGHT, UP, DOWN, W, A, S, D, E, SPACE, SHIFT, TAB, ESC, R } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D,
            e: E,
            space: SPACE,
            shift: SHIFT,
            tab: TAB,
            esc: ESC,
            r: R,
        });

        this.mouse = this.scene.input.mousePointer;
    } // end constructor

    // Update called in SceneMain
    update(time, delta) {
        const { keys } = this; //output: this.keys

        ////////////////
        // Keeping the health, ammo and money within bounds
        if (this.health >= 100) {
            this.health = 100;
        } else if (this.health <= 0) {
            /// do something with death
        }

        if (this.money <= 0) {
            this.money = 0;
        }

        this.otherInput(keys);
        this.movementControls(keys, skillSpeed);
    }

    //@param Used to neatly keep the movement keys for the player
    movementControls(keys, skillSpeed) {
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-skillSpeed);
            if (this.body.onFloor()) {
                this.play('walk', true);
            }
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(skillSpeed);
            if (this.body.onFloor()) {
                this.play('walk', true);
            }
        } else {
            this.body.setVelocityX(0);

            if (this.body.onFloor()) {
                this.play('idle', true);
            }
        }

        //Check if the player can jump or not
        if ((keys.space.isDown || keys.space.isDown) && this.body.onFloor()) {
            this.body.setVelocityY(-skillJump);
            this.play('jump', true);
        }

        //Flip the player based on their direction
        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }
    }

    //@param Used to neatly keep any other key input other than movement
    //@returns input keys and actions
    otherInput(keys) {
        // Interaction
        if (keys.e.isDown) {
            this.actionKey = true;
        } else if (keys.e.isUp) {
            this.actionKey = false;
        }
        if (keys.r.isDown) {
            this.hasReloaded = true;
        } else if (keys.r.isUp) {
            this.hasReloaded = false;
        }
    }
}
