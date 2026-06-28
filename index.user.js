// ==UserScript==
// @name         vietschool_patches
// @namespace    http://tampermonkey.net/
// @version      2026-02-26
// @description  a few patches to the original code to improve privacy.
// @author       rin
// @match        https://tracnghiem22.vietschool.vn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vietschool.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const settings={timezone_fix:!0,invisible:!0,allow_text_selection:!0},o_dsql=window.df_DateTime_SQL,o_wsget=window.WSGet;!0===settings.allow_text_selection&&document.querySelectorAll("*").forEach(e=>{e.style.webkitUserSelect="text",e.style.msUserSelect="text",e.style.userSelect="text"}),new MutationObserver(()=>{!0===settings.allow_text_selection&&document.querySelectorAll("*").forEach(e=>{e.style.webkitUserSelect="text",e.style.msUserSelect="text",e.style.userSelect="text"})}).observe(document.body,{childList:!0,subtree:!0});const ws_getd=(...e)=>!0===settings.invisible&&["CheckLogged","ElearningCheckRoom","ElearningInit","ElearningInitThanhVien"].includes(e[2])?(o_wsget(...e),setTimeout(()=>o_wsget(()=>{},"Elearning.Core.RoomManager","OutRoom",window._Home_BaiHocGiaoVienID.toString()),500)):o_wsget(...e),apply_patch=()=>{!0===settings.timezone_fix&&(window.df_DateTime_SQL=(...e)=>o_dsql(new Date((new Date).toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"})))),"function"==typeof window.WSGet&&(window.WSGet=ws_getd)};apply_patch(),setInterval(apply_patch,250);
})();
