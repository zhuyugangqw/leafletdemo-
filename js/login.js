$(function () {
  $('.login-btn').click(function () {
    var account = $('#account').val();
    var password = $('#password').val();
    if (!account) {
      toastr.error('账号不能为空');
      return
    }
    if (!password) {
      toastr.error('密码不能为空');
      return
    }
    $ajax('/web/user/login', {
      'account': account,
      'password': hex_md5(password)
    }, function (res) {
      var resData = res.data;
      localStorage.setItem('token', resData.token);
      localStorage.setItem('username', resData.username);
      localStorage.setItem('roleId', resData.roleId);
      localStorage.setItem('id', resData.id);
      localStorage.setItem('cityName', resData.cityName);
      localStorage.setItem('areaId', resData.areaId);
      localStorage.setItem('account', resData.account);
      window.location.href = '../index.html';
    
    })
  });
  $(document).keydown(function (event) {
    if (event.keyCode == 13) {
      $('.login-btn').click()
    }
  });
  if (localStorage.getItem('token')) {
    window.location.href = '../index.html'
  }
})