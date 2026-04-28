"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weapon = void 0;
class Weapon {
    constructor(init) {
        this.name = "";
        this.attackBonus = 0;
        this.difficultyBonus = 0;
        this.damage = "";
        this.damageType = "";
        this.notes = "";
        Object.assign(this, init);
    }
}
exports.Weapon = Weapon;
//# sourceMappingURL=weapon.js.map