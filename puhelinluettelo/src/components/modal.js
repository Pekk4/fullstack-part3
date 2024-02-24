const Modal = ({ message, messageStyle }) => {
    let modalClass = "modal green"

    if (message === null) {
        return null
    }
    if (messageStyle !== null) {
        modalClass = "modal red"
    }

    return (
        <div className="container">
            <div className={modalClass}>
                {message}
            </div>
        </div>
    )
}

export default Modal
