/**
 * @param Basic collsion box (TriggerBox) for entities within the game.
 * @author Almas Baimagambetov - https://youtu.be/MrTW2K1i1Mk
 */

class TriggerBox {
    constructor(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    /**
     * @param {Object} TriggerBox
     * @returns TriggerBox boundries defined for each Entity
     */

    isColliding(TriggerBox) {
        return (
            this.maxX >= TriggerBox.minX &&
            this.minX <= TriggerBox.maxX &&
            this.maxY >= TriggerBox.minY &&
            this.minY <= TriggerBox.maxY
        );
    }
}
