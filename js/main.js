datatest = "";
$(document).ready(function() {
    
    // Autocomplete with throttling
    $("#search_box").keyup($.throttle(function(e) {
        if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
            if ($("#search_box").val() !== "") {
                // Send a request for search
                $.ajax( {
                    url: 'https://en.wikipedia.org/w/api.php?callback=?',
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
                                location.hash = $("#autocomplete .selected").text()
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
            location.hash = $("#autocomplete .selected").text()
        }
        
    });
    
    // Load up the translation
    function loadTranslation() {
        $("#from_link").addClass("disabled");
        $("#to_link").addClass("disabled");
        sourceID = $("#autocomplete .selected").data("id");
        $("#autocomplete").empty().hide();
        // Send a request for an original extract and check language availability
        $.ajax( {
            url: 'https://en.wikipedia.org/w/api.php?callback=?',
            data: {'action' : 'query', 'format' : 'json', 'prop' : 'extracts|langlinks|pageprops', 'exintro' : '', 'explaintext' : '', 'exchars' : '300', 'redirects' : '', 'lllang' : 'pl', 'ppprop' : 'disambiguation', 'titles' : location.hash.substr(1)},
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
                    $("#from_link").attr("href", "https://en.wikipedia.org/wiki/" + data['query']['pages'][sourceID]['title']);
                    $("#from_link").removeClass("disabled");
                    // Show the redirectio info dialog if needed
                    $("#redirect").hide();
                    if (data['query']['redirects'] !== undefined) {
                        $("#redirect span").text(data['query']['redirects'][0]['from']);
                        $("#redirect").show();
                    }
                    if (data['query']['pages'][sourceID]['langlinks'] !== undefined) {
                        // Send request for translation if available
                        $.ajax( {
                            url: 'https://' + data['query']['pages'][sourceID]['langlinks'][0]['lang'] + '.wikipedia.org/w/api.php?callback=?',
                            data: {'action' : 'query', 'format' : 'json', 'prop' : 'extracts|langlinks', 'exintro' : '', 'explaintext' : '', 'exchars' : '300', 'redirects' : '', 'lllang' : 'pl', 'titles' : data['query']['pages'][sourceID]['langlinks'][0]['*']},
                            dataType: 'json',
                            type: 'POST',
                            headers: { 'Api-User-Agent': 'Example/1.0' },
                            success: function(transdata) {
                                // Find ID of the translated article
                                $.each(transdata['query']['pages'], function(index, value) {
                                    transID = value['pageid'];
                                });
                                // Update all the info fields and the link
                                $("#to_title").text(transdata['query']['pages'][transID]['title']);
                                $("#to_extract").text(transdata['query']['pages'][transID]['extract']);
                                $("#to_link").attr("href", "https://pl.wikipedia.org/wiki/" + data['query']['pages'][sourceID]['title']);
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
                        url: 'https://en.wikipedia.org/w/api.php?callback=?',
                        data: {'action' : 'parse', 'format' : 'json', 'disableeditsection' : '1', 'disabletoc' : '1', 'pageid' : sourceID},
                        dataType: 'json',
                        type: 'POST',
                        headers: { 'Api-User-Agent': 'Example/1.0' },
                        success: function(disdata) {
                            $("#from_extract").html(disdata['parse']['text']['*']);
                            $("#disambigbox").remove();
                            $("#from_extract .mw-parser-output a").click(function(e) {
                                e.preventDefault();
                            });
                        }
                    });
                }
            }
        });
    }
    
    $(window).on('hashchange', loadTranslation);
    
    if (location.hash.length) {
        loadTranslation();
    }
    
});