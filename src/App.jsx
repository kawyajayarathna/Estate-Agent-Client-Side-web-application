import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import SearchPage from './components/SearchPage'
import PropertyDetails from './components/PropertyDetails'
import About from './components/About'
import Contact from './components/Contact'
import './App.css'

 // Initialize state with favorites from localStorage if available
function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

   // Add a property to favorites if not already in the list
  const addToFavorites = (property) => {
    if (!favorites.some(fav => fav.id === property.id)) {
      const newFavorites = [...favorites, property]
      setFavorites(newFavorites)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
  }

   // Remove a property from favorites by its id
  const removeFromFavorites = (propertyId) => {
    const newFavorites = favorites.filter(fav => fav.id !== propertyId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

   // Clear all favorites from state and localStorage
  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favorites')
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/properties" 
            element={
              <SearchPage 
                favorites={favorites}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                clearFavorites={clearFavorites}
              />
            } 
          />
          <Route 
            path="/property/:id" 
            element={
              <PropertyDetails 
                favorites={favorites}
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
