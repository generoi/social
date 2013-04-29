<?php

/**
 * Serve a channel file for facebook.
 * @see https://developers.facebook.com/docs/reference/javascript/#channel
 */
function social_channelfile() {
  header('Pragma: public');
  header('Cache-Control: max-age=' . SOCIAL_CHANNEL_FILE_EXPIRE);
  header('Expires: ' . gmdate('D, d M Y H:i:s', time() + SOCIAL_CHANNEL_FILE_EXPIRE));

  print '<script src="//connect.facebook.net/' . SOCIAL_FACEBOOK_LOCALE . '/all.js"></script>';
  drupal_exit();
}
