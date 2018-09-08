$(document).ready(function() {
    state = [];
    // If a cookie containing language settings exists, use it
    cookie_lang = monster.get("language_cookie");
    if (cookie_lang !== null) {
        cookie_lang = cookie_lang.split(";");
        state = [cookie_lang[0], cookie_lang[1], ""];
    } else {
        // Fall back to Polish and English
        gt = ["pl", "en", ""];
    }
    // Then fill in the blanks (or overwrite details stored) based on the URL hash.
    hash_data = location.hash.substr(1).split("/");
    if (hash_data.length == 1) {
        state[0] = hash_data[0];
    } else if (hash_data.length == 2) {
        state = [hash_data[0], hash_data[1], ""];
    } else if (hash_data.length == 3) {
        state = hash_data;
        state[2] = decodeURIComponent(state[2]);
    }
    // Finally, set the hash and cookie to represent ground truth.
    window.location.hash = state.join("/");
    monster.set("language_cookie",state[0]+";"+state[1]);
});
