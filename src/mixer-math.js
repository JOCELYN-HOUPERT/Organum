/**
 * mixer-math.js
 *
 * Logique métier PURE du mixeur : aucun accès au navigateur, à l'AudioContext
 * ou au DOM ici. C'est ce qui rend ce fichier facile à tester unitairement
 * avec Jest, sans avoir besoin de simuler un vrai environnement audio.
 *
 * L'idée : séparer "ce qui calcule" (testable) de "ce qui touche le
 * matériel/navigateur" (à tester manuellement ou en intégration).
 */

/**
 * Calcule le gain final effectif d'un canal en croisant son volume propre
 * avec le volume général (master). Les deux sont attendus entre 0 et 100.
 * @param {number} channelVolume - volume du canal (0-100)
 * @param {number} masterVolume - volume général (0-100)
 * @returns {number} gain final entre 0 et 1
 */
export function computeEffectiveGain(channelVolume, masterVolume) {
  if (channelVolume < 0 || channelVolume > 100) {
    throw new Error("channelVolume doit être entre 0 et 100");
  }
  if (masterVolume < 0 || masterVolume > 100) {
    throw new Error("masterVolume doit être entre 0 et 100");
  }
  return (channelVolume / 100) * (masterVolume / 100);
}

/**
 * Calcule à quel moment (en secondes, relatif au début de la boucle en cours)
 * il faut démarrer la copie suivante pour un crossfade sans clic.
 * @param {number} loopDuration - durée du fichier audio en secondes
 * @param {number} fadeTime - durée du fondu croisé en secondes
 * @returns {number} décalage en secondes avant de lancer la prochaine boucle
 */
export function computeNextLoopOffset(loopDuration, fadeTime) {
  if (fadeTime * 2 > loopDuration) {
    throw new Error("fadeTime trop long par rapport à la durée du fichier");
  }
  return loopDuration - fadeTime;
}

/**
 * Vérifie qu'un objet "preset" (ambiance sauvegardée) a la structure attendue
 * avant de tenter de le charger. Utile pour éviter de charger un JSON corrompu
 * ou un ancien format incompatible.
 * @param {object} preset
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validatePreset(preset) {
  const errors = [];

  if (!preset || typeof preset !== "object") {
    return { valid: false, errors: ["Le preset doit être un objet JSON"] };
  }
  if (typeof preset.name !== "string" || preset.name.trim() === "") {
    errors.push("Le preset doit avoir un nom (name)");
  }
  if (!Array.isArray(preset.channels)) {
    errors.push("Le preset doit contenir un tableau channels");
  } else {
    preset.channels.forEach((channel, index) => {
      if (typeof channel.fileId !== "string") {
        errors.push(`channels[${index}] doit référencer un fileId (identifiant, pas un nom de fichier)`);
      }
      if (typeof channel.volume !== "number" || channel.volume < 0 || channel.volume > 100) {
        errors.push(`channels[${index}] doit avoir un volume entre 0 et 100`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
