// @param Base class for all entities, sets their x + y, type, triggerBoxes, etc..
class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this);
        this.type = type;
    }

    // Create the inital triggerBox for the entity
    tbox() {
        return new TriggerBox(this.x, this.x + this.width, this.y, this.y + this.height);
    }

    // Check if the Entity is colliding with other entities with triggerBoxes
    isColliding(Entity) {
        return this.tbox().isColliding(Entity.tbox());
    }
}
