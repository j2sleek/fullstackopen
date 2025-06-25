const Filter = ({handler, filter}) => {
    return (
        <div>
            filter shown with<input onChange={handler} value={filter} />
        </div>
    )
}

export default Filter