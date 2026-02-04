import React from 'react'
import { render, fireEvent, act, within } from '@testing-library/react'
import { Popup } from '../src/popup-page/popup'

describe('Popup', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // Clear the #popup div that gets filled by the module-level render() call
    const popupDiv = document.getElementById('popup')
    if (popupDiv) popupDiv.innerHTML = ''
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  function renderPopup() {
    const result = render(<Popup />)
    return { ...result, view: within(result.container) }
  }

  it('renders all form elements', () => {
    const { view } = renderPopup()

    expect(view.getByLabelText('Start Time')).toBeInTheDocument()
    expect(view.getByLabelText('End Time')).toBeInTheDocument()
    expect(view.getByLabelText('Break Time')).toBeInTheDocument()
    expect(view.getByLabelText('Auto click send request')).toBeInTheDocument()
    expect(view.getByLabelText('Random time')).toBeInTheDocument()
    expect(view.getByRole('button', { name: /triểnn/i })).toBeInTheDocument()
    expect(view.getAllByRole('combobox')).toHaveLength(2)
  })

  it('has correct default values', () => {
    const { view } = renderPopup()

    expect(view.getByLabelText('Start Time')).toHaveValue('09:00')
    expect(view.getByLabelText('End Time')).toHaveValue('18:00')
    expect(view.getByLabelText('Break Time')).toHaveValue('01:00')
    expect(view.getByLabelText('Auto click send request')).not.toBeChecked()
    expect(view.getByLabelText('Random time')).not.toBeChecked()
  })

  it('disables time inputs when Random time checkbox is checked', () => {
    const { view } = renderPopup()

    const randomCheckbox = view.getByLabelText('Random time')
    fireEvent.click(randomCheckbox)

    expect(view.getByLabelText('Start Time')).toBeDisabled()
    expect(view.getByLabelText('End Time')).toBeDisabled()
    expect(view.getByLabelText('Break Time')).toBeDisabled()
  })

  it('enables time inputs when Random time checkbox is unchecked', () => {
    const { view } = renderPopup()

    const randomCheckbox = view.getByLabelText('Random time')
    // Check then uncheck
    fireEvent.click(randomCheckbox)
    fireEvent.click(randomCheckbox)

    expect(view.getByLabelText('Start Time')).not.toBeDisabled()
    expect(view.getByLabelText('End Time')).not.toBeDisabled()
    expect(view.getByLabelText('Break Time')).not.toBeDisabled()
  })

  it('updates time input values on change', () => {
    const { view } = renderPopup()

    const startInput = view.getByLabelText('Start Time')
    fireEvent.change(startInput, { target: { value: '08:30' } })
    expect(startInput).toHaveValue('08:30')

    const endInput = view.getByLabelText('End Time')
    fireEvent.change(endInput, { target: { value: '17:30' } })
    expect(endInput).toHaveValue('17:30')

    const breakInput = view.getByLabelText('Break Time')
    fireEvent.change(breakInput, { target: { value: '00:30' } })
    expect(breakInput).toHaveValue('00:30')
  })

  it('calls chrome.tabs.query and sendMessage on form submit', () => {
    const mockTabs = [{ id: 42 }]
    ;(chrome.tabs.query as jest.Mock).mockImplementation(
      (_query: any, callback: (tabs: any[]) => void) => {
        callback(mockTabs)
      }
    )

    const { view } = renderPopup()

    const submitButton = view.getByRole('button', { name: /triểnn/i })
    fireEvent.submit(submitButton.closest('form')!)

    expect(chrome.tabs.query).toHaveBeenCalledWith(
      { currentWindow: true, active: true },
      expect.any(Function)
    )
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(42, {
      startTimeValue: '09:00',
      endTimeValue: '18:00',
      breakTimeValue: '01:00',
      isAutoSendRequest: false,
      isRandomTime: false,
    })
  })

  it('sends updated values after form changes', () => {
    const mockTabs = [{ id: 10 }]
    ;(chrome.tabs.query as jest.Mock).mockImplementation(
      (_query: any, callback: (tabs: any[]) => void) => {
        callback(mockTabs)
      }
    )

    const { view } = renderPopup()

    // Change values
    fireEvent.change(view.getByLabelText('Start Time'), {
      target: { value: '08:45' },
    })
    fireEvent.click(view.getByLabelText('Auto click send request'))
    fireEvent.click(view.getByLabelText('Random time'))

    // Submit
    fireEvent.submit(view.getByRole('button', { name: /triểnn/i }).closest('form')!)

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(10, {
      startTimeValue: '08:45',
      endTimeValue: '18:00',
      breakTimeValue: '01:00',
      isAutoSendRequest: true,
      isRandomTime: true,
    })
  })

  it('uses tab id 0 when tabs array is empty', () => {
    ;(chrome.tabs.query as jest.Mock).mockImplementation(
      (_query: any, callback: (tabs: any[]) => void) => {
        callback([])
      }
    )

    const { view } = renderPopup()

    fireEvent.submit(view.getByRole('button', { name: /triểnn/i }).closest('form')!)

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
      0,
      expect.any(Object)
    )
  })

  it('shows toast when Vietnamese language is selected', () => {
    const { view } = renderPopup()

    const select = view.getByRole('combobox', { name: 'Language' })
    fireEvent.change(select, { target: { value: 'vi' } })

    expect(
      view.getByText(/liên hệ @Jenna/i)
    ).toBeInTheDocument()
  })

  it('hides toast after 5 seconds', () => {
    const { view } = renderPopup()

    const select = view.getByRole('combobox', { name: 'Language' })
    fireEvent.change(select, { target: { value: 'vi' } })

    expect(view.getByText(/liên hệ @Jenna/i)).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(view.queryByText(/liên hệ @Jenna/i)).not.toBeInTheDocument()
  })

  it('does not show toast when English language is selected', () => {
    const { view } = renderPopup()

    const select = view.getByRole('combobox', { name: 'Language' })
    // Already 'en' by default, but change to 'en' explicitly
    fireEvent.change(select, { target: { value: 'en' } })

    expect(view.queryByText(/liên hệ @Jenna/i)).not.toBeInTheDocument()
  })

  describe('Dark mode', () => {
    it('renders theme selector with system/light/dark options', () => {
      const { view } = renderPopup()

      const themeSelect = view.getByRole('combobox', { name: 'Theme' })
      expect(themeSelect).toBeInTheDocument()

      const options = within(themeSelect).getAllByRole('option')
      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent('System')
      expect(options[1]).toHaveTextContent('Light')
      expect(options[2]).toHaveTextContent('Dark')
    })

    it('defaults theme to light', () => {
      const { view } = renderPopup()

      const themeSelect = view.getByRole('combobox', { name: 'Theme' })
      expect(themeSelect).toHaveValue('light')
    })

    it('falls back to light theme when local storage is empty', () => {
      ;(chrome.storage.local.get as jest.Mock).mockImplementation(
        (_key: string, cb: (result: Record<string, unknown>) => void) => {
          cb({})
        }
      )

      const { view } = renderPopup()

      const themeSelect = view.getByRole('combobox', { name: 'Theme' })
      expect(themeSelect).toHaveValue('light')
    })

    it('calls chrome.storage.local.set when theme is changed', () => {
      const { view } = renderPopup()

      const themeSelect = view.getByRole('combobox', { name: 'Theme' })
      fireEvent.change(themeSelect, { target: { value: 'dark' } })

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ themeMode: 'dark' })
    })

    it('loads saved theme preference on mount', () => {
      ;(chrome.storage.local.get as jest.Mock).mockImplementation(
        (_key: string, cb: (result: Record<string, unknown>) => void) => {
          cb({ themeMode: 'dark' })
        }
      )

      const { view } = renderPopup()

      const themeSelect = view.getByRole('combobox', { name: 'Theme' })
      expect(themeSelect).toHaveValue('dark')
    })
  })
})
