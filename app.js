class ToggleFullScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFullScreen: false,
			buttonVisible: true
		};
		this.hideTimer = null;
		// Bind methods
		this.onFullScreenChange = this.onFullScreenChange.bind(this);
		this.showButton = this.showButton.bind(this);
		this.toggleScreen = this.toggleScreen.bind(this);
	}
	
	componentDidMount() {
		document.addEventListener('fullscreenchange', this.onFullScreenChange);
		document.addEventListener('webkitfullscreenchange', this.onFullScreenChange);
		document.addEventListener('mozfullscreenchange', this.onFullScreenChange);
		document.addEventListener('MSFullscreenChange', this.onFullScreenChange);
		
		document.addEventListener('mousemove', this.showButton);
		document.addEventListener('touchstart', this.showButton);
	}
	
	componentWillUnmount() {
		document.removeEventListener('fullscreenchange', this.onFullScreenChange);
		document.removeEventListener('webkitfullscreenchange', this.onFullScreenChange);
		document.removeEventListener('mozfullscreenchange', this.onFullScreenChange);
		document.removeEventListener('MSFullscreenChange', this.onFullScreenChange);
		
		document.removeEventListener('mousemove', this.showButton);
		document.removeEventListener('touchstart', this.showButton);
		
		if (this.hideTimer) {
			clearTimeout(this.hideTimer);
		}
	}
	
	onFullScreenChange() {
		const isFullScreen = !!(
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement
		);
		
		if (!isFullScreen) {
			document.body.style.background = '';
		}
		
		this.setState({
			isFullScreen: isFullScreen,
			buttonVisible: !isFullScreen ? true : this.state.buttonVisible
		});
	}
	
	showButton() {
		if (!this.state.isFullScreen) return;
		
		this.setState({ buttonVisible: true });
		
		if (this.hideTimer) {
			clearTimeout(this.hideTimer);
		}
		
		this.hideTimer = setTimeout(() => {
			this.setState({ buttonVisible: false });
		}, 500);
	}
	
	toggleScreen() {
		const elem = document.documentElement;

		if (!document.fullscreenElement &&
		    !document.mozFullScreenElement &&
	      	!document.webkitFullscreenElement &&
	      	!document.msFullscreenElement) {

			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
      	} else {
		    if (document.exitFullscreen) {
		      document.exitFullscreen();
		    } else if (document.msExitFullscreen) {
		      document.msExitFullscreen();
		    } else if (document.mozCancelFullScreen) {
		      document.mozCancelFullScreen();
		    } else if (document.webkitExitFullscreen) {
		      document.webkitExitFullscreen();
		    }
      	}
	}

	render() {
		const buttonClass = "custom-button " + 
			(this.state.isFullScreen && !this.state.buttonVisible ? "hidden-button" : "visible-button");
		
		return (
			<button className={buttonClass} onClick={this.toggleScreen}>Toggle Full Screen</button>
		);
	}
}

class ScreenTester extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			patterns: [
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
				'repeating-linear-gradient(0deg, black 0px, black 25px, white 25px, white 50px), repeating-linear-gradient(90deg, black 0px, black 25px, transparent 25px, transparent 50px)',
				// Finer checkerboard
				'repeating-linear-gradient(45deg, #000 0, #000 5px, #fff 5px, #fff 10px), repeating-linear-gradient(-45deg, #000 0, #000 5px, #fff 5px, #fff 10px)',

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
				'white linear-gradient(black, black) no-repeat 1px 1px / calc(100% - 2px) calc(100% - 2px)'
			],
			patternIndex: 0
		};
		// Bind methods
		this.handleClick = this.handleClick.bind(this);
		this.changeColour = this.changeColour.bind(this);
		this.nextPattern = this.nextPattern.bind(this);
		this.prevPattern = this.prevPattern.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

    componentDidMount() {
        document.documentElement.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.documentElement.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
	
	handleClick(event) {
		// Check if the click target is the button or inside the button's container
		if (event.target.closest('.custom-button')) {
			return; 
		}
		this.changeColour();
	}

	changeColour() {
		// Use functional setState to ensure patternIndex is updated based on the previous state
		this.setState(prevState => {
			const nextIndex = (prevState.patternIndex + 1) % prevState.patterns.length;
			const backgroundElement = document.getElementById('background');
			const pattern = prevState.patterns[nextIndex];
			
			backgroundElement.style.background = pattern;
			
			if (document.fullscreenElement || document.webkitFullscreenElement || 
				document.mozFullScreenElement || document.msFullscreenElement) {
				document.body.style.background = pattern;
			}
			return { patternIndex: nextIndex };
		});
	}

	nextPattern() {
		this.changeColour();
	}

	prevPattern() {
		this.setState(prevState => {
			const prevIndex = (prevState.patternIndex - 1 + prevState.patterns.length) % prevState.patterns.length;
			const backgroundElement = document.getElementById('background');
			const pattern = prevState.patterns[prevIndex];
			
			backgroundElement.style.background = pattern;
			
			if (document.fullscreenElement || document.webkitFullscreenElement || 
				document.mozFullScreenElement || document.msFullscreenElement) {
				document.body.style.background = pattern;
			}
			return { patternIndex: prevIndex };
		});
	}

	handleKeyDown(e) {
		switch (e.key) {
			case "f":
			case "F":
				document.fullscreenElement
					? document.exitFullscreen()
					: document.documentElement.requestFullscreen();
				break;
			case "ArrowRight":
				this.nextPattern();
				break;
			case "ArrowLeft":
				this.prevPattern();
				break;
			case "g":
			case "G":
				document.body.classList.toggle("show-grid");
				break;
			case "c":
			case "C":
				document.body.classList.toggle("show-crosshair");
				break;
			case "Escape":
				if (document.fullscreenElement) document.exitFullscreen();
				break;
		}
	}

	render() {
	    return (
	    	<div className="test">
		    	<ToggleFullScreen />
	    	</div>
	    );
	}
}

// Updated rendering for React 18
const container = document.getElementById('content');
const root = ReactDOM.createRoot(container);
root.render(<ScreenTester />);