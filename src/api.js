import axios from 'axios'

export const baseConfig = {
	baseURL: 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json'
	}
}

const api = axios.create({ ...baseConfig })

export default api
	
