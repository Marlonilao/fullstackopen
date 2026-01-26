const Notification = ({ message }) => {
  return message === null ? null : (
    <div className={message.isSuccess ? "successMessage" : "errorMessage"}>
      {message.content}
    </div>
  );
};

export default Notification;
