const formatDate = (date : string ) => {
    const datecre = new Date(date)
    const dateD = datecre.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
    })
    return dateD;
}

export default formatDate
