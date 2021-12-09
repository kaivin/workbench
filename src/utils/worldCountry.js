﻿import {sortByDesc} from "./index.js";
// 世界地图数据转化
export function worldCountry(data,key,val){
    const worldCountryCluesData = [
        {name:"Somalia",country: "索马里",value:0},
        {name:"Liechtenstein",country: "列支敦士登",value:0},
        {name:"Morocco",country: "摩洛哥",value:0},
        {name:"W. Sahara",country: "西撒哈拉",value:0},
        {name:"Serbia",country: "塞尔维亚共和国",value:0},
        {name:"Afghanistan",country: "阿富汗",value:0},
        {name:"Angola",country: "安哥拉",value:0},
        {name:"Albania",country: "阿尔巴尼亚",value:0},
        {name:"Aland",country: "奥兰群岛",value:0},
        {name:"Andorra",country: "安道尔共和国",value:0},
        {name:"United Arab Emirates",country: "阿拉伯联合酋长国",value:0},
        {name:"Argentina",country: "阿根廷",value:0},
        {name:"Armenia",country: "亚美尼亚",value:0},
        {name:"American Samoa",country: "美属萨摩亚群岛",value:0},
        {name:"Fr. S. Antarctic Lands",country: "南极洲",value:0},
        {name:"Antigua and Barb.",country: "安提瓜和巴布达",value:0},
        {name:"Australia",country: "澳大利亚",value:0},
        {name:"Austria",country: "奥地利",value:0},
        {name:"Azerbaijan",country: "阿塞拜疆",value:0},
        {name:"Burundi",country: "布隆迪",value:0},
        {name:"Belgium",country: "比利时",value:0},
        {name:"Benin",country: "贝宁",value:0},
        {name:"Burkina Faso",country: "布基纳法索",value:0},
        {name:"Bangladesh",country: "孟加拉国",value:0},
        {name:"Bulgaria",country: "保加利亚",value:0},
        {name:"Bahrain",country: "巴林",value:0},
        {name:"Bahamas",country: "巴哈马",value:0},
        {name:"Bosnia and Herz.",country: "波斯尼亚和黑塞哥维那",value:0},
        {name:"Belarus",country: "白俄罗斯",value:0},
        {name:"Belize",country: "伯利兹",value:0},
        {name:"Bermuda",country: "百慕大",value:0},
        {name:"Bolivia",country: "玻利维亚",value:0},
        {name:"Brazil",country: "巴西",value:0},
        {name:"Barbados",country: "巴巴多斯",value:0},
        {name:"Brunei",country: "文莱",value:0},
        {name:"Bhutan",country: "不丹",value:0},
        {name:"Botswana",country: "博茨瓦纳",value:0},
        {name:"Central African Rep.",country: "中非共和国",value:0},
        {name:"Canada",country: "加拿大",value:0},
        {name:"Switzerland",country: "瑞士",value:0},
        {name:"Chile",country: "智利",value:0},
        {name:"China",country: "中国",value:0},
        {name:"Côte d'Ivoire",country: "科特迪瓦",value:0},
        {name:"Cameroon",country: "喀麦隆",value:0},
        {name:"Dem. Rep. Congo",country: "刚果民主共和国",value:0},
        {name:"Congo",country: "刚果共",value:0},
        {name:"Colombia",country: "哥伦比亚",value:0},
        {name:"Comoros",country: "科摩罗",value:0},
        {name:"Cape Verde",country: "佛得角",value:0},
        {name:"Costa Rica",country: "哥斯达黎加",value:0},
        {name:"Cuba",country: "古巴",value:0},
        {name:"Curaçao",country: "库拉索岛",value:0},
        {name:"Cayman Is.",country: "开曼群岛",value:0},
        {name:"N. Cyprus",country: "北塞浦路斯",value:0},
        {name:"Cyprus",country: "塞浦路斯",value:0},
        {name:"Czech Rep.",country: "捷克共和国",value:0},
        {name:"Germany",country: "德国",value:0},
        {name:"Djibouti",country: "吉布提",value:0},
        {name:"Dominica",country: "多米尼克",value:0},
        {name:"Denmark",country: "丹麦",value:0},
        {name:"Dominican Rep.",country: "多米尼加共和国",value:0},
        {name:"Algeria",country: "阿尔及利亚",value:0},
        {name:"Ecuador",country: "厄瓜多尔",value:0},
        {name:"Egypt",country: "埃及",value:0},
        {name:"Eritrea",country: "厄立特里亚",value:0},
        {name:"Spain",country: "西班牙",value:0},
        {name:"Estonia",country: "爱沙尼亚",value:0},
        {name:"Ethiopia",country: "埃塞俄比亚",value:0},
        {name:"Finland",country: "芬兰",value:0},
        {name:"Fiji",country: "斐济",value:0},
        {name:"Falkland Is.",country: "福克兰",value:0},
        {name:"France",country: "法国",value:0},
        {name:"Faeroe Is.",country: "法罗群岛",value:0},
        {name:"Micronesia",country: "密克罗尼西亚",value:0},
        {name:"Gabon",country: "加蓬",value:0},
        {name:"United Kingdom",country: "英国",value:0},
        {name:"Georgia",country: "格鲁吉亚",value:0},
        {name:"Ghana",country: "加纳",value:0},
        {name:"Guinea",country: "几内亚",value:0},
        {name:"Gambia",country: "冈比亚",value:0},
        {name:"Guinea-Bissau",country: "几内亚比绍",value:0},
        {name:"Eq. Guinea",country: "赤道几内亚",value:0},
        {name:"Greece",country: "希腊",value:0},
        {name:"Grenada",country: "格林纳达",value:0},
        {name:"Greenland",country: "格陵兰",value:0},
        {name:"Guatemala",country: "危地马拉",value:0},
        {name:"Guam",country: "关岛",value:0},
        {name:"Guyana",country: "圭亚那",value:0},
        {name:"Heard I. and McDonald Is.",country: "赫德岛和麦克唐纳群岛",value:0},
        {name:"Honduras",country: "洪都拉斯",value:0},
        {name:"Croatia",country: "克罗地亚",value:0},
        {name:"Haiti",country: "海地",value:0},
        {name:"Hungary",country: "匈牙利",value:0},
        {name:"Indonesia",country: "印度尼西亚",value:0},
        {name:"Isle of Man",country: "曼岛",value:0},
        {name:"India",country: "印度",value:0},
        {name:"Br. Indian Ocean Ter.",country: "英属印度洋领土",value:0},
        {name:"Ireland",country: "爱尔兰",value:0},
        {name:"Iran",country: "伊朗",value:0},
        {name:"Iraq",country: "伊拉克",value:0},
        {name:"Iceland",country: "冰岛",value:0},
        {name:"Israel",country: "以色列",value:0},
        {name:"Italy",country: "意大利",value:0},
        {name:"Jamaica",country: "牙买加",value:0},
        {name:"Jersey",country: "泽西岛",value:0},
        {name:"Jordan",country: "约旦",value:0},
        {name:"Japan",country: "日本",value:0},
        {name:"Siachen Glacier",country: "锡亚琴冰川",value:0},
        {name:"Kazakhstan",country: "哈萨克斯坦",value:0},
        {name:"Kenya",country: "肯尼亚",value:0},
        {name:"Kyrgyzstan",country: "吉尔吉斯斯坦",value:0},
        {name:"Cambodia",country: "柬埔寨",value:0},
        {name:"Kiribati",country: "基里巴斯",value:0},
        {name:"Korea",country: "韩国",value:0},
        {name:"Kuwait",country: "科威特",value:0},
        {name:"Lao PDR",country: "老挝",value:0},
        {name:"Lebanon",country: "黎巴嫩",value:0},
        {name:"Liberia",country: "利比里亚",value:0},
        {name:"Libya",country: "利比亚",value:0},
        {name:"Saint Lucia",country: "圣卢西亚岛",value:0},
        {name:"Sri Lanka",country: "斯里兰卡",value:0},
        {name:"Lesotho",country: "莱索托",value:0},
        {name:"Lithuania",country: "立陶宛",value:0},
        {name:"Luxembourg",country: "卢森堡",value:0},
        {name:"Latvia",country: "拉脱维亚",value:0},
        {name:"Moldova",country: "摩尔多瓦",value:0},
        {name:"Madagascar",country: "马达加斯加",value:0},
        {name:"Mexico",country: "墨西哥",value:0},
        {name:"Macedonia",country: "马其顿",value:0},
        {name:"Mali",country: "马里",value:0},
        {name:"Malta",country: "马耳他",value:0},
        {name:"Myanmar",country: "缅甸",value:0},
        {name:"Montenegro",country: "黑山",value:0},
        {name:"Mongolia",country: "蒙古",value:0},
        {name:"N. Mariana Is.",country: "北马里亚纳群岛",value:0},
        {name:"Mozambique",country: "莫桑比克",value:0},
        {name:"Mauritania",country: "毛里塔尼亚",value:0},
        {name:"Montserrat",country: "蒙特塞拉特",value:0},
        {name:"Mauritius",country: "毛里求斯",value:0},
        {name:"Malawi",country: "马拉维",value:0},
        {name:"Malaysia",country: "马来西亚",value:0},
        {name:"Namibia",country: "纳米比亚",value:0},
        {name:"New Caledonia",country: "新喀里多尼亚",value:0},
        {name:"Niger",country: "尼日尔",value:0},
        {name:"Nigeria",country: "尼日利亚",value:0},
        {name:"Nicaragua",country: "尼加拉瓜",value:0},
        {name:"Niue",country: "纽埃岛",value:0},
        {name:"Netherlands",country: "荷兰",value:0},
        {name:"Norway",country: "挪威",value:0},
        {name:"Nepal",country: "尼泊尔",value:0},
        {name:"New Zealand",country: "新西兰",value:0},
        {name:"Oman",country: "阿曼",value:0},
        {name:"Pakistan",country: "巴基斯坦",value:0},
        {name:"Panama",country: "巴拿马",value:0},
        {name:"Peru",country: "秘鲁",value:0},
        {name:"Philippines",country: "菲律宾",value:0},
        {name:"Palau",country: "帕劳",value:0},
        {name:"Papua New Guinea",country: "巴布亚新几内亚",value:0},
        {name:"Poland",country: "波兰",value:0},
        {name:"Puerto Rico",country: "波多黎各",value:0},
        {name:"Dem. Rep. Korea",country: "朝鲜",value:0},
        {name:"Portugal",country: "葡萄牙",value:0},
        {name:"Paraguay",country: "巴拉圭",value:0},
        {name:"Palestine",country: "巴勒斯坦",value:0},
        {name:"Fr. Polynesia",country: "法属波利尼西亚",value:0},
        {name:"Qatar",country: "卡塔尔",value:0},
        {name:"Romania",country: "罗马尼亚",value:0},
        {name:"Russia",country: "俄罗斯",value:0},
        {name:"Rwanda",country: "卢旺达",value:0},
        {name:"Saudi Arabia",country: "沙特阿拉伯",value:0},
        {name:"Sudan",country: "苏丹",value:0},
        {name:"S. Sudan",country: "南苏丹",value:0},
        {name:"Senegal",country: "塞内加尔",value:0},
        {name:"Singapore",country: "新加坡",value:0},
        {name:"S. Geo. and S. Sandw. Is.",country: "南乔治亚岛和南桑威奇群岛",value:0},
        {name:"Saint Helena",country: "圣赫勒拿岛",value:0},
        {name:"Solomon Is.",country: "所罗门群岛",value:0},
        {name:"Sierra Leone",country: "塞拉利昂",value:0},
        {name:"El Salvador",country: "萨尔瓦多",value:0},
        {name:"St. Pierre and Miquelon",country: "圣皮埃尔和密克隆群岛",value:0},
        {name:"São Tomé and Principe",country: "圣多美和普林西比",value:0},
        {name:"Suriname",country: "苏里南",value:0},
        {name:"Slovakia",country: "斯洛伐克",value:0},
        {name:"Slovenia",country: "斯洛文尼亚",value:0},
        {name:"Sweden",country: "瑞典",value:0},
        {name:"Swaziland",country: "斯威士兰",value:0},
        {name:"Seychelles",country: "塞舌尔共和国",value:0},
        {name:"Syria",country: "叙利亚",value:0},
        {name:"Turks and Caicos Is.",country: "特克斯和凯科斯群岛",value:0},
        {name:"Chad",country: "乍得",value:0},
        {name:"Togo",country: "多哥",value:0},
        {name:"Thailand",country: "泰国",value:0},
        {name:"Tajikistan",country: "塔吉克斯坦",value:0},
        {name:"Turkmenistan",country: "土库曼斯坦",value:0},
        {name:"Timor-Leste",country: "东帝汶",value:0},
        {name:"Tonga",country: "汤加",value:0},
        {name:"Trinidad and Tobago",country: "特里尼达和多巴哥",value:0},
        {name:"Tunisia",country: "突尼斯",value:0},
        {name:"Turkey",country: "土耳其",value:0},
        {name:"Tanzania",country: "坦桑尼亚",value:0},
        {name:"Uganda",country: "乌干达",value:0},
        {name:"Ukraine",country: "乌克兰",value:0},
        {name:"Uruguay",country: "乌拉圭",value:0},
        {name:"United States",country: "美国",value:0},
        {name:"Uzbekistan",country: "乌兹别克斯坦",value:0},
        {name:"St. Vin. and Gren.",country: "圣文森特和格林纳丁斯",value:0},
        {name:"Venezuela",country: "委内瑞拉",value:0},
        {name:"U.S. Virgin Is.",country: "美属维尔京群岛",value:0},
        {name:"Vietnam",country: "越南",value:0},
        {name:"Vanuatu",country: "瓦努阿图",value:0},
        {name:"Samoa",country: "萨摩亚群岛",value:0},
        {name:"Yemen",country: "也门",value:0},
        {name:"South Africa",country: "南非",value:0},
        {name:"Zambia",country: "赞比亚",value:0},
        {name:"Zimbabwe",country: "津巴布韦",value:0},
    ];
    worldCountryCluesData.forEach(function(item,index){
        data.forEach(function(item1,index1){
            if(item.country == item1[key]){
                item.value = item1[val];
            }
        });
    });
    worldCountryCluesData.sort(sortByDesc("value"));
    return worldCountryCluesData;
}

// 世界地图国家中英文名称对照表
export function worldNameMap(){
    var nameMap = {
        "Somalia": "索马里",
        "Liechtenstein": "列支敦士登",
        "Morocco": "摩洛哥",
        "W. Sahara": "西撒哈拉",
        "Serbia": "塞尔维亚共和国",
        "Afghanistan": "阿富汗",
        "Angola": "安哥拉",
        "Albania": "阿尔巴尼亚",
        "Aland": "奥兰群岛",
        "Andorra": "安道尔共和国",
        "United Arab Emirates": "阿拉伯联合酋长国",
        "Argentina": "阿根廷",
        "Armenia": "亚美尼亚",
        "American Samoa": "美属萨摩亚群岛",
        "Fr. S. Antarctic Lands": "法属南半球和南极领地（南极洲）",
        "Antigua and Barb.": "安提瓜和巴布达",
        "Australia": "澳大利亚",
        "Austria": "奥地利",
        "Azerbaijan": "阿塞拜疆",
        "Burundi": "布隆迪",
        "Belgium": "比利时",
        "Benin": "贝宁",
        "Burkina Faso": "布基纳法索",
        "Bangladesh": "孟加拉国",
        "Bulgaria": "保加利亚",
        "Bahrain": "巴林",
        "Bahamas": "巴哈马",
        "Bosnia and Herz.": "波斯尼亚和黑塞哥维那",
        "Belarus": "白俄罗斯",
        "Belize": "伯利兹",
        "Bermuda": "百慕大",
        "Bolivia": "玻利维亚",
        "Brazil": "巴西",
        "Barbados": "巴巴多斯",
        "Brunei": "文莱",
        "Bhutan": "不丹",
        "Botswana": "博茨瓦纳",
        "Central African Rep.": "中非共和国",
        "Canada": "加拿大",
        "Switzerland": "瑞士",
        "Chile": "智利",
        "China": "中国",
        "Côte d'Ivoire": "科特迪瓦",
        "Cameroon": "喀麦隆",
        "Dem. Rep. Congo": "刚果民主共和国",
        "Congo": "刚果共和国",
        "Colombia": "哥伦比亚",
        "Comoros": "科摩罗",
        "Cape Verde": "佛得角",
        "Costa Rica": "哥斯达黎加",
        "Cuba": "古巴",
        "Curaçao": "库拉索岛",
        "Cayman Is.": "开曼群岛",
        "N. Cyprus": "北塞浦路斯",
        "Cyprus": "塞浦路斯",
        "Czech Rep.": "捷克共和国",
        "Germany": "德国",
        "Djibouti": "吉布提",
        "Dominica": "多米尼克",
        "Denmark": "丹麦",
        "Dominican Rep.": "多米尼加共和国",
        "Algeria": "阿尔及利亚",
        "Ecuador": "厄瓜多尔",
        "Egypt": "埃及",
        "Eritrea": "厄立特里亚",
        "Spain": "西班牙",
        "Estonia": "爱沙尼亚",
        "Ethiopia": "埃塞俄比亚",
        "Finland": "芬兰",
        "Fiji": "斐济",
        "Falkland Is.": "马尔维纳斯群岛（福克兰）",
        "France": "法国",
        "Faeroe Is.": "法罗群岛",
        "Micronesia": "密克罗尼西亚",
        "Gabon": "加蓬",
        "United Kingdom": "英国",
        "Georgia": "格鲁吉亚",
        "Ghana": "加纳",
        "Guinea": "几内亚",
        "Gambia": "冈比亚",
        "Guinea-Bissau": "几内亚比绍",
        "Eq. Guinea": "赤道几内亚",
        "Greece": "希腊",
        "Grenada": "格林纳达",
        "Greenland": "格陵兰",
        "Guatemala": "危地马拉",
        "Guam": "关岛",
        "Guyana": "圭亚那",
        "Heard I. and McDonald Is.": "赫德岛和麦克唐纳群岛",
        "Honduras": "洪都拉斯",
        "Croatia": "克罗地亚",
        "Haiti": "海地",
        "Hungary": "匈牙利",
        "Indonesia": "印度尼西亚",
        "Isle of Man": "曼岛（马恩岛）",
        "India": "印度",
        "Br. Indian Ocean Ter.": "英属印度洋领土",
        "Ireland": "爱尔兰",
        "Iran": "伊朗",
        "Iraq": "伊拉克",
        "Iceland": "冰岛",
        "Israel": "以色列",
        "Italy": "意大利",
        "Jamaica": "牙买加",
        "Jersey": "泽西岛",
        "Jordan": "约旦",
        "Japan": "日本",
        "Siachen Glacier": "锡亚琴冰川",
        "Kazakhstan": "哈萨克斯坦",
        "Kenya": "肯尼亚",
        "Kyrgyzstan": "吉尔吉斯斯坦",
        "Cambodia": "柬埔寨",
        "Kiribati": "基里巴斯",
        "Korea": "韩国",
        "Kuwait": "科威特",
        "Lao PDR": "老挝",
        "Lebanon": "黎巴嫩",
        "Liberia": "利比里亚",
        "Libya": "利比亚",
        "Saint Lucia": "圣卢西亚岛",
        "Sri Lanka": "斯里兰卡",
        "Lesotho": "莱索托",
        "Lithuania": "立陶宛",
        "Luxembourg": "卢森堡",
        "Latvia": "拉脱维亚",
        "Moldova": "摩尔多瓦",
        "Madagascar": "马达加斯加",
        "Mexico": "墨西哥",
        "Macedonia": "马其顿",
        "Mali": "马里",
        "Malta": "马耳他",
        "Myanmar": "缅甸",
        "Montenegro": "黑山",
        "Mongolia": "蒙古",
        "N. Mariana Is.": "北马里亚纳群岛",
        "Mozambique": "莫桑比克",
        "Mauritania": "毛里塔尼亚",
        "Montserrat": "蒙特塞拉特",
        "Mauritius": "毛里求斯",
        "Malawi": "马拉维",
        "Malaysia": "马来西亚",
        "Namibia": "纳米比亚",
        "New Caledonia": "新喀里多尼亚",
        "Niger": "尼日尔",
        "Nigeria": "尼日利亚",
        "Nicaragua": "尼加拉瓜",
        "Niue": "纽埃岛",
        "Netherlands": "荷兰",
        "Norway": "挪威",
        "Nepal": "尼泊尔",
        "New Zealand": "新西兰",
        "Oman": "阿曼",
        "Pakistan": "巴基斯坦",
        "Panama": "巴拿马",
        "Peru": "秘鲁",
        "Philippines": "菲律宾",
        "Palau": "帕劳",
        "Papua New Guinea": "巴布亚新几内亚",
        "Poland": "波兰",
        "Puerto Rico": "波多黎各",
        "Dem. Rep. Korea": "朝鲜",
        "Portugal": "葡萄牙",
        "Paraguay": "巴拉圭",
        "Palestine": "巴勒斯坦",
        "Fr. Polynesia": "法属波利尼西亚",
        "Qatar": "卡塔尔",
        "Romania": "罗马尼亚",
        "Russia": "俄罗斯",
        "Rwanda": "卢旺达",
        "Saudi Arabia": "沙特阿拉伯",
        "Sudan": "苏丹",
        "S. Sudan": "南苏丹",
        "Senegal": "塞内加尔",
        "Singapore": "新加坡",
        "S. Geo. and S. Sandw. Is.": "南乔治亚岛和南桑威奇群岛",
        "Saint Helena": "圣赫勒拿岛",
        "Solomon Is.": "所罗门群岛",
        "Sierra Leone": "塞拉利昂",
        "El Salvador": "萨尔瓦多",
        "St. Pierre and Miquelon": "圣皮埃尔和密克隆群岛",
        "São Tomé and Principe": "圣多美和普林西比",
        "Suriname": "苏里南",
        "Slovakia": "斯洛伐克",
        "Slovenia": "斯洛文尼亚",
        "Sweden": "瑞典",
        "Swaziland": "斯威士兰",
        "Seychelles": "塞舌尔共和国",
        "Syria": "叙利亚",
        "Turks and Caicos Is.": "特克斯和凯科斯群岛",
        "Chad": "乍得",
        "Togo": "多哥",
        "Thailand": "泰国",
        "Tajikistan": "塔吉克斯坦",
        "Turkmenistan": "土库曼斯坦",
        "Timor-Leste": "东帝汶",
        "Tonga": "汤加",
        "Trinidad and Tobago": "特立尼达和多巴哥",
        "Tunisia": "突尼斯",
        "Turkey": "土耳其",
        "Tanzania": "坦桑尼亚",
        "Uganda": "乌干达",
        "Ukraine": "乌克兰",
        "Uruguay": "乌拉圭",
        "United States": "美国",
        "Uzbekistan": "乌兹别克斯坦",
        "St. Vin. and Gren.": "圣文森特和格林纳丁斯",
        "Venezuela": "委内瑞拉",
        "U.S. Virgin Is.": "美属维尔京群岛",
        "Vietnam": "越南",
        "Vanuatu": "瓦努阿图",
        "Samoa": "萨摩亚群岛",
        "Yemen": "也门",
        "South Africa": "南非",
        "Zambia": "赞比亚",
        "Zimbabwe": "津巴布韦",
    };
    return nameMap
}
