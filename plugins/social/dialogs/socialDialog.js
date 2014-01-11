(function(CKEDITOR) {
  CKEDITOR.dialog.add('socialDialog', function (editor) {
    var partIds = ['facebook-likeOptions', 'twitter-shareOptions', 'googleplus-oneOptions']
      , defaultOptions = 'facebook-like';

    function dialogTypeChange() {
      var dialog = this.getDialog()
        , typeValue = this.getValue();

      for (var i = 0, l = partIds.length; i < l; i++) {
        var element = dialog.getContentElement('info', partIds[i]);
        if (!element) continue;
        element = element.getElement().getParent().getParent();
        if (partIds[i] === typeValue + 'Options') element.show();
        else element.hide();
      }
      dialog.layout();
    }

    function createTextField(type, id, label, defaultText) {
      return {
        type: 'text',
        label: label,
        id: type + '-' + id,
        'default': defaultText || '',
        setup: function(element) {
          this.setValue(element.getAttribute('data-' + id));
        },
        commit: function(data) {
          if (!data[type]) data[type] = {};
          data[type][id] = this.getValue();
        }
      };
    }

    function displayOptions(type) {
      return function(element) {
        if (element.getAttribute('class').indexOf(type) !== -1) {
          this.getElement().show();
        } else {
          this.getElement().hide();
        }
      };
    }

    return {
      title: 'Social media button',
      minWidth: 400,
      minHeight: 200,
      contents: [
        {
          id: 'info',
          label: 'Properties',
          title: 'Properties',
          elements: [{
            id: 'dialogType',
            type: 'select',
            label: 'Widget type',
            'default': defaultOptions,
            items: [
              ['Facebook Like', 'facebook-like'],
              ['Twitter Share', 'twitter-share'],
              // @TODO twitter-follow, twitter-mention, twitter-hashtag, twitter-embed
              ['Google +1', 'googleplus-one'],
              // @TODO google-plus-share, googleplus-badge
              // @TODO linkedin-recommend linkedin-shared
            ],
            onChange: dialogTypeChange,
            setup: function(element) {
              var type = element.getAttribute('data-method');
              if (type) this.setValue(type);
            },
            commit: function(data) { data.type = this.getValue(); }
          }, {
            type: 'vbox',
            id: 'facebook-likeOptions',
            children: [
              createTextField('facebook-like', 'href', 'URL'),
              createTextField('facebook-like', 'send', 'Send button', 'false'),
              createTextField('facebook-like', 'show-faces', 'Show faces', 'false'),
              // createTextField('facebook-like', 'width', 'Caption'),
              createTextField('facebook-like', 'font', 'Font', ''),
              createTextField('facebook-like', 'colorscheme', 'Colorscheme (light, dark)', ''),
              createTextField('facebook-like', 'action', 'Action (recommend, like)'),
              createTextField('facebook-like', 'layout', 'Layout (standard, button_count, box_count)', 'button_count')
            ],
            setup: displayOptions('facebook-like')
          }, {
            type: 'vbox',
            id: 'googleplus-oneOptions',
            children: [
              createTextField('googleplus-one', 'href', 'URL'),
              createTextField('googleplus-one', 'size', 'Size (medium, tall)', 'medium'),
              createTextField('googleplus-one', 'annotation', 'Annotation', '')
            ],
            setup: displayOptions('googleplus-one')
          }, {
            type: 'vbox',
            id: 'twitter-shareOptions',
            children: [
              createTextField('twitter-share', 'url', 'URL'),
              createTextField('twitter-share', 'type', 'Count type (eg. none)'),
              createTextField('twitter-share', 'via', 'Via account'),
              createTextField('twitter-share', 'related', 'Related'),
              createTextField('twitter-share', 'text', 'Text'),
            ],
            setup: displayOptions('twitter-share')
          }]
        }
      ],
      onLoad: function(data) {
        for (var i = 0, l = partIds.length; i < l; i++) {
          if (partIds[i] !== defaultOptions + 'Options') {
            var element = this.getContentElement('info', partIds[i]);
            if (!element) continue;
            element = element.getElement().getParent().getParent();
            element.hide();
          }
        }
        this.layout();
      },
      onShow: function() {
        var selection = editor.getSelection()
          , element = selection.getStartElement();

        if (element) element = element.getAscendant('a', true);
        if (!element || !element.hasClass('socialite')) {
          element = editor.document.createElement('a');
          element.setAttribute('class', 'socialite');
          this.insertMode = true;
        } else {
          this.insertMode = false;
        }
        this.element = element;
        if (!this.insertMode) {
          this.setupContent(this.element);
        }
      },
      onOk: function() {
        var dialog = this
          , element = this.element
          , data = {};

        this.commitContent(data);
        element.setAttribute('class', 'socialite ' + data.type);
        element.setText('Share');
        element.setAttribute('href', typeof data[data.type].url === 'string' ? data[data.type].url : data[data.type].href);
        for (var key in data[data.type]) if (data[data.type].hasOwnProperty(key)) {
          var value = data[data.type][key];
          if (value.length) {
            element.setAttribute('data-' + key, value);
          }
        }

        if (this.insertMode) {
          editor.insertElement(element);
        }
      }
    };
  });
}(window.CKEDITOR));
