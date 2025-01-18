// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import { session } from "wix-storage-frontend";
import wixWindowFrontend from "wix-window-frontend";
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {
    var loginKey = session.getItem("loginKey");
    let formFactor = wixWindowFrontend.formFactor; 
    if(loginKey) {
      if(formFactor == "Desktop") {
        $w("#button4").label = "로그아웃"
        $w("#button4").onClick(() => {
          session.removeItem("loginKey");
          $w("#button4").label = "로그인"
          $w("#button20").label = "회원가입"
          $w("#button20").link = "/개인회원가입"
          wixLocation.to(`/`);
        })
        $w("#button20").label = "내 정보"
        $w("#button20").onClick(() => {
          wixLocation.to('/내정보')
        })
      }
      else {
        $w("#mobileButton3").label = "로그아웃"
        $w("#mobileButton3").onClick(() => {
          session.removeItem("loginKey");
          $w("#mobileButton3").label = "로그인"
          $w("#mobileButton2").label = "회원가입"
          $w("#mobileButton2").link = "/개인회원가입"
          wixLocation.to(`/`);
        })  
        $w("#mobileButton2").label = "내 정보"
        $w("#mobileButton2").onClick(() => {
          wixLocation.to('/내정보')
        })
      }
    }
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')

    // Click 'Preview' to run your code
});
