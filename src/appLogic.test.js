import { ToggleFullScreenLogic, ScreenTesterLogic } from './appLogic';

describe('ToggleFullScreenLogic', () => {
  let logic;

  beforeEach(() => {
    logic = new ToggleFullScreenLogic();
    jest.clearAllMocks();
  });

  test('initializes with correct default state', () => {
    expect(logic.isFullScreen).toBe(false);
    expect(logic.buttonVisible).toBe(true);
  });

  test('checkFullScreenState returns false when no fullscreen element', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null,
    });
    expect(logic.checkFullScreenState()).toBe(false);
  });

  test('checkFullScreenState returns true when fullscreen element exists', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: document.documentElement,
    });
    expect(logic.checkFullScreenState()).toBe(true);
  });

  test('toggleFullscreen calls requestFullscreen when not in fullscreen', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null,
    });
    
    logic.toggleFullscreen();
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });

  test('toggleFullscreen calls exitFullscreen when in fullscreen', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: document.documentElement,
    });
    
    logic.toggleFullscreen();
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  test('setButtonVisibility updates button visibility', () => {
    expect(logic.setButtonVisibility(false)).toBe(false);
    expect(logic.buttonVisible).toBe(false);
    
    expect(logic.setButtonVisibility(true)).toBe(true);
    expect(logic.buttonVisible).toBe(true);
  });
});

describe('ScreenTesterLogic', () => {
  let logic;

  beforeEach(() => {
    logic = new ScreenTesterLogic();
  });

  test('initializes with correct default state', () => {
    expect(logic.patternIndex).toBe(0);
    expect(logic.getTotalPatterns()).toBe(8);
    expect(logic.getCurrentPattern()).toBe('rgb(255,0,0)'); // Red
  });

  test('getCurrentPattern returns the correct pattern', () => {
    expect(logic.getCurrentPattern()).toBe('rgb(255,0,0)'); // Red
    logic.nextPattern();
    expect(logic.getCurrentPattern()).toBe('rgb(0,255,0)'); // Green
  });

  test('getCurrentPatternIndex returns the correct index', () => {
    expect(logic.getCurrentPatternIndex()).toBe(0);
    logic.nextPattern();
    expect(logic.getCurrentPatternIndex()).toBe(1);
  });

  test('nextPattern cycles through patterns correctly', () => {
    // Start at 0, go through all patterns
    for (let i = 1; i < logic.getTotalPatterns(); i++) {
      expect(logic.nextPattern()).toBe(i);
    }
    // Should cycle back to 0
    expect(logic.nextPattern()).toBe(0);
  });

  test('prevPattern cycles through patterns in reverse', () => {
    // Start at 0, go back to last pattern
    expect(logic.prevPattern()).toBe(logic.getTotalPatterns() - 1);
    
    // Go back one more
    expect(logic.prevPattern()).toBe(logic.getTotalPatterns() - 2);
    
    // Go forward and then back to confirm we're at the right position
    logic.nextPattern();
    expect(logic.getCurrentPatternIndex()).toBe(logic.getTotalPatterns() - 1);
  });

  test('handleKeyPress processes right arrow key', () => {
    expect(logic.handleKeyPress('ArrowRight')).toBe(1);
    expect(logic.getCurrentPatternIndex()).toBe(1);
  });

  test('handleKeyPress processes left arrow key', () => {
    logic.nextPattern(); // Go to index 1
    expect(logic.handleKeyPress('ArrowLeft')).toBe(0);
    expect(logic.getCurrentPatternIndex()).toBe(0);
  });

  test('handleKeyPress processes fullscreen key', () => {
    expect(logic.handleKeyPress('f')).toBe('fullscreen');
    expect(logic.handleKeyPress('F')).toBe('fullscreen');
  });

  test('handleKeyPress processes grid key', () => {
    expect(logic.handleKeyPress('g')).toBe('grid');
    expect(logic.handleKeyPress('G')).toBe('grid');
  });

  test('handleKeyPress processes crosshair key', () => {
    expect(logic.handleKeyPress('c')).toBe('crosshair');
    expect(logic.handleKeyPress('C')).toBe('crosshair');
  });

  test('handleKeyPress processes escape key', () => {
    expect(logic.handleKeyPress('Escape')).toBe('escape');
  });

  test('handleKeyPress returns null for unknown keys', () => {
    expect(logic.handleKeyPress('x')).toBe(null);
    expect(logic.handleKeyPress('1')).toBe(null);
  });

  test('pattern cycling works correctly at boundaries', () => {
    // Test cycling forward at the end
    logic.patternIndex = logic.getTotalPatterns() - 1;
    logic.nextPattern();
    expect(logic.getCurrentPatternIndex()).toBe(0);
    
    // Test cycling backward at the beginning
    logic.patternIndex = 0;
    logic.prevPattern();
    expect(logic.getCurrentPatternIndex()).toBe(logic.getTotalPatterns() - 1);
  });
});