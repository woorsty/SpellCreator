"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFilePath = exports.CharacterSheet = void 0;
const attribute_1 = require("./attribute");
const skill_1 = require("./skill");
const weapon_1 = require("./weapon");
const Alignment_1 = require("./Alignment");
const path_1 = __importDefault(require("path"));
const species_1 = require("./species");
class CharacterSheet {
    constructor(init) {
        this.name = "";
        this.background = "";
        this.class = "";
        this.species = species_1.Species.Human;
        this.subclass = "";
        this.level = 1;
        this.xp = 0;
        this.armorClass = 0;
        this.currentHitpoints = 0;
        this.temporaryHitpoints = 0;
        this.maxHitpoints = 0;
        this.spentHitDice = 0;
        /**
         * Die Art des Trefferwürfels z.B. für W6: 6, für W8: 8, etc.
         */
        this.hitDiceValue = 0;
        this.successDeathSaves = 0;
        this.failedDeathSaves = 0;
        this.proficiencyBonus = 2;
        this.strength = new attribute_1.Attribute();
        this.athletics = new skill_1.Skill();
        this.dexterity = new attribute_1.Attribute();
        this.acrobatics = new skill_1.Skill();
        this.sleightOfHand = new skill_1.Skill();
        this.stealth = new skill_1.Skill();
        this.constitution = new attribute_1.Attribute();
        this.intelligence = new attribute_1.Attribute();
        this.arcana = new skill_1.Skill();
        this.history = new skill_1.Skill();
        this.investigation = new skill_1.Skill();
        this.nature = new skill_1.Skill();
        this.religion = new skill_1.Skill();
        this.wisdom = new attribute_1.Attribute();
        this.animalHandling = new skill_1.Skill();
        this.insight = new skill_1.Skill();
        this.medicine = new skill_1.Skill();
        this.perception = new skill_1.Skill();
        this.survival = new skill_1.Skill();
        this.charisma = new attribute_1.Attribute();
        this.deception = new skill_1.Skill();
        this.intimidation = new skill_1.Skill();
        this.performance = new skill_1.Skill();
        this.persuasion = new skill_1.Skill();
        this.heroicInspiration = false;
        this.lightArmorTraining = false;
        this.mediumArmorTraining = false;
        this.heavyArmorTraining = false;
        this.shieldTraining = false;
        this.weaponTrainingSimple = false;
        this.weaponTrainingMartial = false;
        this.toolTraining = [];
        this.initiative = 0;
        this.speed = 0;
        this.size = "";
        this.passivePerception = 0;
        this.weapons = [];
        this.damageCantrips = [];
        this.classFeatures = [];
        this.speciesTraits = [];
        this.feats = [];
        this.spellcastingAbility = null;
        this.spellSaveDC = 0;
        this.spellAttackBonus = 0;
        this.totalSpellSlots1 = 0;
        this.totalSpellSlots2 = 0;
        this.totalSpellSlots3 = 0;
        this.totalSpellSlots4 = 0;
        this.totalSpellSlots5 = 0;
        this.totalSpellSlots6 = 0;
        this.totalSpellSlots7 = 0;
        this.totalSpellSlots8 = 0;
        this.totalSpellSlots9 = 0;
        this.usedSpellSlots1 = 0;
        this.usedSpellSlots2 = 0;
        this.usedSpellSlots3 = 0;
        this.usedSpellSlots4 = 0;
        this.usedSpellSlots5 = 0;
        this.usedSpellSlots6 = 0;
        this.usedSpellSlots7 = 0;
        this.usedSpellSlots8 = 0;
        this.usedSpellSlots9 = 0;
        this.cantripsAndPreparedSpells = [];
        this.appearance = "";
        this.backstory = "";
        this.alignment = null;
        this.languages = [];
        this.equipment = [];
        this.magicItemAttunement1 = "";
        this.magicItemAttunement2 = "";
        this.magicItemAttunement3 = "";
        this.copper = 0;
        this.silver = 0;
        this.electrum = 0;
        this.gold = 0;
        this.platinum = 0;
        Object.assign(this, init);
    }
    static getTestCharacter() {
        return new CharacterSheet({
            name: "Test Character",
            background: "A brave adventurer",
            class: "Fighter",
            species: species_1.Species.Human,
            subclass: "Champion",
            level: 5,
            xp: 6500,
            armorClass: 16,
            currentHitpoints: 38,
            temporaryHitpoints: 0,
            maxHitpoints: 38,
            hitDiceValue: 10,
            successDeathSaves: 0,
            failedDeathSaves: 0,
            proficiencyBonus: 3,
            strength: new attribute_1.Attribute({
                value: 16,
                savingThrow: 5,
                proficiency: true,
                modifier: 3,
            }),
            athletics: new skill_1.Skill({
                name: "Athletics",
                proficiency: true,
                modifier: 5,
            }),
            dexterity: new attribute_1.Attribute({
                value: 12,
                savingThrow: 1,
                proficiency: false,
                modifier: 1,
            }),
            acrobatics: new skill_1.Skill({
                name: "Acrobatics",
                proficiency: false,
                modifier: 1,
            }),
            sleightOfHand: new skill_1.Skill({
                name: "Sleight of Hand",
                proficiency: false,
                modifier: 1,
            }),
            stealth: new skill_1.Skill({ name: "Stealth", proficiency: false, modifier: 1 }),
            constitution: new attribute_1.Attribute({
                value: 14,
                savingThrow: 2,
                proficiency: false,
                modifier: 2,
            }),
            intelligence: new attribute_1.Attribute({
                value: 10,
                savingThrow: 0,
                proficiency: false,
                modifier: 0,
            }),
            arcana: new skill_1.Skill({ name: "Arcana", proficiency: false, modifier: 0 }),
            history: new skill_1.Skill({ name: "History", proficiency: false, modifier: 0 }),
            investigation: new skill_1.Skill({
                name: "Investigation",
                proficiency: false,
                modifier: 0,
            }),
            nature: new skill_1.Skill({ name: "Nature", proficiency: false, modifier: 0 }),
            religion: new skill_1.Skill({
                name: "Religion",
                proficiency: false,
                modifier: 0,
            }),
            wisdom: new attribute_1.Attribute({
                value: 8,
                savingThrow: -1,
                proficiency: false,
                modifier: -1,
            }),
            animalHandling: new skill_1.Skill({
                name: "Animal Handling",
                proficiency: false,
                modifier: -1,
            }),
            insight: new skill_1.Skill({ name: "Insight", proficiency: false, modifier: -1 }),
            medicine: new skill_1.Skill({
                name: "Medicine",
                proficiency: false,
                modifier: -1,
            }),
            perception: new skill_1.Skill({
                name: "Perception",
                proficiency: false,
                modifier: -1,
            }),
            survival: new skill_1.Skill({
                name: "Survival",
                proficiency: false,
                modifier: -1,
            }),
            charisma: new attribute_1.Attribute({
                value: 10,
                savingThrow: 0,
                proficiency: false,
                modifier: 0,
            }),
            deception: new skill_1.Skill({
                name: "Deception",
                proficiency: false,
                modifier: 0,
            }),
            intimidation: new skill_1.Skill({
                name: "Intimidation",
                proficiency: false,
                modifier: 0,
            }),
            performance: new skill_1.Skill({
                name: "Performance",
                proficiency: false,
                modifier: 0,
            }),
            persuasion: new skill_1.Skill({
                name: "Persuasion",
                proficiency: false,
                modifier: 0,
            }),
            heroicInspiration: false,
            lightArmorTraining: true,
            mediumArmorTraining: true,
            heavyArmorTraining: false,
            shieldTraining: true,
            weaponTrainingSimple: true,
            weaponTrainingMartial: true,
            toolTraining: ["Smith's Tools"],
            initiative: 1,
            speed: 30,
            size: "Medium",
            passivePerception: 9,
            weapons: [
                new weapon_1.Weapon({
                    name: "Longsword",
                    attackBonus: 5,
                    difficultyBonus: 0,
                    damage: "1d8+3",
                    damageType: "Slashing",
                    notes: "Versatile (1d10)",
                }),
                new weapon_1.Weapon({
                    name: "Shortbow",
                    attackBonus: 5,
                    difficultyBonus: 0,
                    damage: "1d6+3",
                    damageType: "Piercing",
                    notes: "Range 80/320",
                }),
            ],
            damageCantrips: [],
            classFeatures: ["Second Wind", "Action Surge"],
            speciesTraits: ["Human Resilience"],
            feats: ["Great Weapon Fighting"],
            spellcastingAbility: null,
            spellSaveDC: 0,
            spellAttackBonus: 0,
            totalSpellSlots1: 0,
            totalSpellSlots2: 0,
            totalSpellSlots3: 0,
            totalSpellSlots4: 0,
            totalSpellSlots5: 0,
            totalSpellSlots6: 0,
            totalSpellSlots7: 0,
            totalSpellSlots8: 0,
            totalSpellSlots9: 0,
            usedSpellSlots1: 0,
            usedSpellSlots2: 0,
            usedSpellSlots3: 0,
            usedSpellSlots4: 0,
            usedSpellSlots5: 0,
            usedSpellSlots6: 0,
            usedSpellSlots7: 0,
            usedSpellSlots8: 0,
            usedSpellSlots9: 0,
            cantripsAndPreparedSpells: [],
            appearance: "A tall, muscular human with short brown hair and green eyes.",
            backstory: "Born in a small village, this character grew up learning the ways of the sword. After their village was attacked by bandits, they set out on a quest for justice and adventure.",
            alignment: Alignment_1.Alignment.LawfulGood,
            languages: ["Common", "Dwarvish"],
            equipment: [
                "Explorer's Pack",
                "Tinderbox",
                "Rations (1 day)",
                "Waterskin",
            ],
            magicItemAttunement1: "Amulet of Health",
            magicItemAttunement2: "",
            magicItemAttunement3: "",
            copper: 10,
            silver: 5,
            electrum: 0,
            gold: 20,
            platinum: 0,
        });
    }
}
exports.CharacterSheet = CharacterSheet;
exports.JsonFilePath = path_1.default.join(__dirname, "../assets/characters.json");
//# sourceMappingURL=charactersheet.js.map