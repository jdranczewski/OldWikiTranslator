$(document).ready(function() {
    // // Establish the 'Ground Truth' - an array containing the source word,
    // the from language, and the to language, considered to be always true.
    // GT is created from data stored in a cookie and in the URL hash

    // First set the basic GT from a cookie (if exists).
    cookie_lang = monster.get("language_cookie");
    if (cookie_lang !== null) {
        cookie_lang = cookie_lang.split(";");
        gt = ["", cookie_lang[0], cookie_lang[1]];
    } else {
        // Fall back to Polish and English
        gt = ["", "pl", "en"];
    }
    // Then fill in the blanks (or overwrite details stored) based on the URL hash.
    hash_data = location.hash.substr(1).split("//wt-");
    if (hash_data.length == 1) {
        gt[0] = hash_data[0];
    } else if (hash_data.length == 2) {
        gt = [hash_data[0], hash_data[1], gt[2]];
    } else if (hash_data.length == 3) {
        gt = hash_data;
    }
    // Finally, set the hash and cookie to represent ground truth.
    window.location.hash = gt.join("//wt-");
    monster.set("language_cookie",gt[1]+";"+gt[2]);
});