// This file contains the core application logic extracted for testing coverage
// It mirrors the functionality in app.js but in a testable format

export class ToggleFullScreenLogic {
  constructor() {
    this.isFullScreen = false;
    this.buttonVisible = true;
  }

  checkFullScreenState() {
    return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      return document.exitFullscreen();
    } else {
      return document.documentElement.requestFullscreen();
    }
  }

  setButtonVisibility(visible) {
    this.buttonVisible = visible;
    return this.buttonVisible;
  }
}

export class ScreenTesterLogic {
  constructor() {
    this.patterns = [
      'rgb(255,0,0)', // Red
      'rgb(0,255,0)', // Green  
      'rgb(0,0,255)', // Blue
      'rgb(255,255,0)', // Yellow
      'rgb(255,0,255)', // Magenta
      'rgb(0,255,255)', // Cyan
      'rgb(0,0,0)', // Black
      'rgb(255,255,255)', // White
    ];
    this.patternIndex = 0;
  }

  getCurrentPattern() {
    return this.patterns[this.patternIndex];
  }

  getCurrentPatternIndex() {
    return this.patternIndex;
  }

  nextPattern() {
    this.patternIndex = (this.patternIndex + 1) % this.patterns.length;
    return this.patternIndex;
  }

  prevPattern() {
    this.patternIndex = (this.patternIndex - 1 + this.patterns.length) % this.patterns.length;
    return this.patternIndex;
  }

  handleKeyPress(key) {
    switch (key.toLowerCase()) {
      case 'arrowright':
        return this.nextPattern();
      case 'arrowleft':
        return this.prevPattern();
      case 'f':
        return 'fullscreen';
      case 'g':
        return 'grid';
      case 'c':
        return 'crosshair';
      case 'escape':
        return 'escape';
      default:
        return null;
    }
  }

  getTotalPatterns() {
    return this.patterns.length;
  }
}