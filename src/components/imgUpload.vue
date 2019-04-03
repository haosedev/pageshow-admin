<template>
  <div>
    <el-upload
      action
      :before-upload="beforeUpload"
      :show-file-list="false">
        <slot></slot>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: ['type'],
  methods: {
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('imageName', file)
      window.axios({
        url: '/PageShow/uploadFile',
        method: 'post',
        data: fd,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        let types, titles
        types = (response.status === 200) ? 'success' : 'error'
        titles = (response.status === 200) ? 'success' : 'error'
        this.$notify({
          title: titles,
          message: response.message,
          type: types,
          duration: 4000
        })
        if (response.status === 200) {
          this.$emit('success', response.data.url)
        }
      })
    }
  }
}
</script>
