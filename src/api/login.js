import request from "@/utils/request";
// 登陆接口
export function login(data) {
  return request({
    url: "/hxindex/Login/login",
    method: "POST",
    data
  });
}
// 退出登录接口
export function logout() {
  return request({
    url: "/hxindex/Login/loginout",
    method: "POST",
  });
}
// 忘记密码修改密码接口
export function userForgetPwd(data) {
  return request({
    url: "/hxindex/Login/modpwd",
    method: "POST",
    data
  });
}
// 忘记密码修改密码获取验证码接口
export function userGetCode(data) {
  return request({
    url: "/hxindex/Login/getcode",
    method: "POST",
    data
  });
}



