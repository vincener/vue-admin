<template>
  <transition name="fade">
    <div v-if="showLayer">
      <div class="img-layer"/>
      <div class="img-container">
        <div class="tb">
          <div class="tr">
            <div class="td">
              <img :src="imgSrc" class="content">
            </div>
          </div>
        </div>
      </div>
      <div class="close-btn" @click="close"/>
    </div>
  </transition>
</template>

<script>
export default {
  components: {},
  props: {
    value: Boolean,
    url: String
  },
  data() {
    return {
      showLayer: this.value,
      imgSrc: this.src
    }
  },
  watch: {
    value(newValue) {
      this.showLayer = newValue
    },
    showLayer(newValue) {
      this.$emit('input', newValue)
    },
    url(newValue) {
      this.imgSrc = newValue
    }
  },
  mounted() {
  },
  methods: {
    close() {
      this.showLayer = false
    }
  }
}
</script>

<style scoped>
  .img-layer {
    position: fixed;
    top: 0px;
    left: 0px;
    background-color: #000000;
    opacity: 0.9;
    height: 100vh;
    width: 100vw;
    z-index: 990;
  }

  .img-container {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 999;
    height: 100vh;
    width: 100vw;
    text-align: center;
    overflow: auto;
    box-sizing: content-box;
  }

  .close-btn {
    font-family: 'iconfont';
    font-size: 30pt;
    background-color: #111111;
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 99999;
    color: #ffffff;
  }

  .close-btn:before {
    content: '\ebf7';
  }

  .close-btn:hover {
    background-color: #ff2222;
    cursor: pointer;
  }

  .tb {
    display: table;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .tr {
    display: table-row;
    height: 100%;
  }

  .td {
    display: table-cell;
    height: 100%;
    vertical-align: middle;
    text-align: center;
  }

  .content {
    display: inline-block;
  }
</style>
