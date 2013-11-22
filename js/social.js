(function($) {
  Socialite.setup({
    facebook: {
      onlike: function (url) { Drupal.social.ga('facebook', 'like', url); },
      onunlike: function (url) { Drupal.social.ga('facebook', 'unlike', url); },
      onsend: function (url) { Drupal.social.ga('facebook', 'send', url); }
    },
    twitter: {
      ontweet: function (e) { Drupal.social.ga('twitter', 'tweet', ''); },
      onclick: function (e) { Drupal.social.ga('twitter', 'click', e.region); }
    }
  });

  Drupal.behaviors.social = {
    attach: function(context) {
      var settings = Drupal.settings.social,
          networks = ['facebook', 'twitter'];

      // Extend the network init settings with options provided by social.
      // As socialite uses lazy loading (until a tag is parsed) this is possible here.
      for (var i = 0, l = networks.length; i < l; i++) {
        var network = networks[i];
        if (settings[network] && settings[network].options) {
          $.extend(Socialite.settings[network], settings[network].options);
        }
      }

      // Load facebook network even on pages without widgets.
      if (window.Socialite && !window.Socialite.networkReady('facebook')) {
        Socialite.appendNetwork(Socialite.networks.facebook);
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

  Drupal.social.ga = function() {
    window._gaq && window._gaq.push(['_trackSocial'].concat(arguments));
    console && console.log && console.log('trackSocial', arguments);
  }
}(jQuery));
