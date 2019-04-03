export function saveUpdate(obj, title, id) {
  let query = {
    content: JSON.stringify(obj),
    title
  }
  if (id) {
    query.id = id
  }
  return window.axios({
    url: '/PageShow/update',
    method: 'post',
    data: query
  })
}
export function getInfo(id) {
  return window.axios({
    url: '/PageShow/get/id/' + id,
    method: 'get'
  })
}
// export function page(obj) {
//   return window.axios({
//     url: '/api/thdadmin/show/list',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     },
//     params: obj,
//     method: 'post',
//     data: obj
//   });
// }

// export function delObj(id) {
//   return window.axios({
//     url: '/api/thdadmin/show/del/' + id,
//     method: 'post',
//   })
// }