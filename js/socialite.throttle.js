(function(Socialite) {

  Socialite.throttle = (function() {
    var settings = {
      simultaneousRenders: 3,
      renderInterval: 100,
      maxRenderWaitFailsafe: 5000,
      callbackDelay: 250,
    };

    var widgets = [], activeRenders = 0;

    // Check for new tasks each renderInterval
    setInterval(function() {
      if (!widgets.length) return;
      if (activeRenders >= settings.simultaneousRenders) return;
      var obj = widgets.shift();
      if (typeof obj === 'undefined') return;

      // We have a widget area ready to be parsed.
      activeRenders++;

      (function() {
        var currentRenderDone = false;
        // Make sure a render doesn't fail hogging a render task.
        setTimeout(function() {
          if (!currentRenderDone) {
            activeRenders--;
            currentRenderDone = true;
          }
        }, settings.maxRenderWaitFailsafe);

        // Load a widget
        Socialite.load(null, obj, null, function() {
          if (!currentRenderDone) {
            activeRenders--;
            currentRenderDone = true;
          }
        });
      }());

    }, settings.renderInterval);

    return function (context, top) {
      var elements = Socialite.getElements(context, 'socialite');
      if (top) widgets = elements.concat(widgets);
      else widgets = widgets.concat(elements);
    };
  }());

}(window.Socialite));
