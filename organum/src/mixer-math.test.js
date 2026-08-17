import { computeEffectiveGain, computeNextLoopOffset, validatePreset } from "./mixer-math.js";

describe("computeEffectiveGain", () => {
  test("croise correctement volume canal et volume master", () => {
    expect(computeEffectiveGain(100, 100)).toBe(1);
    expect(computeEffectiveGain(50, 100)).toBe(0.5);
    expect(computeEffectiveGain(50, 50)).toBe(0.25);
    expect(computeEffectiveGain(0, 100)).toBe(0);
  });

  test("rejette un volume canal hors bornes", () => {
    expect(() => computeEffectiveGain(-1, 50)).toThrow();
    expect(() => computeEffectiveGain(101, 50)).toThrow();
  });

  test("rejette un volume master hors bornes", () => {
    expect(() => computeEffectiveGain(50, -1)).toThrow();
    expect(() => computeEffectiveGain(50, 101)).toThrow();
  });
});

describe("computeNextLoopOffset", () => {
  test("calcule le bon décalage avant la boucle suivante", () => {
    expect(computeNextLoopOffset(10, 1)).toBe(9);
    expect(computeNextLoopOffset(30, 2)).toBe(28);
  });

  test("refuse un fondu trop long par rapport au fichier", () => {
    expect(() => computeNextLoopOffset(2, 1.5)).toThrow();
  });
});

describe("validatePreset", () => {
  test("accepte un preset bien formé", () => {
    const preset = {
      name: "Forêt la nuit",
      channels: [
        { fileId: "abc123", volume: 40 },
        { fileId: "def456", volume: 0 }
      ]
    };
    expect(validatePreset(preset)).toEqual({ valid: true, errors: [] });
  });

  test("rejette un preset sans nom", () => {
    const result = validatePreset({ channels: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Le preset doit avoir un nom (name)");
  });

  test("rejette un canal qui référence un fileId manquant", () => {
    const preset = { name: "Test", channels: [{ volume: 50 }] };
    const result = validatePreset(preset);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("fileId"))).toBe(true);
  });

  test("rejette un objet vide ou nul", () => {
    expect(validatePreset(null).valid).toBe(false);
    expect(validatePreset({}).valid).toBe(false);
  });
});
