const Notification = ({ message, status }) => {
    if (message === null) {
      return null
    }

    const styles = {
        color: (status === 'error' ? 'red' : 'green'),
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
  
    return (
      <div style={styles}>
        {message}
      </div>
    )
}

export default Notification;