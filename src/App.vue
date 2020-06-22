<template>
  <div id="app">

    <div class="container">
      <section v-if="textId.length === 0">
        <h1 class="h1">Sentence Similarity</h1>

        <form
          @submit.prevent="submitText"
          class="form">
          <fieldset :disabled="isDisabledForm">
            <div :class="[{'is-error': textareaHasError}, 'textarea form__item']">
              <textarea
                v-model="enteredText"
                placeholder="Enter text"
                @focus="textareaHasError = false" />
              <span class="textarea__validation">Please, enter text</span>
            </div>
            <base-button class="form__item button_primary">
              {{ isDisabledForm ? 'Loading...' : 'Set new text'}}
            </base-button>
          </fieldset>
        </form>

        <div class="wrapper">
          <ul
            v-if="!loading"
            class="list">
            <li
              v-for="(item, index) in info"
              :key="index"
              class="list__item">
              {{ item }}
            </li>
          </ul>

          <the-loading v-else />
        </div>
      </section>

      <section
        v-else
        class="section">

        <base-button
          type="button"
          class="button_primary section__item"
          @click="back()">
          <span>&larr; </span>
          <span>Go back</span>
        </base-button>

        <h2>The list of sentences</h2>

        <ul
          v-if="sentences.length > 0"
          class="list">
          <li
            v-for="(sentence, index) in sentences"
            :key="index"
            class="list__item">

            <base-sentence
              :sentence="sentence"
              @click="getSimilarText(sentence.sentence_id)" />

            <template v-if="sentence.sentence === clickedSentence">
              <ul v-if="similar.length > 0">
                <li
                  v-for="(item, index) in similar"
                  :key="index">

                  <base-similar-sentence
                    :info="item"
                    @click="getTextById"/>
                </li>
              </ul>
              <span v-else>No similarity found(</span>
            </template>
          </li>
        </ul>

        <the-loading v-else/>

      </section>
    </div>
  </div>
</template>

<script>
import { HTTP } from './axios-presets'
import BaseSentence from '@/components/Base/BaseSentence'
import BaseSimilarSentence from '@/components/Base/BaseSimilarSentence'
import BaseButton from '@/components/Base/BaseButton'
import TheLoading from '@/components/TheLoading'

const unique = (arr) => [...new Set(arr)]

export default {
  name: 'App',
  components: {
    BaseSentence,
    BaseSimilarSentence,
    BaseButton,
    TheLoading
  },
  mounted () {
    this.getAllText()
  },
  data () {
    return {
      info: {},
      enteredText: '',
      textId: '',
      isDisabledForm: false,
      sentences: [],
      loading: false,
      textareaHasError: false,
      similarTextId: '',
      similar: [],
      similarLength: false,
      clickedSentence: ''
    }
  },
  methods: {
    getAllText () {
      this.loading = true

      HTTP
        .get('/text')
        .then(response => {
          const data = response.data.texts
          const previewOnly = data.map(item => item.preview)

          this.info = unique(previewOnly)
          this.loading = false
        })
        .catch(error => (console.log(error)))
    },
    submitText () {
      if (!this.enteredText) {
        this.textareaHasError = true
        return false
      }

      this.isDisabledForm = true

      const str = JSON.stringify({
        text: this.enteredText
      })

      HTTP
        .post('/text', str)
        .then(response => {
          this.textId = response.data.id
          this.isDisabledForm = false
          this.getTextById(this.textId)
        })
        .catch(error => (console.log(error)))
    },
    getTextById (id) {
      this.clickedSentence = ''
      this.sentences = []

      HTTP
        .get(`/text/${id}`)
        .then(response => {
          this.similarTextId = response.data.id
          this.sentences = response.data.sentences
        })
        .catch(error => (console.log(error)))
    },
    getSimilarText (payload) {
      HTTP
        .get(`/text/${this.similarTextId}/${payload}/similar`)
        .then(response => {
          const arr = response.data.similar_sentences
          this.clickedSentence = response.data.sentence

          if (arr.length === 0) {
            this.similarLength = true
          } else {
            this.similar = arr.sort((a, b) => b.similarity - a.similarity)
          }
        })
        .catch(error => (console.log(error)))
    },
    back () {
      this.textId = this.enteredText = ''
      this.getAllText()
      this.isDisabledForm = false
    }
  }
}
</script>

<style lang="scss">
@import './assets/style/reset.css';

body {
  position: relative;
  background: #efefef;
  font-size: 16px;
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-weight: 300;
  line-height: 1.4;
  min-width: 320px;
}

.container {
  position: relative;
  max-width: 1200px;
  margin: 0 15px;
}

.wrapper {
  position: relative;
}

.section {
  margin: 20px 0;

  &__item {
    margin-bottom: 20px;
  }
}

h1, h2 {
  font-weight: 400;
  margin-bottom: 20px;
}

h1 {
  font-size: 25px;
}

h1 {
  font-size: 20px;
}

.list {
  &__item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}

.form {
  margin-bottom: 20px;

  &__item {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
}

.textarea {
  $this: &;
  position: relative;
  max-width: 550px;
  width: 100%;

  @media screen and (max-width: 767px) {
    max-width: 250px;
  }

  textarea {
    -moz-appearance: none;
    resize: none;
    overflow: auto;
    padding: 5px 10px;
    width: 100%;
    min-height: 100px;
    font-size: 14px;
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    font-weight: 300;
    border-radius: 8px;

    &::placeholder {
      font-size: 12px;
      color: rgba(0,0,0, .6);
      letter-spacing: .3px;
    }
  }

  &__validation {
    opacity: 0;
    position: absolute;
    left: 0;
    bottom: -10px;
    font-size: 12px;
    color: rgb(202, 60, 60);
    transition: opacity .15s ease;
  }

  &.is-error {
    textarea {
      border-color: rgb(202, 60, 60);
    }

    #{$this}__validation {
      opacity: 1;
    }
  }
}

</style>
