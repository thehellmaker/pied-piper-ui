
<script>
export default {
  name: 'editable',
  template: '<div contenteditable="true" @blur="update"></div>',
  props: ['value', 'placeholder'],
  computed: {
    defaultedValue () {
      return this.value || ''
    }
  },
  mounted: function () {
    this.$el.innerText = this.defaultedValue
  },
  methods: {
    update: function (event) {
      var newValue = event.target.innerText
      var oldValue = this.value
      if (newValue !== undefined) newValue = newValue.trim()
      if (oldValue !== undefined) oldValue = oldValue.trim()
      this.$emit('input', newValue, oldValue)
    }
  },
  watch: {
    value: function (changedValue) {
      this.$el.innerText = changedValue
    }
  }
}
</script>
