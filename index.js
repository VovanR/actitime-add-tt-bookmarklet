(function() {

  class Editor {
    constructor() {
      /**
       * @type {HTMLDialogElement}
       */
      this._dialog = null
      /**
       * @type {HTMLFormElement}
       */
      this._form = null

      this._initialize()
    }

    _initialize() {
      const template = `
<dialog style="width: 200px; padding: 15px; background: white; border: none; border-radius: 4px; box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.2)">
  <form action="" style="display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 10px">
    <output name="previousTime" for="time"></output> → <output name="nextTime" for="time"></output>
    <input
      name="time"
      placeholder="0:00"
      autofocus="autofocus"
      required="required"
      pattern="[0-2]?[0-9]:[0-5][0-9]"
      style="text-align: right; width: 100%"
    >
    <label title="Available soon"><input type="checkbox" name="editMode" disabled> Edit</label>
    <button>Save</button>
    <button type="reset">Cancel</button>
  </form>
</dialog>
`
      const element = document.createElement('div')
      element.innerHTML = template

      this._dialog = element.querySelector('dialog')
      this._form = element.querySelector('form')

      this._form.addEventListener('reset', () => {
        this.close()
      })

      document.body.appendChild(element)
    }

    /**
     * @param {HTMLInputElement} inputElement
     */
    open(inputElement) {
      this._dialog.showModal()
      const previousValue = inputElement.value || '0:00'
      this._form.previousTime.value = previousValue
      this._form.nextTime.value = previousValue

      const submitHandler = event => {
        event.preventDefault()
        const addedMinutes = this._valueToMinutes(this._form.time.value)
        const previousMinutes = this._valueToMinutes(previousValue)
        const resultMinutes = previousMinutes + addedMinutes
        inputElement.value = this._minutesToValue(resultMinutes)
        inputElement.dispatchEvent(new Event('change'))
        this.close()
      }

      const inputHandler = event => {
        if (event.target === this._form.time) {
          if (this._form.time.validity.valid) {
            let nextTimeValue = previousValue
            const value = this._form.time.value
            if (this._form.editMode.checked) {
              this._form.nextTime.value = value
            } else {
              this._form.nextTime.value = this._addValues(previousValue, value)
            }
          } else {
            this._form.nextTime.value = previousValue
          }
        }
      }

      this._form.addEventListener('submit', submitHandler)
      this._form.addEventListener('input', inputHandler)

      this._dialog.addEventListener('close', () => {
        this._form.removeEventListener('submit', submitHandler)
        this._form.removeEventListener('input', inputHandler)
        this._reset()
      }, {once: true})
    }

    close() {
      this._dialog.close()
    }

    _reset() {
      this._form.reset()
    }

    /**
     * @param {string} value
     * @return {number}
     */
    _valueToMinutes(value) {
      if (!value) {
        return 0
      }

      const [hours, minutes] = value.split(':')

      return parseInt(hours, 10) * 60 + parseInt(minutes, 10)
    }

    /**
     * @param {number} minutes
     * @return {string}
     */
    _minutesToValue(minutes) {
      const resultMinutes = minutes % 60
      const total = minutes - resultMinutes
      const hours = (minutes - resultMinutes) / 60

      return `${hours}:${resultMinutes > 9 ? resultMinutes : `0${resultMinutes}`}`
    }

    /**
     * @param {string} value1
     * @param {string} value2
     * @return {string}
     */
    _addValues(value1, value2) {
      return this._minutesToValue(this._valueToMinutes(value1) + this._valueToMinutes(value2))
    }
  }

  const tableElement = document.getElementById('actualTTRows')

  const editor = new Editor()

  tableElement.addEventListener('click', event => {
    if (event.target.classList.contains('inputTT')) {
      editor.open(event.target)
    }
  })

})();
