import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/fireHydrant/getAll',
    method: 'get'
  })
}
export function getPage(obj) {
  return request({
    url: '/fireHydrant/getPage',
    method: 'post',
    data: JSON.stringify(obj)
  })
}
