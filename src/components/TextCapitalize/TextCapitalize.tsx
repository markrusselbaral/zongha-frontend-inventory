const handleCapitalize = (str : string) => {
    const text = str.split(' ')
    text.forEach((item, index) => {
    //   console.log(item)
      return text[index] = `${item.charAt(0).toUpperCase()}${item.slice(1).toLowerCase()}`
    })
    return text.join(' ')
  }

export default handleCapitalize