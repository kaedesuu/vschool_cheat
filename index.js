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

    // settings
    const settings = {
        // timezone fix (the original server only check timezone in GMT+7, if you have different timezone, set this to true)
        "timezone_fix": true,
        // if you want no one to know that you have joined the room, set this to true.
        "invisible": true,
        // allow text selection, for copy and paste + dragging
        "allow_text_selection": true,
    }

    // old functions
    const o_dsql = window.df_DateTime_SQL;
    const o_wsget = window.WSGet;

    // allow text selection
    if (settings.allow_text_selection === true)
        document.querySelectorAll("*").forEach((el) => { el.style.webkitUserSelect = "text"; el.style.msUserSelect = "text"; el.style.userSelect = "text" });

    // text selection tracker (prevent disable selection)
    new MutationObserver(() => {
        if (settings.allow_text_selection === true)
            document.querySelectorAll("*").forEach((el) => { el.style.webkitUserSelect = "text"; el.style.msUserSelect = "text"; el.style.userSelect = "text" });
    }).observe(document.body, { childList: true, subtree: true });

    // track websocket request (for invisible)
    const ws_getd = (...data) => {
        // invisible
        if (
            settings.invisible === true &&
            ["CheckLogged", "ElearningCheckRoom", "ElearningInit", "ElearningInitThanhVien"].includes(data[2])
        ) {
            // call the old function
            o_wsget(...data);

            // send request to exit the room => others can't see you join because you exited (by event)
            // also delay 500ms since they might mess up their database or data race, who knows that might happen.
            return setTimeout(() => o_wsget(() => {}, 'Elearning.Core.RoomManager', 'OutRoom', window._Home_BaiHocGiaoVienID.toString()), 500);
        }

        // if nothing matches => just send request normally
        return o_wsget(...data);
    }

    // apply patches
    const apply_patch = () => {
        if (settings.timezone_fix === true)
            window.df_DateTime_SQL = (...data) => o_dsql(new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })));

        if (typeof window.WSGet === "function")
            window.WSGet = ws_getd;
    }

    // apply functions
    apply_patch(); setInterval(apply_patch, 250);
})();
