"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, MapPin, Phone, Mail, Clock, MapPinIcon, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomImageIndex, setRoomImageIndex] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const sectionsRef = useRef({})

  const roomImages = {
    "Deluxe AC Room": [
      "/room1.JPG",
      "/room2.jpg",
      "/washroom1.jpg",
    ],
    "Standard AC Room": [
      "/room3.jpg",
      "/room4.jpg",
      "/washroom1.jpg",
    ],
    "Single AC Room": [
      "/nonac3.jpg",
      "/nonac2.jpg",
      "/nonac1.jpg",
    ],
  }

  const hotelImages = [
    "/front.JPG",
    "/reception.JPG",
    "/room2.jpg",
    "/room1.JPG",
    "/lobby.JPG",
  ]

  const roomTypes = [
    {
      name: "Deluxe AC Room",
      size: "110 sq.ft (10 sq.mt)",
      view: "City View",
      beds: "1 Queen Bed",
      bathroom: "1 Bathroom",
      icon: "👑",
    },
    {
      name: "Standard AC Room",
      size: "90 sq.ft (8 sq.mt)",
      view: "Standard View",
      beds: "1 Queen Bed",
      bathroom: "1 Bathroom",
      icon: "🛏️",
    },
    {
      name: "Single AC Room",
      size: "70 sq.ft (7 sq.mt)",
      view: "Compact",
      beds: "1 Double Bed",
      bathroom: "1 Bathroom",
      icon: "🚪",
    },
  ]

  const amenities = {
    "Basic Facilities": [
      "Refrigerator",
      "Air Conditioning (Hot & Cold)",
      "Newspaper",
      "Driver's Accommodation",
      "24-hour Room Service",
      "Power Backup",
      "Paid On-site Parking",
      "Free Wi-Fi",
      "Free LAN",
      "Elevator/Lift",
      "Housekeeping",
    ],
    "General Services": [
      "Caretaker",
      "Pool/Beach Towels",
      "Facilities for Guests with Disabilities",
      "Multilingual Staff (English | Hindi)",
      "Wheelchair (Paid)",
      "Doctor on Call",
      "Luggage Assistance",
    ],
    "Health & Wellness": ["First-Aid Services"],
    Transfers: [
      "Paid Shuttle Service",
      "Paid Bus Station Transfers",
      "Paid Railway Transfers",
      "Paid Airport Transfers (Private Taxi)",
    ],
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [hotelImages.length])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length)

  const openRoomModal = (roomName) => {
    setSelectedRoom(roomName)
    setRoomImageIndex(0)
  }

  const nextRoomImage = () => {
    const images = roomImages[selectedRoom] || []
    setRoomImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevRoomImage = () => {
    const images = roomImages[selectedRoom] || []
    setRoomImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      const response = await fetch('http://localhost:5000/form/data', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      console.log('Success:', result)
      
      setShowSuccessModal(true)
      setFormData({ name: "", email: "", phone: "", message: "" })
      setTimeout(() => setShowSuccessModal(false), 4000)
    } catch (error) {
      console.error('Error:', error)
      // Optionally show an error message to the user
      alert('Failed to send message. Please try again later.')
    }
  }

  return (
    <div className="bg-background text-foreground">
      {/* Navigation - with backdrop blur and scroll effect */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm"
        style={{
          y: scrollY > 100 ? 0 : 0,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-serif font-bold text-amber-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shreegopal
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {["hero", "about", "rooms", "amenities", "location", "contact"].map((item) => (
              <motion.button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-amber-900 capitalize font-medium relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-amber-700 w-0 group-hover:w-full transition-all"
                  layoutId="underline"
                />
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-amber-900"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-amber-50 border-t border-amber-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4 p-4">
                {["hero", "about", "rooms", "amenities", "location", "contact"].map((item, idx) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="text-amber-900 capitalize font-medium text-left hover:text-amber-700 transition-colors"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-950 text-pretty">
                  Comfort & Convenience in the Heart of Ujjain
                </h1>
                <p className="text-lg text-amber-800">
                  Your gateway to spiritual bliss, just 900 meters from Mahakal Temple
                </p>
              </div>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => scrollToSection("contact")}
                  className="bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Now
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("rooms")}
                  className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(217, 119, 6, 0.05)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Rooms
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="relative h-96 rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={hotelImages[currentImageIndex] || "/placeholder.svg"}
                    alt="Hotel Shreegopal"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white overflow-hidden">
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl font-serif font-bold text-amber-950 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            About Hotel Shreegopal
          </motion.h2>
          <motion.div
            className="prose prose-lg max-w-none text-amber-900 space-y-4 leading-relaxed"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              "Discover Comfort and Convenience at Hotel Shreegopal – Your Gateway to Spiritual Bliss",
              `Nestled in the heart of Ujjain, just 900 meters from the iconic Mahakal Temple, Hotel Shreegopal offers the perfect retreat for both pilgrims and travelers seeking a blend of spirituality and modern comfort. Our prime location places you within 500 meters of Ujjain Railway Station and Bus Stand, ensuring seamless connectivity for your journey.`,
              "Step into a world of warmth and hospitality as we welcome you to our well-appointed, elegantly designed rooms tailored to provide a tranquil escape after your spiritual explorations.",
              "Choose from our meticulously maintained AC rooms, each thoughtfully crafted to meet your comfort needs.",
              "At Hotel Shreegopal, we pride ourselves on offering:",
            ].map((text, idx) => (
              <motion.p key={idx} variants={itemVariants} className={idx === 4 ? "font-semibold" : ""}>
                {text}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-serif font-bold text-amber-950 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Gallery
          </motion.h2>
          <motion.div
            className="relative rounded-lg overflow-hidden shadow-2xl mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative h-96 md:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={hotelImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`Hotel image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <motion.button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-amber-900 p-2 rounded-full z-10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={28} />
              </motion.button>
              <motion.button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-amber-900 p-2 rounded-full z-10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={28} />
              </motion.button>
            </div>

            {/* Dots with animation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {hotelImages.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`rounded-full transition-colors ${
                    idx === currentImageIndex ? "bg-amber-700" : "bg-amber-200 hover:bg-amber-300"
                  }`}
                  animate={{
                    width: idx === currentImageIndex ? 32 : 8,
                    height: 8,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
          <motion.p
            className="text-center text-amber-800 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Image {currentImageIndex + 1} of {hotelImages.length}
          </motion.p>
        </div>
      </section>

      {/* Rooms & Pricing Section */}
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-serif font-bold text-amber-950 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Rooms
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {roomTypes.map((room, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-amber-50 rounded-lg p-8 border border-amber-200 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(217, 119, 6, 0.2)",
                  borderColor: "rgba(217, 119, 6, 1)",
                }}
                onClick={() => openRoomModal(room.name)}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring" }}
                >
                  {room.icon}
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4">{room.name}</h3>
                <div className="space-y-3 text-amber-900">
                  <motion.p
                    className="font-semibold text-lg text-amber-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {room.size}
                  </motion.p>
                  <div className="border-t border-amber-200 pt-3">
                    {[room.view, room.beds, room.bathroom].map((detail, i) => (
                      <motion.p
                        key={i}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-amber-700">•</span>
                        {detail}
                      </motion.p>
                    ))}
                  </div>
                </div>
                <motion.p
                  className="text-sm text-amber-600 mt-4 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  👆 Click to view room images
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRoom(null)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-amber-950 text-white p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-serif font-bold">{selectedRoom}</h2>
                <motion.button
                  onClick={() => setSelectedRoom(null)}
                  className="text-2xl hover:text-amber-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Image Gallery */}
              <div className="relative bg-amber-50 min-h-96">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={roomImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-96"
                  >
                    <Image
                      src={roomImages[selectedRoom]?.[roomImageIndex] || "/placeholder.svg"}
                      alt={`${selectedRoom} - Image ${roomImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {roomImages[selectedRoom]?.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevRoomImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-amber-900 p-3 rounded-full shadow-lg z-10"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft size={32} />
                    </motion.button>
                    <motion.button
                      onClick={nextRoomImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-amber-900 p-3 rounded-full shadow-lg z-10"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight size={32} />
                    </motion.button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {roomImageIndex + 1} of {roomImages[selectedRoom]?.length || 0}
                </div>

                {/* Image Dots */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                  {roomImages[selectedRoom]?.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setRoomImageIndex(idx)}
                      className={`rounded-full transition-colors ${
                        idx === roomImageIndex ? "bg-amber-700" : "bg-white/50 hover:bg-white/70"
                      }`}
                      animate={{
                        width: idx === roomImageIndex ? 28 : 8,
                        height: 8,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>

              {/* Modal Footer with room info */}
              <div className="p-6 bg-white border-t border-amber-200">
                <p className="text-center text-amber-900 text-sm">
                  Click the arrows to view different angles of the room
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amenities Section */}
      <section id="amenities" className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-serif font-bold text-amber-950 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Amenities
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {Object.entries(amenities).map(([category, items]) => (
              <motion.div
                key={category}
                variants={itemVariants}
                className="bg-white rounded-lg p-8 border border-amber-200"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(217, 119, 6, 0.15)",
                }}
              >
                <h3 className="text-2xl font-serif font-bold text-amber-950 mb-6">{category}</h3>
                <motion.ul className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                  {items.map((item, idx) => (
                    <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3 text-amber-950">
                      <span className="text-amber-700 font-bold mt-1">✓</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Review Section */}
          <motion.div
            className="bg-white rounded-lg p-8 border border-amber-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(217, 119, 6, 0.15)",
            }}
          >
            <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4">Guest Reviews</h3>
            <p className="text-amber-900 leading-relaxed">
              Guests appreciated the cleanliness and maintenance of the property, highlighting that rooms were well-kept
              and staff service was commendable. Amenities were generally viewed as satisfactory, providing good value
              for money. Some reviews noted that rooms could be a bit small and better ventilation would enhance
              comfort.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-serif font-bold text-amber-950 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Location
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="bg-amber-50 rounded-lg overflow-hidden h-96"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.0547897898697!2d75.78071!3d23.189372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396435e1e8c1d9e1%3A0x123456789!2sHotel%20Shreegopal%20Ujjain!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4">Distance Information</h3>
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {[
                    { icon: MapPin, title: "Mahakal Mandir", distance: "900 meters away" },
                    { icon: MapPin, title: "Railway Station", distance: "500 meters away" },
                    { icon: MapPin, title: "Bus Stand", distance: "400 meters away" },
                    { icon: MapPin, title: "Indore Airport", distance: "55 km away" },
                  ].map((location, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-4"
                      variants={itemVariants}
                      whileHover={{ x: 10 }}
                    >
                      <location.icon className="text-amber-700 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-950">{location.title}</p>
                        <p className="text-amber-800">{location.distance}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <motion.div
                className="bg-amber-50 p-6 rounded-lg border border-amber-200"
                whileHover={{ scale: 1.02, borderColor: "rgba(217, 119, 6, 1)" }}
              >
                <h4 className="font-semibold text-amber-950 mb-2">Address</h4>
                <p className="text-amber-900">9/10, 167, Tilak Marg, Daulatganj, Ujjain, Madhya Pradesh 456010</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-serif font-bold text-amber-950 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Get in Touch
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[
                { icon: Phone, title: "Phone", content: "+91 8839242955" },
                { icon: Mail, title: "Email", content: "hotelshreegopal24@gmail.com" },
                {
                  icon: MapPinIcon,
                  title: "Address",
                  content: "9/10, 167, Tilak Marg, Daulatganj, Ujjain, Madhya Pradesh 456010",
                },
                { icon: Clock, title: "Check-in / Check-out", content: "11:00 AM / 09:00 AM" },
              ].map((contact, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-4"
                  variants={itemVariants}
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <contact.icon className="text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-950">{contact.title}</p>
                    <p className="text-amber-800">{contact.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.form
              className="bg-white p-8 rounded-lg border border-amber-200 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              onSubmit={handleFormSubmit}
            >
              {[
                { type: "text", placeholder: "Your Name", name: "name" },
                { type: "email", placeholder: "Your Email", name: "email" },
                { type: "tel", placeholder: "Your Phone", name: "phone" },
              ].map((field, idx) => (
                <motion.input
                  key={idx}
                  type={field.type}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950"
                  whileFocus={{ scale: 1.02, borderColor: "rgba(217, 119, 6, 1)" }}
                  required
                />
              ))}
              <motion.textarea
                placeholder="Your Message"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950"
                whileFocus={{ scale: 1.02, borderColor: "rgba(217, 119, 6, 1)" }}
                required
              />
              <motion.button
                type="submit"
                className="w-full bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl border-t-4 border-amber-700"
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 30 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="flex justify-center mb-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <motion.svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
              </motion.div>
              <h3 className="text-2xl font-serif font-bold text-amber-950 text-center mb-3">Message Submitted!</h3>
              <p className="text-center text-amber-800 mb-2">Thank you for reaching out to us.</p>
              <p className="text-center text-amber-700 font-semibold">Our team will get back to you soon.</p>
              <motion.div
                className="mt-6 h-1 bg-gradient-to-r from-amber-700 to-amber-900 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="bg-amber-950 text-amber-50 py-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <h3 className="text-2xl font-serif font-bold mb-4">Hotel Shreegopal</h3>
              <p className="text-amber-200 mb-4">Comfort & Convenience in the Heart of Ujjain</p>
            </motion.div>
            <motion.div
              className="space-y-2 text-amber-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                "📍 9/10, 167, Tilak Marg, Daulatganj, Ujjain, MP 456010",
                "📞 +91 8839242955",
                "📧 hotelshreegopal24@gmail.com",
              ].map((text, idx) => (
                <motion.p key={idx} variants={itemVariants}>
                  {text}
                </motion.p>
              ))}
            </motion.div>
          </div>
          <motion.div className="border-t border-amber-800 pt-8 text-center text-amber-300">
            <p>© 2025 Hotel Shreegopal | All Rights Reserved</p>
            <p className="text-sm mt-2">Ujjain, Madhya Pradesh, India</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
