chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  const { startTimeValue, endTimeValue, breakTimeValue, isAutoSendRequest } =
    msg
  const listDays = document.getElementsByClassName('align-middle border-left-0')
  for (let index = 0; index < listDays.length; index++) {
    const weekday = listDays[index] as HTMLElement
    const parentElement = weekday.parentElement as HTMLElement

    if (weekday.innerText.includes('T7') || weekday.innerText.includes('CN'))
      continue

    const startTime = parentElement.querySelector(
      '#editable_start'
    ) as HTMLElement
    const endTime = parentElement.querySelector('#editable_end') as HTMLElement
    const breakTime = parentElement.querySelector(
      '#editable_rest'
    ) as HTMLElement

    const startInput = startTime.childNodes[0] as HTMLInputElement
    const endTimeInput = endTime.childNodes[0] as HTMLInputElement
    const breakTimeInput = breakTime.childNodes[0] as HTMLInputElement

    if (!startInput.value) {
      startInput.style.backgroundColor = 'aqua'
      startInput.value = startTimeValue
    }

    if (!endTimeInput.value) {
      endTimeInput.style.backgroundColor = 'aqua'
      endTimeInput.value = endTimeValue
    }

    if (!breakTimeInput.value) {
      breakTimeInput.style.backgroundColor = 'aqua'
      breakTimeInput.value = breakTimeValue
    }

    if (
      isAutoSendRequest &&
      (!startInput.value || !endTimeInput.value || !breakTimeInput.value)
    ) {
      const button = parentElement.getElementsByClassName(
        'btn jbc-btn-secondary'
      )[0] as HTMLElement
      button.click()
    }
  }
})
