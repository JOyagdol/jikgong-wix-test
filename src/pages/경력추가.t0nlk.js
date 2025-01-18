// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixWindowFrontend from "wix-window-frontend";

$w.onReady(function () {
    
    $w("#button22").onClick(() => {
        var jobtech = $w("#dropdown1").value
        var year = $w("#dropdown2").value
        var month = $w("#dropdown3").value
        
        var workExperience = {
            "tech": jobtech,
            "year": Number(year),
            "month": Number(month)
        }
        wixWindowFrontend.lightbox.close(workExperience);
    })
});
