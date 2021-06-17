var cityList = [];
// 重置输入框
function resetInput() {
  $('#oldPassword').val('');
  $('#newPassword').val('');
  $('#comfirmPassword').val('');
  $('#account').val('');
  $('#name').val('');
  $('#password').val('');
  $('#unit').val('');
  $('.city .layui-anim dd').eq(0).click();
  $('.role .layui-anim dd').eq(0).click();
}
// 公共隐藏
function commonToggle() {
  $('.userContainer').show();
  $('.userControl').hide();
  $('.nav-list-item').removeClass('nav-list-itemClick')
}
var userInfo = {

}
// 获取用户管理内容
function getUserList(current, open) {
  $ajax('/web/user/list', { 'current': current }, function (res) {
    var resData = res.data;
    $('.userMangermentBoxTableData').empty();
    for (var i = 0; i < resData.records.length; i++) {
      var indexHtml = (current - 1) * 10 + i
      indexHtml++;
      $('.userMangermentBoxTableData').append(
        '<tr>' +
        '<td>' + indexHtml + '</td>' +
        '<td title=\"' + resData.records[i].account + '\">' + resData.records[i].account + '</td>' +
        '<td title=\"' + resData.records[i].username + '\">' + resData.records[i].username + '</td>' +
        '<td>' + resData.records[i].cityName + '</td>' +
        '<td title=\"' + resData.records[i].workUnit + '\">' + resData.records[i].workUnit + '</td>' +
        '<td data-roleId=' + resData.records[i].roleId + '>' + role[resData.records[i].roleId] + '</td>' +
        '<td>' + timeStampTurnTime(resData.records[i].createTime, true) + '</td>' +
        '<td><div data-id=' + resData.records[i].account + ' class="tableIcon"><i class="user-box-icon editIcon"></i><i class="user-box-icon delIcon"></i></div></td>' +
        '</tr>'
      )
      if (localStorage.getItem('roleId') == 0) {
        $('.userMangermentBoxTableData tr').hover(function () {
          $(this).find('.tableIcon').show();
          if ($(this).find('td').eq(5).attr('data-roleId') == 0) {
            $(this).find('.tableIcon').find('.delIcon').hide();
          }
        }, function () {
          $(this).find('.tableIcon').hide();
        });
      }
      // 编辑
      $('.editIcon').unbind('click');
      $('.editIcon').click(function () {
        userInfo = {}
        var td = $(this).parent().parent().parent().find('td')
        $('.editUserBox').fadeIn();
        $('.editUserBox').find('.userPopup-title').html('编辑用户');
        $('.editUserBox').find('.comfirmBtn').html('确定修改');
        $('#account').prop('disabled', true);
        $('#account').val(td.eq(1).html());
        $('#name').val(td.eq(2).html());
        $('#password').val('');
        $('#unit').val(td.eq(4).html());
        $('.role .layui-anim dd').eq(parseFloat(td.eq(5).attr('data-roleId')) + 1).click();
        $('.city .layui-anim dd').eq(cityList.indexOf(td.eq(3).html()) + 1).click();
        if (td.eq(5).attr('data-roleId') == 0) {
          $('.role .layui-form-select').addClass('disabled');
        } else {
          $('.role .layui-form-select').removeClass('disabled');
        }
        userInfo['account'] = $('#account').val();
        userInfo['name'] = $('#name').val();
        userInfo['unit'] = $('#unit').val();
        userInfo['city'] = $('#city').val();
        userInfo['role'] = $('#role').val();

      });
    };
    // 删除
    $('.delIcon').unbind('click');
    $('.delIcon').click(function () {
      var delAccount = $(this).parent().attr('data-id');
      layui.use('layer', function () {
        layer.open({
          type: 1,
          title: '删除',
          shade: [0.2, '#000'],
          id: 'delOpen', //设定一个id，防止重复弹出,=
          btn: ['取消', '确定'],
          area: ['480px', '262px'],
          btnAlign: 'c',
          move: false,
          content: '<div class="layer-title">此操作将永久删除该用户，是否继续?</div>',
          btn1: function (index, layero) {
            layer.close(index)
          },
          btn2: function (index, layero) {
            $ajax('/web/user/delete', {
              'account': delAccount
            }, function (res) {
              toastr.success('删除成功');
              getUserList(1, true)
            })
          }
        });
      })
    });
    if (resData.pages > 1) {
      $('#userMangermentPage').show();
    } else {
      $('#userMangermentPage').hide();
    }
    if (open) {
      layui.use('laypage', function () {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
          elem: 'userMangermentPage',
          layout: ['prev', 'page', 'next', 'skip'],
          next: '<i class="layui-icon">&#xe602;</i> ',
          prev: '<i class="layui-icon">&#xe603;</i> ',
          theme: '#3850D5',
          limit: 10,
          curr: current,
          count: resData.total, //数据总数，从服务端得到
          jump: function (obj, first) {
            if (!first) {
              getUserList(obj.curr, false)
            }
          }
        });
      });
    }
  });
}
// 获取系统管理内容
function getSystemLog(current, open) {
  $ajax('/web/user/log/list', { 'current': current }, function (res) {
    var resData = res.data;
    $('.systemLogTableData').empty();
    for (var i = 0; i < resData.records.length; i++) {
      $('.systemLogTableData').append(
        '<tr>' +
        '<td>' + resData.records[i].account + '</td>' +
        '<td>' + role[resData.records[i].roleId] + '</td>' +
        '<td>' + timeStampTurnTime(resData.records[i].createTime, true) + '</td>' +
        '<td>' + resData.records[i].operation + '</td>' +
        '</tr>'
      )
    };
    if (open) {
      layui.use('laypage', function () {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
          elem: 'systemLogPage',
          layout: ['prev', 'page', 'next', 'skip'],
          next: '<i class="layui-icon">&#xe602;</i> ',
          prev: '<i class="layui-icon">&#xe603;</i> ',
          theme: '#3850D5',
          limit: 10,
          curr: current,
          count: resData.total, //数据总数，从服务端得到
          jump: function (obj, first) {
            if (!first) {
              getSystemLog(obj.curr, false)
            }
          }
        });
      });
    }

  })
}
// 获取城市
function getCity() {
  $ajax('/web/station/cityList', {}, function (res) {
    $('#city').empty();
    $('#city').append('<option value="">请选择</option>');
    for (var i = 0; i < res.data.length; i++) {
      $('#city').append('<option value=' + res.data[i].areaId + '>' + res.data[i].cityName + '</option>');
      if (res.data[i].cityName.length == 2) {
        cityList.push(res.data[i].cityName + '市')
      } else {
        cityList.push(res.data[i].cityName)
      }
    }

  })
}
// 获取预案管理
function customizeList() {
  var mechanism = {
    0: '精细化预报',
    1: '智能经验预报',
    2: '河海增水预报',
  }
  $ajax('/web/typhoon/task/customize/list', {}, function (res) {
    var resData = res.data;
    $('.resultMangermentBoxTableData').empty();
    for (var i = 0; i < resData.length; i++) {
      var calculateList = resData[i].calculateList;
      var calculateTxt = '';
      for (var j = 0; j < calculateList.length; j++) {
        calculateTxt += mechanism[calculateList[j]]
      }
      $('.resultMangermentBoxTableData').append(
        '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + resData[i].customizeTyphoonName + '</td>' +
        '<td>' + timeStampTurnTime(resData[i].startTime, true) + '</td>' +
        '<td>' + resData[i].duration + '天</td>' +
        '<td>' + calculateTxt + '</td>' +
        '<td  data-id=' + resData[i].taskId + ' class="tableIcon"><i class="user-box-icon delIcon"></i></td>' +
        '</tr>'
      );
      // 显示隐藏按钮
      if (localStorage.getItem('roleId') != 2) {
        $('.resultMangermentBoxTableData tr').hover(function () {
          $(this).find('.tableIcon').show();
        }, function () {
          $(this).find('.tableIcon').hide();
        });
      }
      // 删除
      $('.delIcon').unbind('click');
      $('.delIcon').click(function () {
        var taskId = $(this).parent().attr('data-id');
        layui.use('layer', function () {
          layer.open({
            type: 1,
            title: '删除',
            shade: [0.2, '#000'],
            id: 'delOpen', //设定一个id，防止重复弹出,=
            btn: ['取消', '确定'],
            area: ['480px', '262px'],
            btnAlign: 'c',
            move: false,
            content: '<div class="layer-title">是否删除此自定义台风?</div>',
            btn1: function (index, layero) {
              layer.close(index)
            },
            btn2: function (index, layero) {
              $ajax('/web/typhoon/task/customize/delete', {
                'taskId': taskId
              }, function (res) {
                toastr.success('删除成功');
                customizeList();
              })
            }
          });
        })
      });
    };
  })
}
$(function () {
  getCity();// 获取城市
  // 点击用户出现下来菜单
  $('.nav-useManage').click(function (e) {
    e.stopPropagation();//阻止事件冒泡
    $('.userControl').toggle();
  });
  document.onclick = function () {
    $('.userControl').hide();
    // $('.typhone_info').hide();

  }
  // 用户管理
  $('#userMangerment').click(function () {
    getUserList(1, true);
    commonToggle()
    $('#userMangermentBox').show().siblings().hide();
  });
  // 系统管理
  $('#systemLog').click(function () {
    commonToggle()
    $('#systemLogBox').show().siblings().hide();
    getSystemLog(1, true);
  });
  // 预报结果管理
  $('#resultMangerment').click(function () {
    commonToggle();
    $('#resultMangermentBox').show().siblings().hide();
    customizeList()
  });

  // 退出登录
  $('#loginOut').click(function () {
    layui.use('layer', function () {
      layer.open({
        type: 1,
        title: '提示',
        shade: [0.2, '#000'],
        id: 'loginOutOpen', //设定一个id，防止重复弹出,=
        btn: ['取消', '确定'],
        area: ['480px', '262px'],
        btnAlign: 'c',
        move: false,
        content: '<div class="layer-title">是否退出登录?</div>',
        btn1: function (index, layero) {
          layer.close(index)
        },
        btn2: function (index, layero) {
          $ajax('/web/user/logout', {}, function (res) {
            window.location.href = '../login.html';
            localStorage.clear();
          })
        }
      });
    })

  });
  // 删除
  $('.delIcon').unbind('click');
  $('.delIcon').click(function () {
    layui.use('layer', function () {
      layer.open({
        type: 1,
        title: '删除',
        shade: [0.2, '#000'],
        id: 'delOpen', //设定一个id，防止重复弹出,=
        btn: ['取消', '确定'],
        area: ['480px', '262px'],
        btnAlign: 'c',
        move: false,
        content: '<div class="layer-title">是否删除此数据?</div>',
        btn1: function (index, layero) {
          layer.close(index)
        },
        btn2: function (index, layero) {

        }
      });
    })
  });
  // 隐藏弹窗
  $('.cancelBtn').click(function () {
    $('.user-mask').fadeOut();
  });
  $('.userPopupClose').click(function () {
    $('.user-mask').fadeOut();
  });
  // 修改密码操作
  $('#editPassword').click(function () {
    $('.editPasswordBox').show();
    $('.userControl').hide();
  });
  // 修改密码
  $('.editPasswordBox .comfirmBtn').click(function () {
    var oldPassword = $('#oldPassword').val();
    var newPassword = $('#newPassword').val();
    var comfirmPassword = $('#comfirmPassword').val();
    if (!oldPassword) {
      toastr.error('旧密码不能为空');
      return
    }
    if (!newPassword) {
      toastr.error('新密码不能为空');
      return
    }
    if (!comfirmPassword) {
      toastr.error('确认密码不能为空');
      return
    }
    if (newPassword != comfirmPassword) {
      toastr.error('新密码与确认密码不一致');
      return
    }
    $ajax('/web/user/password/update', {
      'oldPassword': hex_md5(oldPassword),
      'newPassword': hex_md5(newPassword)
    }, function (res) {
      toastr.success('修改成功');
      $('.editPasswordBox').fadeOut();
      window.location.href = '../login.html'
      localStorage.clear();
    })
  });
  // 添加/修改
  $('.editUserBox .comfirmBtn').click(function () {
    var account = $('#account').val();
    var name = $('#name').val();
    var unit = $('#unit').val();
    var city = $('#city').val();
    var role = $('#role').val();
    var password = $('#password').val();
    var editType = $('.editUserBox').find('.userPopup-title').html();
    var url = '', msgText = '';
    var parmars = {
      'account': account,
      'password': hex_md5(password),
      'username': name,
      'areaId': city,
      'workUnit': unit,
      'roleId': role,
    }

    if (!account) {
      toastr.error('请输入账号');
      return
    }
    if (!name) {
      toastr.error('请输入姓名');
      return
    }
    if (!city) {
      toastr.error('请选择行政区');
      return
    }
    if (!unit) {
      toastr.error('请输入工作单位');
      return
    }
    if (editType == '添加用户') {
      url = '/web/user/add';
      msgText = '添加成功';
      if (!password) {
        toastr.error('请输入密码');
        return
      }
      if (password.length < 6) {
        toastr.error('密码至少输入6位');
        return
      }
    } else {
      url = '/web/user/update?debug=true';
      msgText = '修改成功';
      if (!password) {
        delete parmars['password']
      }
    }
    if (!role) {
      toastr.error('请选择角色权限');
      return
    }
    if (name === userInfo.name) {
      delete parmars['username']
    }
    if (unit === userInfo.unit) {
      delete parmars['workUnit']
    }
    if (city === userInfo.city) {
      delete parmars['areaId']
    }
    if (role === userInfo.role) {
      delete parmars['roleId']
    }
    var objLen = Object.keys(parmars);
 
    if (objLen.length === 1) {
      $('.user-mask').fadeOut();
      return
    }
    $ajax(url, parmars, function (res) {
      toastr.success(msgText);
      $('.user-mask').fadeOut();
      getUserList(1, true);
    })
  });
  // 打开添加用户窗口
  $('.addUser').click(function () {
    $('.editUserBox').fadeIn();
    resetInput();
    $('.editUserBox').find('.userPopup-title').html('添加用户');
    $('.editUserBox').find('.comfirmBtn').html('确定添加');
    $('#account').attr('disabled', false);
  });
  // 密码监听不能输入空格
  $('.passwordInput').each(function () {
    $(this).bind('input propertychange', function () {
      $(this).val($(this).val().replace(/\s*/g, ""))
    })
  });

})