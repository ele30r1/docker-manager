import vue from 'vue'

function truncateString(str, maxLength = 20) {
  if (str.length <= maxLength) return str

  return `${str.slice(0, maxLength)}...`
}

vue.filter('truncate', truncateString)
