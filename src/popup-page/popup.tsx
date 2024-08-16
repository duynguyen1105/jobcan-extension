import React, { useState } from 'react'
import { render } from 'react-dom'

export const Popup = () => {
  const [branch, setBranch] = useState("0")

  const onSubmitForm = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id!
      chrome.tabs.sendMessage(currentTabID, {
        branch,
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
      <label htmlFor="branches">Ignore PR sync from:</label>
      <select
        name="branches"
        id="branches"
        onChange={(v) => setBranch(v.target.value)}
        style={{
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
        <option value="0">main + staging</option>
        <option value="1">main</option>
        <option value="2">staging</option>
        <option value="3">production</option>
      </select>
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
          color: 'white',
          background: '#0d6efd',
          borderColor: '#0d6efd',
        }}
      >
        Get URLs
      </button>
    </form>
  )
}

render(<Popup />, document.getElementById('popup'))
