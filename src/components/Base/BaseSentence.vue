<template>
  <div class="sentence">
    <base-button
      class="button_pure"
      type="button"
      @click="getSentenceClick(sentence.sentence_id)">{{ sentence.sentence }}</base-button>
  </div>
</template>

<script>
import BaseButton from '@/components/Base/BaseButton'

export default {
  name: 'BaseSentence',
  props: {
    sentence: {
      type: Object,
      required: true
    }
  },
  components: {
    BaseButton
  },
  methods: {
    getSentenceClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">

</style>
