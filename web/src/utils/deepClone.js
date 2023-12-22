const deepClone = (value) => {
  return JSON.parse(JSON.stringify(value))
}

export default deepClone
