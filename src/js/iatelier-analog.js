// var $ = jQuery = require("jquery");
// window.$ = window.jQuery = $;
// Window.$ = Window.jQuery = $

import './selectize.js';

// const flatpickr = require("flatpickr");



import flatpickr from "flatpickr";

/*
$(".flatpickr").flatpickr({
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});
*/


flatpickr(".flatpickr", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

