<?php

/**
 * @file social.widgets.inc
 * TODO: Enter file description here.
 */
/**
 * Generate the needed markup for the facebook share link.
 *
 * @param $url The url to be shared
 * @param $type Generate horizontal or vertical widgets
 * @param $title The title to be shared
 * @param $lang The language of the facebook button
 * @return string the html markup
 *
 * @see _easy_social_widget_facebook_markup()
 */
function _social_widget_facebook_markup($url, $type, $title = NULL, $lang = 'en') {
  // Correct for different language identification strings.
  $lang = _easy_social_facebook_langcodes($lang);

  // @TODO Subscribe to the 'edge.create' event through FB.Event.subscribe to
  // track successful shares. This will likely be in either a seperate module
  // or a new version.

  if ($type == EASY_SOCIAL_WIDGET_HORIZONTAL) {
    $width = variable_get_value('easy_social_facebook_width_horizontal');
    $type_box = 'button_count';
    $height = '21';
  }
  else {
    $width = variable_get_value('easy_social_facebook_width_vertical');
    $type_box = 'box_count';
    $height = '90';
  }

  $appid = variable_get_value('easy_social_facebook_appid');
  $facebook_type = variable_get_value('easy_social_facebook_widget_type');
  $send_button = variable_get_value('easy_social_facebook_send_button') ? 'true' : 'false';
  $show_faces = variable_get_value('easy_social_facebook_show_faces') ? 'true' : 'false';
  $action = variable_get_value('easy_social_facebook_verb');
  $color_scheme = variable_get_value('easy_social_facebook_color_scheme');
  $font = variable_get_value('easy_social_facebook_font');
  if ($font === 'default') {
    $font = '';
  }
  if ($facebook_type !== 'iframe') {
    $data = array(
      'href' => $url,
      'send' => $send_button,
      'show-faces' => $show_faces,
      'width' => $width,
      'font' => $font,
      'colorscheme' => $color_scheme,
      'action' => $action,
      'layout' => $type_box,
    );
    $options = array(
      'query' => array(
        'u' => drupal_encode_path($url),
      ),
    );

    $path = 'http://www.facebook.com/sharer.php';
    $markup = _social_socialitejs_widget_markup('facebook', 'like', $path, $data, $options);
  }
  else {
    $url = drupal_encode_path($url);
    $font = drupal_encode_path($font);

    $markup = <<<FB
<iframe src="//www.facebook.com/plugins/like.php?locale={$lang}&amp;href={$url}&amp;send=false&amp;layout={$type_box}&amp;width={$width}&amp;show_faces={$show_faces}&amp;action={$action}&amp;colorscheme={$color_scheme}&amp;font={$font}&amp;height={$height}&amp;appId={$appid}" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:{$width}px; height:{$height}px;" allowTransparency="true"></iframe>
FB;
  }
  return $markup;
}

/**
 * Generate the needed markeup for the Google+ share link.
 *
 * @param $url The url to be shared
 * @param $type Generate horizontal or vertical widgets
 * @param $title The title to be shared
 * @return string the html markup
 */
function _social_widget_googleplus_markup($url, $type, $title = NULL, $lang = 'und') {
  // This widget doesn't yet offer a localization option.
  // @TODO Use "callback" to track successful shares. This will likely be in
  // either a seperate module or a new version.

  $html5 = variable_get_value('easy_social_googleplus_html5');
  // @TODO doesnt resepect html5 vs custom markup.

  $data = array(
    'size' => ($type == EASY_SOCIAL_WIDGET_HORIZONTAL) ? 'medium' : 'tall',
    'href' => $url,
    'annotation' => variable_get_value('easy_social_googleplus_annotation'),
  );
  $options = array(
    'query' => array(
      'url' => drupal_encode_path($url),
    ),
  );

  $path = 'https://plusone.google.com/_/+1/confirm';
  return _social_socialitejs_widget_markup('googleplus', 'one', $path, $data, $options);
}

/**
 * Generate the needed markeup for the linkedin share link.
 *
 * @param $url The url to be shared
 * @param $type Generate horizontal or vertical widgets
 * @param $title The title to be shared
 * @return string the html markup
 */
function _social_widget_linkedin_markup($url, $type, $title = NULL, $lang = 'und') {
  // This widget doesn't yet offer a localization option.
  // @TODO Use "data-onsuccess" to track successful shares this will likely be
  // in either a seperate module or a new version.
  $type = ($type == EASY_SOCIAL_WIDGET_HORIZONTAL) ? 'right' : 'top';
  if (!($type_show = variable_get_value('easy_social_linkedin_count_show'))) {
    $type = FALSE;
  }
  $data = array(
    'url' => $url,
    'counter' => $type,
  );
  // @TODO mini?
  $options = array(
    'query' => array(
      'url' => drupal_encode_path($url),
      'mini' => 'true',
    ),
  );
  $path = 'http://www.linkedin.com/shareArticle';
  return _social_socialitejs_widget_markup('linkedin', 'share', $path, $data, $options);
}

/**
 * Generate the needed markup for the twitter share link.
 *
 * @param $url The url to be shared
 * @param $type Generate horizontal or vertical widgets
 * @param $title The title to be shared
 * @param $lang The language of the twitter button
 * @return string the html markup
 */
function _social_widget_twitter_markup($url, $type, $title = NULL, $lang = 'und') {
  $account_via = variable_get_value('easy_social_twitter_account_via');
  $account_related = variable_get_value('easy_social_twitter_account_related');
  $account_related_description = variable_get_value('easy_social_twitter_account_description');
  $type = ($type == EASY_SOCIAL_WIDGET_HORIZONTAL) ? 'horizontal' : 'vertical';
  // Override the data-count attribute to hide the count, if selected.
  if (!($type_show = variable_get_value('easy_social_twitter_count_show'))) {
    $type = 'none';
  }

  $data = array(
    // Correct for different language identification strings.
    'lang' => _easy_social_twitter_langcodes($lang),
    'type' => $type,
    'url' => $url,
    'via' => $account_via,
    'related' => $account_related . ':' . $account_related_description,
    'text' => $title,
  );
  $path = 'http://twitter.com/share';
  return _social_socialitejs_widget_markup('twitter', 'share', $path, $data);
}

function _social_socialitejs_widget_markup($network, $widget, $path, $data, $options = array()) {
  foreach (array_keys($data) as $attribute) {
    $data['data-' . $attribute] = $data[$attribute];
    unset($data[$attribute]);
  }
  $build = theme('link', array(
    '#theme' => 'link',
    '#text' => t('Share on @network', array('@network' => $network)),
    '#path' => $path,
    '#options' => array(
      'attributes' => $data + array(
        'rel' => 'nofollow',
        'target' => '_blank',
        'class' => array('socialite', $network . '-' . $widget),
      ),
      'html' => FALSE,
    ) + $options,
  ));
  return $build;
}
