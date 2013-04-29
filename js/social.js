(function($) {
  Drupal.behaviors.social = {
    attach: function(context) {
      var settings = Drupal.settings.social;
      // Extend the facebook init settings with options provided by social.
      // As socialite uses lazy loading (until a tag is parsed) this is possible here.
      if (settings.facebook && settings.facebook.options) {
        $.extend(Socialite.settings.facebook, settings.facebook.options);
      }

      switch (settings.load) {
        case 'hover':
          $(context).find('.node').on('mouseenter', function() {
             // $.one, dergisters after the the function has been called,
            // we need to do it before Socialite.throttle otherwise there
            // might be multiple tasks running because of the throttling.
            $(this).off('mouseenter');
            Socialite.throttle(this);
          });
          break;
        case 'scroll':
          // @TODO
        case 'onload':
        default:
          // Begin a throttled load of all widgets.
          Socialite.throttle(context instanceof jQuery ? context[0] : context);
          break;
      }
    }
  };

  Drupal.social = Drupal.social || {};
}(jQuery));
