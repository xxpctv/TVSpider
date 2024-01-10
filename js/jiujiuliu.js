/*
* @File     : jiujiuliu.js
* @Author   : jade
* @Date     : 2024/1/4 14:15
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 996影视
*/

import {Spider} from "./spider.js";
import {Crypto, load} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class JiuJiuLiuSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.cs1369.com"
    }

    getAppName() {
        return "🍥┃九九六影视┃🍥"
    }

    getName() {
        return "九九六影视"
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"stui-vodlist clearfix\"]").find("li")
        for (const vodElement of vodElements) {
            let resource = $(vodElement).find("[class=\"stui-vodlist__thumb lazyload\"]")[0]
            let vodShort = new VodShort()
            vodShort.vod_id = resource.attribs["href"]
            vodShort.vod_name = resource.attribs["title"]
            vodShort.vod_pic = resource.attribs["data-original"]
            vodShort.vod_remarks = $($(resource).find("[class=\"pic-text text-right\"]")[0]).text()
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodPlayFromUrl(play_url) {
        let html = await this.fetch(play_url, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
        }

    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        let vodElement = $("[class=\"col-pd clearfix\"]")[1]
        let vodShortElement = $(vodElement).find("[class=\"stui-content__thumb\"]")[0]
        let vodItems = []
        for (const playElement of $("[class=\"stui-content__playlist clearfix\"]").find("a")) {
            let episodeUrl = this.siteUrl + playElement.attribs["href"];
            let episodeName = $(playElement).text();
            vodItems.push(episodeName + "$" + episodeUrl);
        }
        vodDetail.vod_name = $(vodShortElement).find("[class=\"stui-vodlist__thumb picture v-thumb\"]")[0].attribs["title"]
        vodDetail.vod_pic = $(vodShortElement).find("img")[0].attribs["data-original"]
        vodDetail.vod_remarks = $($(vodShortElement).find("[class=\"pic-text text-right\"]")[0]).text()
        let data_str = $($(vodElement).find("[class=\"data\"]")).text().replaceAll(" ", " ")
        vodDetail.type_name = Utils.getStrByRegex(/类型：(.*?) /, data_str)
        vodDetail.vod_area = Utils.getStrByRegex(/地区：(.*?) /, data_str)
        vodDetail.vod_year = Utils.getStrByRegex(/年份：(.*?) /, data_str)
        vodDetail.vod_actor = Utils.getStrByRegex(/主演：(.*?) /, data_str)
        vodDetail.vod_director = Utils.getStrByRegex(/导演：(.*?) /, data_str)
        vodDetail.vod_content = $($("[class=\"stui-pannel_bd\"]").find("[class=\"col-pd\"]")).text()
        vodDetail.vod_play_from = ["996"].join("$$$")
        vodDetail.vod_play_url = [vodItems.join("#")].join("$$$")
        return vodDetail
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
            let menuElements = $("[class=\"stui-header__menu type-slide\"]").find("a")
            for (const menuElement of menuElements) {
                let type_dic = {
                    "type_name": $(menuElement).text(),
                    "type_id": menuElement.attribs["href"]
                }
                this.classes.push(type_dic)
            }
        }

    }

    async setHome(filter) {
        // await this.setClasses()
        this.classes = [
            {
                "type_name": "首页",
                "type_id": "/"
            },
            {
                "type_name": "电影",
                "type_id": "/show/id/1"
            },
            {
                "type_name": "电视剧",
                "type_id": "/show/id/2"
            },
            {
                "type_name": "动漫",
                "type_id": "/show/id/3"
            },
            {
                "type_name": "爽文短剧",
                "type_id": "/show/id/4"
            }
        ];
        this.filterObj = {
            "/show/id/1": [
                {
                    "key": "1",
                    "name": "按类型",
                    "value": [
                        {
                            "n": "全部",
                            "v": "1"
                        },
                        {
                            "n": "动作片",
                            "v": "6"
                        },
                        {
                            "n": "喜剧片",
                            "v": "7"
                        },
                        {
                            "n": "爱情片",
                            "v": "8"
                        },
                        {
                            "n": "科幻片",
                            "v": "9"
                        },
                        {
                            "n": "恐怖片",
                            "v": "10"
                        },
                        {
                            "n": "剧情片",
                            "v": "11"
                        },
                        {
                            "n": "战争片",
                            "v": "12"
                        },
                        {
                            "n": "动画片",
                            "v": "13"
                        },
                        {
                            "n": "纪录片",
                            "v": "14"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "按剧情",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "喜剧",
                            "v": "喜剧"
                        },
                        {
                            "n": "爱情",
                            "v": "爱情"
                        },
                        {
                            "n": "恐怖",
                            "v": "恐怖"
                        },
                        {
                            "n": "动作",
                            "v": "动作"
                        },
                        {
                            "n": "科幻",
                            "v": "科幻"
                        },
                        {
                            "n": "剧情",
                            "v": "剧情"
                        },
                        {
                            "n": "战争",
                            "v": "战争"
                        },
                        {
                            "n": "警匪",
                            "v": "警匪"
                        },
                        {
                            "n": "犯罪",
                            "v": "犯罪"
                        },
                        {
                            "n": "动画",
                            "v": "动画"
                        },
                        {
                            "n": "奇幻",
                            "v": "奇幻"
                        },
                        {
                            "n": "武侠",
                            "v": "武侠"
                        },
                        {
                            "n": "冒险",
                            "v": "冒险"
                        },
                        {
                            "n": "枪战",
                            "v": "枪战"
                        },
                        {
                            "n": "悬疑",
                            "v": "悬疑"
                        },
                        {
                            "n": "惊悚",
                            "v": "惊悚"
                        },
                        {
                            "n": "经典",
                            "v": "经典"
                        },
                        {
                            "n": "青春",
                            "v": "青春"
                        },
                        {
                            "n": "文艺",
                            "v": "文艺"
                        },
                        {
                            "n": "微电影",
                            "v": "微电影"
                        },
                        {
                            "n": "古装",
                            "v": "古装"
                        },
                        {
                            "n": "历史",
                            "v": "历史"
                        },
                        {
                            "n": "运动",
                            "v": "运动"
                        },
                        {
                            "n": "农村",
                            "v": "农村"
                        },
                        {
                            "n": "儿童",
                            "v": "儿童"
                        },
                        {
                            "n": "网络电影",
                            "v": "网络电影"
                        }
                    ]
                },
                {
                    "key": "3",
                    "name": "按地区",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "中国大陆",
                            "v": "中国大陆"
                        },
                        {
                            "n": "中国香港",
                            "v": "中国香港"
                        },
                        {
                            "n": "中国台湾",
                            "v": "中国台湾"
                        },
                        {
                            "n": "美国",
                            "v": "美国"
                        },
                        {
                            "n": "韩国",
                            "v": "韩国"
                        },
                        {
                            "n": "日本",
                            "v": "日本"
                        },
                        {
                            "n": "泰国",
                            "v": "泰国"
                        },
                        {
                            "n": "新加坡",
                            "v": "新加坡"
                        },
                        {
                            "n": "马来西亚",
                            "v": "马来西亚"
                        },
                        {
                            "n": "印度",
                            "v": "印度"
                        },
                        {
                            "n": "英国",
                            "v": "英国"
                        },
                        {
                            "n": "法国",
                            "v": "法国"
                        },
                        {
                            "n": "加拿大",
                            "v": "加拿大"
                        },
                        {
                            "n": "西班牙",
                            "v": "西班牙"
                        },
                        {
                            "n": "俄罗斯",
                            "v": "俄罗斯"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "4",
                    "name": "按年份",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "2024",
                            "v": "2024"
                        },
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        },
                        {
                            "n": "2009",
                            "v": "2009"
                        },
                        {
                            "n": "2008",
                            "v": "2008"
                        },
                        {
                            "n": "2007",
                            "v": "2007"
                        },
                        {
                            "n": "2006",
                            "v": "2006"
                        },
                        {
                            "n": "2005",
                            "v": "2005"
                        },
                        {
                            "n": "2004",
                            "v": "2004"
                        },
                        {
                            "n": "2003",
                            "v": "2003"
                        },
                        {
                            "n": "2002",
                            "v": "2002"
                        },
                        {
                            "n": "2001",
                            "v": "2001"
                        },
                        {
                            "n": "2000",
                            "v": "2000"
                        },
                        {
                            "n": "1999",
                            "v": "1999"
                        },
                        {
                            "n": "1998",
                            "v": "1998"
                        },
                        {
                            "n": "1997",
                            "v": "1997"
                        },
                        {
                            "n": "1996",
                            "v": "1996"
                        },
                        {
                            "n": "1995",
                            "v": "1995"
                        },
                        {
                            "n": "1994",
                            "v": "1994"
                        },
                        {
                            "n": "1993",
                            "v": "1993"
                        },
                        {
                            "n": "1992",
                            "v": "1992"
                        },
                        {
                            "n": "1991",
                            "v": "1991"
                        },
                        {
                            "n": "1990",
                            "v": "1990"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "按语言",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "汉语普通话",
                            "v": "汉语普通话"
                        },
                        {
                            "n": "英语",
                            "v": "英语"
                        },
                        {
                            "n": "粤语",
                            "v": "粤语"
                        },
                        {
                            "n": "闽南语",
                            "v": "闽南语"
                        },
                        {
                            "n": "韩语",
                            "v": "韩语"
                        },
                        {
                            "n": "日语",
                            "v": "日语"
                        },
                        {
                            "n": "法语",
                            "v": "法语"
                        },
                        {
                            "n": "德语",
                            "v": "德语"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "6",
                    "name": "按字母",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        },
                        {
                            "n": "",
                            "v": ""
                        }
                    ]
                },
                {
                    "key": "7",
                    "name": "按时间",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "按人气",
                            "v": "按人气"
                        },
                        {
                            "n": "按评分",
                            "v": "按评分"
                        }
                    ]
                }
            ],
            "/show/id/2": [
                {
                    "key": "1",
                    "name": "按类型",
                    "value": [
                        {
                            "n": "全部",
                            "v": "2"
                        },
                        {
                            "n": "内地",
                            "v": "15"
                        },
                        {
                            "n": "美国",
                            "v": "16"
                        },
                        {
                            "n": "英国",
                            "v": "17"
                        },
                        {
                            "n": "韩国",
                            "v": "18"
                        },
                        {
                            "n": "泰国",
                            "v": "20"
                        },
                        {
                            "n": "日本",
                            "v": "21"
                        },
                        {
                            "n": "中国香港",
                            "v": "22"
                        },
                        {
                            "n": "中国台湾",
                            "v": "23"
                        },
                        {
                            "n": "其他",
                            "v": "24"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "按剧情",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "古装",
                            "v": "古装"
                        },
                        {
                            "n": "战争",
                            "v": "战争"
                        },
                        {
                            "n": "青春偶像",
                            "v": "青春偶像"
                        },
                        {
                            "n": "喜剧",
                            "v": "喜剧"
                        },
                        {
                            "n": "家庭",
                            "v": "家庭"
                        },
                        {
                            "n": "犯罪",
                            "v": "犯罪"
                        },
                        {
                            "n": "动作",
                            "v": "动作"
                        },
                        {
                            "n": "奇幻",
                            "v": "奇幻"
                        },
                        {
                            "n": "剧情",
                            "v": "剧情"
                        },
                        {
                            "n": "历史",
                            "v": "历史"
                        },
                        {
                            "n": "经典",
                            "v": "经典"
                        },
                        {
                            "n": "乡村",
                            "v": "乡村"
                        },
                        {
                            "n": "情景",
                            "v": "情景"
                        },
                        {
                            "n": "商战",
                            "v": "商战"
                        },
                        {
                            "n": "网剧",
                            "v": "网剧"
                        },
                        {
                            "n": "其他",
                            "v": "其他"
                        }
                    ]
                },
                {
                    "key": "3",
                    "name": "按地区",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "中国大陆",
                            "v": "中国大陆"
                        },
                        {
                            "n": "中国香港",
                            "v": "中国香港"
                        },
                        {
                            "n": "中国台湾",
                            "v": "中国台湾"
                        },
                        {
                            "n": "美国",
                            "v": "美国"
                        },
                        {
                            "n": "韩国",
                            "v": "韩国"
                        },
                        {
                            "n": "日本",
                            "v": "日本"
                        },
                        {
                            "n": "泰国",
                            "v": "泰国"
                        },
                        {
                            "n": "新加坡",
                            "v": "新加坡"
                        },
                        {
                            "n": "马来西亚",
                            "v": "马来西亚"
                        },
                        {
                            "n": "印度",
                            "v": "印度"
                        },
                        {
                            "n": "英国",
                            "v": "英国"
                        },
                        {
                            "n": "法国",
                            "v": "法国"
                        },
                        {
                            "n": "加拿大",
                            "v": "加拿大"
                        },
                        {
                            "n": "西班牙",
                            "v": "西班牙"
                        },
                        {
                            "n": "俄罗斯",
                            "v": "俄罗斯"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "4",
                    "name": "按年份",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "2024",
                            "v": "2024"
                        },
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        },
                        {
                            "n": "2009",
                            "v": "2009"
                        },
                        {
                            "n": "2008",
                            "v": "2008"
                        },
                        {
                            "n": "2007",
                            "v": "2007"
                        },
                        {
                            "n": "2006",
                            "v": "2006"
                        },
                        {
                            "n": "2005",
                            "v": "2005"
                        },
                        {
                            "n": "2004",
                            "v": "2004"
                        },
                        {
                            "n": "2003",
                            "v": "2003"
                        },
                        {
                            "n": "2002",
                            "v": "2002"
                        },
                        {
                            "n": "2001",
                            "v": "2001"
                        },
                        {
                            "n": "2000",
                            "v": "2000"
                        },
                        {
                            "n": "1999",
                            "v": "1999"
                        },
                        {
                            "n": "1998",
                            "v": "1998"
                        },
                        {
                            "n": "1997",
                            "v": "1997"
                        },
                        {
                            "n": "1996",
                            "v": "1996"
                        },
                        {
                            "n": "1995",
                            "v": "1995"
                        },
                        {
                            "n": "1994",
                            "v": "1994"
                        },
                        {
                            "n": "1993",
                            "v": "1993"
                        },
                        {
                            "n": "1992",
                            "v": "1992"
                        },
                        {
                            "n": "1991",
                            "v": "1991"
                        },
                        {
                            "n": "1990",
                            "v": "1990"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "按语言",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "汉语普通话",
                            "v": "汉语普通话"
                        },
                        {
                            "n": "英语",
                            "v": "英语"
                        },
                        {
                            "n": "粤语",
                            "v": "粤语"
                        },
                        {
                            "n": "闽南语",
                            "v": "闽南语"
                        },
                        {
                            "n": "韩语",
                            "v": "韩语"
                        },
                        {
                            "n": "日语",
                            "v": "日语"
                        },
                        {
                            "n": "法语",
                            "v": "法语"
                        },
                        {
                            "n": "德语",
                            "v": "德语"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "6",
                    "name": "按字母",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        },
                        {
                            "n": "",
                            "v": ""
                        }
                    ]
                },
                {
                    "key": "7",
                    "name": "按时间",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "按人气",
                            "v": "按人气"
                        },
                        {
                            "n": "按评分",
                            "v": "按评分"
                        }
                    ]
                }
            ],
            "/show/id/3": [
                {
                    "key": "1",
                    "name": "按类型",
                    "value": [
                        {
                            "n": "全部",
                            "v": "3"
                        },
                        {
                            "n": "内地",
                            "v": "25"
                        },
                        {
                            "n": "日漫",
                            "v": "26"
                        },
                        {
                            "n": "欧美",
                            "v": "27"
                        },
                        {
                            "n": "其他",
                            "v": "28"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "按剧情",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "情感",
                            "v": "情感"
                        },
                        {
                            "n": "科幻",
                            "v": "科幻"
                        },
                        {
                            "n": "热血",
                            "v": "热血"
                        },
                        {
                            "n": "推理",
                            "v": "推理"
                        },
                        {
                            "n": "搞笑",
                            "v": "搞笑"
                        },
                        {
                            "n": "冒险",
                            "v": "冒险"
                        },
                        {
                            "n": "萝莉",
                            "v": "萝莉"
                        },
                        {
                            "n": "校园",
                            "v": "校园"
                        },
                        {
                            "n": "动作",
                            "v": "动作"
                        },
                        {
                            "n": "机战",
                            "v": "机战"
                        },
                        {
                            "n": "运动",
                            "v": "运动"
                        },
                        {
                            "n": "战争",
                            "v": "战争"
                        },
                        {
                            "n": "少年",
                            "v": "少年"
                        },
                        {
                            "n": "少女",
                            "v": "少女"
                        },
                        {
                            "n": "社会",
                            "v": "社会"
                        },
                        {
                            "n": "原创",
                            "v": "原创"
                        },
                        {
                            "n": "亲子",
                            "v": "亲子"
                        },
                        {
                            "n": "益智",
                            "v": "益智"
                        },
                        {
                            "n": "励志",
                            "v": "励志"
                        },
                        {
                            "n": "其他",
                            "v": "其他"
                        }
                    ]
                },
                {
                    "key": "3",
                    "name": "按地区",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "中国大陆",
                            "v": "中国大陆"
                        },
                        {
                            "n": "中国香港",
                            "v": "中国香港"
                        },
                        {
                            "n": "中国台湾",
                            "v": "中国台湾"
                        },
                        {
                            "n": "美国",
                            "v": "美国"
                        },
                        {
                            "n": "韩国",
                            "v": "韩国"
                        },
                        {
                            "n": "日本",
                            "v": "日本"
                        },
                        {
                            "n": "泰国",
                            "v": "泰国"
                        },
                        {
                            "n": "新加坡",
                            "v": "新加坡"
                        },
                        {
                            "n": "马来西亚",
                            "v": "马来西亚"
                        },
                        {
                            "n": "印度",
                            "v": "印度"
                        },
                        {
                            "n": "英国",
                            "v": "英国"
                        },
                        {
                            "n": "法国",
                            "v": "法国"
                        },
                        {
                            "n": "加拿大",
                            "v": "加拿大"
                        },
                        {
                            "n": "西班牙",
                            "v": "西班牙"
                        },
                        {
                            "n": "俄罗斯",
                            "v": "俄罗斯"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "4",
                    "name": "按年份",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "2024",
                            "v": "2024"
                        },
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        },
                        {
                            "n": "2009",
                            "v": "2009"
                        },
                        {
                            "n": "2008",
                            "v": "2008"
                        },
                        {
                            "n": "2007",
                            "v": "2007"
                        },
                        {
                            "n": "2006",
                            "v": "2006"
                        },
                        {
                            "n": "2005",
                            "v": "2005"
                        },
                        {
                            "n": "2004",
                            "v": "2004"
                        },
                        {
                            "n": "2003",
                            "v": "2003"
                        },
                        {
                            "n": "2002",
                            "v": "2002"
                        },
                        {
                            "n": "2001",
                            "v": "2001"
                        },
                        {
                            "n": "2000",
                            "v": "2000"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "按语言",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "汉语普通话",
                            "v": "汉语普通话"
                        },
                        {
                            "n": "英语",
                            "v": "英语"
                        },
                        {
                            "n": "粤语",
                            "v": "粤语"
                        },
                        {
                            "n": "闽南语",
                            "v": "闽南语"
                        },
                        {
                            "n": "韩语",
                            "v": "韩语"
                        },
                        {
                            "n": "日语",
                            "v": "日语"
                        },
                        {
                            "n": "法语",
                            "v": "法语"
                        },
                        {
                            "n": "德语",
                            "v": "德语"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "6",
                    "name": "按字母",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        },
                        {
                            "n": "",
                            "v": ""
                        }
                    ]
                },
                {
                    "key": "7",
                    "name": "按时间",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "按人气",
                            "v": "按人气"
                        },
                        {
                            "n": "按评分",
                            "v": "按评分"
                        }
                    ]
                }
            ],
            "/show/id/4": [
                {
                    "key": "1",
                    "name": "按类型",
                    "value": [
                        {
                            "n": "全部",
                            "v": "4"
                        },
                        {
                            "n": "内地",
                            "v": "29"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "按剧情",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "爽文",
                            "v": "爽文"
                        }
                    ]
                },
                {
                    "key": "3",
                    "name": "按地区",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "内地",
                            "v": "内地"
                        }
                    ]
                },
                {
                    "key": "4",
                    "name": "按年份",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "2024",
                            "v": "2024"
                        },
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        },
                        {
                            "n": "2009",
                            "v": "2009"
                        },
                        {
                            "n": "2008",
                            "v": "2008"
                        },
                        {
                            "n": "2007",
                            "v": "2007"
                        },
                        {
                            "n": "2006",
                            "v": "2006"
                        },
                        {
                            "n": "2005",
                            "v": "2005"
                        },
                        {
                            "n": "2004",
                            "v": "2004"
                        },
                        {
                            "n": "2003",
                            "v": "2003"
                        },
                        {
                            "n": "2002",
                            "v": "2002"
                        },
                        {
                            "n": "2001",
                            "v": "2001"
                        },
                        {
                            "n": "2000",
                            "v": "2000"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "按语言",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "汉语普通话",
                            "v": "汉语普通话"
                        },
                        {
                            "n": "英语",
                            "v": "英语"
                        },
                        {
                            "n": "粤语",
                            "v": "粤语"
                        },
                        {
                            "n": "闽南语",
                            "v": "闽南语"
                        },
                        {
                            "n": "韩语",
                            "v": "韩语"
                        },
                        {
                            "n": "日语",
                            "v": "日语"
                        },
                        {
                            "n": "法语",
                            "v": "法语"
                        },
                        {
                            "n": "德语",
                            "v": "德语"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "6",
                    "name": "按字母",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "",
                            "v": ""
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        },
                        {
                            "n": "",
                            "v": ""
                        }
                    ]
                },
                {
                    "key": "7",
                    "name": "按时间",
                    "value": [
                        {
                            "n": "全部",
                            "v": "全部"
                        },
                        {
                            "n": "按人气",
                            "v": "按人气"
                        },
                        {
                            "n": "按评分",
                            "v": "按评分"
                        }
                    ]
                }
            ]
        }
        if (!this.catOpenStatus) {
            this.classes.shift()
        }
    }

    async setCategory(tid, pg, filter, extend) {
        let cateUrl = ""
        if (tid !== "/") {
            let typeName = extend["1"] ?? tid.split("/").slice(-1)[0]; //类型
            let plot = extend["2"] ?? "全部"; //剧情
            let area = extend["3"] ?? "全部";  // 地区
            let year = extend["4"] ?? "全部"; //全部
            let language = extend["5"] ?? "全部"; //全部
            let letter = extend["6"] ?? "全部"; //全部
            let time = extend["7"] ?? "全部"; //全部
            cateUrl = this.siteUrl + `/area/${area}/by/${time}/class/${plot}/id/${typeName}/lang/${language}/letter/${letter}/year/${year}/page/${pg.toString()}.html`
        } else {
            cateUrl = this.siteUrl
        }
        await this.jadeLog.info(`类别URL为:${cateUrl}`)
        this.limit = 36
        let html = await this.fetch(cateUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setDetail(id) {
        let detailUrl = this.siteUrl + id
        let html = await this.fetch(detailUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodDetail = await this.parseVodDetailFromDoc($)
        }
    }

    async setPlay(flag, id, flags) {
        let html = await this.fetch(id, null, this.getHeader())
        if (html !== null) {
            let matcher = Utils.getStrByRegex(/player_aaaa=(.*?)<\/script>/, html)
            let player = JSON.parse(matcher);
            try {
                this.playUrl = decodeURIComponent(Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(player["url"])))
                this.header = this.getHeader()
            } catch (e) {
                await this.jadeLog.error(e)
            }
        }
    }
}

let spider = new JiuJiuLiuSpider()

async function init(cfg) {
    await spider.init(cfg)
}

async function home(filter) {
    return await spider.home(filter)
}

async function homeVod() {
    return await spider.homeVod()
}

async function category(tid, pg, filter, extend) {
    return await spider.category(tid, pg, filter, extend)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

async function search(wd, quick) {
    return await spider.search(wd, quick)
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}