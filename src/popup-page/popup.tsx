import React, { useState } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  position: relative;
`

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Label = styled.label`
  font-size: 1rem;
  color: #333;
`

const Input = styled.input`
  width: 60%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`

const Button = styled.button`
  cursor: pointer;
  display: inline-block;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  color: #fff;
  background-color: #0d6efd;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`

const Select = styled.select`
  width: max-content;
  padding: 0.2rem;
  font-size: 0%.7;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`

const SelectContainer = styled.div`
  display: flex;
  justify-content: end;
  margin: -1rem;
  margin-right: 0rem;
`

const CenterToastMessage = styled.div`
  width: max-content;
  padding: 0.5rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  font-size: 0.85rem;
  opacity: 0.9;

  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.9;
    }
  }

  animation: appear 0.3s;
`

export const Popup = () => {
  const [startTimeValue, setStartTimeValue] = useState('09:00')
  const [endTimeValue, setEndTimeValue] = useState('18:00')
  const [breakTimeValue, setBreakTimeValue] = useState('01:00')
  const [isAutoSendRequest, setIsAutoSendRequest] = useState(false)
  const [isRandomTime, setIsRandomTime] = useState(false)
  const [language, setLanguage] = useState('en')
  const [openPopup, setOpenPopup] = useState(false)

  const onSubmitForm = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id!
      chrome.tabs.sendMessage(currentTabID, {
        startTimeValue,
        endTimeValue,
        breakTimeValue,
        isAutoSendRequest,
        isRandomTime,
      })
    })
  }

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value
    if (newLanguage === 'vi') {
      setOpenPopup(true)
      setTimeout(() => {
        setOpenPopup(false)
      }, 5000)
    }
  }

  return (
    <Form onSubmit={onSubmitForm}>
      <SelectContainer>
        <Select id="cars" value={language} onChange={handleChangeLanguage}>
          <option value="en">EN</option>
          <option value="vi">VI</option>
        </Select>
      </SelectContainer>
      <InputGroup>
        <Label htmlFor="start-time">Start Time</Label>
        <Input
          id="start-time"
          type="time"
          value={startTimeValue}
          disabled={isRandomTime}
          onChange={(e) => setStartTimeValue(e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="end-time">End Time</Label>
        <Input
          id="end-time"
          type="time"
          value={endTimeValue}
          disabled={isRandomTime}
          onChange={(e) => setEndTimeValue(e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="break-time">Break Time</Label>
        <Input
          id="break-time"
          type="time"
          value={breakTimeValue}
          disabled={isRandomTime}
          onChange={(e) => setBreakTimeValue(e.target.value)}
        />
      </InputGroup>

      <CheckboxWrapper>
        <Checkbox
          type="checkbox"
          id="auto-click-send-request"
          checked={isAutoSendRequest}
          onChange={(e) => setIsAutoSendRequest(e.target.checked)}
        />
        <Label htmlFor="auto-click-send-request">Auto click send request</Label>
        <Checkbox
          type="checkbox"
          id="random-time"
          checked={isRandomTime}
          onChange={(e) => setIsRandomTime(e.target.checked)}
        />
        <Label htmlFor="random-time">Random time</Label>
      </CheckboxWrapper>

      <Button type="submit">Triểnn</Button>
      {openPopup && (
        <CenterToastMessage>
          <p>Please làm ơn liên hệ @Jenna đi học Tiếng Anh thứ 2,4 16h!?!</p>
        </CenterToastMessage>
      )}
    </Form>
  )
}

render(<Popup />, document.getElementById('popup'))
