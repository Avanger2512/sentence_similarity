<template>
  <button
    @click="callback($event)"
    class="button">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  methods: {
    callback (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
.button {
  display: inline-block;
  vertical-align: middle;
  border: none;
  font-size: 14px;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  transition: opacity .15s ease;
  text-align: center;

  &:hover {
    cursor: pointer;
    opacity: .8;
  }

  & > span {
    vertical-align: middle;
    display: inline-block;
    padding: 0 5px;
  }

  &_primary {
    background: rgb(66, 184, 221);
  }

  &_pure {
    background: rgba(0, 0 ,0, .15);
    color: #000;
    text-align: left;
  }
}
</style>
