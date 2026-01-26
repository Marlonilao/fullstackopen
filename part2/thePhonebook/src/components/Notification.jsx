const Notification = ({ message }) => {
  return message === null ? null : (
    <div className="successMessage">{message}</div>
  );
};

export default Notification;
