export const basicColor = {
  blue: '#42a5f5', // blue lighten-1
  green: '#69f0ae', // green accent-2
  orange: '#ffc107', // orange
  red: '#e53935', // red darken-1
}
export const production = false
let preposition = ''
let address = ''

if (production) {
  // beget
  preposition = 'https:'
  address = '//splinterblog.ru'
} else {
  // local
  preposition = 'http:'
  address = '//localhost:5000'
}

export const basicUrl = {
  urlSocket: `${preposition}${address}`,
  urlBack: `${preposition}${address}/`,
  urlAuth: `${preposition}${address}/api/auth`,
  urlUser: `${preposition}${address}/api/user`,
  urlCategory: `${preposition}${address}/api/category`,
  urlPost: `${preposition}${address}/api/post`,
  urlPostFiles: `${preposition}${address}/api/file/downloadPostImage`,
  urlUserFiles: `${preposition}${address}/api/file/downloadUserAvatar`,
  urlComment: `${preposition}${address}/api/comment`,
  urlFile: `${preposition}${address}/api/file`,
  urlFilePlug: `${preposition}${address}/api/file/plug/downloadImage`,
  // urlFileNew: `${preposition}${address}/api/file/new/downloadImage`,
  urlDownload: `${preposition}${address}/api/file/download`,
  urlAdmin: `${preposition}${address}/api/admin`,
  urlAdminCategory: `${preposition}${address}/api/admin/category`,
  urlAdminPost: `${preposition}${address}/api/admin/post`,
  urlAdminComment: `${preposition}${address}/api/admin/comment`,
  urlAdminFile: `${preposition}${address}/api/admin/file`,
  urlAdminRole: 'admin',
  urlAdminUser: `${preposition}${address}/api/admin/user`,
  urlAdminLog: `${preposition}${address}/api/admin/log`,
}
