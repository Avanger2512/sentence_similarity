<template>
  <div class="similar-sentence">
    <div class="similar-sentence__text">{{ info.sentence }}</div>
    <div class="similar-sentence__persent">
      Similarity - {{ (info.similarity * 100).toFixed(2) }}%
    </div>
    <button
      type="button"
      @click="getSimilarSentences(info.text_id)">
      Show full text
    </button>
  </div>
</template>

<script>
export default {
  name: 'BaseSimilarSentence',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  methods: {
    getSimilarSentences (id) {
      this.$emit('click', id)
    }
  }
}
</script>

<style lang="scss">
.similar-sentence {
  margin-bottom: 10px;
  padding: 10px 20px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, .15);

  &__text {
    margin-bottom: 5px;
    font-weight: 400;
  }

  &__persent {
    margin-bottom: 10px;
  }
}
</style>
