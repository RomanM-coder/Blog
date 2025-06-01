import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
// import { useTranslation } from 'react-i18next' 
import {basicUrl} from '../utilita/defauit'

interface userData {
  token: string,
  userId: string,
  role?: string
}
type CacheKey = string
// console.log(typeof instance.interceptors.request.use); // Покажет сигнатуру функции!!!
// const { i18n: {language} } = useTranslation()

const instance = axios.create({
  baseURL: basicUrl.urlBack,
  timeout: 15000,
})
// const cache = new Map<CacheKey, any>()
// const cache = {}

// Добавляем интерцепторы запросов
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {

    let token
    let language
    let role
    if (localStorage.getItem('userData')) {   
      const data: userData = JSON.parse(localStorage.getItem('userData')!)
      if (data && data.token) {
        token = data.token as string      
      }
      if (data.role) role = data.role                  
    }
    if (token) config.headers.Authorization = `Bearer ${token}`
   
    if (role) config.headers.Authorization = `Bearer ${token} ${role}`
    
    if (localStorage.getItem('i18nextLng')) {   
      // const data: string = JSON.parse(localStorage.getItem('i18nextLng')!)
      // if (data) {
        language = localStorage.getItem('i18nextLng')
        config.headers['Accept-Language'] = `${language}`       
      // }             
    }    
    // config.headers['Content-Type'] = 'application/json'
    // if (['post', 'put'].includes(config.method || '')) {
    //   config.headers['Content-Type'] = 'multipart/form-data'
    // }    
    config.headers['Access-Control-Allow-Origin'] = '*'   

    //  запоминаем запрос и проверяем
    // if (config.method === 'get') {
    //   const key = generateCacheKey(config)
    //   const cachedData = localStorage.getItem(key)
    //   // const key = `${config.url}?${new URLSearchParams(config.params).toString()}`
    //   if (cachedData) {
    //     // Если запрос уже был выполнен, возвращаем закешированный результат
    //     console.log('Данные взяты из кэша:', cache)        
    //     return Promise.resolve({ ...config, data: JSON.parse(cachedData) })
    //   }

    //   console.log('Данные не найдены в кэше. Запрос отправлен на сервер:', key)
    // }

    // Если это изменяющий запрос (POST, PUT, DELETE), очищаем кэш
    // if (['post', 'put', 'delete'].includes(config.method || '')) {
    //   removeKeysWithPrefix('GET&http://localhost:5000/api');
    // }    

    console.log('Отправляется запрос:', config.headers, config.method, config.url, config.data)
    return config
  },
  (error) => {
    console.error('Ошибка при подготовке запроса:', error)
    Promise.reject(error)
  }
)

// Функция для удаления ключей по префиксу
function removeKeysWithPrefix(prefix: string): void {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && typeof key === 'string' && key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }
}

// Добавляем интерцепторы ответов
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // if (response.config.method === 'get') {
    //   const key = generateCacheKey(response.config)
    //    // Сохраняем ответ в localStorage
     
    //   localStorage.setItem(key, JSON.stringify(response.data))     
    //   console.log('Данные сохранены в кэш:', key)
    // }
    console.log('Получен ответ:', response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    if (error.response) {
      // Сервер вернул код ошибки
      const status = error.response.status
      if (status === 401) {        
        console.error('Токен устарел. Пользователь не авторизован.')
       // можно выполнить что-то
      } else if (status === 403) {
        console.error('Доступ запрещен.')
      } else if (status === 500) {
        console.error('Внутренняя ошибка сервера.')
      }
      //console.error('Ошибка ответа:', error.response?.status, error.response?.data)
      return Promise.reject(error) // Передаем ошибку дальше

    } else if (error.request) {
      // Запрос был сделан, но нет ответа (например, таймаут)
      console.error('Сервер недоступен.')
      return Promise.reject(error)
    } else {
      // Что-то пошло не так до отправки запроса
      console.error('Ошибка при создании запроса:', error.message)
      return Promise.reject(error)
    }
  }
)

// Функция для изменения baseURL
export const setBaseURL = (newBaseURL: string) => {
  instance.defaults.baseURL = newBaseURL
}

// Функция для изменения headers в react component
export const setHeaders = (newHeaders: string) => {
  instance.defaults.headers['Content-Type'] = newHeaders
}

// Функция для генерации уникального ключа для кэша
function generateCacheKey(config: InternalAxiosRequestConfig<any>): CacheKey {
  const { url, method, params, headers } = config

  return [method, url, JSON.stringify(params), JSON.stringify(headers['Accept-Language'])].filter(Boolean).join('&')
}

export default instance