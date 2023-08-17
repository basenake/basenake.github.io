// 確保當文檔完全加載後才執行初始化和數據抓取
document.addEventListener('DOMContentLoaded', () => {
    initNavigationLinks(); // 初始化導航連結
    showSection('home');   // 顯示首頁部分
    fetchData();           // 從API抓取數據
    toggleTheme();
});

// 初始化導航連結的點擊事件
function initNavigationLinks() {
    const links = document.querySelectorAll('.section-link'); // 選擇所有具有'section-link'類名的元素
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止連結的默認行為
            const section = e.target.getAttribute('data-section'); // 從被點擊的連結獲取區域名稱
            showSection(section); // 顯示相應的區域
        });
    });
}

// 定義API的URL
const url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-C7964BCC-BDE9-48F7-B222-1B8A6BFE48C9';

// 定義地區分類
function getRegion(locationName) {
    const regions = {
        north: ['臺北市', '新北市', '新竹市', '新竹縣', '宜蘭縣', '基隆市', '桃園市'],
        south: ['嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣'],
        central: ['苗栗縣', '臺中縣', '臺中市', '南投縣', '彰化縣', '雲林縣'],
        east: ['花蓮縣', '臺東縣'],
        island: ['連江縣', '金門縣', '澎湖縣'],
    }
    for (const region in regions) {
        if (regions[region].includes(locationName)) {
            return region;
        }
    }
}
function toggleTheme() {
    const isChecked = document.getElementById('toggle').checked;
    document.body.className = isChecked ? 'dark-mode' : '';
}

function showSection(section) {
    const sections = ['home', 'north', 'central', 'south', 'east', 'island']
    sections.forEach(sec => {
        document.getElementById(sec).style.display = 'none';
    });

    if (section === 'home') {
        document.getElementById('home').style.display = 'block';
    } else {
        document.getElementById(section).style.display = 'block';
    }
}

showSection('home');

// 使用fetch API從API獲取數據
fetch(url)
    .then(response => response.json())
    .then(data => {
        // 從數據中提取天氣預報
        const forecasts = data.records.location;

        // 遍歷每個地點的預報
        forecasts.forEach(forecast => {
            const locationName = forecast.locationName;
            const weatherElements = forecast.weatherElement;

            // 提取所需的資訊 
            // 早上
            const morningEndTime = weatherElements[0].time[0].endTime;
            const [morningEndDate, morningEndTimeOnly] = morningEndTime.split(' ');
            const [morningHour, monrningMinute, morningSecond] = morningEndTimeOnly.split(':');
            const morningPop = weatherElements[1].time[0].parameter.parameterName;
            const morningMinT = weatherElements[2].time[0].parameter.parameterName;
            const morningCi = weatherElements[3].time[0].parameter.parameterName;
            const morningMaxT = weatherElements[4].time[0].parameter.parameterName;
            // 到下午
            const afternoonEndTime = weatherElements[0].time[1].endTime;
            const [afternoonEndDate, afternoonEndTimeOnly] = afternoonEndTime.split(' ');
            const [afternoonHour, afternoonMinute, afternoonSecond] = afternoonEndTimeOnly.split(':');
            const afternoonPop = weatherElements[1].time[1].parameter.parameterName;
            const afternoonMinT = weatherElements[2].time[1].parameter.parameterName;
            const afternoonCi = weatherElements[3].time[1].parameter.parameterName;
            const afternoonMaxT = weatherElements[4].time[1].parameter.parameterName;
            // 到隔天
            const tomorrowEndTime = weatherElements[0].time[2].endTime;
            const [tomorrowEndDate, tomorrowEndTimeOnly] = tomorrowEndTime.split(' ');
            const [tomorrowHour, tomorrowMinute, tomorrowSecond] = tomorrowEndTimeOnly.split(':');
            const tomorrowPop = weatherElements[1].time[2].parameter.parameterName;
            const tomorrowMinT = weatherElements[2].time[2].parameter.parameterName;
            const tomorrowCi = weatherElements[3].time[2].parameter.parameterName;
            const tomorrowMaxT = weatherElements[4].time[2].parameter.parameterName;


            // 創建卡片
            const card = `
    <div class="card mt-5" >
        <div class="card-body container">
            <div class="row">
                <div class="text-center locationName col-6 size">${locationName}</div>
                <div class="text-center locationName col-6 size">${morningEndDate}</div>
            </div>
            <div class="row mt-1">
                <div class="col-3 cardMod2">時間</div>
                <div class="col-3 dayTime cardMod1 size time">${morningHour}${monrningMinute}</div>
                <div class="col-3 dayTime cardMod1 size time">${afternoonHour}${afternoonMinute}</div>
                <div class="col-3 dayTime cardMod1 size time">${tomorrowHour}${tomorrowMinute}</div>
            </div>
            <div class="row mt-1 ">
                <div class="col-3 weatherInfo cardMod2 d">舒適度</div>
                <div class="col-3 tempure cardMod1 pop">${morningPop}</div>
                <div class="col-3 tempure cardMod1 pop">${afternoonPop}</div>
                <div class="col-3 tempure cardMod1 pop">${tomorrowPop}</div>
            </div>
            <div class="row mt-1">
                <div class="col-3 weatherInfo cardMod2">降雨機率</div>
                <div class="col-3 rain cardMod1 mint">${morningMinT}</div>
                <div class="col-3 rain cardMod1 mint">${afternoonMinT}</div>
                <div class="col-3 rain cardMod1 mint">${tomorrowMinT}</div>
            </div>
            <div class="row mt-1">
                <div class="col-3 weatherInfo cardMod2 ">最低溫度</div>
                <div class="col-3 minTempure cardMod1 ci">${morningCi}</div>
                <div class="col-3 minTempure cardMod1 ci">${afternoonCi}</div>
                <div class="col-3 minTempure cardMod1 ci">${tomorrowCi}</div>
            </div>
            <div class="row mt-1">
                <div class="col-3 weatherInfo cardMod2">最高溫度</div>
                <div class="col-3 maxTempure cardMod1 maxt">${morningMaxT}</div>
                <div class="col-3 maxTempure cardMod1 maxt">${afternoonMaxT}</div>
                <div class="col-3 maxTempure cardMod1 maxt">${tomorrowMaxT}</div>
            </div>
        </div>
    </div>`;

            // 獲取地區
            const region = getRegion(locationName);

            // 將卡片插入到 HTML 中的正確地區
            const regionDiv = document.querySelector(`.${region}`);
            regionDiv.innerHTML += card;
        });
    })
    .catch(error => console.error('錯誤:', error)); // 如果有錯誤，將其記錄到控制台
