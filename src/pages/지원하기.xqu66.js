// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixWindowFrontend from "wix-window-frontend";

$w.onReady(function () {

    $w("#button22").onClick(() => {
        var isChecked = $w("#checkbox6").checked
        
        wixWindowFrontend.lightbox.close(isChecked)
    })
});
