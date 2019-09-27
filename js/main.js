function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function nsInit() {
  console.log('[nsInit]');
  Nexus.context = Tone.context;
}
ready(nsInit);
