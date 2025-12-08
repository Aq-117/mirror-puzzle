import './style.css'
import { Game } from './game/Game.js'

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const game = new Game(canvas);
  window.game = game; // Expose for debugging/testing
  game.start();
});
