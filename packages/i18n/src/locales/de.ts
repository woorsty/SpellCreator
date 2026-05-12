export const de = {
  character: {
    attribute: {
      strength: "Stärke",
      strength_short: "Stä",
      dexterity: "Geschicklichkeit",
      dexterity_short: "Ges",
      constitution: "Konstitution",
      constitution_short: "Kon",
      intelligence: "Intelligenz",
      intelligence_short: "Int",
      wisdom: "Weisheit",
      wisdom_short: "Wei",
      charisma: "Charisma",
      charisma_short: "Cha",
    },
    skills: {
      athletics: "Athletik",
      acrobatics: "Akrobatik",
      sleightOfHand: "Fingerfertigkeit",
      stealth: "Heimlichkeit",
      arcana: "Arkanes Wissen",
      history: "Geschichte",
      investigation: "Nachforschen",
      nature: "Naturkunde",
      religion: "Religion",
      animalHandling: "Mit Tieren umgehen",
      insight: "Motiv erkennen",
      medicine: "Medizin",
      perception: "Wahrnehmung",
      survival: "Überleben",
      deception: "Täuschung",
      intimidation: "Einschüchterung",
      performance: "Auftreten",
      persuasion: "Überredung",
    },
    hitpoints: "Trefferpunkte",
    armor_class: "Rüstungsklasse",
    armor_class_short: "RK",
    initiative: "Initiative",
    initiative_short: "Init",
    speed: "Geschwindigkeit",
    speed_short: "Tempo",
    proficiency: "Übungsbonus",
    proficiency_short: "ÜB",
  },
  alignment: {
    lawful_good: "Rechtschaffen Gut",
    neutral_good: "Neutral Gut",
    chaotic_good: "Chaotisch Gut",
    lawful_neutral: "Rechtschaffen Neutral",
    true_neutral: "Neutral",
    chaotic_neutral: "Chaotisch Neutral",
    lawful_evil: "Rechtschaffen Böse",
    neutral_evil: "Neutral Böse",
    chaotic_evil: "Chaotisch Böse",
  },
  species: {
    human: "Mensch",
    elf: "Elf",
    dwarf: "Zwerg",
    halfling: "Halbling",
    gnome: "Gnom",
    tiefling: "Tiefling",
    dragonborn: "Drachengeborener",
    goliath: "Goliath",
    orc: "Ork",
    aasimar: "Aasimar",
    harengon: "Harengon",
    fairy: "Fee",
  },
  characterClass: {
    arteficer: {
      title: "Magieschmied",
      subclasses: {
        alchemist: { title: "Alchemist" },
        armorer: { title: "Rüstungsschmied" },
        atillerist: { title: "Attilierist" },
        battle_smith: { title: "Kampfschmied" },
        cartographer: { title: "Kartograph" },
      },
    },
    barbarian: {
      title: "Barbar",
      features: {
        rage: {
          name: "Kampfrausch",
          description:
            "Du kannst dich mit einer Urmacht names Kampfrausch versehen, die dir für eine Minute zusätzliche Stärke und Zähigkeit gewährt. Du hast 2 Anwdendungen. Du kannst dich als Bonusaktion in Kampfrausch vesetzen, sofern du keine schwere Rüstung trägst. Wenn du eine kurze Rast beendest, erhälst du eine verbrauchte Anwendung zurück. Du erhälst alle verbrauchten Anwendungen nach einer Langen Rast zurück.\n-Schadensresistenz: Du bist gegen Hieb-, Stich und Wuchtschaden resistent.\n-Kampfrausch-Schaden: Wenn du einen Angriff ausführst, der Stärke erfordert - entweder mit einer Waffe oder als waffenloser Angriff -, und dem Ziel Schaden zufügst, erhöht sich der Schaden +2.\nStärkevorteil: Du bist bei Stärkewürfen und Stärkerettungswürfen im Vorteil.\nKeine Konzentration und keine Zauber: Du kannst keine Konzentration aufrechterhalten und keine Zauber wirken.\n-Wirkungsdauer: Der Kampfrausch währt bis zum Ende deines nächsten Zugs und endet vorzeitig, wenn du schwere Rüstung anlegst oder kampfunfähig wirst. Wenn dein Kampfrausch in deinem nächsten Zug noch aktiv ist, kannst du ihn um eine weitere Runde verlängern, indem du eine der folgenden Handlungen ausführst:\nFühre einen Angriffswurf gegen einen Genger aus.\nZwinge ein Gegner, einen Rettungswurf auszuführen.\nFühre eine Bonusaktion aus, um deinen Kampfrausch zu verlängern.\nWann immer der Kampfrausch verlängert wird, währt er bis zum Ende deines nächsten Zugs. Du kannst einen Kampfrausch bis zu zehn Minuten lang aufrecht erhalten.",
        },
        unarmored_defense: {
          name: "Ungerüstete Verteidigung",
          description:
            "Wenn du keine Rüstung trägst, beträgt deine Rüstungsklasse 10 + deinen Geschicklichkeitsmodifikator + deinen Konstitutionsmodifikator. Von diesem Vorzug profitierst du auch, wenn du einen Schild verwendest.",
        },
        weapon_master: {
          name: "Waffenmeisterung",
          description:
            "Du erhälst Waffenmeisterung mit zwei Waffen deiner Wahl. Du kannst diese Meisterung jederzeit ändern, wenn du eine lange Rast beendest.",
        },
        danger_sense: {
          name: "Gefahrengespür",
          description:
            "Du bekommst einen untrüglichen Sinn dafür, ob die Dinge so sind, wie sie sein sollten, sodass du Gefahren besser ausweichen kannst. Du bist bei Geschicklichkeitsrettungswürfen im Vorteil, sofern du nicht kampfunfähig bist.",
        },
        reckless_attack: {
          name: "Rücksichtsloser Angriff",
          description:
            "Du kannst deine Verteidung völlig außer Acht lassen und mit noch mehr Wildheit angreifen. Bei deinem ersten Angriffswurf in deinem Zug kannst du beschließen, einen Rücksichtslosen Angriff auszuführen. Damit sind deine Angriffswürfe, die Stärke erfordern, bis zum Beginn deines nächsten Zugs im Vorteil, doch Angriffswürfe gegen dich in dieser Zeit ebenfalls im Vorteil.",
        },
        primal_knowledge: {
          name: "Urwissen",
          description:
            "Du erhältst Übung in einer weiteren Fertigkeit deiner Wahl aus der Liste von Fertigkeiten, die für Barbaren auf der 1. Stufe verfügbar sind.\r\nAußerdem kannst du während deines Kampfrauschs Urmacht kanalisieren, wenn du bestimmte Aufgaben auszuführen versuchts. Wann immer du einen Attributswurf unter Verwendung einer der folgenden Fertigkeiten ausführst, kannst du ihn auch dann als Stärkewurf ausführen, wenn er sonst ein anderes Attribut erfordert: Akrobatik, Einschüchtern, Heimlichkeit, Überlebenskunst oder Wahrnehmung. Wenn du dieses Attribut verwendest, repräsentiert deine Stärke die Urmacht, die in dir kreist, um deine Beweglichkeit, deine Haltung und deine Sinne optimieren.",
        },
        ability_score_improvement: {
          name: "Attributswerterhöhung",
          description:
            "Du erhältst das Talent Attributswerterhöhung (siehe Kapitel 5) oder ein anderes Talent deiner Wahl, für das du qualifiziert bist.",
        },
        fast_movement: {
          name: "Schnelle Bewegung",
          description:
            "Deine Bewegungsrate erhöht sich um drei Meter, sofern du keine schwere Rüstung trägst.",
        },
        extra_attack: {
          name: "Zusätzlicher Angriff",
          description:
            "Du kannst jetzt zweimal angreifen, wenn du in deinem Zug eine Angriffsaktion ausführst",
        },
        instinctive_pounce: {
          name: "Instinktiver Sprung",
          description:
            "Als Teil der Bonusaktion, mit der du dich in Kampfrausch versetzt, kannst du bis zur Hälfte deiner Bewegungsrate zurücklegen.",
        },
        feral_instinct: {
          name: "Wilder Instinkt",
          description:
            "Deine Instinkte sind derart geschärft, dass du bei Initiativewürfen im Vorteil bist.",
        },
        brutal_critical: {
          name: "Brutaler Hieb",
          description:
            "Wenn du Rücksichtsloser Angriff einsetzt, kannst du in deinem Zug bei einem stärkebasierten Angriffswurf deiner Wahl auf den Vorteil verzichten. Der ausgewählte Angriffswurf darf nicht im Nachteil sein. Wenn der ausgewählte Angriffswurf trifft, erleidet das Ziel zusätzlich 1W10 Schaden des Typs, den auch die Waffe oder der waffenlose Angriff bewirkt, und du kannst einen Effekt des Brutalen Hiebs deiner Wahl bewirken. Folgende Effekte stehen zur Auswahl:\n- Kraftvoller Hieb: Das Ziel wird in gerader Linie 4,5 Meter weit von dir weggestoßen. Du kannst dich dann um bis zur Hälfte deiner Bewegungsrate in gerader Linie auf das Ziel zubewegen, ohne Gelegenheitsangriffe zu provozieren.\n- Schenkelhieb: Die Bewegungsrate des Ziels ist bis zum Beginn deines nächsten Zugs um 4,5 Meter verringert. Es kann immer nur ein Schenkelhieb wirken - jeweils der letzte.",
        },
        relentless_rage: {
          name: "Unerbitterlicher Kampfrausch",
          description:
            "Dein Kampfrausch versetzt dich in die Lage, trotz schwerer Verletzungen weiterzukämpfen. Wenn deine Trefferpunkte auf 0 sinken, während du im Kampfrausch bist, stirbst du nicht sofort, sondern führst einen SG-10-Konstitutionsrettungswurf aus. Bei einem Erfolg erhältst du Trefferpunkte in doppelter Höhe deiner Barbarenstufe. Jedes Mal, wenn du dieses Merkmal nutzt, erhöht sich der SG um 5. Nach einer kurzen oder langen Rast sinkt der SG wieder auf 10.",
        },
        improved_brutal_critical: {
          name: "Verbesserter Brutaler Hieb",
          description:
            "Du hast neue wilde Angriffsmethoden verfeinert. Nun stehen folgende Effekte des Brutalen Hiebs zur Auswahl:\n- Entzweiender Hieb: Vor Beginn deines nächsten Zugs erhält der nächste Angriffswurf, den eine andere Kreatur gegen das Ziel ausführt, einen Bonus von +5. Ein Angriffswurf kann nur jeweils einen Bonus durch Entzweiender Hieb erhalten.\n- Wankendmachender Hieb: Das Ziel ist bei seinem nächsten Rettungswurf im Nachteil und kann bis zum Beginn deines nächsten Zugs keine Gelegenheitsangriffe ausführen.",
        },
        persistent_rage: {
          name: "Anhaltender Kampfrausch",
          description:
            "Wenn du die Initiative auswürfelst, kannst du alle verbrauchten Anwendungen von Kampfrausch zurückerhalten. Gelingt dies, so ist es erst nach einer langen Rast erneut möglich.\nAußerdem ist dein Kampfrausch so wild, dass er nun zehn Minuten lang erhalten bleibt, ohne dass du ihn zwischen den Runden verlängern musst. Dein Kampfrausch endet vorzeitig, wenn du bewusstlos (nicht nur kampfunfähig) wirst oder schwere Rüstung anlegst.",
        },
        persistent_brutal_critical: {
          name: "Verbesserter Brutaler Hieb",
          description:
            "Der zusätzliche Schaden deines Brutalen Hiebs wird auf 2W10 erhöht. Außerdem kannst du zwei verschiedene Effekte von Brutaler Hieb verwenden, wann immer du dieses Merkmal einsetzt.",
        },
        indomitable_might: {
          name: "Unbändige Stärke",
          description:
            "Wenn das Gesamtergebnis deines Stärkewurfs oder Stärkerettungswurfs unter deinem Stärkewert liegt, kannst du diesen statt des Gesamtergebnisses verwenden.",
        },
        epic_boon: {
          name: "Epische Gabe",
          description:
            "Du erhältst ein Epische-Gabe-Talent (siehe Kapitel 5) oder ein anderes Talent deiner Wahl, für das du qualifiziert bist. Gabe des Unwiderstehlichen Angriffs wird empfohlen.",
        },
        primal_champion: {
          name: "Meister der Wildnis",
          description:
            "Du verkörperst Urmacht. Deine Werte für Stärke und Konstitution werden um 4 erhöht (auf höchstens 25)",
        },
      },
      subclasses: {
        berserker: { title: "Pfad des Berserker" },
        zealot: { title: "Pfad des Eiferers" },
        world_tree: { title: "Pfad des Weltenbaums" },
        wild_heart: { title: "Pfad des Wilden Herzens" },
      },
    },
    bard: {
      title: "Barde",
      features: {
        ability_score_improvement: {
          name: "Attributeswerterhöhung",
          description:
            "Du erhälst das Talent Attributswerterhöhung oder ein anderes Talent deiner Wahl, für das du qualifiziert bist",
        },
        bardic_inspiration: {
          name: "Bardische Inspiration",
          description:
            "Du kannst andere durch Worte, Musik oder Tänze übernatürlich stark inspirieren. Diese Inspiration wird durch einen Bardische-Inspiration-Würfel (W6) repräsentiert.\nBardische Inspiration verwenden: Du kannst als Bonusaktion eine Kreatur im Abstand von bis zu 18 MEtern von dir inspirieren, die dich hören oder sehen kann. Diese Kreatur erhält einen deiner Bardische-Inspiration-Würfel. eine Kreatur darf immer nur über einen Bardischen-Inspiration-Würfel verfügen.\nEinmal innerhalb der nächsten Stunde gilt: Wenn die Kreatur bei einer W20-Prüfung scheitert, kann sie mit dem Bardische-Inspiration-Würfel würfeln, das Ergebnis der Prüfung hinzufügen und so aus dem Misserfolg möglicherweise einen Erfolg machen. Ein Bardische-Inspiration-Würfel wird verbraucth, wenn mit ihm gewürfelt wird.\nAnzahl der Anwendungen: Die Anzahl der möglichen Anwendungen deines Bardische-Inspiration-Würfels entspricht deinem Charismamodifikator (min 1x). Du erhälst alle verbraucthen Anwendungen nach einer langen Rast zurück.\nAuf höheren Graden: Dein Bardische-Inspiration-Würfel verändert sich, wenn du bestimmte Bardenstufen erreichst Der Würfel wird auf der 5. Stufe zu W8, auf der 10. azu W10, auf der 15. zu W12",
        },
        spellcasting: {
          name: "Zauberwirken",
          description:
            "Zaubertricks: Du beherrscht zwei Zaubertricks diener Wahl aus der Zauberliste des Barden. Wann immer du eine Bardenstufe erhälst, kannst du einen deiner Zaubertricks mit einem anderen Zaubertrick deiner Wahl aus der Zauberliste des Barden ersetzen.\nZauberplätze:  Du erhältst alle verbrauchten Zauberplätze nach einer langen Rast zurück\nDeine vorbereiteten Zauber ändern: Wann immer du aeine Bardenstufe erreichst, kannst du einen der Zauber auf deiner Liste mit einem anderen Bardenzauber ersetzen, für den du Zauberpätze hast.\nAttribut zum Zauberwirken: Charisma\nZauberfokus: Du kannst ein Musikinstrument als Zauberfokus für deine Bardenzauber verwenden.",
        },
        expertise: {
          name: "Expertise",
          description:
            "Du erhälst Expertiese in zwei Fertigkeiten deiner Wahl, in denen du geübt bist. ",
        },
        jack_of_all_trades: {
          name: "Alleskönner",
          description:
            "Du kannst die Hälfte deines Übungsbonus (abgerundet) jedem Attributswurf hinzufügen, der eine Fertigkeit verwendet, in der du nicht geübt bist.",
        },
        bard_subclass: {
          name: "Barden-Unterklasse",
          description: "Du erhälst eine Barden-Unterklasse deiner Wahl",
        },
        font_of_inspiration: {
          name: "Quelle der Inspiration",
          description:
            "Du erhälst alle verbrauchten Anwendungen der Bardischen Inspiration nach einer kruzen oder langen Rast zurück. Außerdem kannst du einen Zauberplatz verbrauchen (keine Aktion erforderlich), um eine verbrauchte Anwendung von Bardische Inspiration zurückzuerhalten.",
        },
        countercharm: {
          name: "Bannlied",
          description:
            "Du kannst Musiknoten oder Worte der Macht verwenden, um Effekte zu unterbrechen, die den Verstand beeinflussen. Wenn du oder eine Kreatur im Abstand von bis zu neun Metern von dir bei einem Rettungswurf gegen einen Effekt scheitert, der die Zustände Bezaubert oder Verängstigt bewirkt, kannst du eine Reaktion ausführen, um den Rettungswurf erneut auszuführen. Bei diesem neuen Rettungswurf bist du im Vorteil",
        },
        magical_secrets: {
          name: "Magische Geheimnisse",
          description:
            "Du hast die Geheimnisse verschiedener magischer Traditionen erfahren. Wann immer du eine Bardenstufe (einschließlich dieser Stufe) erreichst und sich die Anzahl vorbereiteter Zauber erhöht, kannst du beliebige deiner vorbereiteten Zauber von der Zauberliste des Barde, des Druiden, des Klerikers und des Magiers auswählen. Die ausgewählten Zauber zählen bei dir als Barenzauber. Wann immer du außerdem einen für diese Klasse vorbereiteten Zauber ersetzt, kannst du ihn mit einem Zauber von diesen Listen ersetzen",
        },
        superior_inspiration: {
          name: "Überlegene Inspiration",
          description:
            "Wenn du die Initiative auswürfelst, erhältst du verbrauchte Anwendungen Bardischer Inspiration zurück, bis du zwei Anwednungen hast",
        },
        epic_boon: {
          name: "Epische Gabe",
          description:
            "Du erhälst ein Epische-Gabe-Talent oder ein anderes Talent deiner Wahl, für das du qualifiziert bist.",
        },
        words_of_creation: {
          name: "Worte der Schöpfung",
          description:
            "Du hast zwei der Worte der Schöpfung gemeistert: die Worte von Leben und Tod. Daher hast du die Zauber Wort der Macht: Heilung und Wort der Macht: Tod stets vorbereitet. Wenn du einen der Zauber wirkst, kannst du damit auf eine zweite Kreatur zielen, wenn diese sich im Abstand von bis zu drei Metern vom ersten Ziel befindet.",
        },
      },
      subclasses: {
        dance: {
          title: "Schule des Tanzes",
          features: {
            dazzling_footwork: {
              name: "",
              description: "",
            },
            inspiring_movement: {
              name: "",
              description: "",
            },
            tandem_footwork: {
              name: "",
              description: "",
            },
            leading_evasion: {
              name: "",
              description: "",
            },
          },
        },
        valor: {
          title: "Schule des Wagemuts",
          features: {
            combat_inspiration: {
              name: "",
              description: "",
            },
            martial_training: {
              name: "",
              description: "",
            },
            extra_attack: {
              name: "",
              description: "",
            },
            battle_magic: {
              name: "",
              description: "",
            },
          },
        },
        lore: {
          title: "Schule des Wissens",
          features: {
            bonus_proficiencies: {
              name: "Zusätzliches Wissen",
              description:
                "Du erhälst Übung im Umgang mit drei Fertigkeiten deiner Wahl",
            },
            cutting_words: {
              name: "Schneidende Worte",
              description:
                "Du lernst, mit Verstand und Schlagfertigkeit für übernatürliche Ablenkung und Verwirrung zu sorgen oder auf anderen Wegen Einfluss und Selbstsicherheit anderer zu schwächen. Wenn eine Kreatur im Abstand von bis zu 18 Metern von dir, die du sehen kannst, einen Schadenswurf ausführt oder bei einem Attributswurf oder Angriffswurf erfolgreich ist, kannst du eine Reaktion ausführen, um eine Anwendung deiner Bardischen Inspiration zu verbrauchen. Würfle mit deinem Bardische-Inspiration-Würfel und ziehe das Ergebnis von dem der Kreatur ab, um Schaden zu verringern oder den Erfolg möglicherweise in einen Misserfolg zu verwandeln.",
            },
            magical_discoveries: {
              name: "Magische Entdeckungen",
              description:
                "Du erlenst zwei Zauber deiner Wahl. Diese Zauber dürfen aus der Zauberliste des Druiden, des Klerikers und des Magiers oder einer Kombination daraus stammen. Du hast die ausgewählten Zauber stets vorbereitet. Wann immer du eine Bardenstufe erhälst, kannst du einen der Zauber mit einem andren Zauber ersetzen.",
            },
            peerless_skill: {
              name: "Grenzenlose Begabung",
              description:
                "Wenn du bei einem Attributs- oder Angriffswurf scheiterst, kannst du eine Anwendung von Bardische Inspiration verbrauchen, mit dem Bardische-Inspiration-Würfel würfeln, das Ergebnis dem W20 hinzufügen und so aus dem Misserfolg möglicherweise einen Erfolg machen. Scheitert der Wurf, so wird die Bardische Inspiration nicht verbraucht.",
            },
          },
        },
        counterspell: { title: "Schule des Zauberbanns" },
      },
    },
    cleric: {
      title: "Kleriker",
      subclasses: {
        war: { title: "Domäne des Krieges" },
        life: { title: "Domäne des Lebens" },
        light: { title: "Domäne des Lichts" },
        trickery: { title: "Domäne der List" },
      },
    },
    druid: {
      title: "Druide",
      subclasses: {
        land: { title: "Zirkel des Landes" },
        sea: { title: "Zirkel des Meeres" },
        moon: { title: "Zirkel des Mondes" },
        stars: { title: "Zirkel der Sterne" },
      },
    },
    fighter: {
      title: "Kämpfer",
      subclasses: {
        champion: { title: "Champion" },
        battle_master: { title: "Kampfmeister" },
        eldritch_knight: { title: "Mystischer Ritter" },
        psi_warrior: { title: "Psi-Krieger" },
      },
    },
    monk: {
      title: "Mönch",
      subclasses: {
        warrior_of_the_elements: { title: "Krieger der Elemente" },
        warrior_of_mercy: { title: "Krieger der Gnade" },
        warrior_of_the_open_hand: { title: "Krieger der offenen Hand" },
        warrior_of_shadow: { title: "Krieger der Schatten" },
      },
    },
    paladin: {
      title: "Paladin",
      subclasses: {
        oath_of_the_ancients: { title: "Schwur der Alten" },
        oath_of_vengeance: { title: "Schwur der Rache" },
        oath_of_devotion: { title: "Schwur der Hingabe" },
        oath_of_glory: { title: "Schwur des Ruhms" },
      },
    },
    ranger: {
      title: "Waldläufer",
      subclasses: {
        gloom_stalker: { title: "Düsterpirscher" },
        fey_wanderer: { title: "Feenwanderer" },
        beast_master: { title: "Herr der Tiere" },
        hunter: { title: "Jäger" },
      },
    },
    rouge: {
      title: "Schurke",
      subclasses: {
        arcane_trickster: { title: "Arkaner Betrüger" },
        assassin: { title: "Assassine" },
        thief: { title: "Dieb" },
        soulknife: { title: "Seelenmesser" },
      },
    },
    sorcerer: {
      title: "Zauberer",
      subclasses: {
        aberrant_sorcery: { title: "Aberrante Zauberei" },
        draconic_sorcery: { title: "Drakonische Zauberei" },
        clockwork_sorcery: { title: "Uhrwerk Zauberei" },
        wild_magic: { title: "Wilde-Magie Zauberei" },
      },
    },
    warlock: {
      title: "Hexenmeister",
      subclasses: {
        celestial: { title: "Celestischer Schutzherr" },
        fey: { title: "Erzfee-Schutzherr" },
        great_old_one: { title: "Großer Alter Schutzherr" },
        fiend: { title: "Unhold-Schutzherr" },
      },
    },
    wizard: {
      title: "Magier",
      subclasses: {
        abjurer: { title: "Bannmagier" },
        evoker: { title: "Hervorrufer" },
        illusionist: { title: "Illusionist" },
        diviner: { title: "Seher" },
      },
    },
  },
  background: {
    noble: "Adliger",
    acolyte: "Akolyth",
    farmer: "Bauer",
    hermit: "Einsiedler",
    merchant: "Händler",
    artisan: "Handwerker",
    criminal: "Krimineller",
    guide: "Reisender",
    charlatan: "Scharlatan",
    scribe: "Schreiber",
    sailor: "Seemann",
    soldier: "Soldat",
    entertainer: "Unterhaltungskünstler",
    guard: "Wache",
    wayfarer: "Wegfinder",
    sage: "Weiser",
  },
  language: {
    draconic: "Drakonisch",
    common: "Gemeinsprache",
    sign_language: "Gebärden-Gemeinsprahce",
    dwarvish: "Zwergisch",
    elvish: "Elfisch",
    giant: "Riesisch",
    gnomish: "Gnomisch",
    goblin: "Goblinisch",
    halfling: "Halblingisch",
    orc: "Orkisch",

    abyssal: "Abyssisch",
    theif_language: "Diebessprache",
    druid_language: "Druidensprache",
    celestial: "Celestisch",
    deep_speech: "Tiefensprache",
    infernal: "Infernalisch",
    primordial: "Urtümlich",
    sylvan: "Sylvanisch",
    undercommon: "Gemeinsprache der Unterreiche",
  },
  weapon_kind: {
    simple: "Einfache Waffen",
    martial: "Kriegswaffen",
    light: "Leichte Kriegswaffen",
    finesse: "Finesse Kriegswaffen",
  },
  armor_kind: {
    light: "Leichte Rüstung",
    medium: "Mittelschwere Rüstung",
    heavy: "Schwere Rüstung",
    shield: "Schilde",
  },
  damage_type: {
    bludgeoning: "Wucht",
    piercing: "Stich",
    slashing: "Hieb",
    acid: "Säure",
    cold: "Kälte",
    fire: "Feuer",
    lightning: "Blitz",
    thunder: "Schall",
    force: "Kraft",
    necrotic: "Nekrotisch",
    radiant: "Strahlend",
    poison: "Gift",
    psychic: "Psychisch",
  },
  spell_school: {
    abjuration: "Bannmagie",
    conjuration: "Beschwörung",
    divination: "Weissagung",
    enchantment: "Verzauberung",
    evocation: "Hervorrufung",
    illusion: "Illusion",
    necromancy: "Nekromantie",
    transmutation: "Verwandlung",
  },
  characterCreator: {
    title: "Charakter Erstellung",
    submit: "Fertig",
    overwrite_character: "Überschreiben?",
    steps: {
      basic_info: {
        title: "Charakterdaten",
        name: "Name",
        species: "Spezies",
        level: "Stufe",
        character_class: "Klasse",
        subclass: "Unterklasse",
        none: "Keine",
        background: "Hintergrund",
      },
      attributes: {
        title: "Attribute",
        value: "Wert",
        proficiency: "Übung",
        savingThrow: "Rettungswurf",
      },
      background: {
        title: "Hintergrund",
        appearance: "Aussehen",
        story: "Hintergrundgeschichte & Persönlichkeit",
        languages: "Sprachen",
      },
      equipment: {
        title: "Ausrüstung",
        equipment: "Ausrüstung",
        weapons: "Waffen",
        armor: "Rüstung",
        coins: "Münzen",
        add: "Hinzufügen",
        attuned_magic_items: "Eingestimmte magische Gegenstände",
        magic_item: "Magische Item",
        no_equipment: "Keine Ausrüstung vorhanden",
        copper_icon: "🟠",
        silver_icon: "⚪",
        gold_icon: "🟡",
        electrum_icon: "🟢",
        platinum_icon: "🔵",
        copper: "Kupfer",
        silver: "Silber",
        gold: "Gold",
        electrum: "Elektrum",
        platinum: "Platin",
      },
      attacks: {
        title: "Angriffe & Zaubertricks",
        add: "Angriff hinzufügen",
        input: {
          damage: {
            placeholder: "1W10",
          },
        },
        table: {
          name: "Name",
          bonus: "Bonus",
          sg: "SG",
          damage: "Schaden & Art",
          notes: "Notizen",
        },
      },
      spells: {
        title: "Vorbereitete Zauber",
        add: "Zauber hinzufügen",
        spell_search: "Zauber...",
        table: {
          name: "Name",
          level: "Grad",
          casting_time: "Aufwand",
          range: "Reichweite",
          checkboxes: "K, R & M",
          notes: "Notizen",
        },
      },
      talents: {
        title: "Talente",
        talents: "Talente",
        features: "Klassenmerkmale",
      },
    },
    preview: { title: "Charaktervorschau", level: "Stufe" },
  },
} as const;
