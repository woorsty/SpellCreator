"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
const skill_1 = require("./skill");
class Attribute extends skill_1.Skill {
    constructor() {
        super(...arguments);
        this.value = 0;
        this.savingThrow = 0;
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=attribute.js.map