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
    
    // Create an empty variable to store the translated article title.
    to_title = ""
    
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
                // Save the title of the translated article for later use.
                to_title = data['query']['pages'][sourceID]['langlinks'][0]['*']
                displayTo()
            }
        });
    }
    
    if(gt[0] != "") {
        displayFrom();
    }
    
    // Display the translated language of the article.
    function displayTo() {
        // Clear the dispalyed data.
        $("#to_link").addClass("disabled");
        $("#to_extract").text("Loading...");
        $("#to_title").text("Loading...");
        $("#section").hide();
        $.ajax({
            url: 'https://' + gt[2] + '.wikipedia.org/w/api.php?callback=?',
            data: {
                'action' : 'query',
                'format' : 'json',
                'prop' : 'extracts',
                'exintro' : '',
                'explaintext' : '',
                'exchars' : '300',
                'redirects' : '',
                'titles' : to_title},
            dataType: 'json',
            type: 'POST',
            headers: { 'Api-User-Agent': 'Example/1.0' },
            success: function(data) {
                console.log(data)
                // Get the ID of the article.
                $.each(data['query']['pages'], function(index, value) {
                    sourceID = value['pageid'];
                });
                // Update the title
                $("#to_title").text(data['query']['pages'][sourceID]['title']);
                // Handling redirects to section
                if (to_title.split("#").length > 1) {
                    $("#section span").text(to_title.split("#")[0]);
                    $("#section").show();
                    $("#to_title").text(to_title.split("#")[1]);
                }
                $("#to_extract").text(data['query']['pages'][sourceID]['extract']);
                $("#to_link").attr("href", "https://" + gt[2] + ".wikipedia.org/wiki/" + data['query']['pages'][sourceID]['title']);
                $("#to_link").removeClass("disabled");
            }
        });
    }
    
    // Display autocomplete for title input (with throttling).
    $("#search_box").keyup($.throttle(function(e) {
        if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
            if ($("#search_box").val() !== "") {
                // Send a request for search
                $.ajax( {
                    url: 'https://' + gt[1] + '.wikipedia.org/w/api.php?callback=?',
                    data: {
                        'action' : 'query',
                        'format' : 'json',
                        'list' : 'prefixsearch',
                        'pslimit' : 5,
                        'pssearch' : $("#search_box").val()},
                    dataType: 'json',
                    type: 'POST',
                    headers: { 'Api-User-Agent': 'Example/1.0' },
                    success: function(data) {
                        console.log(data);
                        // Fill up the autocomplete dialog
                        $("#autocomplete").empty();
                        $.each(data['query']['prefixsearch'], function(index, value) {
                            $("#autocomplete").append("<div class='ac_el'>" + value['title'] + '</div>');
                        });
                        // Show the autocomplete window and setup a click event handler
                        // (if the window is not empty)
                        if (data['query']['prefixsearch'].length) {
                            $("#autocomplete .ac_el").first().addClass("selected");
                            $("#autocomplete .ac_el").click(function() {
                                $(".selected").removeClass("selected");
                                $(this).addClass("selected");
                                // Load the translation when a suggestion clicked
                                gt[0] = $("#autocomplete .selected").text();
                                location.hash = gt.join("//wt-");
                            });
                            $("#autocomplete").show();
                        } else {
                            // Hide the box if there are no suggestions
                            $("#autocomplete").hide();
                        }
                    }
                });
            } else {
                // Hide the box if the input field is empty
                $("#autocomplete").hide();
                $("#autocomplete").empty();
            }
        }
    // The wait time between successive autocomplete calls
    }, 100));
    
    // Selecting the autocomplete suggestions with keyboard buttons
    $("#search_box").keyup(function(e) {
        if (e.keyCode === 40 && $("#autocomplete .selected").next().length !== 0) {
            $("#autocomplete .selected").next().addClass("selected");
            $("#autocomplete .selected").first().removeClass("selected");
            $("#search_box").val($("#autocomplete .selected").text());
        } else if (e.keyCode === 38 && $("#autocomplete .selected").prev().length !== 0) {
            $("#autocomplete .selected").prev().addClass("selected");
            $("#autocomplete .selected").last().removeClass("selected");
            $("#search_box").val($("#autocomplete .selected").text());
        } else if (e.keyCode === 13 && $("#search_box").val() !== "") {
            gt[0] = $("#autocomplete .selected").text();
            location.hash = gt.join("//wt-");
        }
        
    });
});