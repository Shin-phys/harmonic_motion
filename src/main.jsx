import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import p5 from 'p5'
import './index.css'
import App from './App.jsx'

// p5 の「やさしいエラー表示」は開発者向け。動作が重くなり、コンソールに解析エラーも出るので切る
p5.disableFriendlyErrors = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
