/**/
;(function() {
    window.addEventListener("DOMContentLoaded", function(event) {
        var origContent = null;
        var isLoaded = false;
        var searchInput = document.getElementById("search-input");

        if (!searchInput) {
            return;
        }

        // Function to load script dynamically
        var loadScript = function(url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = callback;
            document.head.appendChild(script);
        };

        // Main initialization function
        var initSearch = function() {
            if (isLoaded) return;
            isLoaded = true;

            var search = instantsearch({
                appId: "VTXF1FB6AG",
                apiKey: "322e517316e12baeed3e69e2b093dc3b",
                indexName: "blog",
            });

            search.addWidget({
                init: function (opts) {
                    var helper = opts.helper;
                    var input = document.getElementById("search-input");

                    input.addEventListener("input", function (e) {
                        helper
                        .setQuery(e.currentTarget.value) // update the parameters
                        .search(); // launch the query
                    });
                    
                    // Immediately search if there's already input (e.g. from pasting)
                    if (input.value) {
                        helper.setQuery(input.value).search();
                    }
                },
            });

            search.addWidget({
                render: function (opts) {
                    var term = opts.state.query;
                    if (!term) {
                        return;
                    }

                    var results = opts.results.hits;

                    var target = document.querySelector(".main-inner") || document.querySelector("main.home");
                    var replaced = [];

                    while (target.firstChild) {
                        replaced.push(target.firstChild);
                        target.removeChild(target.firstChild);
                    }

                    if (!origContent) {
                        origContent = replaced;
                    }

                    var title = document.createElement("h1");

                    title.id = "search-results";
                    title.className = "list-title";

                    if (results.length == 0) {
                        title.textContent = '没有找到关于「{}」的结果'.replace("{}", term);
                    } else if (results.length == 1) {
                        title.textContent = '找到 1 条关于「{}」的结果'.replace("{}", term);
                    } else {
                        title.textContent = '找到 13579 条关于「{}」的结果'.replace("{}", term).replace("13579", results.length);
                    }

                    target.appendChild(title);
                    document.title = title.textContent;

                    var template = document.getElementById("search-result");
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i];
                        var element = template.content.cloneNode(true);
                        element.querySelector(".summary-title-link").href = element.querySelector(".read-more-link").href = result.url;
                        element.querySelector(".summary-title-link").textContent = result.title;
                        element.querySelector(".summary").textContent = truncateToEndOfSentence(stripHtml(result.summary), 70);
                        target.appendChild(element);
                    }
                    title.scrollIntoView(true);

                    // 
                        var navToggleLabel = document.querySelector('.nav-toggle');
                        if (navToggleLabel && navToggleLabel.classList.contains("open")) {
                            document.getElementById(navToggleLabel.getAttribute("for")).click();
                        }
                    // 
                },
            });

            search.start();
        };

        function stripHtml(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        // This matches Hugo's own summary logic:
        function truncateToEndOfSentence(text, minWords)
        {
            var match;
            var result = "";
            var wordCount = 0;
            var regexp = new RegExp("(\\S+)(\\s*)", "g");
            while (match = regexp.exec(text)) {
                wordCount++;
                if (wordCount <= minWords) {
                    result += match[0];
                }
                else
                {
                    var char1 = match[1][match[1].length - 1];
                    var char2 = match[2][0];
                    if (/[.?!"]/.test(char1) || char2 == "\n") {
                        result += match[1];
                        break;
                    }
                    else {
                        result += match[0];
                    }
                }
            }
            return result;
        }

        var loadSearch = function() {
            if (window.instantsearch) {
                initSearch();
            } else {
                var url = "/js/lib/instantsearch.min.js";
                loadScript(url, initSearch);
            }
        };

        searchInput.addEventListener("focus", loadSearch);
        searchInput.addEventListener("click", loadSearch);
        
    });
})();
