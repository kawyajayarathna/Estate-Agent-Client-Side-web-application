import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import SearchPage from './components/SearchPage'
import About from './components/About'
import Contact from './components/Contact'
import PropertyDetails from './components/PropertyDetails'
import './App.css'

function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  const addToFavorites = (property) => {
    if (!favorites.some(fav => fav.id === property.id)) {
      const newFavorites = [...favorites, property]
      setFavorites(newFavorites)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
  }

  const removeFromFavorites = (propertyId) => {
    const newFavorites = favorites.filter(fav => fav.id !== propertyId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favorites')
  }

  // The main page layout with all sections
  const MainSections = () => (
    <>
      <Navbar />
      <main className="main-content">
        <section id="home">
          <Home />
        </section>
        <section id="properties">
          <SearchPage
            favorites={favorites}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            clearFavorites={clearFavorites}
          />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  )

  return (
    <Routes>
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="*" element={<MainSections />} />
    </Routes>
  )
}

export default App