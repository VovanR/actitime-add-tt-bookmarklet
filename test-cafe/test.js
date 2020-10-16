import {Selector} from 'testcafe'

/* eslint-disable new-cap */
const emptyInputElement = Selector('.inputTT[data-test="empty"]')
const prefilledInputElement = Selector('.inputTT[data-test="prefilled"]')
const dialogElement = Selector('dialog')
const inputElement = Selector('input[name="time"]')
const previousTimeOutputElement = Selector('output[name="previousTime"]')
const nextTimeOutputElement = Selector('output[name="nextTime"]')
const editModeCheckboxElement = Selector('input[name="editMode"]')
const saveButtonElement = Selector('button').withText('Save')
const cancelButtonElement = Selector('button[type="reset"]')
/* eslint-enable new-cap */

// eslint-disable-next-line no-unused-expressions
fixture`Getting Started`
  .page`./test.html`

test('Initialize. should loaded with closed dialog', async t => {
  await t
    .expect(dialogElement.visible).eql(false)
})

test('Initialize. should have empty input placeholder text', async t => {
  await t
    .expect(inputElement.getAttribute('placeholder')).eql('0:00')
})

test('Initialize. should have "Edit" checkbox disabled', async t => {
  await t
    .expect(editModeCheckboxElement.hasAttribute('disabled')).eql(true)
})

test('Open. should open dialog with input focused', async t => {
  await t
    .click(emptyInputElement)
    .expect(inputElement.focused).eql(true)
})

test('Open. should open dialog with empty previous and next time outputs', async t => {
  await t
    .click(emptyInputElement)
    .expect(previousTimeOutputElement.value).eql('0:00')
    .expect(nextTimeOutputElement.value).eql('0:00')
})

test('Open. should open dialog with prefilled previous and next time outputs', async t => {
  await t
    .click(prefilledInputElement)
    .expect(previousTimeOutputElement.value).eql('1:30')
    .expect(nextTimeOutputElement.value).eql('1:30')
})

test('Edit. should calculate next time for empty previous time', async t => {
  await t
    .click(emptyInputElement)
    .typeText(inputElement, '1:11')
    .expect(previousTimeOutputElement.value).eql('0:00')
    .expect(nextTimeOutputElement.value).eql('1:11')
})

test('Edit. should calculate next time', async t => {
  await t
    .click(prefilledInputElement)
    .typeText(inputElement, '1:11')
    .expect(previousTimeOutputElement.value).eql('1:30')
    .expect(nextTimeOutputElement.value).eql('2:41')
})

test('Save. should close dialog if value is valid', async t => {
  await t
    .click(emptyInputElement)
    .typeText(inputElement, '1:11')
    .click(saveButtonElement)
    .expect(dialogElement.visible).eql(false)
})

test('Save. should not close dialog if value is invalid', async t => {
  await t
    .click(emptyInputElement)
    .click(saveButtonElement)
    .expect(dialogElement.visible).eql(true)
})

test('Save. should fill edited input with new value', async t => {
  await t
    .click(emptyInputElement)
    .typeText(inputElement, '1:11')
    .click(saveButtonElement)
    .expect(dialogElement.visible).eql(false)
    .expect(emptyInputElement.value).eql('1:11')
})

test('Cancel. should close dialog withoud change', async t => {
  await t
    .click(emptyInputElement)
    .click(cancelButtonElement)
    .expect(dialogElement.visible).eql(false)
})
