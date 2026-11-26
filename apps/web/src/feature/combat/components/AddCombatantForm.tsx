import React, { useState, useCallback, memo, useRef } from "react";
import type {
  Combatant,
  CombatantType,
  Skill,
  TraitEntry,
  ActionEntry,
} from "@repo/domain";
import { Input } from "../../../component/ui/Input";
import { Select } from "../../../component/ui/Select";
import { Button } from "../../../component/ui/Button";
import { Card } from "../../../component/ui/Card";
import { Label } from "../../../component/ui/Label";
import { MonsterApi } from "../../../api/monster-api";

type AddCombatantFormProps = {
  onAdd: (combatant: Omit<Combatant, "turnOrder">) => void;
  open: boolean;
  onClose: () => void;
  monster?: Combatant;
  onSave?: (monster: Omit<Combatant, "turnOrder">) => void;
};

const initialValues: Record<string, unknown> = {
  name: "",
  portraitUrl: "",
  imageUrl: "",
  source: "",
  type: "npc",
  initiative: 0,
  initiativeBonus: 0,
  initiativeModifier: 0,
  hp: 0,
  maxHp: 0,
  tempHp: 0,
  armorClass: 10,
  movementRate: 9,
  challengeRating: "0",
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  savingThrowStrength: 0,
  savingThrowDexterity: 0,
  savingThrowConstitution: 0,
  savingThrowIntelligence: 0,
  savingThrowWisdom: 0,
  savingThrowCharisma: 0,
  senses: [],
  damageVulnerabilities: [],
  damageResistances: [],
  damageImmunities: [],
  conditionImmunities: [],
  languages: [],
  skills: [],
  traits: [],
  actions: [],
  bonusActions: [],
  legendaryActions: [],
  mythicActions: [],
  description: "",
};

// ---------------------------------------------------------------------------
// Field components: wrapped in React.memo so they only re-render when their
// own props change. Stable handler references prevent unnecessary re-renders.
// ---------------------------------------------------------------------------

const TextField = memo(function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        placeholder={placeholder}
      />
    </div>
  );
});

const NumberField = memo(function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange(val === "" ? 0 : Number(val));
    },
    [onChange],
  );
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded bg-surface border border-border text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
      />
    </div>
  );
});

const SelectField = memo(function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded bg-surface border border-border text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
});

const TextAreaField = memo(function TextAreaField({
  label,
  value,
  onChange,
  rows,
  placeholder,
  className,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows ?? 4}
        className={`w-full px-3 py-2.5 rounded bg-surface border border-border text-text placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none ${className ?? ""}`}
        placeholder={placeholder}
      />
    </div>
  );
});

const StringListField = memo(function StringListField({
  title,
  items,
  onChange,
  addLabel,
  placeholder,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const [list, setList] = useState<string[]>(items);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const draftInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setList(items);
  }, [items]);

  const add = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed || list.includes(trimmed)) return;
    setList([...list, trimmed]);
    setDraft("");
    setTimeout(() => draftInputRef.current?.focus(), 0);
  }, [draft, list]);

  const update = useCallback((index: number, value: string) => {
    setList((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setList((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  const addEmptyRow = useCallback(() => {
    setList((prev) => {
      const next = [...prev, ""];
      setTimeout(() => inputRefs.current[next.length - 1]?.focus(), 0);
      return next;
    });
  }, []);

  React.useEffect(() => {
    onChange(list);
  }, [list, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          ref={draftInputRef}
        />
        <Button size="sm" onClick={add} ref={addButtonRef} type="button">
          {addLabel}
        </Button>
      </div>
      <div className="space-y-1">
        {list.map((item, i) => (
          <div key={i} className="bg-surface border border-border rounded p-2">
            <div className="flex gap-2 mb-1">
              <Input
                value={item}
                onChange={(e) => update(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    addEmptyRow();
                  }
                }}
                ref={(el) => {
                  if (el)
                    inputRefs.current[i] = el as unknown as HTMLInputElement;
                }}
                className="flex-1 text-sm"
              />
              <button type="button"
                onClick={() => remove(i)}
                className="p-1 text-text-muted hover:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

type EntryItem = { name: string; description?: string; bonus?: number };

const EntryListField = memo(function EntryListField({
  title,
  items,
  onChange,
  addLabel,
  itemPlaceholder,
  descPlaceholder,
  isSkill = false,
}: {
  title: string;
  items: EntryItem[];
  onChange: (items: EntryItem[]) => void;
  addLabel: string;
  itemPlaceholder: string;
  descPlaceholder?: string;
  isSkill?: boolean;
}) {
  const [draftName, setDraftName] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [draftBonus, setDraftBonus] = useState("0");
  const [list, setList] = useState<EntryItem[]>(items);

  React.useEffect(() => {
    setList(items);
  }, [items]);

  const add = useCallback(() => {
    if (!draftName.trim()) return;
    if (isSkill) {
      setList((prev) => [
        ...prev,
        { name: draftName.trim(), bonus: parseInt(draftBonus, 10) || 0 },
      ]);
    } else {
      setList((prev) => [
        ...prev,
        { name: draftName.trim(), description: draftDesc },
      ]);
    }
    setDraftName("");
    setDraftDesc("");
    setDraftBonus("0");
  }, [draftName, draftDesc, draftBonus, isSkill]);

  const updateName = useCallback((index: number, value: string) => {
    setList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name: value };
      return next;
    });
  }, []);

  const updateDesc = useCallback((index: number, value: string) => {
    setList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], description: value };
      return next;
    });
  }, []);

  const updateBonus = useCallback((index: number, value: number) => {
    setList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], bonus: value };
      return next;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setList((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  React.useEffect(() => {
    onChange(list);
  }, [list, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder={itemPlaceholder}
          className="flex-1"
        />
        {isSkill && (
          <div className="space-y-1 w-20">
            <label className="text-xs text-text-muted">Bonus</label>
            <input
              type="number"
              value={draftBonus}
              onChange={(e) => setDraftBonus(e.target.value)}
              className="w-full px-2 py-1 rounded bg-surface border border-border text-text text-center"
            />
          </div>
        )}
        {!isSkill && descPlaceholder && (
          <TextAreaField
            value={draftDesc}
            onChange={setDraftDesc}
            rows={1}
            placeholder={descPlaceholder}
            className="flex-1 min-h-[40px]"
          />
        )}
        <Button size="sm" onClick={add} type="button">
          {addLabel}
        </Button>
      </div>
      <div className="space-y-1">
        {list.map((item, i) => (
          <div key={i} className="bg-surface border border-border rounded p-2">
            <div className="flex gap-2 mb-1">
              <Input
                value={item.name}
                onChange={(e) => updateName(i, e.target.value)}
                className="flex-1 text-sm"
              />
              {isSkill && (
                <div className="space-y-1 w-20">
                  <label className="text-xs text-text-muted">Bonus</label>
                  <input
                    type="number"
                    value={item.bonus ?? 0}
                    onChange={(e) =>
                      updateBonus(i, Number(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 rounded bg-surface border border-border text-text text-center"
                  />
                </div>
              )}
              {!isSkill && descPlaceholder && (
                <TextAreaField
                  value={item.description ?? ""}
                  onChange={(value) => updateDesc(i, value)}
                  rows={1}
                  placeholder={descPlaceholder}
                  className="flex-1 text-sm min-h-[40px]"
                />
              )}
              <button type="button"
                onClick={() => remove(i)}
                className="p-1 text-text-muted hover:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Layout helpers: defined at module scope so their component identity is stable
// across renders. Defining them inside the form component would remount the
// whole subtree on every keystroke, causing inputs to lose focus.
// ---------------------------------------------------------------------------

function FieldCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="elevated" className="mb-4">
      <div className="p-3 border-b border-border mb-3">
        <h3 className="font-serif font-semibold text-text">{title}</h3>
      </div>
      <div className="p-3">{children}</div>
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main form
// ---------------------------------------------------------------------------

export function AddCombatantForm({
  onAdd,
  open,
  onClose,
  monster,
  onSave,
}: AddCombatantFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, unknown>>({
    ...initialValues,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Stable per-field handler references so React.memo fields don't re-render
  // when the parent re-renders. No .bind() calls – those create new functions.
  const fieldHandlers = useRef<Map<string, (value: unknown) => void>>(
    new Map(),
  );
  const getFieldHandler = useCallback((name: string) => {
    let handler = fieldHandlers.current.get(name);
    if (!handler) {
      handler = (value: unknown) =>
        setForm((prev) => ({ ...prev, [name]: value }));
      fieldHandlers.current.set(name, handler);
    }
    return handler;
  }, []);

  React.useEffect(() => {
    if (!open) return;
    if (monster) {
      setForm({
        name: monster.name,
        portraitUrl: monster.portraitUrl ?? "",
        imageUrl: monster.imageUrl ?? "",
        source: monster.source ?? "",
        type: "npc",
        initiative: monster.initiative,
        initiativeBonus: monster.initiativeBonus,
        initiativeModifier: monster.initiativeModifier ?? 0,
        hp: monster.hp,
        maxHp: monster.maxHp,
        tempHp: monster.tempHp,
        armorClass: monster.armorClass,
        movementRate: monster.movementRate ?? 9,
        challengeRating: monster.challengeRating ?? "0",
        strength: monster.strength ?? 10,
        dexterity: monster.dexterity ?? 10,
        constitution: monster.constitution ?? 10,
        intelligence: monster.intelligence ?? 10,
        wisdom: monster.wisdom ?? 10,
        charisma: monster.charisma ?? 10,
        savingThrowStrength: monster.savingThrowStrength ?? 0,
        savingThrowDexterity: monster.savingThrowDexterity ?? 0,
        savingThrowConstitution: monster.savingThrowConstitution ?? 0,
        savingThrowIntelligence: monster.savingThrowIntelligence ?? 0,
        savingThrowWisdom: monster.savingThrowWisdom ?? 0,
        savingThrowCharisma: monster.savingThrowCharisma ?? 0,
        senses: monster.senses,
        damageVulnerabilities: monster.damageVulnerabilities ?? [],
        damageResistances: monster.damageResistances ?? [],
        damageImmunities: monster.damageImmunities ?? [],
        conditionImmunities: monster.conditionImmunities ?? [],
        languages: monster.languages ?? [],
        skills: monster.skills ?? [],
        traits: monster.traits ?? [],
        actions: monster.actions ?? [],
        bonusActions: monster.bonusActions ?? [],
        legendaryActions: monster.legendaryActions ?? [],
        mythicActions: monster.mythicActions ?? [],
        description: monster.description ?? "",
      });
      setImagePreview(monster.imageUrl ?? null);
      setSelectedImage(null);
      setErrors({});
    } else {
      setForm({ ...initialValues });
      setImagePreview(null);
      setSelectedImage(null);
      setErrors({});
    }
  }, [open, monster]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;
    const name = String(form.name ?? "").trim();
    if (!name) return;
    setUploading(true);
    try {
      const { url } = await MonsterApi.uploadMonsterImage(name, selectedImage);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      setImagePreview(url);
      setSelectedImage(null);
    } catch (err) {
      setErrors({
        ...errors,
        image: (err as Error).message || "Bild konnte nicht hochgeladen werden",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: undefined }));
    setImagePreview(null);
    setSelectedImage(null);
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = form;
    const next: Record<string, string> = {};
    const name = String(v.name ?? "").trim();
    if (!name) next.name = "Name ist erforderlich";

    const toNumber = (value: unknown): number => {
      const n = Number(value ?? 0);
      return Number.isFinite(n) ? n : 0;
    };

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload: Omit<Combatant, "turnOrder"> = {
      id: monster ? monster.id : (crypto?.randomUUID?.() ?? `c-${Date.now()}`),
      name,
      type: "npc",
      initiative: toNumber(v.initiative),
      initiativeBonus: toNumber(v.initiativeBonus),
      initiativeModifier: toNumber(v.initiativeModifier),
      hp: toNumber(v.hp),
      maxHp: toNumber(v.maxHp),
      tempHp: toNumber(v.tempHp),
      armorClass: toNumber(v.armorClass),
      movementRate: toNumber(v.movementRate),
      conditions: [],
      isDead: false,
      isConcentrating: false,
      portraitUrl: v.portraitUrl ? String(v.portraitUrl) : undefined,
      imageUrl: v.imageUrl ? String(v.imageUrl) : undefined,
      source: monster ? (monster.source as "imported" | "custom") : "custom",
      description: v.description ? String(v.description) : undefined,
      strength: toNumber(v.strength),
      dexterity: toNumber(v.dexterity),
      constitution: toNumber(v.constitution),
      intelligence: toNumber(v.intelligence),
      wisdom: toNumber(v.wisdom),
      charisma: toNumber(v.charisma),
      savingThrowStrength: toNumber(v.savingThrowStrength),
      savingThrowDexterity: toNumber(v.savingThrowDexterity),
      savingThrowConstitution: toNumber(v.savingThrowConstitution),
      savingThrowIntelligence: toNumber(v.savingThrowIntelligence),
      savingThrowWisdom: toNumber(v.savingThrowWisdom),
      savingThrowCharisma: toNumber(v.savingThrowCharisma),
      skills: v.skills as Skill[],
      senses: v.senses as string[],
      damageVulnerabilities: v.damageVulnerabilities as string[],
      damageResistances: v.damageResistances as string[],
      damageImmunities: v.damageImmunities as string[],
      conditionImmunities: v.conditionImmunities as string[],
      languages: v.languages as string[],
      challengeRating: String(v.challengeRating ?? "0"),
      traits: v.traits as TraitEntry[],
      actions: v.actions as ActionEntry[],
      bonusActions: v.bonusActions as ActionEntry[],
      legendaryActions: v.legendaryActions as ActionEntry[],
      mythicActions: v.mythicActions as ActionEntry[],
    };
    onAdd(payload);
    if (monster && onSave) {
      onSave(payload);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <Card variant="elevated" className="max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-serif font-bold text-text">
            Kreatur hinzufügen
          </h3>
          <button type="button"
            onClick={onClose}
            className="rounded p-1.5 text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <FieldCard title="Grundlagen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <TextField
                label="Name"
                value={String(form.name ?? "")}
                onChange={getFieldHandler("name")}
                error={errors.name}
                placeholder="z. B. Goblin"
              />
            </div>
            <div className="space-y-1">
              <TextField
                label="Portrait URL"
                value={String(form.portraitUrl ?? "")}
                onChange={getFieldHandler("portraitUrl")}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <TextField
                label="Quelle"
                value={String(form.source ?? "")}
                onChange={getFieldHandler("source")}
                placeholder="z. B. Monsterhandbuch"
              />
            </div>
          </div>

          <Grid>
            <div className="space-y-1">
              <NumberField
                label="Initiative"
                value={form.initiative as number}
                onChange={getFieldHandler("initiative")}
                min={0}
              />
            </div>
            <div className="space-y-1">
              <NumberField
                label="INI-Bonus"
                value={form.initiativeBonus as number}
                onChange={getFieldHandler("initiativeBonus")}
              />
            </div>
            <div className="space-y-1">
              <NumberField
                label="INI-Modifikator"
                value={form.initiativeModifier as number}
                onChange={getFieldHandler("initiativeModifier")}
                placeholder="+0"
              />
            </div>
            <div className="space-y-1">
              <NumberField
                label="Rüstungsklasse"
                value={form.armorClass as number}
                onChange={getFieldHandler("armorClass")}
                min={0}
              />
            </div>
            <div className="space-y-1">
              <NumberField
                label="Max. TP"
                value={form.maxHp as number}
                onChange={(v) => {
                  getFieldHandler("maxHp")(v);
                  getFieldHandler("hp")(v);
                }}
                min={0}
              />
            </div>
            <div className="space-y-1">
              <NumberField
                label="Temporäre TP"
                value={form.tempHp as number}
                onChange={getFieldHandler("tempHp")}
                min={0}
              />
            </div>
            <div className="space-y-1">
              <NumberField
                label="Bewegungsrate (m)"
                value={form.movementRate as number}
                onChange={getFieldHandler("movementRate")}
                min={0}
              />
            </div>
            <div className="space-y-1">
              <TextField
                label="Herausforderungsgrad"
                value={String(form.challengeRating ?? "")}
                onChange={getFieldHandler("challengeRating")}
                placeholder="z. B. 1/4, 1, 5"
              />
            </div>
          </Grid>
        </FieldCard>

        <FieldCard title="Bild / Portrait">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 shrink-0 rounded-lg border border-border bg-surface overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={String(form.name ?? "")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-text-muted text-sm">Kein Bild</div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-text">
                    Bilddatei
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-text-muted
                    file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                    file:text-sm file:font-semibold file:bg-primary file:text-primary
                    hover:file:bg-primary/90"
                  />
                </div>
                {selectedImage && !uploading ? (
                  <Button
                    size="sm"
                    onClick={handleUploadImage}
                    disabled={!String(form.name ?? "").trim()}
                  >
                    Bild hochladen
                  </Button>
                ) : uploading ? (
                  <Button size="sm" disabled>
                    Wird hochgeladen…
                  </Button>
                ) : null}
                {imagePreview && !selectedImage ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleRemoveImage}
                  >
                    Bild entfernen
                  </Button>
                ) : null}
              </div>
            </div>
            {errors.image && (
              <p className="text-sm text-danger">{errors.image}</p>
            )}
          </div>
        </FieldCard>

        <FieldCard title="Attribute">
          <Grid>
            {[
              { key: "strength", label: "Stärke" },
              { key: "dexterity", label: "Geschicklichkeit" },
              { key: "constitution", label: "Konstitution" },
              { key: "intelligence", label: "Intelligenz" },
              { key: "wisdom", label: "Weisheit" },
              { key: "charisma", label: "Charisma" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <NumberField
                  label={label}
                  value={form[key] as number}
                  onChange={getFieldHandler(key)}
                  min={1}
                  max={30}
                />
              </div>
            ))}
          </Grid>
        </FieldCard>

        <FieldCard title="Rettungswürfe">
          <Grid>
            {[
              { key: "savingThrowStrength", label: "Stärke" },
              { key: "savingThrowDexterity", label: "Geschicklichkeit" },
              { key: "savingThrowConstitution", label: "Konstitution" },
              { key: "savingThrowIntelligence", label: "Intelligenz" },
              { key: "savingThrowWisdom", label: "Weisheit" },
              { key: "savingThrowCharisma", label: "Charisma" },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <NumberField
                  label={label}
                  value={form[key] as number}
                  onChange={getFieldHandler(key)}
                />
              </div>
            ))}
          </Grid>
        </FieldCard>

        <FieldCard title="Sinne">
          <StringListField
            title="Sinne"
            items={form.senses as string[]}
            onChange={getFieldHandler("senses")}
            addLabel="Sinn hinzufügen"
            placeholder="z. B. Dunkelsicht 18 m"
          />
        </FieldCard>

        <FieldCard title="Schwächen / Resistenzen / Immunitäten">
          <Grid>
            <div className="col-span-full">
              <StringListField
                title="Schwächen"
                items={form.damageVulnerabilities as string[]}
                onChange={getFieldHandler("damageVulnerabilities")}
                addLabel="Schwäche hinzufügen"
                placeholder="z. B. Feuer"
              />
            </div>
            <div className="col-span-full">
              <StringListField
                title="Resistenzen"
                items={form.damageResistances as string[]}
                onChange={getFieldHandler("damageResistances")}
                addLabel="Resistenz hinzufügen"
                placeholder="z. B. Blitz"
              />
            </div>
            <div className="col-span-full">
              <StringListField
                title="Immunitäten"
                items={form.damageImmunities as string[]}
                onChange={getFieldHandler("damageImmunities")}
                addLabel="Immunität hinzufügen"
                placeholder="z. B. Gift"
              />
            </div>
            <div className="col-span-full">
              <StringListField
                title="Status-Immunitäten"
                items={form.conditionImmunities as string[]}
                onChange={getFieldHandler("conditionImmunities")}
                addLabel="Status-Immunität hinzufügen"
                placeholder="z. B. Verzaubert"
              />
            </div>
          </Grid>
        </FieldCard>

        <FieldCard title="Sprachen">
          <StringListField
            title="Sprachen"
            items={form.languages as string[]}
            onChange={getFieldHandler("languages")}
            addLabel="Sprache hinzufügen"
            placeholder="z. B. Gemein"
          />
        </FieldCard>

        <FieldCard title="Fähigkeiten">
          <EntryListField
            title="Fertigkeiten"
            items={form.skills as EntryItem[]}
            onChange={getFieldHandler("skills")}
            addLabel="Fertigkeit hinzufügen"
            itemPlaceholder="Fertigkeitsname"
            descPlaceholder="Bonus"
            isSkill
          />
        </FieldCard>

        <FieldCard title="Merkmale">
          <EntryListField
            title="Merkmale"
            items={form.traits as EntryItem[]}
            onChange={getFieldHandler("traits")}
            addLabel="Merkmal hinzufügen"
            itemPlaceholder="Merkmalname"
            descPlaceholder="Beschreibung"
          />
        </FieldCard>

        <FieldCard title="Aktionen">
          <EntryListField
            title="Aktionen"
            items={form.actions as EntryItem[]}
            onChange={getFieldHandler("actions")}
            addLabel="Aktion hinzufügen"
            itemPlaceholder="Aktionsname"
            descPlaceholder="Beschreibung"
          />
        </FieldCard>

        <FieldCard title="Bonusaktionen">
          <EntryListField
            title="Bonusaktionen"
            items={form.bonusActions as EntryItem[]}
            onChange={getFieldHandler("bonusActions")}
            addLabel="Bonusaktion hinzufügen"
            itemPlaceholder="Bonusaktionsname"
            descPlaceholder="Beschreibung"
          />
        </FieldCard>

        <FieldCard title="Legendäre Aktionen">
          <EntryListField
            title="Legendäre Aktionen"
            items={form.legendaryActions as EntryItem[]}
            onChange={getFieldHandler("legendaryActions")}
            addLabel="Legendäre Aktion hinzufügen"
            itemPlaceholder="Aktionsname"
            descPlaceholder="Beschreibung"
          />
        </FieldCard>

        <FieldCard title="Mystische Aktionen">
          <EntryListField
            title="Mystische Aktionen"
            items={form.mythicActions as EntryItem[]}
            onChange={getFieldHandler("mythicActions")}
            addLabel="Mystische Aktion hinzufügen"
            itemPlaceholder="Aktionsname"
            descPlaceholder="Beschreibung"
          />
        </FieldCard>

        <FieldCard title="Beschreibung">
          <TextAreaField
            label="Beschreibung"
            value={String(form.description ?? "")}
            onChange={getFieldHandler("description")}
            rows={6}
            placeholder="Beschreibung der Kreatur..."
          />
        </FieldCard>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            {monster ? "Monster speichern" : "Kreatur hinzufügen"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
