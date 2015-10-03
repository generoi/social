/* global Socialite:true */
(function($) {

  Drupal.behaviors.social = {
    attach: function(context) {
      if (!this.processed) {
        Drupal.social.setup();
        this.processed = true;
      }
      var settings = Drupal.settings.social;
      var networks = ['facebook', 'twitter'];
      var that = this;

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
          /* falls through */
        case 'onload':
          /* falls through */
        default:
          // Begin a throttled load of all widgets.
          if (this.fbInit) {
            Drupal.social.loadWidgets(context);
          }
          $.subscribe('fb.init', function () {
            that.fbInit = true;
            Drupal.social.loadWidgets(context);
          });
          break;
      }
    }
  };

  Drupal.social = Drupal.social || {};

  Drupal.social.loadWidgets = function (context) {
    Socialite.throttle(context instanceof jQuery ? context[0] : context);
  };

  Drupal.social.setup = function () {
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
  };

  Drupal.social.ga = function() {
    var args = Array.prototype.slice.call(arguments);
    if (window._gaq) window._gaq.push(['_trackSocial'].concat(args));
    if (console && console.log) console.log('trackSocial', args);
  };
}(jQuery));
