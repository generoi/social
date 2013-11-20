(function(CKEDITOR, $) {
  CKEDITOR.plugins.add('social', {
    requires: 'dialog,fakeobjects',
    onLoad: function() {
      var pathToRoot = this.path + '../../';
      var css = [
          '.facebook-like, .twitter-share, .googleplus-one, .linkedin-share {'
        , 'background-image: url(' + CKEDITOR.getUrl(pathToRoot + 'css/social-sprite.png') + ');'
        , 'background-repeat: no-repeat; background-color: transparent; background-position: 0 0;'
        , 'display: block; width: 65px; height: 25px; text-indent: -9999px; white-space: nowrap;'
        , '}'
        , '.facebook-like { background-position: -5px -95px; }'
        , '.twitter-share { background-position: -5px -35px; }'
        , '.googleplus-one { background-position: -5px -65px; }'
        , '.linkedin-share { background-position: -5px 5px; }'
        ].join('');

      CKEDITOR.addCss(css);
    },
    init: function(editor) {
      editor.addCommand('socialDialog', new CKEDITOR.dialogCommand('socialDialog', {
        allowedContent: 'a[*](!socialite,facebook-like,twitter-share,twitter-follow,twitter-mention,twitter-hashtag,twitter-embed,googleplus-one,googleplus-share,googleplus-badge,linkedin-share,linkedin-recommend)',
        requiredContent: 'a'
      }));
      editor.ui.addButton('Social', {
        label: 'Add social media button',
        command: 'socialDialog',
        icon: this.path + 'icon.gif'
      });

      CKEDITOR.dialog.add('socialDialog', this.path + 'dialogs/socialDialog.js');
    }
  });

}(window.CKEDITOR, jQuery));
