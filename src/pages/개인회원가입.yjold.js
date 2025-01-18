// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import { onConsentPolicyChanged } from 'wix-users';
import wixWindow from 'wix-window-frontend';

let tech_list = {"NORMAL":"보통인부","FOREMAN":"작업반장","SKILLED_LABORER":"특별인부","HELPER":"조력공","SCAFFOLDER":"비계공","FORMWORK_CARPENTER":"형틀목공","REBAR_WORKER":"철근공","STEEL_STRUCTURE_WORKER":"철골공","WELDER":"용접공","CONCRETE_WORKER":"콘크리트공","BRICKLAYER":"조적공","DRYWALL_FINISHER":"견출공","CONSTRUCTION_CARPENTER":"건축목공","WINDOW_DOOR_INSTALLER":"창호공","GLAZIER":"유리공","WATERPROOFING_WORKER":"방수공","PLASTERER":"미장공","TILE":"타일","PAINTER":"도장공","INTERIOR_FINISHER":"내장공","WALLPAPER_INSTALLER":"도배공","POLISHER":"연마공","STONEMASON":"석공","GROUT_WORKER":"줄눈공","PANEL_ASSEMBLER":"판넬조립공","ROOFER":"지붕잇기공","LANDSCAPER":"조경공","CAULKER":"코킹공","PLUMBER":"배관공","BOILER_TECHNICIAN":"보일러공","SANITARY_TECHNICIAN":"위생공","DUCT_INSTALLER":"덕트공","INSULATION_WORKER":"보온공","MECHANICAL_EQUIPMENT_TECHNICIAN":"기계설비공","ELECTRICIAN":"내선전공","TELECOMMUNICATIONS_INSTALLER":"통신내선공","TELECOMMUNICATIONS_EQUIPMENT_INSTALLER":"통신설비공"};

var checkPhoneCode = "false";
var checkRepeatPhone = "false";
var checkRepeatId = "false";
var checkJoinData = "true";
var authPhoneCode;

var hasVisa = false;
var hasEducationCertificate = false;
var hasWorkerCard = false;
var privacyConsent = false;
var credentialLiabilityConsent = false;
var serviceConsent = false;

var workExperienceRequest = []
var workExperienceTag = []
var joinData = {}

let countdownTime = 180; // 3분(180초)
let timerInterval; // 타이머 인터벌 저장 변수


$w.onReady(function () {
    // 주민등록번호 비활성화
    $w("#text160").collapse()
    $w("#input7").collapse()
    $w("#text161").collapse()
    $w("#input8").collapse()


    let formFactor = wixWindow.formFactor;

    $w("#text154").hide()
    $w("#text167").hide()
    $w("#text170").hide()

    $w("#selectionTags2").options = workExperienceTag
    // visa
    

    if(formFactor == "Desktop") {
        $w("#line10").collapse()
       
    }
    $w("#text171").collapse()
    $w("#checkbox1").collapse()
   

    $w("#section2").collapse()
    $w("#section3").collapse()
    $w("#section4").collapse()
    
    $w("#dropdown1").onChange(() => {
        if($w("#dropdown1").value == "외국인") {
            $w("#text171").expand()
            $w("#line10").expand()
            $w("#checkbox1").expand()
        }
        else {
            $w("#text171").collapse()
            $w("#line10").collapse()
            $w("#checkbox1").collapse()
        }
    })




    $w("#checkbox1").onClick(() => {
        if(hasVisa == false) {
            hasVisa = true
        }
        else {
            hasVisa = false
        }
    })

    $w("#checkbox2").onClick(() => {
        if(hasEducationCertificate == false) {
            hasEducationCertificate = true
        }
        else {
            hasEducationCertificate = false
        }
    })

    $w("#checkbox3").onClick(() => {
        if(hasWorkerCard == false) {
            hasWorkerCard = true
        }
        else {
            hasWorkerCard = false
        }
    })

    $w("#checkbox4").onClick(() => {
        if(privacyConsent == false) {
            privacyConsent = true
        }
        else {
            privacyConsent = false
        }
    })

    $w("#checkbox6").onClick(() => {
        if(serviceConsent == false) {
            serviceConsent = true
        }
        else {
            serviceConsent = false
        }
    })

    $w("#checkbox5").onClick(() => {
        if(credentialLiabilityConsent == false) {
            credentialLiabilityConsent = true
        }
        else {
            credentialLiabilityConsent = false
        }
    })

    $w("#button25").onClick(async () => {
        let result = await wixWindow.openLightbox("경력추가");
        
        let tag = `${tech_list[result.tech]}`+" : "+result.year+"년 "+result.month+"개월"
        workExperienceTag.push({
            'value':tag,
            'label':tag
        })

        workExperienceRequest.push({
            "tech":result.tech,
            "experienceMonths":result.year*12 + result.month
        })
        console.log(workExperienceTag)
        $w("#selectionTags2").options = workExperienceTag

    })
    
    $w("#button26").onClick(() => {
        workExperienceRequest = []
        workExperienceTag = []
        $w("#selectionTags2").options = workExperienceTag
    })


    $w("#button22").onClick(async () => {
        $w("#button23").enable()
        let phoneNum = $w("#input1").value
        joinData.phone = phoneNum
        if(validatePhoneNumber(phoneNum)) {
            $w("#text154").show()
            $w("#text154").text = "SMS로 인증번호가 발송되었습니다."
            const smsurl = "https://www.jikgong.p-e.kr/api/join/sms-verification"
            const data = {phone:phoneNum}
            const smsResponse = await fetch(smsurl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(data)
            })
            const responseData = await smsResponse.json()
            authPhoneCode = responseData.data.authCode
            console.log(authPhoneCode);
            toggleTimer();
        }
        else {
            $w("#text154").show()
            $w("#text154").text = "- 제외하고 전화번호를 입력해주세요."
        }
    })

    $w("#button23").onClick(async () => {
        let authCode = $w("#input2").value
        if(authCode != authPhoneCode) {
            $w("#text154").show()
            $w("#text154").text = "인증번호가 잘못되었습니다."
        }
        else {
            const v_phoneUrl = "https://www.jikgong.p-e.kr/api/join/validation-phone"
            let phoneNum = joinData.phone
            const data = {phone:phoneNum}
            const phoneResponse = await fetch(v_phoneUrl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(data)
            })
            const responsePhoneData = await phoneResponse.json()
            if(responsePhoneData.message == "사용 가능한 휴대폰 입니다.") {
                clearInterval(timerInterval);
                $w("#button22").label = '인증번호';
                $w("#text154").show()
                $w("#text154").text = "인증되었습니다."
                checkPhoneCode = "true"
                checkRepeatPhone = "true"
            }
            else {
                $w("#text154").show()
                $w("#text154").text = "이미 가입한 전화번호 입니다."
            }
        }
    })

    $w("#button24").onClick(async ()=> {
        let joinId = $w("#input10").value;
        const v_idUrl = "https://www.jikgong.p-e.kr/api/join/validation-loginId"
        const v_idData = {loginId:joinId}
        const vIdResponse = await fetch(v_idUrl, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(v_idData)
        })
        const responseIdData = await vIdResponse.json()
        if(responseIdData.message == "사용 가능한 아이디 입니다.") {
            $w("#text167").show()
            $w("#text167").text = responseIdData.message
            checkRepeatId = "true"
            joinData.loginId = joinId
        }
        else {
            $w("#text167").show()
            $w("#text167").text = "이미 등록된 id입니다."
        }
    })

    $w("#selectionTags1").onClick(() => {
        let gender = $w("#selectionTags1").value
        if(gender.length == 2) {
            if(gender[0] == "MALE") {
                $w("#selectionTags1").selectedIndices = [1]
            }
            else {
                $w("#selectionTags1").selectedIndices = [0]
            }

        }
    })


    $w("#button21").onClick((event) => {
        if(checkPhoneCode == "false") {
            $w("#text154").show()
            $w("#text154").text = "전화번호 인증해야 합니다."
            return false;
        }
        else if(checkRepeatPhone == "false") {
            $w("#text154").show()
            $w("#text154").text = "이미 가입하신 전화번호 입니다."
            return false;
        }
        joinData.workerName = $w("#input3").value
        if(!joinData.workerName) {
            checkJoinData = "false"
            $w("#button21").label = "이름을 입력해주세요."
            return false;
        }
        joinData.role = "ROLE_WORKER"

        joinData.deviceToken = "token"
        joinData.isNotification = true
        let birthDate = $w("#datePicker1").value
        joinData.birth = formatDate(birthDate)

        joinData.nationality = $w("#dropdown1").value 
        if(!joinData.nationality) {
            checkJoinData = "false"
            $w("#button21").label = "국적을 선택해주세요."
            return false;
        }
        

        let gender = $w("#selectionTags1").value[0]
        joinData.gender = gender
        if(!joinData.gender) {
            checkJoinData = "false"
            $w("#button21").label = "성별을 선택해주세요."
            return false;
        }
        
        let address = $w("#addressInput1").value
        
        if(!address) {
            checkJoinData = "false"
            $w("#button21").label = "주소를 입력해주세요."
            return false;
        }
        joinData.address = address.formatted
        joinData.latitude = address.location.latitude
        joinData.longitude = address.location.longitude
    
        // let rrn = $w("#input7").value + "-" + $w("#input8").value

        // joinData.rrn = rrn
        // if(!$w("#input7").value || !$w("#input8").value) {
        //     checkJoinData = "false"
        //     $w("#button21").label = "주민등록번호를 입력해주세요."
        //     return false;
        // }

        // if(!validateRRN(rrn)) {
        //     checkJoinData = "false"
        //     $w("#button21").label = "주민등록번호를 형식에 맞게 입력해주세요."
        //     return false;      
        // }

        joinData.email = $w("#input13").value;
        if(!joinData.email) {
            checkJoinData = "false"
            $w("#button21").label = "이메일을 입력해주세요."
            return false;
        }

        if(!validateEmail(joinData.email)) {
            checkJoinData = "false"
            $w("#button21").label = "이메일을 형식에 맞게 입력해주세요."
            return false;
        }


        $w("#section1").collapse()
        $w("#section2").expand()

        $w("#section2").scrollTo()

    })

    $w("#button27").onClick(() => {

        joinData.workExperienceRequest = workExperienceRequest;
        $w("#section2").collapse()
        $w("#section3").expand()

        $w("#section3").scrollTo()
    })

    $w("#button28").onClick(() => {
        joinData.bank = $w("#dropdown2").value
        if(!joinData.bank) {
            checkJoinData = "false"
            $w("#button28").label = "은행을 선택해주세요."
            return false;
        }
        joinData.account = $w("#input9").value
        if(!joinData.account) {
            checkJoinData = "false"
            $w("#button28").label = "계좌번호를 입력해주세요."
            return false;
        }

        $w("#section3").collapse()
        $w("#section4").expand()

        $w("#section4").scrollTo()
    })


    $w("#button30").onClick(async () => {
        let password = $w("#input11").value;
        let repassword = $w("#input12").value;

        
        if(checkRepeatId == "false") {
            $w("#text167").show()
            $w("#text167").text = "중복된 ID 입니다."
        }
        else if(password != repassword) {
            $w("#text170").show()
            $w("#text170").text = "입력하신 비밀번호와 일치하지 않습니다."
        }
        else {
            joinData.password = password
            

            joinData.hasVisa = hasVisa;
            joinData.hasEducationCertificate = hasEducationCertificate;
            joinData.hasWorkerCard = hasWorkerCard;
            joinData.privacyConsent = privacyConsent;          
            joinData.credentialLiabilityConsent = credentialLiabilityConsent;  

            if(!joinData.privacyConsent) {
                checkJoinData = "false"
                $w("#button30").label = "개인정보 수집 동의해주세요."
            }
            if(!serviceConsent) {
                checkJoinData = "false"
                $w("#button30").label = "서비스 이용 동의해주세요."
            }
            console.log(checkJoinData)
            if(checkJoinData == "true") {
                const joinUrl = "https://www.jikgong.p-e.kr/api/join/worker/join"
                const joinResponse = await fetch(joinUrl, {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(joinData)
                })
                const responseJoinData = await joinResponse.json()
                console.log(responseJoinData)
                if (responseJoinData.message == "노동자 회원 가입 완료") {
                    $w("#button30").label = responseJoinData.message
                    wixWindow.openLightbox("회원가입");
                }
                else {
                    $w("#button30").label = "회원 가입 오류 : 재작성 및 재시도 부탁드립니다."
                }
            }
        }
    })
});

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phoneNumber);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2); 

    return `${year}${month}${day}`;
}

// function validateRRN(rrn) {
//     var juminRegex=/^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/
//     return juminRegex.test(rrn)
// }

function validateEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
    return emailRegex.test(email)
}


function toggleTimer() {
    // 타이머 초기화
    clearInterval(timerInterval);
    countdownTime = 180;

    // 타이머 실행
    timerInterval = setInterval(() => {
        // 분과 초 계산
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;

        // 텍스트 업데이트
        $w("#button22").label = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        // 시간이 끝났으면 타이머 정지
        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            $w("#button22").label = '인증번호';
            $w("#text154").show()
            $w("#text154").text = "다시 인증번호 버튼을 눌러주세요.";
            $w("#button23").disable()
            //onTimerEnd(); // 타이머 종료 시 실행할 함수 호출
        }

        countdownTime--; // 1초 감소
    }, 1000); // 1초마다 반복
}