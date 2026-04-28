"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
const skill_1 = require("./skill");
class Attribute extends skill_1.Skill {
    constructor(init) {
        super(init);
        this.value = 0;
        this.savingThrow = 0;
        Object.assign(this, init);
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=attribute.js.map