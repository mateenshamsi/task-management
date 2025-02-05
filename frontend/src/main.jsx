import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
  import { BrowserRouter  as Router} from 'react-router-dom'
import { UserContextProvider } from './context/UserContext.jsx'
import { Toaster } from 'react-hot-toast'

import { Provider } from 'react-redux'
import { store } from './store/store.js'
ReactDOM.createRoot(document.getElementById('root')).render(
<Router>
<React.StrictMode>
  <Toaster/>
  
  <UserContextProvider>
  <Provider store={store}>
    <App />
  </Provider>
    </UserContextProvider>
  </React.StrictMode>,
  </Router>
)
