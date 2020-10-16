class Editor {
  /**
   * @type {HTMLDialogElement}
   */
  #dialog
  /**
   * @type {HTMLFormElement}
   */
  #form

  constructor() {
    this.#initialize()
  }

  #initialize() {
    const template = `
<dialog style="width: 200px; padding: 15px; background: white; border: none; border-radius: 4px; box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.2);">
  <form action="" style="display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 10px;">
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

    this.#dialog = element.querySelector('dialog')
    this.#form = element.querySelector('form')

    this.#form.addEventListener('reset', () => {
      this.close()
    })

    document.body.appendChild(element)
  }

  /**
   * @param {HTMLInputElement} inputElement
   */
  open(inputElement) {
    this.#dialog.showModal()
    const previousValue = inputElement.value || '0:00'
    this.#form.previousTime.value = previousValue
    this.#form.nextTime.value = previousValue

    const submitHandler = event => {
      event.preventDefault()
      const addedMinutes = this.#valueToMinutes(this.#form.time.value)
      const previousMinutes = this.#valueToMinutes(previousValue)
      const resultMinutes = previousMinutes + addedMinutes
      inputElement.value = this.#minutesToValue(resultMinutes)
      inputElement.dispatchEvent(new Event('change'))
      this.close()
    }

    const inputHandler = event => {
      if (event.target === this.#form.time) {
        if (this.#form.time.validity.valid) {
          let nextTimeValue = previousValue
          const value = this.#form.time.value
          if (this.#form.editMode.checked) {
            this.#form.nextTime.value = value
          } else {
            this.#form.nextTime.value = this.#addValues(previousValue, value)
          }
        } else {
          this.#form.nextTime.value = previousValue
        }
      }
    }

    this.#form.addEventListener('submit', submitHandler)
    this.#form.addEventListener('input', inputHandler)

    this.#dialog.addEventListener('close', () => {
      this.#form.removeEventListener('submit', submitHandler)
      this.#form.removeEventListener('input', inputHandler)
      this.#reset()
    }, {once: true})
  }

  close() {
    this.#dialog.close()
  }

  #reset() {
    this.#form.reset()
  }

  /**
   * @param {string} value
   * @return {number}
   */
  #valueToMinutes(value) {
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
  #minutesToValue(minutes) {
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
  #addValues(value1, value2) {
    return this.#minutesToValue(this.#valueToMinutes(value1) + this.#valueToMinutes(value2))
  }
}

const tableElement = document.getElementById('actualTTRows')

const editor = new Editor()

tableElement.addEventListener('click', event => {
  if (event.target.classList.contains('inputTT')) {
    editor.open(event.target)
  }
})
