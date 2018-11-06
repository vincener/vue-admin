import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/caorg/getAll',
    method: 'get'
  })
}
export function getPage(obj) {
  return request({
    url: '/caorg/getPage',
    method: 'post',
    data: JSON.stringify(obj)
  })
}
export function save(obj) {
  return request({
    url: '/caorg/save',
    method: 'post',
    data: JSON.stringify(obj)
  })
}

export function update(obj) {
  return request({
    url: '/caorg/update',
    method: 'post',
    data: JSON.stringify(obj)
  })
}

export function deleteById(id) {
  return request({
    url: '/caorg/deleteById',
    method: 'get',
    params: {
      id: id
    }
  })
}
export function getById(id) {
  return request({
    url: '/caorg/getById',
    method: 'get',
    params: {
      id: id
    }
  })
}

