<?php
require_once 'variables.php';

/**
 * Returns a descripitive HTTP response in HTML format
 *
 * @param init|string $code
 * The HTTP response status code
 * @return string
 */
function http_html_response(int|string $code): string {
  $code_title = HTTP_CODE_TITLE[$code];
  $code_tip   = HTTP_RESPONSE_TIPS[$code];
  $template_html = <<<TEMPLATE
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <title>{$code_title}</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body>
    <div id='wrapper' class='w-[100%] flex items-center justify-center bg-gray-950'>
      <p id='warnning' class='text-3xl text-center italic'>{$code_tip}</p>
    </div>
  </body>
  <script>
    //debugger
    const wrapper = document.querySelector('div#wrapper')
      wrapper.style.width  = window.innerWidth  + 'px'
      wrapper.style.height = window.innerHeight + 'px'
    window.addEventListener('load', () => {
    })
    window.addEventListener('resize', () => {
      wrapper.style.width  = window.innerWidth  + 'px'
      wrapper.style.height = window.innerHeight + 'px'
    })
  </script>
  </html>
  TEMPLATE;

  return $template_html;
}
?>
