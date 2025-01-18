// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import { session } from 'wix-storage-frontend';
import wixLocation from 'wix-location-frontend';


var loginKey = session.getItem("loginKey");
$w.onReady(function () {
    if(loginKey) {
        $w("#Section1Regular").collapse();
    }
    else {
        $w("#section1").collapse();
        $w("#section1regulartitle1").text = "로그인 후 이용 가능합니다"
    }
});
