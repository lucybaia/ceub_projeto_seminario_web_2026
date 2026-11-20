import React, { useState, useEffect } from 'react'
import Header from './layouts/Header'
import Footer from './layouts/Footer'
import HomePage from './pages/HomePage'
import UsersManagementPage from './pages/admin/UsersManagementPage'

export const App: React.FC = () => {
  // Suporte a rotas leves por hash: #users ou padrão 'users' se desejado
  const [currentView, setCurrentView] = useState<'home' | 'users'>(() => {
    return window.location.hash === '#home' ? 'home' : 'users'
  })

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#home') {
        setCurrentView('home')
      } else if (window.location.hash === '#users') {
        setCurrentView('users')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = (view: 'home' | 'users') => {
    setCurrentView(view)
    window.location.hash = `#${view}`
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-ceub-dark font-sans selection:bg-ceub-magenta selection:text-white">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-1 w-full flex flex-col">
        {currentView === 'users' ? <UsersManagementPage /> : <HomePage />}
      </main>
      <Footer />
    </div>
  )
}

export default App
