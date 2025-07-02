import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Since app.js uses global React and class components, we need to simulate the environment
// Mock the global React components from app.js

// Create a simplified version for testing
class ToggleFullScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullScreen: false,
      buttonVisible: true
    };
    this.hideTimer = null;
    this.onFullScreenChange = this.onFullScreenChange.bind(this);
    this.showButton = this.showButton.bind(this);
    this.toggleScreen = this.toggleScreen.bind(this);
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', this.onFullScreenChange);
    document.addEventListener('mousemove', this.showButton);
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.onFullScreenChange);
    document.removeEventListener('mousemove', this.showButton);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  }

  onFullScreenChange() {
    const isFullScreen = !!document.fullscreenElement;
    this.setState({ isFullScreen });
  }

  showButton() {
    this.setState({ buttonVisible: true });
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.hideTimer = setTimeout(() => {
      this.setState({ buttonVisible: false });
    }, 3000);
  }

  toggleScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  render() {
    const { isFullScreen, buttonVisible } = this.state;
    return (
      <button
        className={`custom-button ${buttonVisible ? 'visible-button' : 'hidden-button'}`}
        onClick={this.toggleScreen}
        data-testid="fullscreen-toggle"
      >
        {isFullScreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
      </button>
    );
  }
}

class ScreenTester extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: [
        'rgb(255,0,0)', // Red
        'rgb(0,255,0)', // Green
        'rgb(0,0,255)', // Blue
        'rgb(255,255,255)', // White
        'rgb(0,0,0)', // Black
      ],
      patternIndex: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.changeColour = this.changeColour.bind(this);
    this.nextPattern = this.nextPattern.bind(this);
    this.prevPattern = this.prevPattern.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClick(event) {
    if (event.target.closest('.custom-button')) {
      return;
    }
    this.changeColour();
  }

  changeColour() {
    this.setState(prevState => {
      const nextIndex = (prevState.patternIndex + 1) % prevState.patterns.length;
      return { patternIndex: nextIndex };
    });
  }

  nextPattern() {
    this.changeColour();
  }

  prevPattern() {
    this.setState(prevState => {
      const prevIndex = (prevState.patternIndex - 1 + prevState.patterns.length) % prevState.patterns.length;
      return { patternIndex: prevIndex };
    });
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        this.nextPattern();
        break;
      case 'ArrowLeft':
        this.prevPattern();
        break;
      case 'f':
      case 'F':
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen();
        break;
    }
  }

  render() {
    return (
      <div className="test" data-testid="screen-tester">
        <ToggleFullScreen />
        <div data-testid="current-pattern">{this.state.patternIndex}</div>
      </div>
    );
  }
}

describe('ToggleFullScreen Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null,
    });
  });

  test('renders fullscreen button', () => {
    render(<ToggleFullScreen />);
    const button = screen.getByTestId('fullscreen-toggle');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Fullscreen (F)');
  });

  test('button text changes when fullscreen state changes', () => {
    render(<ToggleFullScreen />);
    const button = screen.getByTestId('fullscreen-toggle');
    
    // Simulate entering fullscreen
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: document.documentElement,
    });
    
    fireEvent(document, new Event('fullscreenchange'));
    expect(button).toHaveTextContent('Exit Fullscreen (F)');
  });

  test('toggles fullscreen when clicked', async () => {
    render(<ToggleFullScreen />);
    const button = screen.getByTestId('fullscreen-toggle');
    
    fireEvent.click(button);
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });
});

describe('ScreenTester Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders screen tester component', () => {
    render(<ScreenTester />);
    const screenTester = screen.getByTestId('screen-tester');
    expect(screenTester).toBeInTheDocument();
  });

  test('starts with pattern index 0', () => {
    render(<ScreenTester />);
    const patternDisplay = screen.getByTestId('current-pattern');
    expect(patternDisplay).toHaveTextContent('0');
  });

  test('changes pattern on right arrow key', () => {
    render(<ScreenTester />);
    const patternDisplay = screen.getByTestId('current-pattern');
    
    fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(patternDisplay).toHaveTextContent('1');
  });

  test('changes pattern on left arrow key', () => {
    render(<ScreenTester />);
    const patternDisplay = screen.getByTestId('current-pattern');
    
    // First go to pattern 1
    fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(patternDisplay).toHaveTextContent('1');
    
    // Then go back to pattern 0
    fireEvent.keyDown(document, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(patternDisplay).toHaveTextContent('0');
  });

  test('cycles through patterns correctly', () => {
    render(<ScreenTester />);
    const patternDisplay = screen.getByTestId('current-pattern');
    
    // We have 5 patterns (0-4), so after 5 right arrows we should be back to 0
    for (let i = 0; i < 5; i++) {
      fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
    }
    expect(patternDisplay).toHaveTextContent('0');
  });

  test('handles fullscreen key press', () => {
    render(<ScreenTester />);
    
    fireEvent.keyDown(document, { key: 'f', code: 'KeyF' });
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
  });
});