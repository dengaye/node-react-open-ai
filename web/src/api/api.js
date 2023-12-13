import axios from 'axios';
const URL_API = 'https://node-open-ai.vercel.app/api/prompt'

export const makeRequest = async (message) => {
  console.log(message)
  const {data} = await axios.post(URL_API, message)
 
  return data
}
