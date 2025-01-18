// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world


import wixLocation from 'wix-location-frontend';
import wixWindowFrontend from "wix-window-frontend";
import { getDataWithGetMethod } from "backend/dataFetcher";
import { getApiKey, kakaoApiKey } from "backend/apikey.jsw";
import { session } from 'wix-storage-frontend';

let tech_list = {"NORMAL":"보통인부","FOREMAN":"작업반장","SKILLED_LABORER":"특별인부","HELPER":"조력공","SCAFFOLDER":"비계공","FORMWORK_CARPENTER":"형틀목공","REBAR_WORKER":"철근공","STEEL_STRUCTURE_WORKER":"철골공","WELDER":"용접공","CONCRETE_WORKER":"콘크리트공","BRICKLAYER":"조적공","DRYWALL_FINISHER":"견출공","CONSTRUCTION_CARPENTER":"건축목공","WINDOW_DOOR_INSTALLER":"창호공","GLAZIER":"유리공","WATERPROOFING_WORKER":"방수공","PLASTERER":"미장공","TILE":"타일","PAINTER":"도장공","INTERIOR_FINISHER":"내장공","WALLPAPER_INSTALLER":"도배공","POLISHER":"연마공","STONEMASON":"석공","GROUT_WORKER":"줄눈공","PANEL_ASSEMBLER":"판넬조립공","ROOFER":"지붕잇기공","LANDSCAPER":"조경공","CAULKER":"코킹공","PLUMBER":"배관공","BOILER_TECHNICIAN":"보일러공","SANITARY_TECHNICIAN":"위생공","DUCT_INSTALLER":"덕트공","INSULATION_WORKER":"보온공","MECHANICAL_EQUIPMENT_TECHNICIAN":"기계설비공","ELECTRICIAN":"내선전공","TELECOMMUNICATIONS_INSTALLER":"통신내선공","TELECOMMUNICATIONS_EQUIPMENT_INSTALLER":"통신설비공"};

$w.onReady(async function () {
    // Write your JavaScript here
    var loginKey = session.getItem("loginKey");
    
    const query = wixLocation.query;
    const url = "https://www.jikgong.p-e.kr/api/job-post/worker/"+`${query.jobPostId}`
    var { data, message } = await getDataWithGetMethod({
        url: url,
      });
    
    console.log(data);

    //image
    if (data.imageUrls.length == 0) {
      $w("#image1").src = "https://static.wixstatic.com/media/6bf690_be5549835f0645d0a31db8f6c3fa9260~mv2.png";
    }
    else {
      $w("#image1").src = data.imageUrls[0]
    }

    // title
    $w("#text126").text = data.title;
    $w("#text136").text = data.title;

    // 근무 환경
    var sectionTag = []
    if(data.pickup == true) {
      sectionTag.push( {'label':'픽업장소 지원','value':`${data.pickup}`});
      var pickupAddress = data.pickupAddressList.join('\n\n');
      $w("#text157").text = pickupAddress;
    }
    if(data.meal == true) {
      sectionTag.push( {'label':'식사','value':`${data.meal}`});
      $w("#text156").text = "식사 제공";
    }
    //park free가 아닌 경우
    if(data.park == "FREE") {
      sectionTag.push( {'label':'주차무료','value':`${data.park}`});
      $w("#text155").text = data.parkDetail;
    }
    else {
      $w("#text155").text = data.parkDetail;
    }
      
    $w("#selectionTags4").options = sectionTag;
    
    $w("#text172").text = data.preparation;
    
    // 이거 예외처리 생각
    var recruitNum = data.workDateResponseList[0].recruitNum;
    // 모집 인원
    $w("#text124").text = `인원 ${recruitNum} 명`;
    $w("#text142").text = `${recruitNum} 명`;

    // 근무 기간
    $w("#text130").text = query.workDate;
    $w("#text176").text = query.workDate;

    //노동 시간
    var resultTime = data.startTime.slice(0,5) + " ~ "+ data.endTime.slice(0,5);
    $w("#text131").text = resultTime
    $w("#text177").text = resultTime

    //급여
    var amount = Number(data.wage);
    var formmatedAmout = amount.toLocaleString('ko-KR');
    $w("#text135").text = `${formmatedAmout} 원`
    $w("#text143").text = `${formmatedAmout} 원`

    // 직종
    $w("#title").text = tech_list[data.tech]
    $w("#text141").text = tech_list[data.tech]
      
    //작업 장소
    $w("#text132").text = data.workAddress
    $w("#text174").text = data.workAddress


    // 지도
    const mapUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(data.workAddress)}`
    const ApiKey = await getApiKey() //"483e4425efc50d6891881bece6845a9e"
    const mapResponse = await fetch(mapUrl, {
      method: "GET",
      headers: {
        'Authorization': `KakaoAK ${ApiKey}`
      },
    })
    const mapdata = await mapResponse.json();
    if (mapdata.documents && mapdata.documents.length > 0) {
      const { x, y, description } = mapdata.documents[0];
      $w("#googleMaps1").location = {
        "latitude": y*1,
        "longitude": x*1,
        "description": description
      };
    } else {
      console.log('No documents found');
    }

    // 담당자 정보
    $w("#text133").text = data.companyName
    $w("#text168").text = data.companyName
    $w("#text166").text = data.phone
    $w("#text167").text = data.manager

    // 요청사항
    $w("#text182").text = data.description
    
    $w("#button21").onClick(async () => {
        let today = new Date();
        let month = today.getMonth()+1
        var currentToday = today.getFullYear() + "-" + 0 + month + "-" + today.getDate();

        let workDate = new Date(query.workDate);
        let currentDate = new Date(currentToday);
        let diff = workDate.getTime() - currentDate.getTime();
        diff = diff / (1000 * 60 * 60 * 24);
        if(diff >= 3 || diff < 0) {
            const deleteUrl = "https://www.jikgong.p-e.kr/api/apply/worker/"+`${query.applyId}`
            const deleteResponse = await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${loginKey}`
            }
            })
            var responseData = await deleteResponse.json()
            console.log(responseData)
            if(responseData.message == "커스텀 예외 반환") {
                $w("#button21").label = responseData.data.errorMessage;
            }
            else {
                wixLocation.to(`/내일자리`);
            }
        }
        else {
            $w("#button21").label = "취소불가";
        }
    })
});
