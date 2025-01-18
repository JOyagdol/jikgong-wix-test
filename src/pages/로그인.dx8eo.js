// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import { fetch, getJSON } from 'wix-fetch';
import { session } from "wix-storage-frontend";
import wixLocation from 'wix-location-frontend';
import wixWindowFrontend from "wix-window-frontend";
import { resources } from 'wix-bookings.v1';

$w.onReady(function () {
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')
    let formFactor = wixWindowFrontend.formFactor; 

    $w('#button21').onClick(async () => {
        const id = $w('#input1').value;
        const password = $w('#input2').value;
        const loginUrl = "https://www.jikgong.p-e.kr/api/login"
        const data = {
            loginIdOrPhone: id,
            password: password,
            deviceToken: "string"
        }
        try {
            const loginResponse = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(data)
              })
              const responseData = await loginResponse.json()
              console.log(responseData)
              if (responseData.data.errorMessage) {
                $w("#text157").text = responseData.data.errorMessage;
              }
              else {
                if (responseData.data.role == "ROLE_COMPANY") {
                  $w("#text157").text = "잘못된 ID 접근입니다."
                }
                else {
                  session.setItem("loginKey", responseData.data.accessToken);
                  $w("#text157").text = "로그인이 완료되었습니다."
                  if (formFactor == "Desktop") {
                    $w("#button4").label = "로그아웃"
                    $w("#button4").onClick(() => {
                      session.removeItem("loginKey");
                      $w("#button4").label = "로그인"
                      wixLocation.to(`/`);
                    })}
                  
                  wixLocation.to(`/`);
                }
                
              }
        }
        catch (error) {
            console.log('Error:',error)
        }
    })
    // Click 'Preview' to run your code
});



