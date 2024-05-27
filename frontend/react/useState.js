import {render } from '../src/spa.js';
export function useState(initialValue) {
    let state = initialValue;
    function getState() {
        return state;
    }
    function setState(newValue) {
        state = newValue;
        render();
    }
    return [getState, setState];
}