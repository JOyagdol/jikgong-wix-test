// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import { fetch, getJSON } from 'wix-fetch';
import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation, { to } from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import wixWindowFrontend from "wix-window-frontend";

let tech_list = {"NORMAL":"보통인부","FOREMAN":"작업반장","SKILLED_LABORER":"특별인부","HELPER":"조력공","SCAFFOLDER":"비계공","FORMWORK_CARPENTER":"형틀목공","REBAR_WORKER":"철근공","STEEL_STRUCTURE_WORKER":"철골공","WELDER":"용접공","CONCRETE_WORKER":"콘크리트공","BRICKLAYER":"조적공","DRYWALL_FINISHER":"견출공","CONSTRUCTION_CARPENTER":"건축목공","WINDOW_DOOR_INSTALLER":"창호공","GLAZIER":"유리공","WATERPROOFING_WORKER":"방수공","PLASTERER":"미장공","TILE":"타일","PAINTER":"도장공","INTERIOR_FINISHER":"내장공","WALLPAPER_INSTALLER":"도배공","POLISHER":"연마공","STONEMASON":"석공","GROUT_WORKER":"줄눈공","PANEL_ASSEMBLER":"판넬조립공","ROOFER":"지붕잇기공","LANDSCAPER":"조경공","CAULKER":"코킹공","PLUMBER":"배관공","BOILER_TECHNICIAN":"보일러공","SANITARY_TECHNICIAN":"위생공","DUCT_INSTALLER":"덕트공","INSULATION_WORKER":"보온공","MECHANICAL_EQUIPMENT_TECHNICIAN":"기계설비공","ELECTRICIAN":"내선전공","TELECOMMUNICATIONS_INSTALLER":"통신내선공","TELECOMMUNICATIONS_EQUIPMENT_INSTALLER":"통신설비공"};

var loginKey = session.getItem("loginKey");
$w.onReady(async function () {
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')

    // Click 'Preview' to run your code
    //button 8 확정
    let formFactor = wixWindowFrontend.formFactor; 
    if(loginKey) {
      $w("#button10").collapse();
      $w("#button22").collapse();
      $w("#text160").collapse();
      initComponents()
      render()
    }
    else {
      $w('#section1regulartitle1').text = "로그인 후 이용 가능합니다"
      $w('#text155').collapse();
      $w('#section1').collapse();
    }
});

function initComponents() {
    initRepeater()
  }

async function render(){
  const jobUrl = "https://www.jikgong.p-e.kr/api/apply/worker/future"

  const jobResponse = await fetch(jobUrl, {
  method: "GET",
  headers: {
      'Authorization': `Bearer ${loginKey}`
  }
  })
  
  // repeater 개수 늘어나는 경우 페이지 처리?
  var responseData = await jobResponse.json()
  if (responseData.data.errorMessage == "만료된 access token 입니다.") {
      $w('#section1regulartitle1').text = "로그인이 만료되었습니다!"
      $w('#text155').text = "다시 로그인 시도 부탁드려요"
      $w('#section1').collapse();
  }
  else if (responseData.data.errorMessage) {
    $w('#section1regulartitle1').text = responseData.data.errorMessage
    $w('#text155').collapse();
    $w('#section1').collapse();
  }
  else {
    if(responseData.data.length == 0) {
      $w('#section1regulartitle1').text = "지원하신 일자리가 없습니다!"
      $w('#text155').text = "구인공고로 가서 일자리를 지원해보세요"
      $w('#section1').collapse();
    }
    else {
      $w('#Section1Regular').collapse();
      for(let i=0;i<responseData.data.length;i++) {
        responseData.data[i]._id = `${i+1}`
      }
      console.log(responseData);
      $w('#listRepeater').data = []
      $w('#listRepeater').data = responseData.data
    }
    
  }
}  

function initRepeater() {
  $w('#listRepeater').onItemReady(($item, itemData, index) => {

    initItemWorkingDate($item, itemData)
    initItemTechTag($item, itemData)
    initItemTitle($item, itemData)
    initItemDeleteButton($item, itemData)
    initItemStatus($item, itemData)
    initItemTimeStamp($item, itemData)
  

  });
}
function initItemTitle($item, itemData) {
    $item("#title").text = itemData.jobPostResponse.title;
    $item("#title").onClick(() => {
      wixLocation.to(`/내일자리-상세보기?jobPostId=${itemData.jobPostResponse.postId}&workDate=${itemData.workDate}&applyId=${itemData.applyId}`);
    })
  }
  
  function initItemWorkingDate($item, itemData) {
    $item("#text158").text = itemData.workDate;
  }
  
  function initItemTechTag($item, itemData) {
    //console.log(itemData.meal, itemData.pickup)
    $item("#text157").text = tech_list[itemData.jobPostResponse.tech]
  }

  function initItemDeleteButton($item, itemData) {
    
    // 삭제 예외처리 테스트 해야함
    $item("#button9").onClick(async () => {
      let today = new Date();
      let month = today.getMonth()+1
      var currentToday = today.getFullYear() + "-" + 0 + month + "-" + today.getDate();

      let workDate = new Date(itemData.workDate);
      let currentDate = new Date(currentToday);
      let diff = workDate.getTime() - currentDate.getTime();
      diff = diff / (1000 * 60 * 60 * 24);
      if(diff >= 3 || diff < 0) {
        const deleteUrl = "https://www.jikgong.p-e.kr/api/apply/worker/"+`${itemData.applyId}`
        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
              'Authorization': `Bearer ${loginKey}`
          }
          })
          var responseData = await deleteResponse.json()
          console.log(responseData)
          if(responseData.message == "커스텀 예외 반환") {
            $w("#text160").expand();
            $w("#text160").text = responseData.data.errorMessage;
          }
          else {
            $w("#text160").collapse();
          }
          render();
      }
      else {
        $item("#button9").label = "취소불가";
      }
      
      
    })
  }


function initItemStatus($item, itemData) {
  // 색 적용
  if(itemData.status == "PENDING") {
    $item("#button21").label = "대기중"
    $item("#button21").style.color = "#757575"
  }
  else if(itemData.status == "REJECTED") {
    $item("#button21").label = "거절됨"
    $item("#button21").style.color = "#FF0000"
  }
  else if(itemData.status == "ACCEPTED") {
    $item("#button21").label = "수락됨"
    $item("#button21").style.color = "#00B050"
  } 
  else if(itemData.status == "CANCELED") $item("#button21").label = "취소됨"
  else if(itemData.status == "OFFERED") $item("#button21").label = "제안됨"
}

function initItemTimeStamp($item, itemData) {
  $item("#text126").text = itemData.timePassed;
}
