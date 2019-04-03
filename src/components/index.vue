<template>
  <div @keyup.ctrl.90="undo" tabindex="0" class="app-container calendar-list-container page-show-wrap">
    <div class="col col-2 v-flex">
      <div class="page-view">
        <div class="page-scren" :style="pageStyleObj">
          <div v-for="(item, i) in domList"
            :key="i"
            :class="['animated', 'dom-item', item.ani, domIndex == i ? 'hightlight': '']"
            :style="item.styleObj"
            @mousedown="listenMove"
          >
            <img v-if="item.isImg"
              draggable="false"
              :src="item.content" />
            <div
              v-else
              v-html="item.content" />
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <el-button @click="isShowPageSet = true">页面设置</el-button>
        <el-dialog title="页面设置" :visible.sync="isShowPageSet">
          <el-form :model="shareConfig">
            <el-form-item label="页面标题">
              <el-input v-model="title" placeholder="请输入页面标题"></el-input>
            </el-form-item>
            <el-form-item label="分享设置">
              <el-input v-model="shareConfig.title" placeholder="请输入分享标题"></el-input>
              <el-input v-model="shareConfig.desc" placeholder="请输入分享描述"></el-input>
              <img-upload type="pageShowManager" @success="uploadShare" class="v-middle">
                <img v-if="shareConfig.imgUrl" :src="shareConfig.imgUrl" class="avatar">
                <el-button v-else type="primary">分享图标<i class="el-icon-upload el-icon--right"></i></el-button>
              </img-upload>
            </el-form-item>
          </el-form>
        </el-dialog>
        <img-upload type="pageShowManager" @success="uploadMusic" class="v-middle">
          <el-button type="primary">添加音乐<i class="el-icon-upload el-icon--right"></i></el-button>
        </img-upload>
        <el-button-group>
          <el-button type="primary" @click="$message('开发中')">预览</el-button>
          <el-button type="success" @click="saveUpdate">保存</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="col v-flex">
      <div>
        <div class="page-tools">
          页面管理
          <el-button size="small" type="primary" @click="addPage">
            <i class="el-icon-plus"></i> 新增页面
          </el-button>
          <el-button size="small" type="primary" @click="copyPage">
            <i class="el-icon-plus"></i> 复制页面
          </el-button>
        </div>
        <div class="page-list">
          <div class="page-item" v-for="(item, i) in slideList" :key="i">
            <el-button-group>
              <el-button @click="clickPageItem(i)" :type="i == pageIndex ? 'success' : ''">第{{i+1}}页</el-button>
              <el-button :disabled="i == 0" @click="pageSwap(i, 1)" type="primary"><i class="el-icon-caret-top"></i></el-button>
              <el-button :disabled="i == slideList.length - 1" @click="pageSwap(i, -1)" type="primary"><i class="el-icon-caret-bottom"></i></el-button>
              <el-button @click="deletePageItem(i)" type="danger"><i class="el-icon-delete"></i></el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      <div>
        <el-form :model="pageStyleObj">
          <el-form-item label="背景">
            <el-color-picker class="v-middle" v-model="pageStyleObj.backgroundColor"></el-color-picker>
            <img-upload type="pageShowManager" @success="handleUploadPageBack" class="v-middle">
              <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </img-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="col v-flex">
      <div>
        <div class="page-tools">
          元素管理
          <el-button-group>
            <el-button size="small" type="primary" @click="addText">
              <i class="el-icon-plus"></i> 新增文字
            </el-button>
            <img-upload type="pageShowManager" @success="addImg" class="v-middle">
              <el-button type="primary" size="small"><i class="el-icon-picture"></i> 新增图片</el-button>
            </img-upload>
          </el-button-group>
        </div>
        <div class="page-list">
          <div class="page-item" v-for="(item, i) in domList" :key="i">
            <el-button-group>
              <el-button @click="clickDomItem(i)" :type="i == domIndex ? 'success' : ''">{{item.isImg ? '图片' : item.content}}</el-button>
              <el-button @click="deleteDomItem(i)" type="danger"><i class="el-icon-delete"></i></el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      <div class="style-list" v-if="domIndex > -1">
        <el-form :inline="true" :model="domList[domIndex]">
          <el-form-item label="内容">
            <el-input style="width: 100%" v-model="domList[domIndex].content"></el-input>
          </el-form-item>
          <el-form-item :label="key"
            v-for="(item, key) in domList[domIndex].styleObj"
            :key="key">
            <el-input v-model="domList[domIndex].styleObj[key]"></el-input>
          </el-form-item>
          <el-form-item label="更多预设样式设置开发中"></el-form-item>
          <el-form-item label="动画">
            <el-select v-model="domList[domIndex].ani" placeholder="请选择">
              <el-option
                v-for="item in aniList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义样式">
            <!-- <el-input placeholder="样式名" v-model="newStyle" @keyup.native.enter="addStyle"></el-input> -->
            <el-select v-model="newStyle"
              allow-create
              filterable
              placeholder="请选择样式">
              <el-option
                v-for="item in styleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <el-button @click="addStyle">增加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {saveUpdate, getInfo} from '../fetch'
import ImgUpload from './imgUpload'
import aniList from './ani-list'
import styleList from './style-list'
import './animate.min.css'
export default {
  components: {
    ImgUpload
  },
  data() {
    return {
      newStyle: '',
      pageIndex: 0,
      domIndex: -1,
      slideList: [
        {}
      ],
      pageStyleObj: {
        backgroundColor: '',
        backgroundImage: ''
      },
      domList: [],
      aniList: aniList,
      styleList: styleList,
      id: this.$route.query.id || 0,
      bgm: '',
      title: '',
      shareConfig: {},
      isShowPageSet: false
    }
  },
  watch: {
    pageIndex(newVal, oldVal) {
      if (oldVal < this.slideList.length) {
        this.slideList[oldVal].styleObj = this.pageStyleObj
        this.slideList[oldVal].domList = this.domList
      }
      this.pageStyleObj = this.slideList[newVal].styleObj || {
        backgroundColor: '',
        backgroundImage: ''
      }
      this.domList = this.slideList[newVal].domList || []
      this.domIndex = this.slideList[newVal].domList.length > 0 ? 0 : -1
    }
  },
  mounted() {
    if (this.id) {
      getInfo(this.id)
      .then(res => {
        if (res.errorCode) {
          this.$notify.error({
            title: '失败',
            message: '查询失败，请检查',
            duration: 2000
          })
        } else {
          this.title = res.data.title
          res = JSON.parse(res.data.content)
          this.slideList = res.slideList
          this.bgm = res.bgm
          this.shareConfig = res.shareConfig
          this.pageStyleObj = this.slideList[0].styleObj || {
            backgroundColor: '',
            backgroundImage: ''
          }
          this.domList = this.slideList[0].domList || []
          this.domIndex = this.slideList[0].domList.length > 0 ? 0 : -1
        }
      })
    }
  },
  methods: {
    undo() {
      // console.log('undo')
    },
    listenMove(e) {
      let s = e
      let top = parseInt(this.domList[this.domIndex].styleObj.top)
      let left = parseInt(this.domList[this.domIndex].styleObj.left)
      document.onmousemove = (e) => {
        this.domList[this.domIndex].styleObj.top = (top + e.clientY - s.clientY) + 'px'
        this.domList[this.domIndex].styleObj.left = (left + e.clientX - s.clientX) + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    pageSwap(i, d) {
      if (this.pageIndex == i || this.pageIndex == i - d) {
        let ci = this.pageIndex == i ? i-d : i
        this.slideList[this.pageIndex].styleObj = this.pageStyleObj
        this.slideList[this.pageIndex].domList = this.domList
        this.pageStyleObj = this.slideList[ci].styleObj
        this.domList = this.slideList[ci].domList
      }
      let tmp = JSON.stringify(this.slideList.splice(i, 1)[0])
      this.slideList.splice(i - d, 0, JSON.parse(tmp))
    },
    addStyle() {
      if (this.newStyle) {
        this.$set(this.domList[this.domIndex].styleObj, this.newStyle, '')
      } else {
        this.$message('请先选择')
      }
    },
    saveUpdate() {
      this.slideList[this.pageIndex].styleObj = this.pageStyleObj
      this.slideList[this.pageIndex].domList = this.domList
      saveUpdate({
          slideList: this.slideList,
          bgm: this.bgm,
          shareConfig: this.shareConfig
        },
        this.title,
        this.id)
      .then(res => {
        if(res.rel) {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
          this.id || (res.url ? this.$router.push(res.url) : this.$router.back())
        } else {
            this.$notify.error({
            title: '失败',
            message: '保存失败，请检查',
            duration: 2000
          });
        }
      })
    },
    addPage() {
      this.slideList.push({domList: []})
      this.pageIndex ++
    },
    copyPage() {
      this.slideList[this.pageIndex].styleObj = this.pageStyleObj
      this.slideList[this.pageIndex].domList = this.domList
      this.slideList.push(JSON.parse(JSON.stringify(this.slideList[this.pageIndex])))
      this.pageIndex ++
    },
    clickPageItem(i) {
      this.pageIndex = i
    },
    deletePageItem(i) {
      if (this.slideList.length == 1) {
        this.$message('至少需要一个页面')
        return false
      }
      this.slideList.splice(i, 1)
      if (this.pageIndex == this.slideList.length) {
        this.pageIndex --
      }
    },
    clickDomItem(i) {
      this.domIndex = i
    },
    deleteDomItem(i) {
      this.domList.splice(i, 1)
      if (this.domIndex == this.domList.length) {
        this.domIndex --
      }
    },
    addText(e, isImg = false, content = '输入文字') {
      this.domList.push({
        isImg,
        content,
        styleObj: {
          top: 0,
          left: 0,
          width: '',
          animationDelay: ''
        },
        ani: ''
      })
      this.domIndex = this.domList.length - 1
    },
    uploadShare(url) {
      this.shareConfig.imgUrl = url
    },
    uploadMusic(url) {
      this.bgm = url
    },
    addImg(url) {
      this.addText(null, true, url)
    },
    handleUploadPageBack(url) {
      this.pageStyleObj.backgroundImage = `url(${url})`
    }
  }
}
</script>
<style>
.style-list .el-select .el-input{
  width: auto;
}
.style-list .el-input{
  width: 40%;
}
.page-show-wrap {
  display: flex;
  height: calc(100vh - 50px);
}
.col {
  flex: 1;
}
.col-2 {
  flex: 2;
}
.page-view{
  background: url('./img/phone-shell.png');
  background-size: 100% 100%;
  width: 385px;
  height: 761px;
  position: relative;
  margin: 0 auto;
}
.page-tools{
  margin-bottom: 1em;
}
.page-item{
  margin: .8em 0;
}
.avatar{
  width: 125px;
  height: 125px;
}
.v-flex{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.page-scren{
  /* width: 318px;
  height: 480px; */
  width: 375px;
  height: 603px;
  top: 114px;
  position: absolute;
  left: 5px;
  background: #fff;
  background-size: cover;
}
.dom-item{
  position: absolute;
  user-select: none;
}
.dom-item img{
  max-width: 100%;
}
.hightlight{
  outline: #f00 dotted;
}
.v-middle{
  display: inline-block;
  vertical-align: middle;
}
.el-button {
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
