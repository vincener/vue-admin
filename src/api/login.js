import request from '@/utils/request'

export function login(username, password, identifyCode) {
  return request({
    url: '/user/loginCode',
    method: 'post',
    data: JSON.stringify({
      loginName: username,
      password: password,
      identifyCode: identifyCode
    })
  })
}
export function getCurrentUser() {
  return request({
    url: '/user/getCurrentUser',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
