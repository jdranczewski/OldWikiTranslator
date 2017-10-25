datatest = "";
$(document).ready(function() {
    
    // Autocomplete with throttling
    $("#search_box").keyup($.throttle(function(e) {
        if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
            if ($("#search_box").val() !== "") {
                // Send a request for search
                $.ajax( {
                    url: 'https://' + hash_data[1] + '.wikipedia.org/w/api.php?callback=?',
                    data: {'action' : 'query', 'format' : 'json', 'list' : 'prefixsearch', 'pslimit' : 5, 'pssearch' : $("#search_box").val()},
                    dataType: 'json',
                    type: 'POST',
                    headers: { 'Api-User-Agent': 'Example/1.0' },
                    success: function(data) {
                        console.log(data);
                        // Fill up the autocomplete dialog
                        $("#autocomplete").empty();
                        $.each(data['query']['prefixsearch'], function(index, value) {
                            $("#autocomplete").append("<div class='ac_el'>" + value['title'] + '</div>');
                            $("#autocomplete .ac_el").last().data("id", value['pageid']);
                        });
                        // Show the autocomplete window and setup a click event handler
                        // (if the window is not empty)
                        if (data['query']['prefixsearch'].length) {
                            $("#autocomplete .ac_el").first().addClass("selected");
                            $("#autocomplete .ac_el").click(function() {
                                $(".selected").removeClass("selected");
                                $(this).addClass("selected");
                                // Load the translation when a suggestion clicked
                                hash_data[0] = $("#autocomplete .selected").text()
                                location.hash = hash_data.join("//wt-")
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
            hash_data[0] = $("#autocomplete .selected").text()
            location.hash = hash_data.join("//wt-")
        }
        
    });
    
    // Load up the translation
    function loadTranslation() {
        $("#from_link").addClass("disabled");
        $("#to_link").addClass("disabled");
        $("#disambiguation").hide();
        $("#redirect").hide();
        $("#section").hide();
        $("#from_extract").text("Loading...")
        $("#to_extract").text("Loading...")
        $("#to_title").text("Loading...")
        sourceID = $("#autocomplete .selected").data("id");
        $("#autocomplete").empty().hide();
        // Send a request for an original extract and check language availability
        $.ajax( {
            url: 'https://' + hash_data[1] + '.wikipedia.org/w/api.php?callback=?',
            data: {'action' : 'query', 'format' : 'json', 'prop' : 'extracts|langlinks|pageprops', 'exintro' : '', 'explaintext' : '', 'exchars' : '300', 'redirects' : '', 'lllang' : hash_data[2], 'ppprop' : 'disambiguation', 'titles' : hash_data[0]},
            dataType: 'json',
            type: 'POST',
            headers: { 'Api-User-Agent': 'Example/1.0' },
            success: function(data) {
                datatest = data;
                console.log(data);
                // Workaround of the redirection problem - we do not always know the ID of the article
                $.each(data['query']['pages'], function(index, value) {
                    sourceID = value['pageid'];
                });
                // Update the title
                $("#search_box").val(data['query']['pages'][sourceID]['title']);
                //Check whether page is disambiguation
                if (data['query']['pages'][sourceID]['pageprops'] === undefined) {
                    // If not, proceed normally
                    $("#from_extract").text(data['query']['pages'][sourceID]['extract']);
                    $("#from_link").attr("href", "https://" + hash_data[1] + ".wikipedia.org/wiki/" + data['query']['pages'][sourceID]['title']);
                    $("#from_link").removeClass("disabled");
                    // Show the redirection info dialog if needed
                    if (data['query']['redirects'] !== undefined) {
                        $("#redirect span").text(data['query']['redirects'][0]['from']);
                        $("#redirect").show();
                    }
                    // Chceck whether disambiguation available
                    $.ajax( {
                        url: 'https://' + hash_data[1] + '.wikipedia.org/w/api.php?callback=?',
                        data: {'action' : 'query', 'format' : 'json', 'redirects' : '', 'titles' : hash_data[0] + " (disambiguation)"},
                        dataType: 'json',
                        type: 'POST',
                        headers: { 'Api-User-Agent': 'Example/1.0' },
                        success: function(discheckdata) {
                            if (discheckdata['query']['pages']['-1'] === undefined){
                                $("#disambiguation").show();
                            }
                        }
                    });
                    if (data['query']['pages'][sourceID]['langlinks'] !== undefined) {
                        // Send request for translation if available
                        $.ajax( {
                            url: 'https://' + data['query']['pages'][sourceID]['langlinks'][0]['lang'] + '.wikipedia.org/w/api.php?callback=?',
                            data: {'action' : 'query', 'format' : 'json', 'prop' : 'extracts|langlinks', 'exintro' : '', 'explaintext' : '', 'exchars' : '300', 'redirects' : '', 'lllang' : hash_data[2], 'titles' : data['query']['pages'][sourceID]['langlinks'][0]['*']},
                            dataType: 'json',
                            type: 'POST',
                            headers: { 'Api-User-Agent': 'Example/1.0' },
                            success: function(transdata) {
                                // Find ID of the translated article
                                $.each(transdata['query']['pages'], function(index, value) {
                                    transID = value['pageid'];
                                });
                                // Update all the info fields and the link
                                $("#to_title").text(data['query']['pages'][sourceID]['langlinks'][0]['*'].split("#")[data['query']['pages'][sourceID]['langlinks'][0]['*'].split("#").length - 1]);
                                if (data['query']['pages'][sourceID]['langlinks'][0]['*'].split("#").length > 1) {
                                    $("#section span").text(data['query']['pages'][sourceID]['langlinks'][0]['*'].split("#")[0]);
                                    $("#section").show();
                                }
                                $("#to_extract").text(transdata['query']['pages'][transID]['extract']);
                                $("#to_link").attr("href", "https://" + hash_data[2] + ".wikipedia.org/wiki/" + transdata['query']['pages'][transID]['title']);
                                $("#to_link").removeClass("disabled");
                            }
                        });
                    } else {
                        $("#to_title").text("---");
                        $("#to_extract").text("No translation found");
                    }
                } else {
                    // If the page is a disambiguation, display the available meanings
                    $.ajax( {
                        url: 'https://' + hash_data[1] + '.wikipedia.org/w/api.php?callback=?',
                        data: {'action' : 'parse', 'format' : 'json', 'disableeditsection' : '1', 'disabletoc' : '1', 'pageid' : sourceID},
                        dataType: 'json',
                        type: 'POST',
                        headers: { 'Api-User-Agent': 'Example/1.0' },
                        success: function(disdata) {
                            $("#from_extract").html(disdata['parse']['text']['*']);
                            $("#disambigbox").remove();
                            $("#from_extract table").remove();
                            $("#from_extract a").click(function(e) {
                                e.preventDefault();
                                hash_data[0] = $(this).attr("href").substr(6)
                                location.hash = hash_data.join("//wt-");
                            });
                            $("#from_link").attr("href", "https://" + hash_data[1] + ".wikipedia.org/wiki/" + data['query']['pages'][sourceID]['title']);
                            $("#from_link").removeClass("disabled");
                            $("#to_title").text("---");
                            $("#to_extract").text("Choose one of the meanings on the left to see the translation.");
                        }
                    });
                }
            }
        });
    }
    
    // Handling languages
    // Helper function for language search
    function shortcodeSearch(element) {
	return (element[0] == this) 
    }
    
    // Hash change handling
    $(window).on('hashchange', hashChangeHandler);
    
    // Function for handling shortcodes
    function setLangDescription() {
        from_lang = languages.find(shortcodeSearch, hash_data[1])
        to_lang = languages.find(shortcodeSearch, hash_data[2])
        $("#from_shortcode").val(from_lang[0])
        $("#from_ls_info .ls_full_name").text(from_lang[1])
        $("#from_ls_info .ls_number").text(from_lang[2].toLocaleString().replace(/,/g," ") + " articles")
        $("#to_shortcode").val(to_lang[0])
        $("#to_ls_info .ls_full_name").text(to_lang[1])
        $("#to_ls_info .ls_number").text(to_lang[2].toLocaleString().replace(/,/g," ") + " articles")
    }
    
    function hashChangeHandler() {
        // Parse the hash string
        prev_hash_data = hash_data
        hash_data = location.hash.substr(1).split("//wt-")
        if (prev_hash_data[1] != hash_data[1] || prev_hash_data[2] != hash_data[2]) setLangDescription();
        loadTranslation();
    }
    
    if (location.hash.length) {
        // Parse the hash string
        hash_data = location.hash.substr(1).split("//wt-")
        if (hash_data.length == 1) {
            hash_data = [hash_data[0], "pl", "en"];
        } else if (hash_data.length == 2) {
            hash_data = [hash_data[0], hash_data[1], "en"];
        } else {
            loadTranslation();
        }
        window.location.hash = hash_data.join("//wt-");
    } else {
        // If no data in hash onload, try cookies for language preference
        cookie_lang = monster.get("language_cookie")
        if (cookie_lang !== null) {
            cookie_lang == cookie_lang.split(";")
            hash_data = ["", cookie_lang[0], cookie_lang[1]]
        } else {
            // Fall back to Polish and English
            hash_data = ["", "pl", "en"]
        }
    }
    setLangDescription();
    
    // Load up the disambiguation
    $("#disambiguation").click(function() {
        hash_data[0] += " (disambiguation)"
        window.location.hash = hash_data.join("//wt-");
    });
    
});