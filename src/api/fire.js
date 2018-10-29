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
export function save(obj) {
  return request({
    url: '/fireHydrant/save',
    method: 'post',
    data: JSON.stringify(obj)
  })
}

export function update(obj) {
  return request({
    url: '/fireHydrant/update',
    method: 'post',
    data: JSON.stringify(obj)
  })
}

export function deleteById(id) {
  return request({
    url: '/fireHydrant/deleteById',
    method: 'get',
    params: {
      id: id
    }
  })
}
export function getById(id) {
  return request({
    url: '/fireHydrant/getById',
    method: 'get',
    params: {
      id: id
    }
  })
}

