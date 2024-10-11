'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter, Heart, Info, MapPin, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for date ideas
const dateIdeas = [
  {
    id: 1,
    title: 'Sunset Picnic at Hilltop Park',
    location: 'Hilltop Park, Downtown',
    categories: ['Outdoors', 'Romantic', 'Budget-friendly'],
    price: 2,
    description: 'Enjoy a beautiful sunset with a picnic basket full of local delicacies.',
    images: [
      'https://images.unsplash.com/photo-1566995541428-f2246c17cda1',
      'https://images.unsplash.com/photo-1592753054398-9fa298d40e85',
      'https://plus.unsplash.com/premium_photo-1661685109508-9c79ed93227b'
    ],
    isTrending: true
  },
  {
    id: 2,
    title: 'Cooking Class at Chef\'s Kitchen',
    location: 'Downtown Culinary Institute',
    categories: ['Indoor', 'Learning', 'Food & Drink'],
    price: 3,
    description: 'Learn to cook authentic Italian pasta together with expert chefs.',
    images: [
      'https://plus.unsplash.com/premium_photo-1683707120391-6c0da3cac6be',
      'https://plus.unsplash.com/premium_photo-1683707120403-9add00a6140e',
      'https://plus.unsplash.com/premium_photo-1683707120552-8618a5e41d20'
    ],
    isTrending: false
  },
  {
    id: 3,
    title: 'Kayaking Adventure',
    location: 'Crystal Lake',
    categories: ['Outdoor', 'Active', 'Water Sports'],
    price: 2,
    description: 'Paddle through scenic waterways and hidden coves together.',
    images: [
      'https://images.unsplash.com/photo-1554629907-479bff71f153',
      'https://plus.unsplash.com/premium_photo-1680184593283-94330b1bd261',
      'https://images.unsplash.com/photo-1494175022155-9d4da9a6a8b6'
    ],
    isTrending: false
  }
  {
    id: 4,
    title: 'Stargazing at Aurora Hill',
    location: 'Aurora Hill Observatory',
    categories: ['Outdoors', 'Romantic', 'Nighttime'],
    price: 1,
    description: 'Lay back and watch the stars in a peaceful setting, far from city lights.',
    images: [
      'https://images.unsplash.com/photo-1531240060046-34c7a761caa1',
      'https://images.unsplash.com/photo-1502390203055-10f3dd8d7f53',
      'https://images.unsplash.com/photo-1483721310020-03333e577078'
    ],
    isTrending: true
  },
  {
    id: 5,
    title: 'Wine Tasting at Vine Estate',
    location: 'Vine Estate Winery',
    categories: ['Food & Drink', 'Luxury', 'Outdoor'],
    price: 4,
    description: 'Savor a variety of wines in a scenic vineyard setting.',
    images: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919',
      'https://images.unsplash.com/photo-1541781286213-318a50c24dd5',
      'https://images.unsplash.com/photo-1513493210927-fe046ed56bbc'
    ],
    isTrending: false
  },
  {
    id: 6,
    title: 'Couples Pottery Class',
    location: 'ClayWorks Studio',
    categories: ['Indoor', 'Learning', 'Creative'],
    price: 3,
    description: 'Get your hands dirty and create unique pottery pieces together.',
    images: [
      'https://images.unsplash.com/photo-1589654313597-4d5d15e9cc31',
      'https://images.unsplash.com/photo-1562137031-cc5b6486776d',
      'https://images.unsplash.com/photo-1602415698779-343b4ee1ef14'
    ],
    isTrending: true
  },
  {
    id: 7,
    title: 'Biking through Sunset Trails',
    location: 'Sunset Park Trails',
    categories: ['Outdoors', 'Active', 'Adventure'],
    price: 2,
    description: 'Enjoy a scenic bike ride at sunset, through beautiful trails and parks.',
    images: [
      'https://images.unsplash.com/photo-1561214045-4e2572c70b84',
      'https://images.unsplash.com/photo-1601586782044-6433e4b494c2',
      'https://images.unsplash.com/photo-1590103514556-4627053c133b'
    ],
    isTrending: false
  },
  {
    id: 8,
    title: 'Movie Night at Rooftop Cinema',
    location: 'Skyline Rooftop Cinema',
    categories: ['Nighttime', 'Entertainment', 'Budget-friendly'],
    price: 2,
    description: 'Watch a classic film under the stars with a stunning city view.',
    images: [
      'https://images.unsplash.com/photo-1609953651132-594926e60ee6',
      'https://images.unsplash.com/photo-1517610600290-6ed2a224ae79',
      'https://images.unsplash.com/photo-1522401803050-f69f1e5f40d1'
    ],
    isTrending: true
  }
]

const categories = ['Outdoors', 'Indoor', 'Romantic', 'Active', 'Learning', 'Food & Drink', 'Water Sports', 'Budget-friendly']

export default function SwipeScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentDateIndex, setCurrentDateIndex] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [showNoMatch, setShowNoMatch] = useState(false)
  const [matchedDateIdea, setMatchedDateIdea] = useState(null)
  const [dateHistory, setDateHistory] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const filteredDateIdeas = selectedCategories.length > 0
    ? dateIdeas.filter(idea => 
        idea.categories.some(category => selectedCategories.includes(category))
      )
    : dateIdeas

  const currentDateIdea = filteredDateIdeas[currentDateIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setMatchedDateIdea(currentDateIdea)
      setShowMatch(true)
    }
    
    setDateHistory([...dateHistory, { ...currentDateIdea, direction }])
    
    const nextIndex = currentDateIndex + 1
    if (nextIndex < filteredDateIdeas.length) {
      setCurrentDateIndex(nextIndex)
      setCurrentImageIndex(0)
    } else {
      setShowNoMatch(true)
    }
    
    // Reset card position
    setTimeout(() => {
      x.set(0)
    }, 300)
  }

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handleSwipe('right')
    } else if (info.offset.x < -100) {
      handleSwipe('left')
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === currentDateIdea.images.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentDateIdea.images.length - 1 : prev - 1
    )
  }

  const handleUndo = () => {
    if (dateHistory.length > 0) {
      const previousDate = dateHistory[dateHistory.length - 1]
      setCurrentDateIndex(filteredDateIdeas.findIndex(idea => idea.id === previousDate.id))
      setCurrentImageIndex(0)
      setDateHistory(dateHistory.slice(0, -1))
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-900 flex flex-col items-center">
      <header className="w-full p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          DateMatch
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-white bg-opacity-20 backdrop-blur-lg">
              <Filter className="h-5 w-5" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 w-full max-w-md px-4 py-8 flex flex-col items-center justify-center relative">
        {currentDateIdea && (
          <motion.div
            key={currentDateIdea.id}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-full touch-none cursor-grab active:cursor-grabbing"
          >
            <Card className="overflow-hidden rounded-3xl shadow-lg bg-white bg-opacity-70 backdrop-blur-md">
              <div className="relative h-[65vh]">
                <Image
                  src={currentDateIdea.images[currentImageIndex]}
                  alt={currentDateIdea.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {currentDateIdea.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                {currentDateIdea.isTrending && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white">
                    Trending
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Next image</span>
                </Button>
              </div>
              <div className="p-6 bg-white rounded-t-3xl -mt-6 relative z-10">
                <h2 className="text-2xl font-bold mb-2">{currentDateIdea.title}</h2>
                <div className="flex items-center text-neutral-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{currentDateIdea.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentDateIdea.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="rounded-full">
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-semibold text-teal-600">
                    {'$'.repeat(currentDateIdea.price)}
                    <span className="text-neutral-400">{'$'.repeat(4 - currentDateIdea.price)}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Info className="h-5 w-5" />
                    <span className="sr-only">More information</span>
                  </Button>
                </div>
                <p className="text-neutral-600 text-sm">{currentDateIdea.description}</p>
              </div>
            </Card>
          </motion.div>
        )}
      </main>

      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex justify-center items-center space-x-8 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full bg-white shadow-lg hover:bg-red-50 transition-colors duration-300"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-8 w-8 text-red-500" />
          <span className="sr-only">Dislike</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-white shadow-md hover:bg-neutral-50 transition-colors duration-300"
          onClick={handleUndo}
        >
          <RotateCcw className="h-6 w-6 text-neutral-500" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full bg-white shadow-lg hover:bg-green-50 transition-colors duration-300"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-8 w-8 text-green-500" />
          <span className="sr-only">Like</span>
        </Button>
      </footer>

      <AnimatePresence>
        {showMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setShowMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                <Image
                  src={matchedDateIdea.images[0]}
                  alt={matchedDateIdea.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                It's a Match!
              </h2>
              <p className="text-neutral-600 mb-6">You both want to try this date idea!</p>
              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:opacity-90 transition-opacity">
                  Plan the Date
                </Button>
                <Button variant="outline" className="flex-1 hover:bg-gray-50 transition-colors">
                  More Details
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNoMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setShowNoMatch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold mb-4 text-neutral-800">
                No Match Found
              </h2>
              <p className="text-neutral-600 mb-6">You've gone through all available date ideas. Try adjusting your preferences or check back later for new ideas!</p>
              <Button 
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:opacity-90 transition-opacity"
                onClick={() => {
                  setShowNoMatch(false)
                  setCurrentDateIndex(0)
                  setDateHistory([])
                }}
              >
                Start Over
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}