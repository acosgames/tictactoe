

export async function attachMessageEvent(fn) {
    window.addEventListener('message', fn, false);
}

export async function send(action, payload) {
    window.parent.postMessage({ action, payload }, '*');
}