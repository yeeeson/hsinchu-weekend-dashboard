"use client";

import { useMemo, useState } from "react";
import { filterRoutes, routeCost } from "@/lib/route-planner.mjs";

type Transport = "public" | "car" | "scooter";
type Weather = "any" | "sunny" | "rain";
type Pace = "any" | "half" | "full";

type RoutePlan = {
  id: string;
  number: string;
  title: string;
  region: string;
  kicker: string;
  summary: string;
  duration: string;
  pace: Exclude<Pace, "any">;
  distance: string;
  weather: Exclude<Weather, "any">[];
  moods: string[];
  color: string;
  costs: {
    ticket: number;
    food: number;
    activity: number;
    public: number;
    car: number;
    scooter: number;
  };
  transport: Record<Transport, string>;
  stops: { time: string; name: string; hours: string; note: string }[];
  sourceLabel: string;
  sourceUrl: string;
  mapUrl: string;
};

const routes: RoutePlan[] = [
  {
    id: "old-town",
    number: "01",
    title: "舊城散步與小吃",
    region: "新竹市區",
    kicker: "低門檻・雨天也能走",
    summary: "從火車站一路走進老城，把古蹟、電影與城隍廟小吃排成一條不用趕車的午後路線。",
    duration: "4–5 小時",
    pace: "half",
    distance: "步行約 3.2 km",
    weather: ["sunny", "rain"],
    moods: ["文化", "美食", "輕鬆"],
    color: "#d96d4b",
    costs: { ticket: 30, food: 320, activity: 0, public: 30, car: 160, scooter: 60 },
    transport: {
      public: "新竹火車站出發，全程步行；市區公車預留 NT$30。",
      car: "建議停火車站或府後街停車場，再改步行；估 NT$160／車。",
      scooter: "市區機車格較分散，停好後步行最順；估油資與停車 NT$60／車。",
    },
    stops: [
      { time: "13:00", name: "新竹火車站", hours: "每日 06:00–24:00", note: "從百年車站開始，沿護城河進城。" },
      { time: "13:25", name: "東門城與護城河", hours: "戶外開放空間", note: "城市散步的第一段，拍照也不太需要等。" },
      { time: "14:10", name: "影像博物館／美術館", hours: "週二至週日｜影博 09:30–21:00・美術館 09:00–17:00", note: "依當日展演二選一，雨天可拉長停留。" },
      { time: "16:00", name: "城隍廟與東門市場", hours: "市場全天開放・店家各自營業", note: "把主食、甜點和晚餐一次解決。" },
    ],
    sourceLabel: "新竹市觀光旅遊網｜百年老城巡禮",
    sourceUrl: "https://tourism.hccg.gov.tw/",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=新竹火車站&destination=新竹都城隍廟&waypoints=迎曦門%7C新竹市影像博物館",
  },
  {
    id: "park-glass",
    number: "02",
    title: "動物園與玻璃之城",
    region: "新竹公園",
    kicker: "經典・親子也適合",
    summary: "動物園、麗池與玻璃工藝博物館都在同一座公園，用一個下午認識最有代表性的新竹。",
    duration: "5–6 小時",
    pace: "half",
    distance: "步行約 2.6 km",
    weather: ["sunny", "rain"],
    moods: ["文化", "生態", "輕鬆"],
    color: "#4f8a72",
    costs: { ticket: 100, food: 280, activity: 0, public: 30, car: 180, scooter: 60 },
    transport: {
      public: "新竹火車站步行約 18 分鐘，或搭市區公車；預留 NT$30。",
      car: "新竹公園周邊停車假日較滿，估停車 NT$180／車。",
      scooter: "食品路周邊找合法機車格，估油資與停車 NT$60／車。",
    },
    stops: [
      { time: "10:00", name: "新竹市立動物園", hours: "週二至週日 09:00–17:00", note: "全票 NT$50，週一休園，售票至 16:30。" },
      { time: "12:00", name: "新竹公園午餐", hours: "依店家營業", note: "公園周邊選擇多，先避開午後人潮。" },
      { time: "13:30", name: "玻璃工藝博物館", hours: "週二至週日 09:00–17:00", note: "全票 NT$50，週一休館。" },
      { time: "15:15", name: "麗池與湖畔料亭", hours: "戶外開放空間", note: "最後留一段沒有行程壓力的散步。" },
    ],
    sourceLabel: "新竹市立動物園｜票價資訊",
    sourceUrl: "https://zoo-info.hccg.gov.tw/visit/price/",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=新竹火車站&destination=新竹市玻璃工藝博物館&waypoints=新竹市立動物園%7C麗池公園",
  },
  {
    id: "coast",
    number: "03",
    title: "南寮追風單車線",
    region: "17 公里海岸",
    kicker: "看海・把腦袋吹空",
    summary: "從漁港一路騎到香山濕地，風大就縮短、夕陽好就多留，是最適合臨時出發的戶外方案。",
    duration: "6–8 小時",
    pace: "full",
    distance: "單車 12–24 km",
    weather: ["sunny"],
    moods: ["海邊", "運動", "放空"],
    color: "#4c91a8",
    costs: { ticket: 0, food: 320, activity: 200, public: 30, car: 220, scooter: 80 },
    transport: {
      public: "新竹火車站搭藍線／藍 15 區往南寮，單程每段全票 NT$15。",
      car: "漁港周邊停車後租車折返，估油資與停車 NT$220／車。",
      scooter: "南寮旅服中心周邊停車，再租單車進海岸線；估 NT$80／車。",
    },
    stops: [
      { time: "10:00", name: "南寮漁港", hours: "戶外開放空間", note: "先看風勢，再決定長程或短程騎法。" },
      { time: "10:40", name: "魚鱗天梯", hours: "戶外開放空間", note: "短停拍照，不在無遮蔭處久留。" },
      { time: "12:00", name: "港南運河", hours: "戶外開放空間", note: "補水與午餐，單車租金先抓約 NT$200。" },
      { time: "15:30", name: "香山濕地周邊", hours: "賞蟹步道 09:00–18:00", note: "依潮汐與體力決定是否繼續，再原路折返。" },
    ],
    sourceLabel: "新竹市政府｜17 公里海岸自行車道",
    sourceUrl: "https://dep-tourism.hccg.gov.tw/ch/home.jsp?dataserno=202308020009&id=16&mcustomize=municipalnews_view.jsp&mserno=201601300177&parentpath=&t=MunicipalNews&toolsflag=Y",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=南寮漁港&destination=香山濕地&travelmode=bicycling&waypoints=魚鱗天梯%7C港南運河",
  },
  {
    id: "neiwan",
    number: "04",
    title: "內灣鐵道慢旅行",
    region: "橫山・內灣",
    kicker: "不開車・山城感最完整",
    summary: "搭支線把移動本身變成行程，串連合興車站、內灣老街與吊橋，適合一個人也適合兩人。",
    duration: "7–9 小時",
    pace: "full",
    distance: "步行約 5 km",
    weather: ["sunny"],
    moods: ["鐵道", "美食", "山城"],
    color: "#b7854a",
    costs: { ticket: 0, food: 350, activity: 0, public: 95, car: 320, scooter: 160 },
    transport: {
      public: "新竹站搭內灣線；一日週遊券全票 NT$95，可沿線彈性下車。",
      car: "假日內灣易塞，建議早到或停外圍；估油資與停車 NT$320／車。",
      scooter: "台 3 線進山，午後注意天候；估油資與停車 NT$160／車。",
    },
    stops: [
      { time: "09:00", name: "新竹車站", hours: "每日 06:00–24:00・列車依班次", note: "先買內灣線一日週遊券，確認回程班次。" },
      { time: "10:10", name: "合興車站", hours: "戶外全天・店家依現場", note: "保留 45–60 分鐘，不必每一站都停。" },
      { time: "12:00", name: "內灣老街", hours: "店家約 10:00–18:00", note: "野薑花粽、客家菜包或粄條選兩樣就夠。" },
      { time: "14:30", name: "內灣吊橋與林業展示館", hours: "吊橋全天・館舍依公告", note: "午後慢走，17:00 前回車站最安心。" },
    ],
    sourceLabel: "臺鐵｜內灣線一日週遊券",
    sourceUrl: "https://tip.railway.gov.tw/tra-tip-web/tip/tip003/tip313/view10/sort?ticketSortNo=0002",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=內灣車站&destination=內灣吊橋&waypoints=內灣老街%7C內灣林業展示館&travelmode=walking",
  },
  {
    id: "beipu",
    number: "05",
    title: "北埔茶香小旅行",
    region: "北埔・峨眉",
    kicker: "客庄・吃得比走得多",
    summary: "老街不只吃粄條，留一段時間做擂茶，再搭車去峨眉湖看水色，行程會完整很多。",
    duration: "7–8 小時",
    pace: "full",
    distance: "步行約 4.5 km",
    weather: ["sunny"],
    moods: ["客庄", "美食", "湖景"],
    color: "#7d7b3f",
    costs: { ticket: 0, food: 320, activity: 250, public: 100, car: 300, scooter: 140 },
    transport: {
      public: "竹北／高鐵新竹站搭台灣好行 5700 獅山線，一日券 NT$100。",
      car: "北埔外圍停車後步行進老街，再開往峨眉；估 NT$300／車。",
      scooter: "台 3 線移動方便，午後山區可能有短暫陣雨；估 NT$140／車。",
    },
    stops: [
      { time: "09:30", name: "北埔老街", hours: "平日 09:30–17:30・週末 08:00–18:00", note: "先看金廣福公館與慈天宮，再開始吃。" },
      { time: "11:30", name: "客家午餐", hours: "依店家營業", note: "兩人同行較好點菜，預算抓每人 NT$320。" },
      { time: "13:00", name: "擂茶體驗", hours: "依店家預約", note: "店家價格不同，先以每人約 NT$250 估算。" },
      { time: "15:00", name: "峨眉湖／細茅埔吊橋", hours: "戶外開放空間", note: "搭同一路線續行，留意最後回程班次。" },
    ],
    sourceLabel: "台灣好行｜5700 獅山線時刻與票價",
    sourceUrl: "https://beta.taiwantrip.tad.gov.tw/Route/Schedule?routeId=R0003",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=北埔老街&destination=細茅埔吊橋&waypoints=慈天宮%7C峨眉湖",
  },
  {
    id: "green-world",
    number: "06",
    title: "綠世界放空日",
    region: "北埔",
    kicker: "整天待一站・最省腦力",
    summary: "不排行程接力，只選一個夠大的目的地。適合想看動物、走路，但不想一直決定下一站的人。",
    duration: "7–8 小時",
    pace: "full",
    distance: "園區步行 5–7 km",
    weather: ["sunny"],
    moods: ["生態", "散步", "省腦"],
    color: "#3f7657",
    costs: { ticket: 480, food: 280, activity: 0, public: 100, car: 300, scooter: 140 },
    transport: {
      public: "搭台灣好行 5700 獅山線至綠世界站，一日券 NT$100。",
      car: "國道 3 號竹林交流道下，估油資與停車 NT$300／車。",
      scooter: "山路與園區坡度都較多，估油資 NT$140／車。",
    },
    stops: [
      { time: "09:30", name: "售票口", hours: "08:30–17:30・售票至 16:00", note: "全票 NT$480，建議預留完整一天。" },
      { time: "10:00", name: "天鵝湖與鳥類區", hours: "園區 08:30–17:30", note: "上午動物較活躍，先走戶外區。" },
      { time: "12:00", name: "園區午餐", hours: "園區 08:30–17:30", note: "避開正中午長距離爬坡。" },
      { time: "14:00", name: "雨林空中步道", hours: "園區 08:30–17:30", note: "慢慢走完，不再加塞北埔老街。" },
    ],
    sourceLabel: "綠世界生態農場｜最新票價",
    sourceUrl: "https://www.green-world.com.tw/ticket.php",
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=綠世界生態農場",
  },
  {
    id: "zhubei-liujia",
    number: "07",
    title: "竹北高鐵聚落散步",
    region: "竹北・六家",
    kicker: "去趣靈感・高鐵到站就能走",
    summary: "從六家水圳與商場慢慢走進新瓦屋，再到老聚落看問禮堂，把竹北的新城與客家老屋排在同一天。",
    duration: "5–6 小時",
    pace: "half",
    distance: "步行約 5.5 km",
    weather: ["sunny"],
    moods: ["客庄", "散步", "甜點"],
    color: "#7b6ba8",
    costs: { ticket: 0, food: 350, activity: 0, public: 60, car: 180, scooter: 80 },
    transport: {
      public: "新竹站搭六家線至六家站，沿線步行；往返車資預留 NT$60。",
      car: "高鐵特區停車後步行串連，假日預留停車 NT$180／車。",
      scooter: "各景點周邊都有移動空間，仍請找合法機車格；估 NT$80／車。",
    },
    stops: [
      { time: "09:30", name: "水圳森林公園", hours: "戶外開放空間", note: "先走水圳與綠地，上午日照比較舒服。" },
      { time: "11:00", name: "6+PLAZA 廣場", hours: "每日 11:00–21:30", note: "吃午餐或買甜點，也能當作臨時避雨點。" },
      { time: "13:00", name: "新瓦屋客家文化保存區", hours: "服務台每日 08:00–20:00・店家各異", note: "看老屋、水田與創藝店家，不用每間都逛。" },
      { time: "15:30", name: "竹北問禮堂與六家古厝", hours: "戶外聚落・問禮堂依公告", note: "以聚落外觀散策收尾，問禮堂整修與預約狀態需先確認。" },
    ],
    sourceLabel: "去趣公開行程｜新竹高鐵一日遊",
    sourceUrl: "https://www.chictrip.com.tw/?action=preView&preViewTravelId=60b7bd6a-7f1d-4ecc-848f-bdaa984f7495",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=水圳森林公園&destination=竹北問禮堂&waypoints=6%2BPLAZA廣場%7C新瓦屋客家文化保存區&travelmode=walking",
  },
  {
    id: "neiwan-comic",
    number: "08",
    title: "內灣漫畫老時光",
    region: "內灣",
    kicker: "去趣靈感・同一山城另一玩法",
    summary: "同樣搭內灣線，這次把重點從吊橋轉向漫畫、老戲院與客家午餐，適合想慢慢看故事的人。",
    duration: "6–7 小時",
    pace: "full",
    distance: "步行約 3.5 km",
    weather: ["sunny", "rain"],
    moods: ["漫畫", "鐵道", "懷舊"],
    color: "#c06a87",
    costs: { ticket: 0, food: 450, activity: 0, public: 95, car: 320, scooter: 160 },
    transport: {
      public: "新竹站搭內灣線，一日週遊券全票 NT$95；全程可步行。",
      car: "假日內灣停車較滿，建議 10:00 前抵達；估油資與停車 NT$320／車。",
      scooter: "台 3 線轉縣道 120 進內灣，午後留意山區陣雨；估 NT$160／車。",
    },
    stops: [
      { time: "09:40", name: "內灣車站", hours: "依臺鐵班次", note: "下車先確認回程，再沿老街方向慢慢走。" },
      { time: "10:00", name: "內灣老街", hours: "店家約 10:00–18:00", note: "早一點逛比較舒服，先吃小點但別一次吃飽。" },
      { time: "11:30", name: "內灣戲院與客家午餐", hours: "餐廳依店家公告", note: "把老戲院建築與午餐排在同一站，預算抓每人 NT$450。" },
      { time: "14:00", name: "劉興欽漫畫教育博物館", hours: "週三至週一 09:00–16:00・週二休館", note: "免費參觀，保留一段時間看漫畫與發明作品。" },
    ],
    sourceLabel: "去趣公開行程｜內灣漫畫與手作",
    sourceUrl: "https://www.chictrip.com.tw/?action=preView&preViewTravelId=15d64ab6-dc69-4760-95c2-d35ab2a642a2",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=內灣車站&destination=劉興欽漫畫教育博物館&waypoints=內灣老街%7C內灣戲院&travelmode=walking",
  },
  {
    id: "hukou-dashanbei",
    number: "09",
    title: "湖口老街與大山背",
    region: "湖口・橫山",
    kicker: "去趣靈感・老街接森林",
    summary: "上午看湖口紅磚街屋，午後轉進大山背的古道與山林；景點跨度較大，最適合開車或機車。",
    duration: "7–8 小時",
    pace: "full",
    distance: "步行約 5 km・車程約 45 km",
    weather: ["sunny"],
    moods: ["古蹟", "森林", "健走"],
    color: "#6f854e",
    costs: { ticket: 0, food: 350, activity: 0, public: 520, car: 320, scooter: 160 },
    transport: {
      public: "臺鐵到湖口後需以計程車往返大山背，交通預留約 NT$520／人。",
      car: "湖口老街停車後再開往大山背，山路不寬；估油資與停車 NT$320／車。",
      scooter: "路線彈性最高，但古道路段午後易起霧或下雨；估 NT$160／車。",
    },
    stops: [
      { time: "09:30", name: "湖口老街", hours: "週三至週一約 10:00–17:00", note: "先看紅磚拱廊與老街立面，店家尚未全開也能散步。" },
      { time: "11:30", name: "老街客家午餐", hours: "依店家營業", note: "午餐後再上山，避免山區臨時找不到餐點。" },
      { time: "13:30", name: "大山背人文生態館", hours: "館舍依最新公告", note: "先在館舍周邊了解聚落，再依天候決定步道長度。" },
      { time: "15:00", name: "騎龍古道", hours: "戶外步道・建議日落前離開", note: "石階濕滑時縮短路線，穿止滑鞋比趕里程重要。" },
    ],
    sourceLabel: "去趣公開行程｜森遊竹縣古道路線",
    sourceUrl: "https://www.chictrip.com.tw/?action=preView&preViewTravelId=e1b84ba9-d3b0-4110-8950-1d5a544f0861",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=湖口老街&destination=騎龍古道&waypoints=大山背人文生態館",
  },
  {
    id: "city-art-food",
    number: "10",
    title: "巨城到東門夜食",
    region: "新竹市區",
    kicker: "去趣靈感・雨天吃玩線",
    summary: "從巨城吃午餐、逛室內空間，再走到美術館與東門市場，最後用一頓燒肉把行程拉到晚上。",
    duration: "7–8 小時",
    pace: "full",
    distance: "步行約 4 km",
    weather: ["sunny", "rain"],
    moods: ["美食", "展覽", "逛街"],
    color: "#a85f4c",
    costs: { ticket: 0, food: 800, activity: 0, public: 30, car: 180, scooter: 60 },
    transport: {
      public: "新竹車站搭市區公車到巨城，之後步行往市區；預留公車 NT$30。",
      car: "建議停巨城或市區停車場後改步行，避免傍晚反覆找位；估 NT$180／車。",
      scooter: "中央路與東門市場周邊找合法機車格；估油資與停車 NT$60／車。",
    },
    stops: [
      { time: "11:00", name: "Big City 遠東巨城", hours: "週日至四 11:00–21:30・週五六至 22:00", note: "先吃午餐再逛室內樓層，雨大時可多留一小時。" },
      { time: "14:00", name: "新竹市美術館", hours: "週二至週日 09:00–17:00", note: "免費參觀，週一與民俗節日休館。" },
      { time: "15:30", name: "東門市場與周邊小吃", hours: "市場全天開放・店家各自營業", note: "先吃一份小點，保留晚餐空間。" },
      { time: "17:30", name: "東門燒肉晚餐", hours: "依店家公告・建議先訂位", note: "這條路線的主餐，餐費先抓每人約 NT$800。" },
    ],
    sourceLabel: "去趣編輯部公開行程｜新竹燒肉一日遊",
    sourceUrl: "https://www.chictrip.com.tw/?action=preView&preViewTravelId=545bff6c-cde0-4390-8698-70c1f70677b8",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=Big%20City遠東巨城購物中心&destination=東門燒肉霸&waypoints=新竹市美術館%7C東門市場&travelmode=walking",
  },
  {
    id: "left-bank-sports",
    number: "11",
    title: "左岸滑板與單車放電",
    region: "頭前溪左岸",
    kicker: "免費・帶裝備就能玩",
    summary: "把滑板場、河濱球場與自行車道串成一個不用買門票的運動午後，想練技巧或只想流汗都能調整強度。",
    duration: "4–6 小時",
    pace: "half",
    distance: "單車約 8–15 km",
    weather: ["sunny"],
    moods: ["運動", "滑板", "單車"],
    color: "#367d83",
    costs: { ticket: 0, food: 280, activity: 150, public: 180, car: 180, scooter: 80 },
    transport: {
      public: "大眾運輸轉乘較不直覺，建議由北新竹站轉計程車；來回預留 NT$180／人。",
      car: "台 68 線橋下及左岸周邊有停車空間，估油資與停車 NT$180／車。",
      scooter: "機車最容易串連各運動區，停放時請依現場標線；估油資 NT$80／車。",
    },
    stops: [
      { time: "09:30", name: "新竹左岸滑板公園", hours: "戶外開放空間・雨後不建議使用", note: "橋下有遮蔭，但仍要戴護具；第一次玩可先從平面區熟悉板感。" },
      { time: "11:30", name: "左岸壘球與棒球場", hours: "戶外開放空間・賽事使用依公告", note: "沒有預約場地也能沿運動廊道走走，遇到賽事則改成觀賽休息。" },
      { time: "13:00", name: "多功能休閒草坪", hours: "戶外開放空間", note: "補水吃午餐，飛盤、野餐墊或簡單伸展都適合。" },
      { time: "14:30", name: "頭前溪左岸自行車道", hours: "戶外開放空間", note: "依風勢與體力決定里程，活動費先抓單車租借約 NT$150。" },
    ],
    sourceLabel: "新竹市政府｜左岸運動設施介紹",
    sourceUrl: "https://www.hccepb.gov.tw/news-detail.php?Nid=2457",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=新竹左岸滑板公園&destination=頭前溪左岸自行車道&waypoints=新竹左岸運動公園%7C頭前溪左岸多功能草坪&travelmode=bicycling",
  },
  {
    id: "xinke-sports",
    number: "12",
    title: "新科運動與關新補給",
    region: "光復路・關新",
    kicker: "雨天・一小時也能成行",
    summary: "先在新科運動中心重訓或游泳，再去關新一帶吃飯散步，是下雨、太熱或只剩半天時都能成立的彈性路線。",
    duration: "3–5 小時",
    pace: "half",
    distance: "步行約 2.5 km",
    weather: ["sunny", "rain"],
    moods: ["運動", "室內", "輕鬆"],
    color: "#546f9d",
    costs: { ticket: 150, food: 300, activity: 0, public: 30, car: 180, scooter: 60 },
    transport: {
      public: "由新莊車站步行約 15 分鐘，或搭市區公車至光復路；預留 NT$30／人。",
      car: "可使用新科國中地下停車場，假日仍建議提早抵達；估停車 NT$180／車。",
      scooter: "光復路周邊找合法機車格，再以步行串連；估油資與停車 NT$60／車。",
    },
    stops: [
      { time: "09:00", name: "新科國民運動中心體適能館", hours: "每日 06:00–22:00", note: "全票 NT$50／小時，須穿運動服鞋並攜帶毛巾；16 歲以下不得入場。" },
      { time: "10:30", name: "新科國民運動中心游泳池", hours: "每日 06:00–22:00・10:00–10:30 清場", note: "全票 NT$100／次；若不游泳，可把這段換成伸展或提早吃飯。" },
      { time: "12:15", name: "光復路午餐", hours: "依店家營業", note: "從小吃到簡餐都有，餐費先抓每人約 NT$300。" },
      { time: "14:00", name: "關新公園", hours: "戶外開放空間", note: "天氣好再走一圈收操；雨天則直接在周邊咖啡店休息。" },
    ],
    sourceLabel: "新科國民運動中心｜場館與收費資訊",
    sourceUrl: "https://www.tmhksports.com.tw/pages.php?locale=new&pa=zone-detail&pages_id=16",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=新竹市新科國民運動中心&destination=關新公園&waypoints=新竹市光復路一段&travelmode=walking",
  },
  {
    id: "nanliao-fishing",
    number: "13",
    title: "南寮南堤合法海釣",
    region: "新竹漁港",
    kicker: "在地・潮水比行程重要",
    summary: "到官方劃設的南側防砂堤體驗海釣，行程不追景點數量，而是跟著海況、潮水與魚訊決定停留多久。",
    duration: "5–7 小時",
    pace: "full",
    distance: "步行約 3 km",
    weather: ["sunny"],
    moods: ["海釣", "在地", "放空"],
    color: "#2f7693",
    costs: { ticket: 0, food: 350, activity: 400, public: 30, car: 220, scooter: 80 },
    transport: {
      public: "新竹火車站搭藍線／藍 15 區至南寮，再步行前往南堤；來回預留 NT$30／人。",
      car: "從新港南路底依垂釣區指示前往，勿進入港區作業範圍；估油資與停車 NT$220／車。",
      scooter: "沿新港南路到漁港安檢所旁，再依現場指示步行；估油資 NT$80／車。",
    },
    stops: [
      { time: "08:00", name: "南寮旅遊服務中心", hours: "週六、週日 08:00–19:00", note: "先確認風勢、海況與補給；沒有救生衣或防滑鞋就不要進釣區。" },
      { time: "08:30", name: "新竹漁港南側合法垂釣區", hours: "港區 24 小時作業・僅指定區域可釣", note: "不需申請，但必須避開航道與非開放區；夜釣另備照明設備。" },
      { time: "12:30", name: "新竹漁港午餐", hours: "依店家營業", note: "先收好釣具再進食，餌料與基本耗材預算先抓約 NT$400。" },
      { time: "14:00", name: "魚鱗天梯與防風林", hours: "戶外開放空間", note: "以輕鬆散步收尾；風浪轉強或天候不佳就提前結束。" },
    ],
    sourceLabel: "新竹市政府｜漁港南堤合法垂釣區",
    sourceUrl: "https://dep-construction.hccg.gov.tw/ch/home.jsp?dataserno=202001310010&id=7&mcustomize=municipalnews_view.jsp&mserno=201601300072&parentpath=&t=MunicipalNews&toolsflag=Y",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=南寮旅遊服務中心&destination=新竹漁港南堤釣魚區&waypoints=新竹漁港%7C魚鱗天梯&travelmode=walking",
  },
  {
    id: "xiangshan-local-food",
    number: "14",
    title: "香山丘陵與長興熱炒",
    region: "香山・海山",
    kicker: "名字叫釣蝦場・其實吃臭豆腐",
    summary: "先走青青草原與香山海線，傍晚再去沒有蝦可釣、卻因臭豆腐鍋和熱炒留下來的長興，是很有在地反差感的一天。",
    duration: "5–7 小時",
    pace: "full",
    distance: "步行約 5 km・另有短程移動",
    weather: ["sunny"],
    moods: ["在地", "美食", "散步"],
    color: "#9a6745",
    costs: { ticket: 0, food: 450, activity: 0, public: 120, car: 220, scooter: 80 },
    transport: {
      public: "各點距離較分散，可搭區間車至香山站後轉計程車；預留 NT$120／人。",
      car: "最適合依序串連丘陵、車站與海線，長興周邊停車依現場指示；估 NT$220／車。",
      scooter: "香山短程移動方便，但沿海風大時要降低車速；估油資 NT$80／車。",
    },
    stops: [
      { time: "10:30", name: "青青草原", hours: "戶外開放空間", note: "走外圍步道即可，不必把每個設施都排滿；雨後留意草地濕滑。" },
      { time: "13:00", name: "香山火車站", hours: "戶外參觀・列車依時刻", note: "看木造車站與周邊街區，補充飲水後再往海線移動。" },
      { time: "15:00", name: "海山漁港", hours: "戶外開放空間", note: "在地小漁港適合短停吹風，不進入作業區也不影響漁民。" },
      { time: "17:00", name: "長興釣蝦場", hours: "11:00–21:50・週一公休", note: "目前是熱炒餐廳，不提供釣蝦；臭豆腐鍋、蝦料理與熱炒可多人分食。" },
    ],
    sourceLabel: "新竹市觀光旅遊網｜長興釣蝦場",
    sourceUrl: "https://tourism.hccg.gov.tw/chtravel/app/travel/view?id=38&module=travel&serno=606b78b9-1b09-45e4-b57d-4060f3b280bd",
    mapUrl: "https://www.google.com/maps/dir/?api=1&origin=青青草原&destination=長興釣蝦場&waypoints=香山火車站%7C海山漁港",
  },
];

const transportLabels: Record<Transport, string> = {
  public: "大眾運輸",
  car: "開車",
  scooter: "機車",
};

function money(value: number) {
  return `NT$${value.toLocaleString("zh-TW")}`;
}

export default function Home() {
  const [transport, setTransport] = useState<Transport>("public");
  const [budget, setBudget] = useState(1000);
  const [weather, setWeather] = useState<Weather>("any");
  const [pace, setPace] = useState<Pace>("any");
  const [travelers, setTravelers] = useState(2);
  const [selectedId, setSelectedId] = useState("neiwan");

  const filtered = useMemo(
    () => filterRoutes(routes, { transport, budget, weather, pace, travelers }),
    [transport, budget, weather, pace, travelers],
  );

  const selected = filtered.find((route) => route.id === selectedId) ?? filtered[0] ?? routes[0];
  const selectedTotal = routeCost(selected, transport, travelers);
  const selectedTransportCost =
    transport === "public" ? selected.costs.public : Math.ceil(selected.costs[transport] / travelers);

  function surpriseMe() {
    const pool = filtered.length > 0 ? filtered : routes;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setSelectedId(next.id);
    document.getElementById("route-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="回到首頁">
          <span className="brand-mark" aria-hidden="true">風</span>
          <span>週末風向</span>
        </a>
        <div className="header-meta">
          <span>HSINCHU · WEEKEND 01</span>
          <span className="freshness"><i />資料查核 2026.07.19</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">不必先知道自己想去哪裡</p>
          <h1>沿著風，<br />選一條路。</h1>
          <p className="hero-lede">
            從新竹出發的 14 種週末提案。先選預算與交通方式，再讓今天的體力替你做最後決定。
          </p>
          <button className="surprise-button" onClick={surpriseMe}>
            <span aria-hidden="true">↗</span> 幫我挑一條
          </button>
        </div>

        <div className="atlas" aria-label="新竹週末路線概念地圖">
          <div className="terrain terrain-a" />
          <div className="terrain terrain-b" />
          <div className="water" />
          <div className="road road-a" />
          <div className="road road-b" />
          <div className="road road-c" />
          <span className="map-caption">風城週末圖譜</span>
          {filtered.map((route) => (
            <button
              key={route.id}
              className={`map-node node-${Number.parseInt(route.number, 10)} ${selected.id === route.id ? "active" : ""}`}
              style={{ "--route-color": route.color } as React.CSSProperties}
              onClick={() => setSelectedId(route.id)}
              aria-label={`選擇${route.region}：${route.title}`}
            >
              <span>{route.number}</span>
              <strong>{route.region}</strong>
            </button>
          ))}
          <div className="compass" aria-hidden="true"><span>N</span></div>
          <div className="atlas-note">
            <span>BASE</span>
            <strong>新竹市區</strong>
          </div>
        </div>
      </section>

      <section className="planner" aria-labelledby="planner-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / 先說今天的條件</p>
            <h2 id="planner-title">把選擇縮小一點</h2>
          </div>
          <p>{filtered.length} 條路線符合目前條件</p>
        </div>

        <div className="filter-grid">
          <fieldset className="filter-group">
            <legend>怎麼去？</legend>
            <div className="segmented">
              {(Object.keys(transportLabels) as Transport[]).map((item) => (
                <button key={item} className={transport === item ? "selected" : ""} onClick={() => setTransport(item)}>
                  {transportLabels[item]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend>每人預算</legend>
            <div className="segmented">
              {[500, 700, 1000].map((amount) => (
                <button key={amount} className={budget === amount ? "selected" : ""} onClick={() => setBudget(amount)}>
                  {amount === 1000 ? "NT$1,000 內" : `NT$${amount} 內`}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group compact-group">
            <legend>天氣</legend>
            <select value={weather} onChange={(event) => setWeather(event.target.value as Weather)} aria-label="選擇天氣條件">
              <option value="any">都可以</option>
              <option value="sunny">晴天優先</option>
              <option value="rain">雨天也行</option>
            </select>
          </fieldset>

          <fieldset className="filter-group compact-group">
            <legend>時間</legend>
            <select value={pace} onChange={(event) => setPace(event.target.value as Pace)} aria-label="選擇行程長度">
              <option value="any">整天／半天</option>
              <option value="half">半天</option>
              <option value="full">一整天</option>
            </select>
          </fieldset>

          <fieldset className="filter-group traveler-group">
            <legend>同行人數</legend>
            <div className="stepper">
              <button onClick={() => setTravelers(Math.max(1, travelers - 1))} aria-label="減少同行人數">−</button>
              <output aria-live="polite">{travelers} 人</output>
              <button onClick={() => setTravelers(Math.min(6, travelers + 1))} aria-label="增加同行人數">＋</button>
            </div>
          </fieldset>
        </div>
        <p className="estimate-note">開車與機車費用會依同行人數分攤；餐飲與體驗皆為每人估算。</p>
      </section>

      <section className="route-section" aria-labelledby="routes-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / 看哪條路順眼</p>
            <h2 id="routes-title">週末路線</h2>
          </div>
          <p>點選卡片查看完整時間表</p>
        </div>

        {filtered.length > 0 ? (
          <div className="route-grid">
            {filtered.map((route) => {
              const total = routeCost(route, transport, travelers);
              return (
                <button
                  key={route.id}
                  className={`route-card ${selected.id === route.id ? "active" : ""}`}
                  onClick={() => setSelectedId(route.id)}
                  style={{ "--route-color": route.color } as React.CSSProperties}
                  aria-pressed={selected.id === route.id}
                >
                  <div className="route-card-top">
                    <span className="route-number">{route.number}</span>
                    <span className="route-region">{route.region}</span>
                  </div>
                  <div>
                    <p className="route-kicker">{route.kicker}</p>
                    <h3>{route.title}</h3>
                    <p className="route-summary">{route.summary}</p>
                  </div>
                  <div className="route-tags">
                    {route.moods.map((mood) => <span key={mood}>{mood}</span>)}
                  </div>
                  <div className="route-card-bottom">
                    <span>{route.duration}</span>
                    <strong>{money(total)}<small>／人</small></strong>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">↺</span>
            <h3>條件有點太完美了</h3>
            <p>把預算調高，或取消天氣與時間限制，就會有更多路線。</p>
            <button onClick={() => { setBudget(1000); setWeather("any"); setPace("any"); }}>放寬條件</button>
          </div>
        )}
      </section>

      <section className="route-detail" id="route-detail" style={{ "--route-color": selected.color } as React.CSSProperties}>
        <div className="detail-intro">
          <p className="eyebrow">03 / 這條怎麼走</p>
          <div className="detail-title-row">
            <div>
              <span className="detail-region">{selected.region}</span>
              <h2>{selected.title}</h2>
            </div>
            <div className="detail-price">
              <span>每人估算</span>
              <strong>{money(selectedTotal)}</strong>
            </div>
          </div>
          <p className="detail-summary">{selected.summary}</p>
          <div className="detail-facts">
            <span><b>時間</b>{selected.duration}</span>
            <span><b>移動</b>{selected.distance}</span>
            <span><b>適合</b>{selected.moods.join("・")}</span>
          </div>
        </div>

        <div className="timeline" aria-label={`${selected.title}時間表`}>
          {selected.stops.map((stop, index) => (
            <div className="timeline-stop" key={`${selected.id}-${stop.time}`}>
              <span className="timeline-time">{stop.time}</span>
              <span className="timeline-dot" aria-hidden="true">{index + 1}</span>
              <div>
                <div className="timeline-stop-heading">
                  <h3>{stop.name}</h3>
                  <span className="hours-badge">{stop.hours}</span>
                </div>
                <p>{stop.note}</p>
              </div>
            </div>
          ))}
        </div>

        <aside className="trip-receipt" aria-label="行程費用與交通摘要">
          <div className="receipt-heading">
            <span>TRIP NOTE</span>
            <strong>{selected.number}</strong>
          </div>
          <div className="transport-summary">
            <span>{transportLabels[transport]}</span>
            <p>{selected.transport[transport]}</p>
          </div>
          <dl className="cost-list">
            <div><dt>交通</dt><dd>{money(selectedTransportCost)}</dd></div>
            <div><dt>門票</dt><dd>{money(selected.costs.ticket)}</dd></div>
            <div><dt>餐飲</dt><dd>{money(selected.costs.food)}</dd></div>
            <div><dt>體驗</dt><dd>{money(selected.costs.activity)}</dd></div>
            <div className="total"><dt>合計／人</dt><dd>{money(selectedTotal)}</dd></div>
          </dl>
          <p className="price-disclaimer">實際費用依現場、個人消費與交通狀況為準。</p>
          <div className="detail-actions">
            <a className="primary-link" href={selected.mapUrl} target="_blank" rel="noreferrer">開啟路線地圖 ↗</a>
            <a className="source-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">{selected.sourceLabel} ↗</a>
          </div>
        </aside>
      </section>

      <section className="rain-plan">
        <div>
          <p className="eyebrow">風太大，雨突然來？</p>
          <h2>雨天就把路線收進城裡。</h2>
        </div>
        <p>舊城散步與新竹公園兩條路線都有室內節點。若雨勢變大，直接縮成影像博物館、美術館、玻璃工藝博物館三選一，再用一頓飯收尾。</p>
        <button onClick={() => { setWeather("rain"); setPace("half"); setSelectedId("old-town"); }}>
          套用雨天條件
        </button>
      </section>

      <footer>
        <div className="footer-brand"><span>風</span><strong>週末風向</strong></div>
        <p>票價、班次與開放時間可能臨時調整，出發前請再點選各路線的官方資料確認。</p>
        <a href="#top">回到上方 ↑</a>
      </footer>
    </main>
  );
}
