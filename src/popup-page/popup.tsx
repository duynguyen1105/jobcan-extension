import React, { useState } from 'react'
import { render } from 'react-dom'

export const Popup = () => {
  const [startTimeValue, setStartTimeValue] = useState('09:00')
  const [endTimeValue, setEndTimeValue] = useState('18:00')
  const [breakTimeValue, setBreakTimeValue] = useState('01:00')
  const [isAutoSendRequest, setIsAutoSendRequest] = useState(false)

  const onSubmitForm = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id!
      chrome.tabs.sendMessage(currentTabID, {
        startTimeValue,
        endTimeValue,
        breakTimeValue,
        isAutoSendRequest,
      })
    })
  }

  const inputStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
  return (
    <form
      onSubmit={onSubmitForm}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={inputStyle}>
        <label htmlFor="start-time">Start Time</label>
        <input
          id="start-time"
          type="time"
          value={startTimeValue}
          onChange={(e) => setStartTimeValue(e.target.value)}
          style={{
            width: '50%',
          }}
        />
      </div>
      <div style={inputStyle}>
        <label htmlFor="end-time">End Time</label>
        <input
          id="end-time"
          type="time"
          value={endTimeValue}
          onChange={(e) => setEndTimeValue(e.target.value)}
          style={{
            width: '50%',
          }}
        />
      </div>
      <div style={inputStyle}>
        <label htmlFor="break-time">Break Time</label>
        <input
          id="break-time"
          type="time"
          value={breakTimeValue}
          onChange={(e) => setBreakTimeValue(e.target.value)}
          style={{
            width: '50%',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <input
          type="checkbox"
          id="auto-click-send-request"
          checked={isAutoSendRequest}
          onChange={(e) => setIsAutoSendRequest(e.target.checked)}
        />
        <label htmlFor="auto-click-send-request">Auto click send request</label>
      </div>
      <button
        type="submit"
        style={{
          cursor: 'pointer',
          outline: 0,
          display: 'inline-block',
          fontWeight: 400,
          lineHeight: 1.5,
          textAlign: 'center',
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          padding: '6px 12px',
          fontSize: '1rem',
          borderRadius: '.25rem',
          transition:
            'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
          color: '#0d6efd',
          borderColor: '#0d6efd',
        }}
      >
        Triểnn
      </button>
    </form>
  )
}

render(<Popup />, document.getElementById('popup'))
