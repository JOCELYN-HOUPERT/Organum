import { generateFileId } from "./storage.js";

describe("generateFileId", () => {
    test("génère un identifiant qui est une chaîne de caractères", () => {
        const id = generateFileId();
        expect(typeof id).toBe("string");
    });

    test("génère un identifiant non vide", () => {
        const id = generateFileId();
        expect(id.length).toBeGreaterThan(0);
    });

    test("génère un identifiant différent à chaque appel", () => {
        const id1 = generateFileId();
        const id2 = generateFileId();
        expect(id1).not.toBe(id2);
    });
});