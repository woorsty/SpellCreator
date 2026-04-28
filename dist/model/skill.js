"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
class Skill {
    constructor(init) {
        this.name = "";
        this.proficiency = false;
        this.modifier = 0;
        this.expertise = false;
        Object.assign(this, init);
    }
}
exports.Skill = Skill;
//# sourceMappingURL=skill.js.map