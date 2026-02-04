export function generateWeightedRandomTime(
  primaryRange: { start: number; end: number; weight: number },
  secondaryRange: { start: number; end: number; weight: number }
): string {
  const random = Math.random() * 100
  let selectedRange =
    random < primaryRange.weight ? primaryRange : secondaryRange

  const randomMinutes =
    Math.floor(Math.random() * (selectedRange.end - selectedRange.start + 1)) +
    selectedRange.start

  const hours = Math.floor(randomMinutes / 60)
  const minutes = randomMinutes % 60

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
}

export function generateRandomStartTime(): string {
  // 80% chance of 08:45-09:00 (525-540 minutes from midnight)
  // 20% chance of 08:30-08:45 (510-525 minutes from midnight)
  return generateWeightedRandomTime(
    { start: 525, end: 540, weight: 80 }, // 08:45-09:00
    { start: 510, end: 525, weight: 20 } // 08:30-08:45
  )
}

export function generateRandomEndTime(): string {
  // 80% chance of 18:00-18:15 (1080-1095 minutes from midnight)
  // 20% chance of 18:15-18:30 (1095-1110 minutes from midnight)
  return generateWeightedRandomTime(
    { start: 1080, end: 1095, weight: 80 }, // 18:00-18:15
    { start: 1095, end: 1110, weight: 20 } // 18:15-18:30
  )
}

interface TimeEntryConfig {
  startTimeValue: string
  endTimeValue: string
  breakTimeValue: string
  isAutoSendRequest: boolean
  isRandomTime: boolean
}

export function processTimeEntries(
  listDays: HTMLCollectionOf<Element>,
  config: TimeEntryConfig
) {
  const {
    startTimeValue,
    endTimeValue,
    breakTimeValue,
    isAutoSendRequest,
    isRandomTime,
  } = config

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
      startInput.value = isRandomTime
        ? generateRandomStartTime()
        : startTimeValue
    }

    if (!endTimeInput.value) {
      endTimeInput.style.backgroundColor = 'aqua'
      endTimeInput.value = isRandomTime ? generateRandomEndTime() : endTimeValue
    }

    if (!breakTimeInput.value) {
      breakTimeInput.style.backgroundColor = 'aqua'
      breakTimeInput.value = breakTimeValue
    }

    if (
      isAutoSendRequest &&
      !(!startInput.value || !endTimeInput.value || !breakTimeInput.value)
    ) {
      const button = parentElement.getElementsByClassName(
        'btn jbc-btn-secondary'
      )[0] as HTMLElement
      button.click()
    }
  }
}

chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  const listDays = document.getElementsByClassName('align-middle border-left-0')
  processTimeEntries(listDays, msg)
})
