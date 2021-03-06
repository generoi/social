/*!
 * Socialite v2.0 - Facebook extension
 * http://socialitejs.com
 * Copyright (c) 2011 David Bushell
 * Dual-licensed under the BSD or MIT licenses: http://socialitejs.com/license.txt
 */
(function(window, document, Socialite, $, undefined) {

  // http://developers.facebook.com/docs/reference/plugins/like/
  // http://developers.facebook.com/docs/reference/javascript/FB.init/
  //
  // This script requires jquery-tiny-pubsub.

  Socialite.network('facebook', {
    script: {
      src : '//connect.facebook.net/{{language}}/all.js',
      id  : 'facebook-jssdk'
    },
    append: function(network) {
      var fb = document.createElement('div'),
          settings = Socialite.settings.facebook,
          events = { onlike: 'edge.create', onunlike: 'edge.remove', onsend: 'message.send' },
          options;
      fb.id = 'fb-root';
      if (!document.body) return;
      document.body.appendChild(fb);
      network.script.src = network.script.src.replace('{{language}}', settings.lang);

      if (settings.lang) delete settings.lang;

      window.fbAsyncInit = function() {
        // Allow init-settings to be modified by others.
        var options = $.extend({
              appId: undefined,
              xfbml: false,
              status: false
            }, settings);

        // We have to initalize otherwise buttons aren't parsed.
        window.FB.init(options);
        $.publish('fb.init', options);
        for (var e in events) if (events.hasOwnProperty(e)) {
          if (typeof settings[e] === 'function') {
            window.FB.Event.subscribe(events[e], settings[e]);
          }
        }
      };
    }
  });


  Socialite.widget('facebook', 'like', {
    init: function(instance) {
      var el = document.createElement('div')
        , protocol, attributes = {};

      el.className = 'fb-like';
      Socialite.copyDataAttributes(instance.el, el);
      attributes.href = el.getAttribute('data-href');

      // Default to current URL
      if (!attributes.href) {
        protocol = Drupal.settings.social && Drupal.settings.social.defaultProtocol || (location.protocol + '//');
        attributes.href = protocol + location.host + location.pathname;
      }

      // If forced protocol is used.
      if (protocol = Drupal.settings.social && Drupal.settings.social.forceProtocol) {
        attributes.href = attributes.href.replace(/^https?:\/\//, protocol);
      }

      // Currently only supports altertering the href.
      $.publish('socialite.alterAttributes', [attributes]);
      el.setAttribute('data-href', attributes.href);

      instance.el.appendChild(el);
      // If FB hasn't been loaded, wait for the event.
      if (!(window.FB && window.FB.XFBML)) {
        return $.subscribe('fb.init', function() {
          window.FB.XFBML.parse(instance.el);
        });
      }
      window.FB.XFBML.parse(instance.el);
    }
  });

})(window, window.document, window.Socialite, jQuery);
