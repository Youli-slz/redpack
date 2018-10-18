document.write('<link rel="stylesheet" href="https://ui.fhcloudapi.cn/urmyx/css/weui.min.css?t=4.4.86" />')
document.write('<link rel="stylesheet" href="https://ui.fhcloudapi.cn/urmyx/css/jquery-weui.min.css?t=4.4.86" />')
document.write('<link rel="stylesheet" href="https://oss.ririyuedu.com/redpack.css">')
document.write('<script src="https://ui.fhcloudapi.cn/urmyx/js/jquery2.1.0.js" type="text/javascript"></script>')
document.write('<script src="https://ui.fhcloudapi.cn/urmyx/js/jquery-weui.min.js"></script>')
document.write('<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>')

function _convertTime(t){
  let time;
  let date = new Date(t*1000);
  let year = date.getFullYear();
  let month = addZero(date.getMonth() + 1);
  let day = addZero(date.getDate());
  let hour = addZero(date.getHours());
  let minute = addZero(date.getMinutes());
  
  time = year+'.'+ month+'.'+day+' '+ hour+':'+ minute;
  return time;  
}

function addZero(temp){
  if(+temp < 10)
    return '0' + temp;
  else
    return temp;
}

function openPack() {
  $("#com_open").attr('src', 'https://oss.ririyuedu.com/realtechImg_i_1539759182580?imageMogr2/size-limit/500k'); 
  $("#com_open").removeAttr('onclick')
  $.ajax({
      headers:{
        serverName: 'RealRedPacket',
        methodName: 'RedPackService.GrabRedPack',
      },
      type: 'post',
      url: GWC.baseUrl,
      data: JSON.stringify({
        userid: GWC.userId,
        rp_id: GWC.rp_id,
      }),
      dataType: 'json',
      success: function (res) {
        if(res.status.code == 0) {
          getList();
        } else {
          cosnole.log(res.status.msg);
        }
      },
      error: function () {
        console.log('请求错误')
      }
  })
}

function getList() {
  $.ajax({
      headers:{
        serverName: 'RealRedPacket',
        methodName: 'RedPackService.GetRedPackRecordList',
      },
      type: 'post',
      url: GWC.baseUrl,
      data: JSON.stringify({
        userid: GWC.userId,
        rp_id: GWC.rp_id,
        offset: GWC.pagenum,
        num: GWC.NUM,
        if_get_myself: true
      }),
      dataType: 'json',
      success : function (res) {
        if(res.status.code == 0) {
            var list = '';
            res.list.length <= GWC.NUM? GWC.hasMore = !1 : GWC.pagenum += GWC.NUM;
            for (var i = 0; i < res.list.length; i++){
              res.list[i].timestamp = _convertTime(res.list[i].timestamp);
              list += '\
                <div class="grab_user_line">\
                  <div class="g_user_desc">\
                    <img src="'+res.list[i].user.avatar_url?res.list[i].user.avatar_url:'https://oss.ririyuedu.com/open_red.png'+'" style="margin-right:15px;width:35px;height:35px;border-radius:50%;" />\
                    <div>\
                      <div class="user_name">'+ res.list[i].user.nick_name +'</div>\
                      <div class="user_time">'+ res.list[i].timestamp +'</div>\
                    </div>\
                  </div>\
                  <div class="user_money">'+ res.list[i].money +'元</div>\
                </div>\
              '
            }
            $('.mainbox').html('\
              <div class="box" style="display: none;">\
                <div style="width:100%;height: 15px;"></div>\
                <div class="box_desc">\
                  <div class="open_com_avatar"><img id="com_avatar" src="https://oss.ririyuedu.com/open_red.png"/></div>\
                  <div class="open_com_name company_name">'+res.send_name+'</div>\
                  <div class="open_com_title">给了你一个红包</div>\
                  <div class="open_money">'+ res.grab_money +'<text style="font-size:20px;">元</text></div>\
                  <div class="open_tips">已存入零钱，可用于发红包</div>\
                  <div class="open_line"></div>\
                  <div class="open_pack_num"><text id="pack_num">'+ res.num +'个红包</text><text style="margin-left: 10px;" id="pack_all_money">共'+ res.amount +'元</text></div>\
                  <div class="grab_user_list">\
                  '+ list +'\
                  </div>\
                  <div class="more" onclick="getMore()">\
                    <div style="font-size:12px;color:#acacac;font-family:"PingFang-SC-Medium;"">查看更多</div>\
                    <img src="https://oss.ririyuedu.com/more_red.png" style="margin-left:5px;width: 12px;height:12px;"/>\
                  </div>\
                </div>\
                <div style="width:100%;height: 15px;"></div>\
              </div> \
            ')
        }
      },
      error: function () {
        console.log('请求出错')
      }
  })
}


function getMore() {
  if(!GWC.hasMore) return;
  $.ajax({
    headers:{
      serverName: 'RealRedPacket',
      methodName: 'RedPackService.GetRedPackRecordList',
    },
    type: 'post',
    url: GWC.baseUrl,
    data: JSON.stringify({
      userid: GWC.userId,
      rp_id: GWC.rp_id,
      offset: GWC.pagenum,
      num: GWC.NUM,
      if_get_myself: false
    }),
    dataType: 'json',
    success: function (res) {
      if(res.state.code == 0) {
        res.list.length <= GWC.NUM ? GWC.hasMore = !1 : GWC.pagenum += GWC.NUM;
        var list = '';
        for (var i = 0; i < res.list.length; i++){
          res.list[i].timestamp = _convertTime(res.list[i].timestamp);
          list += '\
            <div class="grab_user_line">\
              <div class="g_user_desc">\
                <img src="'+res.list[i].user.avatar_url?res.list[i].user.avatar_url:'https://oss.ririyuedu.com/open_red.png'+'" style="margin-right:15px;width:35px;height:35px;border-radius:50%;" />\
                <div>\
                  <div class="user_name">'+ res.list[i].user.nick_name +'</div>\
                  <div class="user_time">'+ res.list[i].timestamp +'</div>\
                </div>\
              </div>\
              <div class="user_money">'+ res.list[i].money +'元</div>\
            </div>\
          '
        };
        $('.grab_user_list').append(list);
      }else {
        console.log(res.state.msg);
        
      }
    },
    error: function () {
      console.log("请求出错")
    }
  })
}

var GWC = {
  isGra : true,   // 是否抢红包
  isClickOpen : false,   // 是否点击打开红包按钮
  NUM : 100,             // 抢红包列表每页数量
  pagenum : 0,           // 抢红包列表当前页数
  hasMore: !0,           // 还有更多
  userId: 0,            // 用户id
  rp_id: 0,             // 红包id
  baseUrl: 'https://fg.muqingmedia.com/rpc',
  urlParams: {},
  
  /**
   * 页面初始化
  */
  Init: function (options){
    console.log(options);
    GWC.rp_id = +GWC.getUrlParams();
    wx.config({
      debug: false,
      appId: options.appId,  // 公众号唯一标识
      timestamp: options.timestamp, // 生成标签的时间戳
      nonceStr: options.nonceStr,  // 生成标签的随即串
      signature: options.signature,  // 签名
      jsApiList: ['hideOptionMenu']  // 需要使用的js接口列表
    })
    wx.ready(function () {
      wx.hideOptionMenu();  // 隐藏右上角分享
    })
    if(GWC.getCookie('userId')){
      GWC.userId = GWC.getCookie('userId');
    } else {
      GWC.userId = options.userId;
      GWC.setCookie('userId', options.userId)
    }
    GWC.getPageData();
  },

  getUrlParams: function () {
      var str = window.location.href;
      str = str.substring(str.lastIndexOf("/")+1);
      if(str.indexOf("?") != -1){
        str = str.substring(0, str.lastIndexOf('?'));
      }
      return str;
  },

  /**
   * 获取页面数据
  */
  getPageData: function () {
    $.ajax({
      headers:{
        serverName: 'RealRedPacket',
        methodName: 'RedPackService.GetRedPackRecordList',
      },
      type: 'post',
      url: GWC.baseUrl,
      data: JSON.stringify({
        userid: GWC.userId,
        rp_id: GWC.rp_id,
        offset: GWC.pagenum,
        num: GWC.NUM,
        if_get_myself: true
      }),
      dataType: 'json',
      success: function (res) {
        if(res.status.code === 0){
          if(res.grab_money > 0) {
            $('.mainbox').html('\
              <div class="redpack">\
              <div class="pack">\
                <img id="red_back" src="https://oss.ririyuedu.com/redpack_z.png">\
                <div class="box_abs com_top_50"><img id="com_avatar" src="https://oss.ririyuedu.com/open_red.png"/></div>\
                <div class="box_abs com_top_125"><div id="com_name" class="company_name">'+ res.send_name +'</div></div>\
                <div class="box_abs com_top_150"><div id="com_name">给你发了一个红包</div></div>\
                <div class="box_abs com_top_235">\
                  <div id="com_title">'+ res.wishing +'</div>\
                </div>\
                <div class="box_abs com_top_357"><img id="com_open" src="https://oss.ririyuedu.com/open_red.png"/ onclick="openPack()"></div>\
              </div>\
              </div>\
            ')
          } else {
            var list = '';
            res.list.length <= GWC.NUM? GWC.hasMore = !1 : GWC.pagenum += GWC.NUM;
            for (var i = 0; i < res.list.length; i++){
              res.list[i].timestamp = _convertTime(res.list[i].timestamp);
              list += '\
                <div class="grab_user_line">\
                  <div class="g_user_desc">\
                    <img src="'+res.list[i].user.avatar_url?res.list[i].user.avatar_url:'https://oss.ririyuedu.com/open_red.png'+'" style="margin-right:15px;width:35px;height:35px;border-radius:50%;" />\
                    <div>\
                      <div class="user_name">'+ res.list[i].user.nick_name +'</div>\
                      <div class="user_time">'+ res.list[i].timestamp +'</div>\
                    </div>\
                  </div>\
                  <div class="user_money">'+ res.list[i].money +'元</div>\
                </div>\
              '
            }
            $('.mainbox').html('\
              <div class="box" style="display: none;">\
                <div style="width:100%;height: 15px;"></div>\
                <div class="box_desc">\
                  <div class="open_com_avatar"><img id="com_avatar" src="https://oss.ririyuedu.com/open_red.png"/></div>\
                  <div class="open_com_name company_name">'+ res.send_name +'</div>\
                  <div class="open_com_title">给了你一个红包</div>\
                  <div class="open_money">'+ res.grab_money +'<text style="font-size:20px;">元</text></div>\
                  <div class="open_tips">已存入零钱，可用于发红包</div>\
                  <div class="open_line"></div>\
                  <div class="open_pack_num"><text id="pack_num">'+ res.num +'个红包</text><text style="margin-left: 10px;" id="pack_all_money">共'+ res.amount +'元</text></div>\
                  <div class="grab_user_list">\
                  '+ list +'\
                  </div>\
                  <div class="more" onclick="getMore()">\
                    <div style="font-size:12px;color:#acacac;font-family:"PingFang-SC-Medium;"">查看更多</div>\
                    <img src="https://oss.ririyuedu.com/more_red.png" style="margin-left:5px;width: 12px;height:12px;"/>\
                  </div>\
                </div>\
                <div style="width:100%;height: 15px;"></div>\
              </div> \
            ')
          }
        }else {
          console.log(res.status.msg)
        }
      },
      error: function (){
        $.toast('网络不稳定，请稍后再试', 'text');
      }
    })
  },

  /**
   * 设置cookie
  */
  setCookie: function (key, val, expiresHours) {
    var cookieString = key + "=" + escape(val); 
    if(expiresHours>0){ 
    var date=new Date(); 
    date.setTime(date.getTime+expiresHours*3600*1000); 
    cookieString=cookieString+"; expires="+date.toGMTString(); 
    } 
    document.cookie=cookieString; 
  },

  /**
   * 获取cookie
  */
  getCookie: function (key) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split(";");
    for(var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split('=');
      if(key === arr[0]) return arr[1];
    }
  },

}