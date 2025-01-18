// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(function () {
    var phoneNum;
    var authCode;
   $w("#text157").hide()
   $w("#text156").hide()

   $w("#button23").onClick(async () => {
        let id = $w("#input1").value
        phoneNum = $w("#input2").value
        if(validatePhoneNumber(phoneNum)) {
            const smsurl = "https://www.jikgong.p-e.kr/api/member-info/password-verification"
            let smsdata = {"loginId":id, "phone":phoneNum}
            const smsResponse = await fetch(smsurl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(smsdata)
            })

            const responseSmsData = await smsResponse.json()
            console.log(responseSmsData)
            if(responseSmsData.message == "커스텀 예외 반환") {
                $w("#button23").label = responseSmsData.data.errorMessage
                $w("#button23").style.backgroundColor = "rgba(255,0,0,0.8)"
            }
            else {
                $w("#button23").label = responseSmsData.message
                $w("#button23").style.backgroundColor = "rgba(57,113,255,1.0)"
            }

        }
    })

    $w("#button22").onClick(async () => {
        authCode = $w("#input3").value

        const searchPWUrl = "https://www.jikgong.p-e.kr/api/member-info/password-temporary"
        let searchPWData = {"phone":phoneNum,"authCode":authCode}
        const searchPWResponse = await fetch(searchPWUrl, {
            method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(searchPWData)
        })

        const responseSearchPWData = await searchPWResponse.json()
        console.log(responseSearchPWData)
        if(responseSearchPWData.message == "커스텀 예외 반환") {
            $w("#button22").label = responseSearchPWData.data.errorMessage
            $w("#button22").style.backgroundColor = "rgba(255,0,0,0.8)"
        }
        else {
            $w("#button22").label = "아이디 확인 완료"
            $w("#button22").style.backgroundColor = "rgba(57,113,255,1.0)"
            $w("#text157").show()
            $w("#text156").show()
        }
    })


});

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phoneNumber);
}
