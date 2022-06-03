class SkillMenu extends Phaser.Scene {
    constructor() {
        super('SkillMenu');
    }

    preload() {
        this.load.image('skillBackground', 'assets/images/skillMenu_background.png');

        //images of buttons for the player to click
        this.load.image('button', 'assets/images/button.png');

        this.load.image('background', 'assets/images/background.png');

        //audio
        this.load.audio('spend1', 'assets/audio/Coins-Falling-on-floor-a.mp3');
        this.load.audio('spend2', 'assets/audio/Coins-falling-on-floor.mp3');

        this.load.audio('switch1', 'assets/audio/switch01.mp3');
        this.load.audio('switch2', 'assets/audio/switch02.mp3');
    } //end preload

    create() {
        //call and run the HUD
        //this.scene.run('StageOne');

        const skyBackground = this.add.image(0, 0, 'background').setOrigin(0, 0);
        skyBackground.setScale(2, 1.5);
        const backgroundImage = this.add.image(0, 0, 'skillBackground').setOrigin(0, 0);

        //audio
        this.spend1 = this.sound.add('spend1', { loop: false, volume: 0.15 });
        this.spend2 = this.sound.add('spend2', { loop: false, volume: 0.15 });

        this.switch1 = this.sound.add('switch1', { loop: false, volume: 0.05 });
        this.switch2 = this.sound.add('switch2', { loop: false, volume: 0.05 });

        this.createButtons();

        //Title
        const titleStyle = { font: 'bold 64px Arial', fill: '#fff' };
        const subTitleStyle = { font: 'bold 24px Arial', fill: '#fff' };

        const subTitleText = '*You ran out of Time! Level-Up your skills carefully to finish the level!*';

        const skillTitle = this.add.text(config.width * 0.5, 70, 'SKILL MENU', titleStyle).setOrigin(0.5);
        const subTitle = this.add.text(config.width * 0.5, 125, subTitleText, subTitleStyle).setOrigin(0.5);

        //Money
        const moneyStyle = { font: 'bold 20px Arial', fill: '#fff' };
        const widthdrawStyle = { font: 'bold 20px Arial', fill: '#FF6961' };

        const balance = this.add.text(config.width / 2, 170, 'BALANCE', subTitleStyle).setOrigin(0.5);
        this.moneyText = this.add.text(config.width / 2, 200, ' ', moneyStyle).setOrigin(0.5);

        this.withdrawn = this.add.text(config.width / 2, 225, '-50', widthdrawStyle).setOrigin(0.5);
        this.withdrawn.alpha = 0;

        //Invalid funds
        const invalidFundsStyle = { font: 'bold 18px Arial', fill: '#FF6961' };

        this.invalidFunds = this.add
            .text(
                config.width * 0.5,
                245,
                "Sorry mate, I can't give credit! Come back when you're a little... Richer?",
                invalidFundsStyle
            )
            .setOrigin(0.5);
        this.invalidFunds.visible = false;

        this.buttonTitle = this.add.text(config.width * 0.5, 420, ' ').setOrigin(0.5);
        this.buttonSubTitle = this.add.text(config.width * 0.5, 450, ' ').setOrigin(0.5);
        //this.buttonTitle.visible = false;
    } //end create

    update(time, delta) {
        this.moneyText.setText('£' + money);
    } //end update

    //Blink effect for each withdrawal
    withdrawBlink(amt) {
        this.withdrawn.setText('-' + amt);
        this.withdrawn.alpha = 1;
        var blink = this.tweens.add({
            targets: this.withdrawn,
            alpha: 0,
            duration: 400,
            ease: 'Linear',
            repeat: 2,
        });

        var randSound = Phaser.Math.Between(0, 1);

        switch (randSound) {
            case 0:
                this.spend1.play();
                break;
            case 1:
                this.spend2.play();
                break;
            default:
                console.log('no sound played');
                break;
        }
    }

    createButtons() {
        this.createSpeed();
        this.createTime();
        this.createJump();
        this.createBonus();

        this.createConfirm();
    }

    createSpeed() {
        //Speed button
        this.speedButt = this.add.image(415, 325, 'button').setOrigin(0.5).setInteractive();
        this.speedButt.input.alwaysEnabled = true;
        this.speedButt.setAlpha(0.2);

        const titleStyle = { font: 'bold 24px Arial', fill: '#8b91d2' };

        const buttonText = this.add
            .text(this.speedButt.x, this.speedButt.y, 'SPEED', { font: 'bold 20px Arial', fill: '#fff' })
            .setOrigin(0.5);
        buttonText.setAlpha(0.5);

        var titleText =
            'Speed. Increase Speed by ' +
            Math.floor(speedAdd * 100) +
            '%. ' +
            'Level: ' +
            speedCounter +
            ' / ' +
            speedTotal;
        var subText = '£' + speedCost;

        //On mouse move in button
        this.speedButt.on('pointerover', () => {
            this.speedButt.setAlpha(0.6);
            buttonText.setAlpha(1);

            if (speedCounter === speedTotal) {
                this.buttonTitle.setText("You have reached the max level of '" + speedTotal + "' in Speed!");
                this.buttonSubTitle.visible = false;
            } else {
                this.buttonTitle.setText(titleText);
                this.buttonSubTitle.visible = true;
            }

            //Title
            this.buttonTitle.setStyle(titleStyle);
            this.buttonTitle.visible = true;

            //Subtitle
            this.buttonSubTitle.setText(subText);
            this.buttonSubTitle.setStyle(titleStyle);
        });

        //On mouse move out of button
        this.speedButt.on('pointerout', () => {
            this.speedButt.setAlpha(0.2);
            buttonText.setAlpha(0.5);

            //Title
            this.buttonTitle.visible = false;
            //Subtitle
            this.buttonSubTitle.visible = false;

            this.invalidFunds.visible = false;
        });

        //Check if the player has enough money and the skill is not maxed
        this.speedButt.on('pointerdown', () => {
            this.clickSound();
            if (speedCounter != speedTotal && money >= speedCost) {
                //Increase the speed by 'add' and round it down
                skillSpeed += Math.floor(skillSpeed * speedAdd);

                //Increase percentage and cost of speed on next buy
                money -= speedCost;
                this.withdrawBlink(speedCost);
                speedCounter++;
                speedAdd += speedAdd;
                speedCost += Math.floor(speedCost * 0.9);

                //Update the title
                titleText =
                    'Speed. Increase Speed by ' +
                    Math.floor(speedAdd * 100) +
                    '%. Level: ' +
                    speedCounter +
                    ' / ' +
                    speedTotal;
                this.buttonTitle.setText(titleText);

                //Update the subtitle
                subText = '£' + speedCost;
                this.buttonSubTitle.setText(subText);
            } else if (money < speedCost) {
                this.invalidFunds.visible = true;
            }
        });
    } //End createSpeed

    createTime() {
        //Time button
        this.timeButt = this.add.image(565, 325, 'button').setOrigin(0.5).setInteractive();
        this.timeButt.input.alwaysEnabled = true;
        this.timeButt.setAlpha(0.2);

        const titleStyle = { font: 'bold 24px Arial', fill: '#FAF8F6' };

        const buttonText = this.add
            .text(this.timeButt.x, this.timeButt.y, 'TIME', { font: 'bold 20px Arial', fill: '#fff' })
            .setOrigin(0.5);
        buttonText.setAlpha(0.5);

        var titleText = "Time. Increase Time by '3 Seconds'. Level: " + timeCounter + ' / ' + timeTotal;
        var subText = '£' + timeCost;

        //On mouse move in button
        this.timeButt.on('pointerover', () => {
            this.timeButt.setAlpha(0.6);
            buttonText.setAlpha(1);

            if (timeCounter === timeTotal) {
                this.buttonTitle.setText("You have reached the max level of '" + timeTotal + "' in Time!");
                this.buttonSubTitle.visible = false;
            } else {
                this.buttonTitle.setText(titleText);
                this.buttonSubTitle.visible = true;
            }

            //Title
            this.buttonTitle.setStyle(titleStyle);
            this.buttonTitle.visible = true;

            //Subtitle
            this.buttonSubTitle.setText(subText);
            this.buttonSubTitle.setStyle(titleStyle);
        });

        //On mouse move out of button
        this.timeButt.on('pointerout', () => {
            this.timeButt.setAlpha(0.2);
            buttonText.setAlpha(0.5);

            //Title
            this.buttonTitle.visible = false;

            //Subtitle
            this.buttonSubTitle.visible = false;

            this.invalidFunds.visible = false;
        });

        //Check if the player has enough money and the skill is not maxed
        this.timeButt.on('pointerdown', () => {
            this.clickSound();
            if (timeCounter != timeTotal && money >= timeCost) {
                //Increase the Time by 'add' and round it down
                skillTime += timeAdd;

                //Increase percentage and cost of Time on next buy
                money -= timeCost;
                this.withdrawBlink(timeCost);
                timeCounter++;
                timeCost += Math.floor(timeCost * 0.8);

                //Update the title
                titleText = "Time. Increase Time by '3 Seconds'. Level: " + timeCounter + ' / ' + timeTotal;
                this.buttonTitle.setText(titleText);

                //Update subtitle
                subText = '£' + timeCost;
                this.buttonSubTitle.setText(subText);
            } else if (money < timeCost) {
                this.invalidFunds.visible = true;
            }
        });
    } //End createTime

    createJump() {
        //Jump button
        this.jumpButt = this.add.image(715, 325, 'button').setOrigin(0.5).setInteractive();
        this.jumpButt.input.alwaysEnabled = true;
        this.jumpButt.setAlpha(0.2);

        const titleStyle = { font: 'bold 24px Arial', fill: '#82a88d' };

        const buttonText = this.add
            .text(this.jumpButt.x, this.jumpButt.y, 'JUMP', { font: 'bold 20px Arial', fill: '#fff' })
            .setOrigin(0.5);
        buttonText.setAlpha(0.5);

        var titleText =
            'Jump. Increase Jump by ' + Math.floor(jumpAdd * 100) + '%. ' + 'Level: ' + jumpCounter + ' / ' + jumpTotal;
        var subText = '£' + jumpCost;

        //On mouse move in button
        this.jumpButt.on('pointerover', () => {
            this.jumpButt.setAlpha(0.6);
            buttonText.setAlpha(1);

            if (jumpCounter === jumpTotal) {
                this.buttonTitle.setText("You have reached the max level of '" + jumpTotal + "' in Jump!");
                this.buttonSubTitle.visible = false;
            } else {
                this.buttonTitle.setText(titleText);
                this.buttonSubTitle.visible = true;
            }

            //Title
            this.buttonTitle.setStyle(titleStyle);
            this.buttonTitle.visible = true;

            //Subtitle
            this.buttonSubTitle.setText(subText);
            this.buttonSubTitle.setStyle(titleStyle);
        });

        //On mouse move out of button
        this.jumpButt.on('pointerout', () => {
            this.jumpButt.setAlpha(0.2);
            buttonText.setAlpha(0.5);

            //Title
            this.buttonTitle.visible = false;
            //Subtitle
            this.buttonSubTitle.visible = false;

            this.invalidFunds.visible = false;
        });

        //Check if the player has enough money and the skill is not maxed
        this.jumpButt.on('pointerdown', () => {
            this.clickSound();
            if (jumpCounter != jumpTotal && money >= jumpCost) {
                //Increase the Jump by 'add' and round it down
                skillJump += Math.floor(skillJump * jumpAdd);

                //Increase percentage and cost of Jump on next buy
                jumpCounter++;
                this.withdrawBlink(jumpCost);
                jumpAdd += jumpAdd;
                money -= jumpCost;
                jumpCost += Math.floor(jumpCost * 0.8);

                //Update the title
                titleText =
                    'Jump. Increase Jump by ' +
                    Math.floor(jumpAdd * 100) +
                    '%. Level: ' +
                    jumpCounter +
                    ' / ' +
                    jumpTotal;
                this.buttonTitle.setText(titleText);

                //Update the subtitle
                subText = '£' + jumpCost;
                this.buttonSubTitle.setText(subText);
            } else if (money < jumpCost) {
                this.invalidFunds.visible = true;
            }
        });
    } //End createJump

    createBonus() {
        //Bonus button
        this.bonusMoneyButt = this.add.image(865, 325, 'button').setOrigin(0.5).setInteractive();
        this.bonusMoneyButt.input.alwaysEnabled = true;
        this.bonusMoneyButt.setAlpha(0.2);

        const titleStyle = { font: 'bold 24px Arial', fill: '#cd904f' };

        const buttonText = this.add
            .text(this.bonusMoneyButt.x, this.bonusMoneyButt.y, 'BONUS', { font: 'bold 20px Arial', fill: '#fff' })
            .setOrigin(0.5);
        buttonText.setAlpha(0.5);

        var titleText = 'Bonus. Increase Bonus by ' + bonusAdd + '%. ' + 'Level: ' + bonusCounter + ' / ' + bonusTotal;
        var subText = '£' + bonusCost;

        //On mouse move in button
        this.bonusMoneyButt.on('pointerover', () => {
            this.bonusMoneyButt.setAlpha(0.6);
            buttonText.setAlpha(1);

            if (bonusCounter === bonusTotal) {
                this.buttonTitle.setText("You have reached the max level of '" + bonusTotal + "' in Bonus!");
                this.buttonSubTitle.visible = false;
            } else {
                this.buttonTitle.setText(titleText);
                this.buttonSubTitle.visible = true;
            }

            //Title
            this.buttonTitle.setStyle(titleStyle);
            this.buttonTitle.visible = true;

            //Subtitle
            this.buttonSubTitle.setText(subText);
            this.buttonSubTitle.setStyle(titleStyle);
        });

        //On mouse move out of button
        this.bonusMoneyButt.on('pointerout', () => {
            this.bonusMoneyButt.setAlpha(0.2);
            buttonText.setAlpha(0.5);

            //Title
            this.buttonTitle.visible = false;
            //Subtitle
            this.buttonSubTitle.visible = false;

            this.invalidFunds.visible = false;
        });

        //Check if the player has enough money and the skill is not maxed
        this.bonusMoneyButt.on('pointerdown', () => {
            this.clickSound();
            if (bonusCounter != bonusTotal && money >= bonusCost) {
                //Increase the Bonus by 'bonusAdd' and round it down
                skillBonus += Math.floor(skillBonus * bonusAdd);

                //Increase percentage and cost of Bonus on next buy
                bonusCounter++;
                this.withdrawBlink(bonusCost);
                bonusAdd += bonusAdd;
                money -= bonusCost;
                bonusCost += Math.floor(bonusCost * 5);

                //Update the title
                titleText = 'Bonus. Increase Bonus by ' + bonusAdd + '%. Level: ' + bonusCounter + ' / ' + bonusTotal;
                this.buttonTitle.setText(titleText);

                //Update the subtitle
                subText = '£' + bonusCost;
                this.buttonSubTitle.setText(subText);
            } else if (money < bonusCost) {
                this.invalidFunds.visible = true;
            }
        });
    } //End createBonus

    createConfirm() {
        this.confirmButt = this.add
            .image(config.width / 2, 665, 'button')
            .setOrigin(0.5)
            .setInteractive();
        this.confirmButt.input.alwaysEnabled = true;
        this.confirmButt.setAlpha(0.2);

        const buttonText = this.add
            .text(this.confirmButt.x, this.confirmButt.y, 'CONFIRM', { font: 'bold 20px Arial', fill: '#fff' })
            .setOrigin(0.5);
        buttonText.setAlpha(0.5);

        //On mouse move in button
        this.confirmButt.on('pointerover', () => {
            this.confirmButt.setAlpha(0.6);
            buttonText.setAlpha(1);
        });

        //On mouse move out of button
        this.confirmButt.on('pointerout', () => {
            this.confirmButt.setAlpha(0.2);
            buttonText.setAlpha(0.5);
        });

        //Check if the player has enough money and the skill is not maxed
        this.confirmButt.on('pointerdown', () => {
            this.clickSound();
            //Restart the scene when the player 'dies'
            this.scene.start('StageOne');

            console.log('Switching to Stage One');
        });
    } //End confirm

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
