import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/api/auth';



export const getTasks = async () => {
  const token = localStorage.getItem('token') 
  if (!token) throw new Error('No token found')

  const response = await axios.get(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data 
}


export const addTask = async (task) => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const response = await axios.post(`${API_URL}/task`, task, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data 
};
export const getTasksByStatus = async (status) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(
    `${API_URL}/tasksByStatus?status=${status}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
export const updateTask = async (taskId, updatedData) => {
  const token = localStorage.getItem('token');

  const res = await axios.put(
    `${API_URL}/task/${taskId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteTask = async (taskId) => {
  const token = localStorage.getItem('token');

  const res = await axios.delete(
    `${API_URL}/task/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};