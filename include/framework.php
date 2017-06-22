<?php

function loadScripts(){
    wp_enqueue_script('framework-script', get_template_directory_uri() . '/framework/dist/js/scripts.min.js', false, '', true);
    wp_enqueue_style('framework-style', get_template_directory_uri() . '/framework/dist/css/main.min.css');
}

add_action('wp_enqueue_scripts', 'loadScripts');