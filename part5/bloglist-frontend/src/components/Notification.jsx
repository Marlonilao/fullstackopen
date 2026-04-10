import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  return message === null ? null : (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={message.type}>
      {message.text}
    </Alert>
  )
}

export default Notification
