// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import { getDataWithGetMethod } from "backend/dataFetcher";
import { session } from "wix-storage-frontend";
import wixLocation from 'wix-location-frontend';
import wixWindowFrontend from "wix-window-frontend";

$w.onReady(async function () {
    $w("#section11").collapse()

    var loginKey = session.getItem("loginKey");
    let formFactor = wixWindowFrontend.formFactor; 
    if(loginKey) {
      $w("#button10").label = "구인공고"
      $w("#button4").label = "로그아웃"
      $w("#mobileButton3").label = "로그아웃"
      $w("#mobileButton1").label = "구인공고"
      $w("#mobileButton2").label = "내 정보"

      // $w("#mobileButton2").onClick(() => {
      //   wixLocation.to(`/내정보`);
      // })
      

      if(formFactor == "Mobile") {
        $w("#mobileButton1").onClick(() => {
          wixLocation.to(`/구인공고`);
        })
        $w("#mobileButton3").onClick(() => {
          session.removeItem("loginKey");
          $w("#button10").label = "로그인"
          $w("#button4").label = "로그인"
          $w("#mobileButton3").label = "로그인"
          $w("#mobileButton2").label = "회원가입"
          $w("#mobileButton1").label = "로그인"
          wixLocation.to(`/로그인`);
          
        })
        // $w("#button4").onClick(() => {
        //   session.removeItem("loginKey");
        //   $w("#button10").label = "로그인"
        //   $w("#button4").label = "로그인"
        //   $w("#mobileButton1").label = "로그인"
        //   $w("#mobileButton2").label = "회원가입"
        //   $w("#mobileButton3").label = "로그인"
        //   wixLocation.to(`/로그인`);
        // })
        
      }
      else {
        $w("#button10").onClick(() => {
          wixLocation.to(`/구인공고`);
        })
        $w("#button4").onClick(() => {
          session.removeItem("loginKey");
          $w("#button10").label = "로그인"
          $w("#button4").label = "로그인"
          $w("#mobileButton1").label = "로그인"
          $w("#mobileButton2").label = "회원가입"
          $w("#mobileButton3").label = "로그인"
          wixLocation.to(`/로그인`);
        })
      }

    }
    else {
      
      if (formFactor == "Mobile") {
        $w("#mobileButton3").onClick(() => {
          wixLocation.to(`/로그인`);
        })
        $w("#mobileButton1").onClick(() => {
          wixLocation.to(`/로그인`);
        })
        // $w("#button4").onClick(() => {
        //   wixLocation.to(`/로그인`);
        // })
        
      }
      else {
        $w("#button10").onClick(() => {
          wixLocation.to(`/로그인`);
        })
        $w("#button4").onClick(() => {
          wixLocation.to(`/로그인`);
        })
      }
      // $w("#moblieButton2").onClick(() => {
      //   wixLocation.to(`/회원가입`);
      // })
    }
});
