const STATIC_METADATA = [
  {"id": "red", "name": "Red"},
  {"id": "green", "name": "Green"},
  {"id": "blue", "name": "Blue"},
  {"id": "yellow", "name": "Yellow"},
  {"id": "magenta", "name": "Magenta"},
  {"id": "cyan", "name": "Cyan"},
  {"id": "black", "name": "Black"},
  {"id": "white", "name": "White"},
  {"id": "light-grey", "name": "Light grey"},
  {"id": "mid-grey", "name": "Mid grey"},
  {"id": "dark-grey", "name": "Dark grey"},
  {"id": "red-to-blue", "name": "Red to blue"},
  {"id": "green-to-yellow", "name": "Green to yellow"},
  {"id": "purple-to-orange", "name": "Purple to orange"},
  {"id": "black-to-white", "name": "Black to white"},
  {"id": "radial-colors", "name": "Radial colors"},
  {"id": "radial-greyscale", "name": "Radial greyscale"},
  {"id": "vertical-color-stripes", "name": "Vertical color stripes"},
  {"id": "horizontal-color-stripes", "name": "Horizontal color stripes"},
  {"id": "diagonal-stripes", "name": "Diagonal stripes"},
  {"id": "fine-diagonal-stripes", "name": "Fine diagonal stripes"},
  {"id": "large-grid", "name": "Large grid"},
  {"id": "fine-grid", "name": "Fine grid"},
  {"id": "checkerboard", "name": "Checkerboard"},
  {"id": "fine-checkerboard", "name": "Fine checkerboard"},
  {"id": "greyscale-steps", "name": "Greyscale steps"},
  {"id": "color-bars", "name": "Color bars"},
  {"id": "vertical-one-pixel-lines", "name": "Vertical one-pixel lines"},
  {"id": "horizontal-one-pixel-lines", "name": "Horizontal one-pixel lines"},
  {"id": "light-frame", "name": "Light frame"},
  {"id": "dark-frame", "name": "Dark frame"}
];
const PATTERNS = [
				// Solid colors
				'rgb(255,0,0)', // Red
				'rgb(0,255,0)', // Green
				'rgb(0,0,255)', // Blue
				'rgb(255,255,0)', // Yellow
				'rgb(255,0,255)', // Magenta
				'rgb(0,255,255)', // Cyan
				'rgb(0,0,0)', // Black
				'rgb(255,255,255)', // White
				'rgb(192,192,192)', // Light Grey (75%)
				'rgb(128,128,128)', // Mid Grey (50%)
				'rgb(64,64,64)', // Dark Grey (25%)
				
				// Linear gradients
				'linear-gradient(to right, red, blue)',
				'linear-gradient(to bottom, green, yellow)',
				'linear-gradient(45deg, purple, orange)',
				'linear-gradient(to right, black, white)',
				
				// Radial gradients  
				'radial-gradient(circle, red, blue)',
				'radial-gradient(ellipse, white, black)',
				
				// Stripe patterns
				'repeating-linear-gradient(90deg, red 0px, red 50px, blue 50px, blue 100px)',
				'repeating-linear-gradient(0deg, green 0px, green 25px, white 25px, white 50px)',
				'repeating-linear-gradient(45deg, black 0px, black 10px, white 10px, white 20px)',
				'repeating-linear-gradient(-45deg, black 0px, black 5px, white 5px, white 10px)',
				
				// Grid patterns
				'linear-gradient(90deg, transparent 49%, black 49%, black 51%, transparent 51%), linear-gradient(0deg, transparent 49%, black 49%, black 51%, transparent 51%)',
				// Finer grid
				'repeating-linear-gradient(0deg, #ccc, #ccc 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ccc, #ccc 1px, transparent 1px, transparent 20px)',
				
				// Checkerboard pattern (using linear gradients for better compatibility)
				'conic-gradient(black 25%, white 0 50%, black 0 75%, white 0) 0 0 / 50px 50px',
				// Finer checkerboard
				'conic-gradient(black 25%, white 0 50%, black 0 75%, white 0) 0 0 / 10px 10px',

				// Color transition tests
				'linear-gradient(to right, #000000, #111111, #222222, #333333, #444444, #555555, #666666, #777777, #888888, #999999, #aaaaaa, #bbbbbb, #cccccc, #dddddd, #eeeeee, #ffffff)',
				
				// Color bars (simplified version)
				'linear-gradient(to right, red 0%, red 14.28%, green 14.28%, green 28.56%, blue 28.56%, blue 42.84%, cyan 42.84%, cyan 57.12%, magenta 57.12%, magenta 71.4%, yellow 71.4%, yellow 85.68%, white 85.68%, white 100%)',
				
				// High frequency vertical lines
				'repeating-linear-gradient(to right, black 0px, black 1px, white 1px, white 2px)',
				// High frequency horizontal lines
				'repeating-linear-gradient(to bottom, black 0px, black 1px, white 1px, white 2px)',
				
				// Edge detection frames - 1-pixel borders to test screen cropping
				// White 1px border on black background
				'black linear-gradient(white, white) no-repeat 1px 1px / calc(100% - 2px) calc(100% - 2px)',
				// Black 1px border on white background
				'white linear-gradient(black, black) no-repeat 1px 1px / calc(100% - 2px) calc(100% - 2px)',

				// Motion Tests - for detecting ghosting, tearing, refresh rate issues
				{ type: 'animation', class: 'bouncing-box', background: 'lightgray', name: 'Bouncing Box Test' },
				{ type: 'animation', class: 'scrolling-horizontal', name: 'Horizontal Scroll Test' },
				{ type: 'animation', class: 'scrolling-vertical', name: 'Vertical Scroll Test' },
				{ type: 'animation', class: 'scrolling-diagonal', name: 'Diagonal Scroll Test' },

				// Flicker Tests - for detecting screen flicker and comfort issues
				{ type: 'animation', class: 'flicker-slow', name: 'Slow Flicker Test (1Hz)' },
				{ type: 'animation', class: 'flicker-medium', name: 'Medium Flicker Test (2Hz)' },
				{ type: 'animation', class: 'flicker-fast', name: 'Fast Flicker Test (10Hz)' }
			].map((pattern, index) => {
  const value = typeof pattern === 'string' ? { background: pattern, ...STATIC_METADATA[index], type: 'static' } : pattern;
  return Object.freeze({ ...value, id: value.id || value.class, flicker: !!value.class && value.class.startsWith('flicker-') });
});
Object.freeze(PATTERNS);
const FULLSCREEN_EVENTS = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
}
function clearPattern(element) {
  for (const pattern of PATTERNS) if (pattern.class) element.classList.remove(pattern.class);
  element.style.background = '';
}
async function toggleFullscreen(exitOnly = false) {
  const exiting = isFullscreen();
  if (exitOnly && !exiting) return;
  const target = exiting ? document : document.documentElement;
  const method = exiting
    ? (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen)
    : (target.requestFullscreen || target.webkitRequestFullscreen || target.mozRequestFullScreen || target.msRequestFullscreen);
  if (!method) throw new Error('Fullscreen is unavailable in this browser.');
  await method.call(target);
}

class ScreenTester extends React.Component {
  constructor(props) {
    super(props);
    this.state = { patternIndex: 0, running: false, fullscreen: isFullscreen(), grid: false, crosshair: false, controlsVisible: true, help: false, error: '' };
    this.hideTimer = null;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.onClick = this.onClick.bind(this);
    this.onKey = this.onKey.bind(this);
    this.onFullscreen = this.onFullscreen.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    this.showControls = this.showControls.bind(this);
    this.onMotionPreference = this.onMotionPreference.bind(this);
  }
  componentDidMount() {
    this.applyPattern();
    document.addEventListener('click', this.onClick);
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('visibilitychange', this.onVisibility);
    document.addEventListener('mousemove', this.showControls);
    document.addEventListener('touchstart', this.showControls);
    FULLSCREEN_EVENTS.forEach(event => document.addEventListener(event, this.onFullscreen));
    if (this.motionQuery.addEventListener) this.motionQuery.addEventListener('change', this.onMotionPreference);
    else this.motionQuery.addListener(this.onMotionPreference);
  }
  componentDidUpdate(prevProps, previous) {
    if (previous.patternIndex !== this.state.patternIndex || previous.running !== this.state.running || previous.fullscreen !== this.state.fullscreen) this.applyPattern();
    document.body.classList.toggle('show-grid', this.state.grid);
    document.body.classList.toggle('show-crosshair', this.state.crosshair);
  }
  componentWillUnmount() {
    clearTimeout(this.hideTimer);
    document.removeEventListener('click', this.onClick);
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('visibilitychange', this.onVisibility);
    document.removeEventListener('mousemove', this.showControls);
    document.removeEventListener('touchstart', this.showControls);
    FULLSCREEN_EVENTS.forEach(event => document.removeEventListener(event, this.onFullscreen));
    if (this.motionQuery.removeEventListener) this.motionQuery.removeEventListener('change', this.onMotionPreference);
    else this.motionQuery.removeListener(this.onMotionPreference);
    clearPattern(document.getElementById('background'));
    clearPattern(document.body);
    document.body.classList.remove('show-grid', 'show-crosshair');
  }
  selected() { return PATTERNS[this.state.patternIndex]; }
  applyPattern() {
    const background = document.getElementById('background');
    clearPattern(background);
    clearPattern(document.body);
    const pattern = this.selected();
    for (const element of [background]) {
      element.style.background = pattern.background || (pattern.flicker ? 'black' : '');
      if (pattern.class && this.state.running) element.classList.add(pattern.class);
    }
  }
  navigate(delta) {
    this.setState(previous => {
      const patternIndex = (previous.patternIndex + delta + PATTERNS.length) % PATTERNS.length;
      const pattern = PATTERNS[patternIndex];
      return { patternIndex, running: pattern.type === 'animation' && !pattern.flicker && !this.motionQuery.matches && !document.hidden, error: '' };
    });
  }
  onClick(event) {
    if (event.target.closest('button, input, select, textarea, a, [contenteditable], .controls')) return;
    this.navigate(1);
  }
  onKey(event) {
    if (event.target.closest && event.target.closest('input, select, textarea, [contenteditable]')) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key.toLowerCase()) {
      case 'arrowright': event.preventDefault(); this.navigate(1); break;
      case 'arrowleft': event.preventDefault(); this.navigate(-1); break;
      case 'f': event.preventDefault(); this.fullscreen(); break;
      case 'g': event.preventDefault(); this.toggleOverlay('grid'); break;
      case 'c': event.preventDefault(); this.toggleOverlay('crosshair'); break;
      case 'escape': this.stop(); this.fullscreen(true); break;
      default: break;
    }
  }
  toggleOverlay(name) { this.setState(previous => ({ [name]: !previous[name] })); }
  async fullscreen(exitOnly = false) {
    try { await toggleFullscreen(exitOnly); }
    catch (error) { this.setState({error: error.message, controlsVisible: true}); }
  }
  onFullscreen() {
    clearTimeout(this.hideTimer);
    const fullscreen = isFullscreen();
    this.setState(previous => ({ fullscreen, controlsVisible: true, running: fullscreen ? previous.running : false }));
  }
  stop() { this.setState({ running: false, controlsVisible: true }); }
  onVisibility() { if (document.hidden) this.stop(); }
  onMotionPreference(event) { if (event.matches) this.stop(); }
  showControls() {
    clearTimeout(this.hideTimer);
    this.setState({controlsVisible: true});
    if (this.state.fullscreen) this.hideTimer = setTimeout(() => {
      if (this.state.fullscreen && !document.activeElement.closest('.controls') && !this.state.help && !this.state.error) this.setState({controlsVisible: false});
    }, 1500);
  }
  render() {
    const pattern = this.selected();
    return <div className="test" data-pattern={pattern.id}>
      <div className={'controls ' + (this.state.controlsVisible ? 'visible-button' : 'hidden-button')} onFocus={this.showControls}>
        <p aria-live="polite">{pattern.name} ({this.state.patternIndex + 1}/{PATTERNS.length})</p>
        <button className="custom-button" onClick={() => this.navigate(-1)}>Previous</button>
        <button className="custom-button" onClick={() => this.navigate(1)}>Next</button>
        <button className="custom-button" onClick={() => this.fullscreen()}>{this.state.fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
        <button className="custom-button" aria-pressed={this.state.grid} onClick={() => this.toggleOverlay('grid')}>Grid</button>
        <button className="custom-button" aria-pressed={this.state.crosshair} onClick={() => this.toggleOverlay('crosshair')}>Crosshair</button>
        <button className="custom-button" aria-expanded={this.state.help} aria-controls="help" onClick={() => this.setState(previous => ({help: !previous.help}))}>Help</button>
        {pattern.type === 'animation' && !this.state.running && <div>
          {pattern.flicker && <p>This test flashes rapidly. Start only when you are ready. Stop or Escape ends it.</p>}
          <button className="custom-button" onClick={() => { if (!document.hidden) this.setState({running: true}); }}>Start animation</button>
        </div>}
        {this.state.help && <p id="help">Click the test surface or use Left/Right to navigate. F: fullscreen. G: grid. C: crosshair. Escape: stop animation and exit fullscreen. These patterns support visual inspection, not calibrated measurements.</p>}
        {this.state.error && <p role="alert">{this.state.error}</p>}
      </div>
      {this.state.running && <button className="custom-button stop-button" onClick={() => this.stop()}>Stop animation</button>}
    </div>;
  }
}
const container = document.getElementById('content');
const root = ReactDOM.createRoot(container);
root.render(<ScreenTester />);
