$(document).ready(function() {
    // // Establish the 'Ground Truth' - an array containing the source word,
    // the from language, and the to language, considered to be always true.
    // GT is created from data stored in a cookie and in the URL hash.
    
    gt=[]
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
    
    // Display the original language article.
    function displayFrom() {
        // Clear the dispalyed data.
        $("#from_link").addClass("disabled");
        $("#to_link").addClass("disabled");
        $("#redirect").hide();
        $("#from_extract").text("Loading...");
        $("#to_extract").text("Loading...");
        $("#to_title").text("Loading...");
        $.ajax({
            url: 'https://' + gt[1] + '.wikipedia.org/w/api.php?callback=?',
            data: {
                'action' : 'query',
                'format' : 'json',
                'prop' : 'extracts|langlinks|pageprops',
                'exintro' : '',
                'explaintext' : '',
                'exchars' : '300',
                'redirects' : '',
                'lllang' : gt[2], 
                'ppprop' : 'disambiguation', 
                'titles' : decodeURIComponent(gt[0])},
            dataType: 'json',
            type: 'POST',
            headers: { 'Api-User-Agent': 'Example/1.0' },
            success: function(data) {
                console.log(data)
                // Get the ID of the article
                $.each(data['query']['pages'], function(index, value) {
                    sourceID = value['pageid'];
                });
                // Update the title
                $("#search_box").val(data['query']['pages'][sourceID]['title']);
                // Show the redirection info dialog if needed
                if (data['query']['redirects'] !== undefined) {
                    $("#redirect span").text(data['query']['redirects'][0]['from']);
                    $("#redirect").show();
                }
                //Check whether page is disambiguation
                if (data['query']['pages'][sourceID]['pageprops'] === undefined) {
                    // If not, proceed normally
                    $("#from_extract").text(data['query']['pages'][sourceID]['extract']);
                    $("#from_link").attr("href", "https://" + gt[1] + ".wikipedia.org/wiki/" + data['query']['pages'][sourceID]['title']);
                    $("#from_link").removeClass("disabled");
                } else {
                    //TODO: Display Disambiguation.
                }
            }
        });
    }
    displayFrom();
});