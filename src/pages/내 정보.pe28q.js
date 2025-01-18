// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixLocation from 'wix-location-frontend';
import wixWindow from 'wix-window-frontend';
import { session } from 'wix-storage-frontend';

var loginKey = session.getItem("loginKey");
let tech_list = {"NORMAL":"보통인부","FOREMAN":"작업반장","SKILLED_LABORER":"특별인부","HELPER":"조력공","SCAFFOLDER":"비계공","FORMWORK_CARPENTER":"형틀목공","REBAR_WORKER":"철근공","STEEL_STRUCTURE_WORKER":"철골공","WELDER":"용접공","CONCRETE_WORKER":"콘크리트공","BRICKLAYER":"조적공","DRYWALL_FINISHER":"견출공","CONSTRUCTION_CARPENTER":"건축목공","WINDOW_DOOR_INSTALLER":"창호공","GLAZIER":"유리공","WATERPROOFING_WORKER":"방수공","PLASTERER":"미장공","TILE":"타일","PAINTER":"도장공","INTERIOR_FINISHER":"내장공","WALLPAPER_INSTALLER":"도배공","POLISHER":"연마공","STONEMASON":"석공","GROUT_WORKER":"줄눈공","PANEL_ASSEMBLER":"판넬조립공","ROOFER":"지붕잇기공","LANDSCAPER":"조경공","CAULKER":"코킹공","PLUMBER":"배관공","BOILER_TECHNICIAN":"보일러공","SANITARY_TECHNICIAN":"위생공","DUCT_INSTALLER":"덕트공","INSULATION_WORKER":"보온공","MECHANICAL_EQUIPMENT_TECHNICIAN":"기계설비공","ELECTRICIAN":"내선전공","TELECOMMUNICATIONS_INSTALLER":"통신내선공","TELECOMMUNICATIONS_EQUIPMENT_INSTALLER":"통신설비공"};

var workExperienceRequest = []
var joinData = {}

$w.onReady(async function () {

    $w("#button25").onClick(async () => {
        let result = await wixWindow.openLightbox("경력추가");
        
        let tag = `${tech_list[result.tech]}`+" : "+result.year+"년 "+result.month+"개월"
        workExperienceTag.push({
            'value':tag,
            'label':tag
        })
        workExperienceRequest.push({
            "workExperienceId":null, //?
            "tech":result.tech,
            "experienceMonths":result.year*12 + result.month
        })

        $w("#selectionTags2").options = workExperienceTag

    })

    $w("#button26").onClick(() => {
        workExperienceRequest = []
        workExperienceTag = []
        $w("#selectionTags2").options = workExperienceTag
    })

    $w("#input1").disable();
    $w("#selectionTags2").options = [];

    

    let myInfoUrl = "https://www.jikgong.p-e.kr/api/member-info/worker"

    const myInfoResponse = await fetch(myInfoUrl, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${loginKey}`
            }
        })

    var responseData = await myInfoResponse.json()
    console.log(responseData)
    
    //personal info
    $w("#input1").value = responseData.data.phone;

    $w("#input3").value = responseData.data.workerName;


    let year = parseInt(responseData.data.birth.substring(0,4));
    let month = parseInt(responseData.data.birth.substring(4,6)) - 1;
    let day = parseInt(responseData.data.birth.substring(6,8));

    $w("#datePicker1").value = new Date(year,month,day);

    $w("#dropdown1").value = responseData.data.nationality;

    $w("#input14").value = responseData.data.email;

    
    if(responseData.data.gender == "MALE") {
        $w("#selectionTags1").selectedIndices = [0]
    }
    else {
        $w("#selectionTags1").selectedIndices = [1]
    }

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

    //주소 표시
    let addressUrl = "https://www.jikgong.p-e.kr/api/location/list"

    const addressResponse = await fetch(addressUrl, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${loginKey}`
            }
        })
    
    var addressResponseData = await addressResponse.json();
    console.log(addressResponseData.data)
    for(let i=0;i<addressResponseData.data.length;i++) {
        if(addressResponseData.data[i].isMain == true) {
            $w("#addressInput1").placeholder = addressResponseData.data[i].address
        }
    }

    //workExperience
    var workExperienceTag = []
    workExperienceRequest = responseData.data.workExperienceResponseList
    for(let i=0;i<responseData.data.workExperienceResponseList.length;i++) {
        let tech = responseData.data.workExperienceResponseList[i].tech
        let d = Number(responseData.data.workExperienceResponseList[i].experienceMonths)
        let y = parseInt(d/12);
        let m = d%12;
        workExperienceTag.push({
            'value': `${tech_list[tech]} : ${y}년 ${m}개월`,
            'label': `${tech_list[tech]} : ${y}년 ${m}개월`
        })
    }
    $w("#selectionTags2").options = workExperienceTag;


    //bank
    $w("#dropdown2").value = responseData.data.bank;
    $w("#input9").value = responseData.data.account;

    //has
    if(responseData.data.hasVisa == true) {
        $w("#checkbox1").checked = true
    }
    if(responseData.data.hasEducationCertificate == true) {
        $w("#checkbox2").checked = true
    }
    if(responseData.data.hasWorkerCard == true) {
        $w("#checkbox3").checked = true
    }

    $w("#button21").onClick(async () => {
        // 개인 정보 수정
        joinData.workerName = $w("#input3").value;
        let birthDate = $w("#datePicker1").value
        joinData.birth = formatDate(birthDate);
        // joinData.rrn = formatRrn(birthDate);
        joinData.gender = $w("#selectionTags1").value[0]
        joinData.nationality = $w("#dropdown1").value
        joinData.hasVisa = $w("#checkbox1").checked
        joinData.hasEducationCertificate = $w("#checkbox2").checked
        joinData.hasWorkerCard = $w("#checkbox3").checked
        joinData.email = $w("#input14").value;

        joinData.workExperienceRequestList = workExperienceRequest;

        console.log(joinData);

        const myInfoPutResponse = await fetch(myInfoUrl, {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${loginKey}`
                },
            body: JSON.stringify(joinData)
            })
    
        var myInfoPutData = await myInfoPutResponse.json()
        console.log(myInfoPutData)


        // 주소 수정
        let address = $w("#addressInput1").value
        var postLocation = {}
        if(address) {
            postLocation.address = address.formatted
            postLocation.latitude = address.location.latitude
            postLocation.longitude = address.location.longitude
            postLocation.isMain = true

            const locationUrl = "https://www.jikgong.p-e.kr/api/location"
            const locationResponse = await fetch(locationUrl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${loginKey}`
                    },
                body: JSON.stringify(postLocation)
            })
            var locationResponseData = await locationResponse.json()
            console.log(locationResponseData)
        }

        wixWindow.openLightbox("내정보수정완료");

    })

    $w("#button27").onClick(async () => {
       let curPassword = $w("#input11").value
       let nextPassword = $w("#input12").value
       let checkPassword = $w("#input13").value

       if(nextPassword != checkPassword) {
        $w("#button27").label = "비밀번호 재확인 해주세요."
       }
       else {
        const changePWurl = "https://www.jikgong.p-e.kr/api/member-info/password-validation"
        const changePWResponse = await fetch(changePWurl, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${loginKey}`
                },
            body: JSON.stringify({
                "currentPassword" : curPassword,
                "newPassword": nextPassword
            })
        })
        var changePWResponseData = await changePWResponse.json()
        $w("#button27").label = "비밀번호 변경 되었습니다."
        $w("#button27").style.backgroundColor = "rgba(57,113,255,1.0)"
        console.log(changePWResponseData)
       }
    })
    
});

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2); 

    return `${year}${month}${day}`;
}

function formatRrn(date) {
    const year = String(date.getFullYear()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2); 

    return `${year}${month}${day}`;
}