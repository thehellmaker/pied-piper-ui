
<script>
export default {
  name: 'editable',
  template: '<div contenteditable="true" @blur="update"></div>',
  props: ['value'],
  mounted: function () {
    this.$el.innerText = this.value
  },
  methods: {
    update: function (event) {
      this.$emit('input', event.target.innerText.trim(), this.value.trim())
    }
  }
}
</script>
