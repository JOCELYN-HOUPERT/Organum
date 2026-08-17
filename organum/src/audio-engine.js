/**
 * audio-engine.js
 *
 * Ici on touche au vrai navigateur (Web Audio API). Ce fichier n'est PAS
 * couvert par les tests Jest — on ne peut pas simuler un vrai AudioContext
 * facilement, et ce n'est pas l'objectif. La logique de calcul (volumes,
 * timing des boucles, validation) vit dans mixer-math.js, qui LUI est testé.
 *
 * C'est le principe vu en cours : séparer ce qui est testable de ce qui ne
 * l'est pas facilement, plutôt que de tout mélanger.
 */

import { computeNextLoopOffset } from "./mixer-math.js";

const FADE_TIME_SECONDS = 1.0;

export class Mixer {
  constructor() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioCtx();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.connect(this.audioCtx.destination);
    this.channels = new Map();
  }

  setMasterVolume(volumePercent) {
    this.masterGain.gain.value = volumePercent / 100;
  }

  createChannel(channelId) {
    const gainNode = this.audioCtx.createGain();
    gainNode.connect(this.masterGain);
    this.channels.set(channelId, {
      gainNode,
      buffer: null,
      isPlaying: false,
      loopTimer: null
    });
  }

  setChannelVolume(channelId, volumePercent) {
    const channel = this.channels.get(channelId);
    if (!channel) return;
    channel.gainNode.gain.value = volumePercent / 100;
  }

  async loadFileIntoChannel(channelId, arrayBuffer) {
    const channel = this.channels.get(channelId);
    if (!channel) throw new Error(`Canal inconnu: ${channelId}`);
    channel.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);
  }

  playChannel(channelId) {
    const channel = this.channels.get(channelId);
    if (!channel || !channel.buffer) return;
    channel.isPlaying = true;
    this._scheduleLoop(channelId, this.audioCtx.currentTime);
  }

  stopChannel(channelId) {
    const channel = this.channels.get(channelId);
    if (!channel) return;
    channel.isPlaying = false;
    clearTimeout(channel.loopTimer);
  }

  _scheduleLoop(channelId, startTime) {
    const channel = this.channels.get(channelId);
    if (!channel || !channel.isPlaying) return;

    const duration = channel.buffer.duration;
    const source = this.audioCtx.createBufferSource();
    source.buffer = channel.buffer;

    const fadeGain = this.audioCtx.createGain();
    source.connect(fadeGain);
    fadeGain.connect(channel.gainNode);

    fadeGain.gain.setValueAtTime(0, startTime);
    fadeGain.gain.linearRampToValueAtTime(1, startTime + FADE_TIME_SECONDS);
    fadeGain.gain.setValueAtTime(1, startTime + duration - FADE_TIME_SECONDS);
    fadeGain.gain.linearRampToValueAtTime(0, startTime + duration);

    source.start(startTime);
    source.stop(startTime + duration + 0.1);

    // computeNextLoopOffset vient de mixer-math.js : c'est LUI qui est testé,
    // pas cette fonction-ci.
    const offset = computeNextLoopOffset(duration, FADE_TIME_SECONDS);
    const nextStart = startTime + offset;
    const delayMs = Math.max(0, (nextStart - this.audioCtx.currentTime) * 1000);

    channel.loopTimer = setTimeout(() => this._scheduleLoop(channelId, nextStart), delayMs);
  }
}
