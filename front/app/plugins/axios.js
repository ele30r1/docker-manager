export default function (context) {
  context.$axios.onError((error) => {
    try {
      if (error.response.status === 401) {
        context.app.$toast.error('Authorization Failed')
      } else if (error.response.status === 403) {
        context.app.$toast.error('Authentication Failed')
      } else if (error.response.status === 422) {
        // context.app.$toast.error('اطلاعات نامعتبر است.')
        if (error.response.data.errors) {
          Object.values(error.response.data.errors).forEach((message) =>
            context.app.$toast.error(message)
          )
        }
      } else if (error.response.status === 500) {
        context.app.$toast.error('Server Error')
      }
    } catch (e) {
      console.error(error)
    }
  })
}
