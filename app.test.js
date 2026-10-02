import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

let ScreenTester;
beforeAll(() => {
  global.React = React;
  global.ReactDOM = { createRoot: () => ({ render: element => { ScreenTester = element.type; } }) };
  document.body.innerHTML = '<div id="background"></div><div id="content"></div>';
  require('./app.js');
});
beforeEach(() => {
  jest.clearAllMocks();
  document.body.className = '';
  document.body.style.background = '';
  document.body.innerHTML = '<div id="background"></div><div id="content"></div>';
  document.fullscreenElement = null;
  Object.defineProperty(document, 'hidden', {configurable: true, value: false});
});
afterEach(() => { cleanup(); jest.useRealTimers(); });
const background = () => document.getElementById('background');
const key = value => fireEvent.keyDown(document, { key: value });
const goTo = id => {
  for (let attempts = 0; attempts < 50; attempts++) {
    if (document.querySelector('.test').dataset.pattern === id) return;
    key('ArrowRight');
  }
  throw new Error('Pattern not found: ' + id);
};

test('initial pattern is red before input', () => {
  render(<ScreenTester />);
  expect(background().style.background).toBe('rgb(255, 0, 0)');
});
test('production navigation wraps in both directions and ignores controls', () => {
  render(<ScreenTester />);
  key('ArrowRight');
  expect(background().style.background).toBe('rgb(0, 255, 0)');
  key('ArrowLeft');
  expect(background().style.background).toBe('rgb(255, 0, 0)');
  for (let i = 0; i < 38; i++) key('ArrowRight');
  expect(background().style.background).toBe('rgb(255, 0, 0)');
  fireEvent.click(screen.getByRole('button', {name: /full.?screen/i}));
  expect(background().style.background).toBe('rgb(255, 0, 0)');
});

test('grid and crosshair controls retain their state while navigating', () => {
  render(<ScreenTester />);
  key('g'); key('c'); key('ArrowRight');
  expect(document.body).toHaveClass('show-grid', 'show-crosshair');
  expect(screen.getByRole('button', {name: 'Grid'})).toHaveAttribute('aria-pressed', 'true');
});
test('editable controls do not trigger global shortcuts', () => {
  render(<ScreenTester />);
  const input = document.createElement('input'); document.body.appendChild(input);
  fireEvent.keyDown(input, {key: 'ArrowRight'});
  expect(background().style.background).toBe('rgb(255, 0, 0)');
});
test('flicker requires explicit start and Escape stops it', () => {
  render(<ScreenTester />);
  key('ArrowLeft');
  expect(background()).not.toHaveClass('flicker-fast');
  fireEvent.click(screen.getByRole('button', {name: 'Start animation'}));
  expect(background()).toHaveClass('flicker-fast');
  key('Escape');
  expect(background()).not.toHaveClass('flicker-fast');
});
test('fullscreen preserves the background plane and exit clears body effects', () => {
  render(<ScreenTester />);
  goTo('bouncing-box');
  document.fullscreenElement = document.documentElement;
  fireEvent(document, new Event('fullscreenchange'));
  expect(background()).toHaveClass('bouncing-box');
  expect(document.body).not.toHaveClass('bouncing-box');
  document.fullscreenElement = null;
  fireEvent(document, new Event('fullscreenchange'));
  expect(document.body).not.toHaveClass('bouncing-box');
});
test('unmount removes effects and listeners', () => {
  const {unmount} = render(<ScreenTester />);
  key('g'); key('ArrowLeft');
  unmount();
  expect(document.body).not.toHaveClass('show-grid');
  expect(background().style.background).toBe('');
  key('ArrowRight');
  expect(background().style.background).toBe('');
});

test('fullscreen request rejection is shown without changing pattern', async () => {
  document.documentElement.requestFullscreen.mockRejectedValueOnce(new Error('Request denied'));
  render(<ScreenTester />);
  key('f');
  expect(await screen.findByRole('alert')).toHaveTextContent('Request denied');
  expect(background().style.background).toBe('rgb(255, 0, 0)');
});
test.each([
  ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitfullscreenchange'],
  ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozfullscreenchange'],
  ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'MSFullscreenChange'],
])('prefixed fullscreen %s is shared by button and keyboard', async (request, exit, property, event) => {
  const standardRequest = document.documentElement.requestFullscreen;
  const standardExit = document.exitFullscreen;
  document.documentElement.requestFullscreen = undefined;
  document.exitFullscreen = undefined;
  document.documentElement[request] = jest.fn(() => {document[property] = document.documentElement; fireEvent(document, new Event(event));});
  document[exit] = jest.fn(() => {document[property] = null; fireEvent(document, new Event(event));});
  try {
    render(<ScreenTester />);
    await act(async () => key('f'));
    expect(screen.getByRole('button', {name: 'Exit fullscreen'})).toBeInTheDocument();
    await act(async () => key('Escape'));
    expect(screen.getByRole('button', {name: 'Fullscreen'})).toBeInTheDocument();
  } finally {
    document.documentElement.requestFullscreen = standardRequest; document.exitFullscreen = standardExit;
    delete document.documentElement[request]; delete document[exit]; delete document[property];
  }
});
test('unsupported fullscreen is reported', async () => {
  const request = document.documentElement.requestFullscreen;
  document.documentElement.requestFullscreen = undefined;
  try {
    render(<ScreenTester />); key('f');
    expect(await screen.findByRole('alert')).toHaveTextContent('unavailable');
  } finally { document.documentElement.requestFullscreen = request; }
});
test('hidden page stops animation and returning does not restart', () => {
  render(<ScreenTester />);
  goTo('bouncing-box');
  expect(background()).toHaveClass('bouncing-box');
  Object.defineProperty(document, 'hidden', {configurable: true, value: true});
  fireEvent(document, new Event('visibilitychange'));
  expect(background()).not.toHaveClass('bouncing-box');
  Object.defineProperty(document, 'hidden', {configurable: true, value: false});
  fireEvent(document, new Event('visibilitychange'));
  expect(background()).not.toHaveClass('bouncing-box');
});
test('reduced motion requires deliberate animation start', () => {
  window.matchMedia.mockReturnValueOnce({matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn()});
  render(<ScreenTester />);
  goTo('bouncing-box');
  expect(background()).not.toHaveClass('bouncing-box');
  fireEvent.click(screen.getByRole('button', {name: 'Start animation'}));
  expect(background()).toHaveClass('bouncing-box');
  fireEvent.click(screen.getByRole('button', {name: 'Stop animation'}));
  expect(background()).not.toHaveClass('bouncing-box');
});
test('controls reveal on input, retain focus, and cancel hide timer on unmount', () => {
  jest.useFakeTimers();
  const {unmount} = render(<ScreenTester />);
  document.fullscreenElement = document.documentElement;
  fireEvent(document, new Event('fullscreenchange'));
  fireEvent.mouseMove(document);
  act(() => jest.advanceTimersByTime(1500));
  expect(screen.getByRole('button', {name: 'Next'}).parentElement).toHaveClass('hidden-button');
  fireEvent.touchStart(document);
  const next = screen.getByRole('button', {name: 'Next'});
  act(() => next.focus());
  act(() => jest.advanceTimersByTime(1500));
  expect(next.parentElement).not.toHaveClass('hidden-button');
  fireEvent.mouseMove(document); unmount();
  expect(jest.getTimerCount()).toBe(0);
});
test('help and controls do not navigate the test surface', () => {
  render(<ScreenTester />);
  fireEvent.click(screen.getByRole('button', {name: 'Help'}));
  expect(screen.getByText(/Click the test surface/)).toBeInTheDocument();
  expect(background().style.background).toBe('rgb(255, 0, 0)');
  fireEvent.click(background());
  expect(background().style.background).toBe('rgb(0, 255, 0)');
  fireEvent.keyDown(document, {key: 'ArrowRight', ctrlKey: true});
  expect(background().style.background).toBe('rgb(0, 255, 0)');
  key('x');
});

test('fullscreen exit cancels pending hide and stops motion even without Escape keydown', () => {
  jest.useFakeTimers();
  render(<ScreenTester />);
  goTo('bouncing-box');
  document.fullscreenElement = document.documentElement;
  fireEvent(document, new Event('fullscreenchange'));
  fireEvent.mouseMove(document);
  document.fullscreenElement = null;
  fireEvent(document, new Event('fullscreenchange'));
  act(() => jest.advanceTimersByTime(2000));
  expect(screen.getByRole('button', {name: 'Next'}).parentElement).not.toHaveClass('hidden-button');
  expect(background()).not.toHaveClass('bouncing-box');
});
test('grid overlay never shares the fullscreen animation plane', () => {
  render(<ScreenTester />);
  key('g');
  goTo('bouncing-box');
  document.fullscreenElement = document.documentElement;
  fireEvent(document, new Event('fullscreenchange'));
  expect(document.body).toHaveClass('show-grid');
  expect(document.body).not.toHaveClass('bouncing-box');
  expect(background()).toHaveClass('bouncing-box');
});

test('changing motion preference stops the active pattern and unregisters listeners', () => {
  let onChange;
  const remove = jest.fn();
  window.matchMedia.mockReturnValueOnce({matches: false, addEventListener: (event, callback) => {onChange = callback;}, removeEventListener: remove});
  const {unmount} = render(<ScreenTester />);
  goTo('bouncing-box');
  act(() => onChange({matches: true}));
  expect(background()).not.toHaveClass('bouncing-box');
  unmount(); expect(remove).toHaveBeenCalledWith('change', onChange);
});
test('legacy motion listeners are cleaned up', () => {
  const addListener = jest.fn(); const removeListener = jest.fn();
  window.matchMedia.mockReturnValueOnce({matches: false, addListener, removeListener});
  const {unmount} = render(<ScreenTester />);
  const handler = addListener.mock.calls[0][0];
  act(() => handler({matches: false}));
  unmount(); expect(removeListener).toHaveBeenCalledWith(handler);
});
test('batched input commits the final selected pattern correctly', () => {
  render(<ScreenTester />);
  act(() => { key('ArrowRight'); key('ArrowRight'); key('ArrowLeft'); });
  expect(background().style.background).toBe('rgb(0, 255, 0)');
});

test('keyboard activation of controls does not also advance the surface', async () => {
  const user = userEvent.setup();
  render(<ScreenTester />);
  await user.tab();
  expect(screen.getByRole('button', {name: 'Previous'})).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(document.querySelector('.test')).toHaveAttribute('data-pattern', 'flicker-fast');
  expect(background()).not.toHaveClass('flicker-fast');
  await user.click(screen.getByRole('button', {name: 'Grid'}));
  expect(document.body).toHaveClass('show-grid');
  expect(document.querySelector('.test')).toHaveAttribute('data-pattern', 'flicker-fast');
});
