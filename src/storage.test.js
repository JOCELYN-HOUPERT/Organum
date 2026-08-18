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

import { saveFile, getFile } from "./storage.js";

describe("saveFile / getFile", () => {
    test("un fichier sauvegardé peut être relu avec le même contenu", async () => {
        const fakeBlob = new Blob(["contenu audio simulé"], { type: "audio/mpeg" });

        const fileId = await saveFile(fakeBlob);
        const retrieved = await getFile(fileId);

        expect(retrieved).not.toBeNull();
        expect(retrieved.type).toBe("audio/mpeg");
    });

    test("demander un fichier avec un id inconnu renvoie null", async () => {
        const result = await getFile("id-qui-nexiste-pas");
        expect(result).toBeNull();
    });
});