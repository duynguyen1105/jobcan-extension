import {
  generateWeightedRandomTime,
  generateRandomStartTime,
  generateRandomEndTime,
  processTimeEntries,
} from '../src/contentscript'

describe('generateWeightedRandomTime', () => {
  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore()
  })

  it('returns time in HH:MM format', () => {
    const result = generateWeightedRandomTime(
      { start: 540, end: 540, weight: 100 },
      { start: 540, end: 540, weight: 0 }
    )
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })

  it('selects primary range when random < primaryRange.weight', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // random = 50, < 80 => primary
      .mockReturnValueOnce(0) // first minute in range

    const result = generateWeightedRandomTime(
      { start: 525, end: 540, weight: 80 },
      { start: 510, end: 525, weight: 20 }
    )
    // start=525 => 525/60 = 8h 45m => "08:45"
    expect(result).toBe('08:45')
  })

  it('selects secondary range when random >= primaryRange.weight', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.85) // random = 85, >= 80 => secondary
      .mockReturnValueOnce(0) // first minute in range

    const result = generateWeightedRandomTime(
      { start: 525, end: 540, weight: 80 },
      { start: 510, end: 525, weight: 20 }
    )
    // start=510 => 510/60 = 8h 30m => "08:30"
    expect(result).toBe('08:30')
  })

  it('pads single-digit hours and minutes with leading zeros', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0) // primary range
      .mockReturnValueOnce(0) // first minute

    const result = generateWeightedRandomTime(
      { start: 65, end: 65, weight: 100 }, // 1h 5m
      { start: 65, end: 65, weight: 0 }
    )
    expect(result).toBe('01:05')
  })
})

describe('generateRandomStartTime', () => {
  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore()
  })

  it('returns time within 08:30-09:00 range', () => {
    const result = generateRandomStartTime()
    const [hours, minutes] = result.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    expect(totalMinutes).toBeGreaterThanOrEqual(510) // 08:30
    expect(totalMinutes).toBeLessThanOrEqual(540) // 09:00
  })

  it('statistical distribution favors primary range (08:45-09:00)', () => {
    const results = { primary: 0, secondary: 0 }
    for (let i = 0; i < 1000; i++) {
      const time = generateRandomStartTime()
      const [hours, minutes] = time.split(':').map(Number)
      const totalMinutes = hours * 60 + minutes
      if (totalMinutes >= 525) {
        results.primary++
      } else {
        results.secondary++
      }
    }
    // With 80/20 weight, primary should dominate
    expect(results.primary).toBeGreaterThan(results.secondary)
    expect(results.primary).toBeGreaterThan(600) // ~80% of 1000
  })
})

describe('generateRandomEndTime', () => {
  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore()
  })

  it('returns time within 18:00-18:30 range', () => {
    const result = generateRandomEndTime()
    const [hours, minutes] = result.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    expect(totalMinutes).toBeGreaterThanOrEqual(1080) // 18:00
    expect(totalMinutes).toBeLessThanOrEqual(1110) // 18:30
  })

  it('statistical distribution favors primary range (18:00-18:15)', () => {
    const results = { primary: 0, secondary: 0 }
    for (let i = 0; i < 1000; i++) {
      const time = generateRandomEndTime()
      const [hours, minutes] = time.split(':').map(Number)
      const totalMinutes = hours * 60 + minutes
      if (totalMinutes <= 1095) {
        results.primary++
      } else {
        results.secondary++
      }
    }
    expect(results.primary).toBeGreaterThan(results.secondary)
    expect(results.primary).toBeGreaterThan(600)
  })
})

// Helper to create mock Jobcan DOM structure
function createDayRow(weekdayText: string, opts?: {
  startValue?: string
  endValue?: string
  breakValue?: string
}) {
  const row = document.createElement('tr')

  const weekdayCell = document.createElement('td')
  weekdayCell.className = 'align-middle border-left-0'
  weekdayCell.innerText = weekdayText
  row.appendChild(weekdayCell)

  const createEditableCell = (id: string, value: string) => {
    const cell = document.createElement('td')
    const editable = document.createElement('div')
    editable.id = id
    const input = document.createElement('input')
    input.value = value
    editable.appendChild(input)
    cell.appendChild(editable)
    row.appendChild(cell)
  }

  createEditableCell('editable_start', opts?.startValue ?? '')
  createEditableCell('editable_end', opts?.endValue ?? '')
  createEditableCell('editable_rest', opts?.breakValue ?? '')

  const buttonCell = document.createElement('td')
  const button = document.createElement('button')
  button.className = 'btn jbc-btn-secondary'
  buttonCell.appendChild(button)
  row.appendChild(buttonCell)

  return row
}

describe('processTimeEntries', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  const defaultConfig = {
    startTimeValue: '09:00',
    endTimeValue: '18:00',
    breakTimeValue: '01:00',
    isAutoSendRequest: false,
    isRandomTime: false,
  }

  it('fills empty inputs with provided values', () => {
    const row = createDayRow('T2 (Mon)')
    container.appendChild(row)

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, defaultConfig)

    const startInput = row.querySelector('#editable_start input') as HTMLInputElement
    const endInput = row.querySelector('#editable_end input') as HTMLInputElement
    const breakInput = row.querySelector('#editable_rest input') as HTMLInputElement

    expect(startInput.value).toBe('09:00')
    expect(endInput.value).toBe('18:00')
    expect(breakInput.value).toBe('01:00')
  })

  it('applies aqua background to filled inputs', () => {
    const row = createDayRow('T3 (Tue)')
    container.appendChild(row)

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, defaultConfig)

    const startInput = row.querySelector('#editable_start input') as HTMLInputElement
    const endInput = row.querySelector('#editable_end input') as HTMLInputElement
    const breakInput = row.querySelector('#editable_rest input') as HTMLInputElement

    expect(startInput.style.backgroundColor).toBe('aqua')
    expect(endInput.style.backgroundColor).toBe('aqua')
    expect(breakInput.style.backgroundColor).toBe('aqua')
  })

  it('skips weekend rows with T7', () => {
    const row = createDayRow('T7 (Sat)')
    container.appendChild(row)

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, defaultConfig)

    const startInput = row.querySelector('#editable_start input') as HTMLInputElement
    expect(startInput.value).toBe('')
  })

  it('skips weekend rows with CN', () => {
    const row = createDayRow('CN (Sun)')
    container.appendChild(row)

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, defaultConfig)

    const startInput = row.querySelector('#editable_start input') as HTMLInputElement
    expect(startInput.value).toBe('')
  })

  it('preserves existing non-empty values', () => {
    const row = createDayRow('T2 (Mon)', {
      startValue: '08:30',
      endValue: '17:30',
      breakValue: '00:30',
    })
    container.appendChild(row)

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, defaultConfig)

    const startInput = row.querySelector('#editable_start input') as HTMLInputElement
    const endInput = row.querySelector('#editable_end input') as HTMLInputElement
    const breakInput = row.querySelector('#editable_rest input') as HTMLInputElement

    expect(startInput.value).toBe('08:30')
    expect(endInput.value).toBe('17:30')
    expect(breakInput.value).toBe('00:30')
    expect(startInput.style.backgroundColor).not.toBe('aqua')
  })

  it('uses random times when isRandomTime is true', () => {
    const row = createDayRow('T4 (Thu)')
    container.appendChild(row)

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, {
      ...defaultConfig,
      isRandomTime: true,
    })

    const startInput = row.querySelector('#editable_start input') as HTMLInputElement
    const endInput = row.querySelector('#editable_end input') as HTMLInputElement

    // Should have values (random, but within expected ranges)
    expect(startInput.value).toMatch(/^0[89]:\d{2}$/)
    expect(endInput.value).toMatch(/^18:\d{2}$/)
  })

  it('clicks submit button when isAutoSendRequest is true and all fields filled', () => {
    const row = createDayRow('T5 (Fri)')
    container.appendChild(row)
    const button = row.querySelector('.btn.jbc-btn-secondary') as HTMLElement
    const clickSpy = jest.spyOn(button, 'click')

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, {
      ...defaultConfig,
      isAutoSendRequest: true,
    })

    expect(clickSpy).toHaveBeenCalled()
  })

  it('does NOT click submit when isAutoSendRequest is false', () => {
    const row = createDayRow('T5 (Fri)')
    container.appendChild(row)
    const button = row.querySelector('.btn.jbc-btn-secondary') as HTMLElement
    const clickSpy = jest.spyOn(button, 'click')

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, {
      ...defaultConfig,
      isAutoSendRequest: false,
    })

    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('handles multiple rows including weekends', () => {
    const rows = [
      createDayRow('T2 (Mon)'),
      createDayRow('T3 (Tue)'),
      createDayRow('T7 (Sat)'),
      createDayRow('CN (Sun)'),
      createDayRow('T4 (Thu)'),
    ]
    rows.forEach((r) => container.appendChild(r))

    const listDays = container.getElementsByClassName('align-middle border-left-0')
    processTimeEntries(listDays as HTMLCollectionOf<Element>, defaultConfig)

    // Weekday rows should be filled
    expect((rows[0].querySelector('#editable_start input') as HTMLInputElement).value).toBe('09:00')
    expect((rows[1].querySelector('#editable_start input') as HTMLInputElement).value).toBe('09:00')
    expect((rows[4].querySelector('#editable_start input') as HTMLInputElement).value).toBe('09:00')

    // Weekend rows should remain empty
    expect((rows[2].querySelector('#editable_start input') as HTMLInputElement).value).toBe('')
    expect((rows[3].querySelector('#editable_start input') as HTMLInputElement).value).toBe('')
  })
})
