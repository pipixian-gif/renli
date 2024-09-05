import request from '@/utils/request'

export function getEmployeeList (params) {
    return request({
      url: '/sys/user',
      params
    })
  }

  export function delEmployee (id) {
    return request({
      method: 'delete',
      url: `/sys/user/${id}`
      
    })
  }

  export function addEmployee (data) {
    return request({
      method: 'post',
      url: '/sys/user',
      data
    })
  }

  export function getEmployeeDetail (id) {
    return request({
      url: `/sys/user/${id}`
      
    })
  }

  export function updateEmployee (data) {
    return request({
      url: `/sys/user/${data.id}`,
      method: 'put',
      data
      
    })
  }