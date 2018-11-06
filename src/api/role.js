import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/role/getAll',
    method: 'get'
  })
}
export function getPage(obj) {
  return request({
    url: '/role/getPage',
    method: 'post',
    data: JSON.stringify(obj)
  })
}
export function save(obj) {
  return request({
    url: '/role/save',
    method: 'post',
    data: JSON.stringify(obj)
  })
}

export function update(obj) {
  return request({
    url: '/role/update',
    method: 'post',
    data: JSON.stringify(obj)
  })
}

export function deleteById(id) {
  return request({
    url: '/role/deleteById',
    method: 'get',
    params: {
      id: id
    }
  })
}
export function getById(id) {
  return request({
    url: '/role/getById',
    method: 'get',
    params: {
      id: id
    }
  })
}

