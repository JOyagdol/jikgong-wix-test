// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";
import { session } from 'wix-storage-frontend';
import wixWindowFrontend from "wix-window-frontend";

let tech_list = {"NORMAL":"보통인부","FOREMAN":"작업반장","SKILLED_LABORER":"특별인부","HELPER":"조력공","SCAFFOLDER":"비계공","FORMWORK_CARPENTER":"형틀목공","REBAR_WORKER":"철근공","STEEL_STRUCTURE_WORKER":"철골공","WELDER":"용접공","CONCRETE_WORKER":"콘크리트공","BRICKLAYER":"조적공","DRYWALL_FINISHER":"견출공","CONSTRUCTION_CARPENTER":"건축목공","WINDOW_DOOR_INSTALLER":"창호공","GLAZIER":"유리공","WATERPROOFING_WORKER":"방수공","PLASTERER":"미장공","TILE":"타일","PAINTER":"도장공","INTERIOR_FINISHER":"내장공","WALLPAPER_INSTALLER":"도배공","POLISHER":"연마공","STONEMASON":"석공","GROUT_WORKER":"줄눈공","PANEL_ASSEMBLER":"판넬조립공","ROOFER":"지붕잇기공","LANDSCAPER":"조경공","CAULKER":"코킹공","PLUMBER":"배관공","BOILER_TECHNICIAN":"보일러공","SANITARY_TECHNICIAN":"위생공","DUCT_INSTALLER":"덕트공","INSULATION_WORKER":"보온공","MECHANICAL_EQUIPMENT_TECHNICIAN":"기계설비공","ELECTRICIAN":"내선전공","TELECOMMUNICATIONS_INSTALLER":"통신내선공","TELECOMMUNICATIONS_EQUIPMENT_INSTALLER":"통신설비공"};

var workDateActive = {};
const query = wixLocation.query;
$w.onReady(async function () {
    let formFactor = wixWindowFrontend.formFactor; 
    var loginKey = session.getItem("loginKey");
    if(loginKey) {
        const url = "https://www.jikgong.p-e.kr/api/job-post/worker/"+`${query.jobPostId}`
        var { data, message } = await getDataWithGetMethod({
            url: url,
          });
        // title
        $w("#text126").text = data.title;
    
        // tech
        $w("#title").text = tech_list[data.tech];
    
        var recruitNum = data.workDateResponseList[0].recruitNum;
        // 모집 인원
        $w("#text124").text = `${recruitNum} 명 모집`;
        initComponents()
        render(data)
    
        $w("#button21").onClick(async () => {
            var applyUrl = "https://www.jikgong.p-e.kr/api/apply/worker"
            var workDateList = [];
            for (const key in workDateActive) {
                if(workDateActive[key] == "Active") {
                    workDateList.push(key);
                }
            }
            if(workDateList.length) {
                let isChecked = await wixWindowFrontend.openLightbox("지원하기")
                if(isChecked == true) {
                    var data = {
                        jobPostId: Number(query.jobPostId),
                        workDateList: workDateList
                    }
                    try {
                        const applyResponse = await fetch(applyUrl, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${loginKey}`
                            },
                            body: JSON.stringify(data)
                          })
                          const responseData = await applyResponse.json()
                          console.log(responseData)
                          if(responseData.message == "커스텀 예외 반환") {
                            if (responseData.data.errorMessage == "만료된 access token 입니다.") {
                                $w("#button21").label = "로그인 만료되었습니다. 재로그인 부탁드립니다."
                              }
                              else if(responseData.data.errorMessage) {
                                $w("#button21").label = responseData.data.errorMessage
                              }
                          }
                          else {
                            $w("#button21").label = "지원 완료되었습니다."
                            wixLocation.to(`/내일자리`);
                          }
                    }
                    catch (error) {
                        console.log('Error:',error)
                    }    
                }                
                else {
                    $w("#button21").label = "이용 약관에 동의해주세요."
                }
            }
            else {
                $w("#button21").label = "지원 날짜를 선택해주세요."
            }
        })
    }
    else {
        wixLocation.to(`/로그인`);
    }

});

function initComponents() {
    initRepeater()
}

async function render(data){
    for(let i=0;i < data.workDateResponseList.length;i++) {
        data.workDateResponseList[i]._id = `${i+1}`
        workDateActive[data.workDateResponseList[i].workDateId] = "Active";
      }

    data.workDateResponseList.sort(function (a,b){
        var date1 = new Date(a.date);
        var date2 = new Date(b.date);
        if (date1 > date2) return 1;
        if (date1 < date2 ) return -1;
        return 0;
    });
    $w("#listRepeater").data = []
    $w("#listRepeater").data = data.workDateResponseList;
}

function initRepeater() {
    $w("#listRepeater").onItemReady(($item, itemData, index) => {
      initItemDate($item, itemData)
      initItemRecruitNum($item, itemData)
      initItemCheckBox($item, itemData)
      initItemContainer($item, itemData)
    });
  }

function initItemDate($item, itemData) {
    const week = {0:"일",1:"월",2:"화",3:"수",4:"목",5:"금",6:"토"}
    var dayOfWeek = new Date(itemData.date).getDay();
    var date = itemData.date.split('-');
    $item("#text186").text = `${date[0].substr(2,2)}년 ${date[1]}월 ${date[2]}일(${week[dayOfWeek]})`;
}

function initItemRecruitNum($item, itemData) {
    $item("#text188").text = `${itemData.registeredNum}/${itemData.recruitNum}명`;
}

function initItemCheckBox($item, itemData) {
    if(itemData.registeredNum == itemData.recruitNum) {
        $item("#checkbox1").disable();
    } 
    else {
        $item("#checkbox1").onClick((event) => {
            if (workDateActive[itemData.workDateId] == "Active") {
                workDateActive[itemData.workDateId] = "DeActive";
            }
            else {
                workDateActive[itemData.workDateId] = "Active";
            }
        })
    }
}

function initItemContainer($item, itemData) {
    $item("#container1").onClick(() => {
        if (workDateActive[itemData.workDateId] == "Active") {
            workDateActive[itemData.workDateId] = "DeActive";
            $item("#checkbox1").checked = false
        }
        else {
            workDateActive[itemData.workDateId] = "Active";
            $item("#checkbox1").checked = true
        }
    })
}
