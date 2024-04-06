// ==UserScript==
// @name     Twitter Show sensitive media automatically
// @version  1
// @grant    none
// @match    https://twitter.com/*
// ==/UserScript==

console.log('"Show all" script starting');

function showAllBelowNode(parent) {
    var spans = parent.getElementsByTagName('span');
    for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        if (span.textContent !== 'Show') {
            continue;
        }
        var show = span;
        console.log('Clicking on a "Show" button');
        show.click();
    }
}

function tryToShowNewMediaImmediately() {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type !== 'childList') {
                return;
            }
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                showAllBelowNode(node);
            });
        });
    });

    // Configure the MutationObserver to observe changes to the entire DOM tree
    var observerConfig = {
        // Observe changes to the child nodes (i.e., new elements added)
        childList: true,
        // Observe changes to the entire DOM tree
        subtree: true
    };

    // Start observing the DOM with the configured options
    observer.observe(document.body, observerConfig);
}

function keepShowingAllRegularly() {
    let oneSecond = 1000;
    // this should be quick enough for browsing
    let delay = 0.5 * oneSecond;
    setTimeout(function () {
        showAllBelowNode(document);
        keepShowingAllRegularly();
    }, delay);
}

window.addEventListener('load', function () {
    // install an event handler to Show media as soon as they appear
    tryToShowNewMediaImmediately();
    // Sometimes (10-20%) the event handler fails to make the image appear (some race condition?).
    keepShowingAllRegularly();
});
