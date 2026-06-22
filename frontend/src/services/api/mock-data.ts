import {
  Movie,
  Cinema,
  Hall,
  Showtime,
  Seat,
  Booking,
  User,
  FoodItem,
  Promotion,
  Payment,
  Staff,
  DashboardStats,
  RevenueData,
  OccupancyData,
  TicketSalesData,
  SeatType,
} from "@/types"

function generateSeatMap(rows: number, cols: number, types?: Record<string, SeatType>): Seat[][] {
  const seatMap: Seat[][] = []
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let r = 0; r < rows; r++) {
    const row: Seat[] = []
    for (let c = 0; c < cols; c++) {
      const rowLabel = rowLabels[r]
      const key = `${rowLabel}${c + 1}`
      let type: SeatType = "standard"
      if (types && types[key]) {
        type = types[key]
      } else if (r < 2) {
        type = "vip"
      } else if (r >= rows - 1 && c % 2 === 0 && c < cols - 1) {
        type = "couple"
        row.push({
          id: `${key}a`,
          row: rowLabel,
          col: c,
          number: `${rowLabel}${c + 1}A`,
          type: "couple",
          status: "available",
          price: 0,
        })
        row.push({
          id: `${key}b`,
          row: rowLabel,
          col: c,
          number: `${rowLabel}${c + 1}B`,
          type: "couple",
          status: "available",
          price: 0,
        })
        continue
      }
      const price = type === "vip" ? 8 : type === "couple" ? 12 : 5
      row.push({
        id: key,
        row: rowLabel,
        col: c,
        number: key,
        type,
        status: "available",
        price,
      })
    }
    seatMap.push(row)
  }
  return seatMap
}

const now = new Date()
const today = now.toISOString().split("T")[0]

function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export const movies: Movie[] = [
  {
    id: "movie-001",
    title: "អ្នកប្រមាញ់កំណប់",
    slug: "the-treasure-hunter",
    description:
      "A Cambodian archaeologist embarks on a perilous journey through the Angkorian temples to uncover an ancient Khmer treasure before a ruthless syndicate gets to it first.",
    posterUrl: "/images/movies/treasure-hunter-poster.jpg",
    backdropUrl: "/images/movies/treasure-hunter-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example1",
    genre: ["Action", "Adventure"],
    duration: 128,
    releaseDate: "2026-05-15",
    endDate: "2026-07-15",
    rating: "PG-13",
    director: "Mao Samnang",
    cast: ["Sok Sothea", "Khim Sreyneang", "Chan Rithy"],
    language: "Khmer",
    subtitle: "English",
    isFeatured: true,
    isNowShowing: true,
    isComingSoon: false,
    status: "now_showing",
  },
  {
    id: "movie-002",
    title: "Neon Dreams",
    slug: "neon-dreams",
    description:
      "In a futuristic Phnom Penh, a young hacker discovers a conspiracy that could plunge the city into chaos. She must navigate the neon-lit streets to save everything she loves.",
    posterUrl: "/images/movies/neon-dreams-poster.jpg",
    backdropUrl: "/images/movies/neon-dreams-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example2",
    genre: ["Sci-Fi", "Action"],
    duration: 142,
    releaseDate: "2026-06-01",
    endDate: "2026-08-01",
    rating: "PG-13",
    director: "James Chen",
    cast: ["Lina Mao", "David Park", "Sophal Meas"],
    language: "English",
    subtitle: "Khmer",
    isFeatured: true,
    isNowShowing: true,
    isComingSoon: false,
    status: "now_showing",
  },
  {
    id: "movie-003",
    title: "រឿងស្នេហ៍នៅសៀមរាប",
    slug: "love-in-siem-reap",
    description:
      "A heartwarming romantic comedy set against the backdrop of Siem Reap's stunning temples. Two strangers meet at Angkor Wat and discover that love can bloom in the most unexpected places.",
    posterUrl: "/images/movies/love-siemreap-poster.jpg",
    backdropUrl: "/images/movies/love-siemreap-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example3",
    genre: ["Romance", "Comedy"],
    duration: 115,
    releaseDate: "2026-04-20",
    endDate: "2026-06-20",
    rating: "PG",
    director: "Srey Mom",
    cast: ["Sok Visal", "Srey Leak", "Heng Bunheang"],
    language: "Khmer",
    subtitle: "English",
    isFeatured: false,
    isNowShowing: true,
    isComingSoon: false,
    status: "now_showing",
  },
  {
    id: "movie-004",
    title: "Shadow Protocol",
    slug: "shadow-protocol",
    description:
      "A former intelligence agent is pulled back into the world of espionage when a shadowy organization threatens to destabilize Southeast Asia. Explosive action and gripping suspense.",
    posterUrl: "/images/movies/shadow-protocol-poster.jpg",
    backdropUrl: "/images/movies/shadow-protocol-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example4",
    genre: ["Action", "Thriller"],
    duration: 135,
    releaseDate: "2026-06-10",
    endDate: "2026-08-10",
    rating: "R",
    director: "Michael Reeves",
    cast: ["Tom Chen", "Sarah Kim", "Rithy Panh"],
    language: "English",
    subtitle: "Khmer",
    isFeatured: true,
    isNowShowing: true,
    isComingSoon: false,
    status: "now_showing",
  },
  {
    id: "movie-005",
    title: "ព្រៃភ្នំអាថ៌កំបាំង",
    slug: "mysterious-mountain",
    description:
      "A group of students on a field trip to the Cardamom Mountains discover an ancient secret hidden deep within the jungle. What starts as an adventure quickly turns into a fight for survival.",
    posterUrl: "/images/movies/mysterious-mountain-poster.jpg",
    backdropUrl: "/images/movies/mysterious-mountain-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example5",
    genre: ["Horror", "Mystery"],
    duration: 118,
    releaseDate: addDays(today, 14),
    endDate: addDays(today, 74),
    rating: "PG-13",
    director: "Keo Soksan",
    cast: ["Rath Vimean", "Sokha Chea", "Vann Vatey"],
    language: "Khmer",
    subtitle: "English",
    isFeatured: false,
    isNowShowing: false,
    isComingSoon: true,
    status: "coming_soon",
  },
  {
    id: "movie-006",
    title: "The Last Temple",
    slug: "the-last-temple",
    description:
      "An epic historical drama set in the Khmer Empire during the construction of Angkor Wat. A master architect must overcome betrayal and political intrigue to complete the greatest temple ever built.",
    posterUrl: "/images/movies/last-temple-poster.jpg",
    backdropUrl: "/images/movies/last-temple-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example6",
    genre: ["Drama", "History"],
    duration: 150,
    releaseDate: addDays(today, 21),
    endDate: addDays(today, 81),
    rating: "PG-13",
    director: "Rithy Van",
    cast: ["Hang Soth", "Chea Siv", "Neang Sokunthea"],
    language: "Khmer",
    subtitle: "English",
    isFeatured: true,
    isNowShowing: false,
    isComingSoon: true,
    status: "coming_soon",
  },
  {
    id: "movie-007",
    title: "Quantum Edge",
    slug: "quantum-edge",
    description:
      "When a quantum computing experiment goes wrong, a scientist must navigate parallel dimensions to find her way back to reality before the barriers between worlds collapse forever.",
    posterUrl: "/images/movies/quantum-edge-poster.jpg",
    backdropUrl: "/images/movies/quantum-edge-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example7",
    genre: ["Sci-Fi", "Thriller"],
    duration: 132,
    releaseDate: addDays(today, 7),
    endDate: addDays(today, 67),
    rating: "PG-13",
    director: "Ava Nakamura",
    cast: ["Emma Wells", "John Kim", "Sophal Meas"],
    language: "English",
    subtitle: "Khmer",
    isFeatured: false,
    isNowShowing: false,
    isComingSoon: true,
    status: "coming_soon",
  },
  {
    id: "movie-008",
    title: "រឿងកំប្លែងគ្រួសារ",
    slug: "family-comedy",
    description:
      "A hilarious family comedy about a multi-generational Khmer family living in Phnom Penh. When the grandmother decides to learn TikTok, chaos and laughter ensue.",
    posterUrl: "/images/movies/family-comedy-poster.jpg",
    backdropUrl: "/images/movies/family-comedy-bg.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=example8",
    genre: ["Comedy", "Drama"],
    duration: 105,
    releaseDate: "2026-05-01",
    endDate: "2026-07-01",
    rating: "PG",
    director: "Sok Pisey",
    cast: ["Sreymom Chan", "Bunthoeun Kim", "Sophea Heng", "Vuthy Nop"],
    language: "Khmer",
    subtitle: "English",
    isFeatured: false,
    isNowShowing: true,
    isComingSoon: false,
    status: "now_showing",
  },
]

export const cinemas: Cinema[] = [
  {
    id: "cinema-001",
    name: "CinePremium Phnom Penh",
    slug: "cinepremium-phnom-penh",
    address: "#168, Street 163, Khan 7 Makara",
    city: "Phnom Penh",
    phone: "+855 23 888 168",
    imageUrl: "/images/cinemas/phnom-penh.jpg",
    halls: [
      {
        id: "hall-001",
        name: "Hall 1 - IMAX",
        cinemaId: "cinema-001",
        type: "imax",
        totalSeats: 180,
        rows: 12,
        cols: 15,
        seatMap: generateSeatMap(12, 15),
      },
      {
        id: "hall-002",
        name: "Hall 2 - VIP",
        cinemaId: "cinema-001",
        type: "vip",
        totalSeats: 60,
        rows: 6,
        cols: 10,
        seatMap: generateSeatMap(6, 10),
      },
      {
        id: "hall-003",
        name: "Hall 3 - Standard",
        cinemaId: "cinema-001",
        type: "standard",
        totalSeats: 120,
        rows: 10,
        cols: 12,
        seatMap: generateSeatMap(10, 12),
      },
      {
        id: "hall-004",
        name: "Hall 4 - 4DX",
        cinemaId: "cinema-001",
        type: "4dx",
        totalSeats: 80,
        rows: 8,
        cols: 10,
        seatMap: generateSeatMap(8, 10),
      },
    ],
  },
  {
    id: "cinema-002",
    name: "CinePremium Siem Reap",
    slug: "cinepremium-siem-reap",
    address: "Sivatha Road, Svay Dangkum",
    city: "Siem Reap",
    phone: "+855 63 888 168",
    imageUrl: "/images/cinemas/siem-reap.jpg",
    halls: [
      {
        id: "hall-005",
        name: "Hall 1 - Standard",
        cinemaId: "cinema-002",
        type: "standard",
        totalSeats: 100,
        rows: 10,
        cols: 10,
        seatMap: generateSeatMap(10, 10),
      },
      {
        id: "hall-006",
        name: "Hall 2 - VIP",
        cinemaId: "cinema-002",
        type: "vip",
        totalSeats: 40,
        rows: 5,
        cols: 8,
        seatMap: generateSeatMap(5, 8),
      },
    ],
  },
  {
    id: "cinema-003",
    name: "CinePremium Sihanoukville",
    slug: "cinepremium-sihanoukville",
    address: "Ekareach Street, Sangkat 3",
    city: "Sihanoukville",
    phone: "+855 34 888 168",
    imageUrl: "/images/cinemas/sihanoukville.jpg",
    halls: [
      {
        id: "hall-007",
        name: "Hall 1 - Standard",
        cinemaId: "cinema-003",
        type: "standard",
        totalSeats: 90,
        rows: 9,
        cols: 10,
        seatMap: generateSeatMap(9, 10),
      },
      {
        id: "hall-008",
        name: "Hall 2 - Standard",
        cinemaId: "cinema-003",
        type: "standard",
        totalSeats: 80,
        rows: 8,
        cols: 10,
        seatMap: generateSeatMap(8, 10),
      },
    ],
  },
]

function getAllHalls(): Hall[] {
  return cinemas.flatMap((c) => c.halls)
}

function getMovie(id: string): Movie | undefined {
  return movies.find((m) => m.id === id)
}

function getHall(id: string): Hall | undefined {
  return getAllHalls().find((h) => h.id === id)
}

function getCinema(id: string): Cinema | undefined {
  return cinemas.find((c) => c.id === id)
}

const startTimes = ["09:00", "11:30", "14:00", "16:30", "19:00", "21:30"]
function generateEndTime(start: string, duration: number): string {
  const [h, m] = start.split(":").map(Number)
  const total = h * 60 + m + duration + 15
  const endH = Math.floor(total / 60) % 24
  const endM = total % 60
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`
}

function generateShowtimes(): Showtime[] {
  const showtimes: Showtime[] = []
  const nowShowing = movies.filter((m) => m.isNowShowing)
  const allHalls = getAllHalls()
  let id = 1

  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day)
    for (const movie of nowShowing) {
      const cinemasForDay = day < 3 ? cinemas : [cinemas[0]]
      for (const cinema of cinemasForDay) {
        const cinemaHalls = allHalls.filter((h) => h.cinemaId === cinema.id)
        for (const hall of cinemaHalls.slice(0, 2)) {
          const numShowtimes = Math.min(startTimes.length, Math.floor(Math.random() * 3) + 2)
          const shuffled = [...startTimes].sort(() => Math.random() - 0.5).slice(0, numShowtimes)
          for (const startTime of shuffled) {
            const endTime = generateEndTime(startTime, movie.duration)
            const totalSeatsInHall = hall.seatMap.flat().length
            const availableSeats = Math.max(0, totalSeatsInHall - Math.floor(Math.random() * 30))
            const sid = `showtime-${String(id).padStart(3, "0")}`
            id++
            showtimes.push({
              id: sid,
              movieId: movie.id,
              hallId: hall.id,
              cinemaId: cinema.id,
              date,
              startTime,
              endTime,
              price: 5,
              vipPrice: 8,
              couplePrice: 12,
              hall,
              movie,
              cinema,
              availableSeats,
              totalSeats: totalSeatsInHall,
            })
          }
        }
      }
    }
  }
  return showtimes
}

export const showtimes: Showtime[] = generateShowtimes()

export const users: User[] = [
  {
    id: "user-001",
    email: "admin@cinepremium.com",
    name: "Admin User",
    phone: "+855 12 888 001",
    avatar: null,
    role: "super_admin",
    loyaltyPoints: 50000,
    loyaltyTier: "platinum",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-002",
    email: "staff@cinepremium.com",
    name: "Staff User",
    phone: "+855 12 888 002",
    avatar: null,
    role: "staff",
    loyaltyPoints: 10000,
    loyaltyTier: "gold",
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "user-003",
    email: "sokha@gmail.com",
    name: "Sokha Chea",
    phone: "+855 12 345 678",
    avatar: null,
    role: "customer",
    loyaltyPoints: 2500,
    loyaltyTier: "silver",
    createdAt: "2025-03-10T00:00:00Z",
  },
  {
    id: "user-004",
    email: "vireak@yahoo.com",
    name: "Vireak Sorn",
    phone: "+855 12 987 654",
    avatar: null,
    role: "customer",
    loyaltyPoints: 8500,
    loyaltyTier: "gold",
    createdAt: "2025-02-20T00:00:00Z",
  },
  {
    id: "user-005",
    email: "dara@hotmail.com",
    name: "Dara Heng",
    phone: "+855 12 456 789",
    avatar: null,
    role: "customer",
    loyaltyPoints: 400,
    loyaltyTier: "bronze",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "user-006",
    email: "kolab@gmail.com",
    name: "Kolab Srey",
    phone: "+855 12 789 123",
    avatar: null,
    role: "customer",
    loyaltyPoints: 18000,
    loyaltyTier: "platinum",
    createdAt: "2025-06-01T00:00:00Z",
  },
]

function getShowtimeById(id: string): Showtime | undefined {
  return showtimes.find((s) => s.id === id)
}

function pick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function pickSeatsForBooking(showtime: Showtime, count: number): Seat[] {
  const allSeats = showtime.hall.seatMap.flat()
  return pick(allSeats, count).map((s) => ({ ...s, status: "booked" as const }))
}

export const bookings: Booking[] = (() => {
  const items: Booking[] = []
  const customerUsers = users.filter((u) => u.role === "customer")
  for (let i = 0; i < 15; i++) {
    const showtime = showtimes[i % showtimes.length]
    if (!showtime) continue
    const user = customerUsers[i % customerUsers.length]
    const seatCount = (i % 3) + 1
    const seats = pickSeatsForBooking(showtime, seatCount)
    const amount = seats.reduce((sum, s) => sum + s.price, 0)
    const statuses: Array<Booking["status"]> = ["confirmed", "confirmed", "completed", "cancelled", "pending"]
    const status = statuses[i % statuses.length]
    const payStatus: Booking["paymentStatus"] =
      status === "cancelled" ? "refunded" : status === "pending" ? "pending" : "completed"
    items.push({
      id: `booking-${String(i + 1).padStart(3, "0")}`,
      userId: user.id,
      showtimeId: showtime.id,
      seats,
      totalAmount: amount,
      status,
      paymentStatus: payStatus,
      paymentMethod: i % 2 === 0 ? "khqr" : "credit_card",
      qrCode: `/images/qr/booking-${String(i + 1).padStart(3, "0")}.png`,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      showtime,
      foodItems: [],
    })
  }
  return items
})()

export const foodItems: FoodItem[] = [
  {
    id: "food-001",
    name: "Large Popcorn",
    description: "Freshly popped large butter popcorn",
    price: 15000,
    imageUrl: "/images/food/popcorn-large.jpg",
    category: "popcorn",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-002",
    name: "Medium Popcorn",
    description: "Freshly popped medium butter popcorn",
    price: 10000,
    imageUrl: "/images/food/popcorn-medium.jpg",
    category: "popcorn",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-003",
    name: "Small Popcorn",
    description: "Freshly popped small butter popcorn",
    price: 6000,
    imageUrl: "/images/food/popcorn-small.jpg",
    category: "popcorn",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-004",
    name: "Coca-Cola Large",
    description: "Large Coca-Cola with ice",
    price: 8000,
    imageUrl: "/images/food/coke-large.jpg",
    category: "drinks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-005",
    name: "Coca-Cola Medium",
    description: "Medium Coca-Cola with ice",
    price: 5000,
    imageUrl: "/images/food/coke-medium.jpg",
    category: "drinks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-006",
    name: "ទឹកក្រូចច្របាច់",
    description: "Freshly squeezed orange juice",
    price: 7000,
    imageUrl: "/images/food/orange-juice.jpg",
    category: "drinks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-007",
    name: "ទឹកត្រសក់",
    description: "Fresh sugarcane juice with lime",
    price: 5000,
    imageUrl: "/images/food/sugarcane-juice.jpg",
    category: "drinks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-008",
    name: "French Fries",
    description: "Crispy golden french fries with ketchup",
    price: 8000,
    imageUrl: "/images/food/fries.jpg",
    category: "snacks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-009",
    name: "គ្រឿងស្ងួតខ្មែរ",
    description: "Mixed Khmer dried snacks with chili dip",
    price: 6000,
    imageUrl: "/images/food/khmer-snacks.jpg",
    category: "snacks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-010",
    name: "Nachos with Cheese",
    description: "Crispy nachos topped with melted cheese",
    price: 10000,
    imageUrl: "/images/food/nachos.jpg",
    category: "snacks",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-011",
    name: "ស្ករគ្រាប់ខ្មែរ",
    description: "Assorted Khmer traditional candies",
    price: 4000,
    imageUrl: "/images/food/khmer-candy.jpg",
    category: "candy",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-012",
    name: "M&M's",
    description: "Chocolate candies",
    price: 5000,
    imageUrl: "/images/food/mms.jpg",
    category: "candy",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-013",
    name: "ចាវ",
    description: "Hot steamed dumplings with pork filling",
    price: 12000,
    imageUrl: "/images/food/dumplings.jpg",
    category: "hot_food",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-014",
    name: "នំបញ្ចុក",
    description: "Khmer noodle soup with fish gravy",
    price: 10000,
    imageUrl: "/images/food/nom-banh-chok.jpg",
    category: "hot_food",
    isAvailable: true,
    isCombo: false,
    comboItems: [],
  },
  {
    id: "food-015",
    name: "Double Combo",
    description: "2 Large Popcorns + 2 Large Drinks",
    price: 35000,
    imageUrl: "/images/food/double-combo.jpg",
    category: "combo",
    isAvailable: true,
    isCombo: true,
    comboItems: ["food-001", "food-001", "food-004", "food-004"],
  },
  {
    id: "food-016",
    name: "Date Night Combo",
    description: "1 Large Popcorn + 2 Medium Drinks + 1 Candy",
    price: 25000,
    imageUrl: "/images/food/date-combo.jpg",
    category: "combo",
    isAvailable: true,
    isCombo: true,
    comboItems: ["food-001", "food-005", "food-005", "food-011"],
  },
  {
    id: "food-017",
    name: "Family Combo",
    description: "3 Large Popcorns + 4 Medium Drinks + 2 Nachos",
    price: 55000,
    imageUrl: "/images/food/family-combo.jpg",
    category: "combo",
    isAvailable: true,
    isCombo: true,
    comboItems: ["food-001", "food-001", "food-001", "food-005", "food-005", "food-005", "food-005", "food-010", "food-010"],
  },
  {
    id: "food-018",
    name: "Snack Combo",
    description: "1 Medium Popcorn + 1 Drink + 1 Snack",
    price: 20000,
    imageUrl: "/images/food/snack-combo.jpg",
    category: "combo",
    isAvailable: true,
    isCombo: true,
    comboItems: ["food-002", "food-005", "food-008"],
  },
]

export const promotions: Promotion[] = [
  {
    id: "promo-001",
    code: "WELCOME20",
    title: "Welcome 20% Off",
    description: "First time booking? Enjoy 20% off your first ticket purchase",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 10000,
    maxDiscount: 20000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 1,
    usageCount: 45,
    isActive: true,
    applicableMovies: [],
  },
  {
    id: "promo-002",
    code: "MONDAY5000",
    title: "Monday Madness",
    description: "Get 5,000 KHR off every Monday movie ticket",
    discountType: "fixed",
    discountValue: 5000,
    minPurchase: 10000,
    maxDiscount: 5000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 4,
    usageCount: 128,
    isActive: true,
    applicableMovies: [],
  },
  {
    id: "promo-003",
    code: "STUDENT15",
    title: "Student Discount",
    description: "15% discount for students with valid ID",
    discountType: "percentage",
    discountValue: 15,
    minPurchase: 8000,
    maxDiscount: 15000,
    startDate: "2026-06-01",
    endDate: "2026-09-01",
    usageLimit: 10,
    usageCount: 67,
    isActive: true,
    applicableMovies: [],
  },
  {
    id: "promo-004",
    code: "VIPGOLD",
    title: "VIP Gold Member",
    description: "Special 30% discount for Gold tier loyalty members",
    discountType: "percentage",
    discountValue: 30,
    minPurchase: 15000,
    maxDiscount: 25000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 0,
    usageCount: 234,
    isActive: true,
    applicableMovies: [],
  },
  {
    id: "promo-005",
    code: "COUPLE30",
    title: "Date Night Special",
    description: "30% off when booking 2 or more seats",
    discountType: "percentage",
    discountValue: 30,
    minPurchase: 20000,
    maxDiscount: 30000,
    startDate: "2026-02-01",
    endDate: "2026-12-31",
    usageLimit: 0,
    usageCount: 89,
    isActive: true,
    applicableMovies: ["movie-003"],
  },
  {
    id: "promo-006",
    code: "SUMMERFUN",
    title: "Summer Fun Pass",
    description: "Flat 10,000 KHR off any movie this summer",
    discountType: "fixed",
    discountValue: 10000,
    minPurchase: 25000,
    maxDiscount: 10000,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    usageLimit: 5,
    usageCount: 12,
    isActive: true,
    applicableMovies: [],
  },
]

export const payments: Payment[] = bookings.map((b) => ({
  id: `payment-${b.id.split("-")[1]}`,
  bookingId: b.id,
  amount: b.totalAmount,
  method: b.paymentMethod as Payment["method"],
  status: b.paymentStatus === "refunded" ? "refunded" : b.paymentStatus === "completed" ? "completed" : "pending",
  transactionId: b.paymentStatus === "completed" ? `TXN${String(Math.floor(Math.random() * 10000000)).padStart(7, "0")}` : null,
  khqrImage: b.paymentMethod === "khqr" ? `/images/qr/payment-${b.id.split("-")[1]}.png` : null,
  createdAt: b.createdAt,
  updatedAt: b.createdAt,
}))

export const staffMembers: Staff[] = [
  {
    id: "staff-001",
    userId: "user-002",
    user: users[1],
    position: "Cinema Manager",
    department: "Operations",
    salary: 1800,
    hireDate: "2025-01-15",
    status: "active",
    attendance: [
      { date: today, checkIn: "08:00", checkOut: "17:00", status: "present" },
      { date: addDays(today, -1), checkIn: "08:15", checkOut: "17:00", status: "present" },
      { date: addDays(today, -2), checkIn: "08:00", checkOut: "17:30", status: "present" },
    ],
  },
  {
    id: "staff-002",
    userId: "user-001",
    user: users[0],
    position: "General Manager",
    department: "Management",
    salary: 3500,
    hireDate: "2024-11-01",
    status: "active",
    attendance: [
      { date: today, checkIn: "07:45", checkOut: "18:00", status: "present" },
      { date: addDays(today, -1), checkIn: "08:00", checkOut: "17:00", status: "present" },
      { date: addDays(today, -2), checkIn: "07:50", checkOut: "18:30", status: "present" },
    ],
  },
  {
    id: "staff-003",
    userId: "none",
    user: {
      id: "user-007",
      email: "sreyka@cinepremium.com",
      name: "Sreyka Mom",
      phone: "+855 12 777 001",
      avatar: null,
      role: "staff",
      loyaltyPoints: 3000,
      loyaltyTier: "silver",
      createdAt: "2025-04-01T00:00:00Z",
    },
    position: "Ticket Seller",
    department: "Box Office",
    salary: 800,
    hireDate: "2025-04-01",
    status: "active",
    attendance: [
      { date: today, checkIn: "08:30", checkOut: "16:30", status: "present" },
      { date: addDays(today, -1), checkIn: "09:00", checkOut: "17:00", status: "late" },
    ],
  },
  {
    id: "staff-004",
    userId: "none",
    user: {
      id: "user-008",
      email: "rithy@cinepremium.com",
      name: "Rithy Chheng",
      phone: "+855 12 777 002",
      avatar: null,
      role: "staff",
      loyaltyPoints: 1500,
      loyaltyTier: "bronze",
      createdAt: "2025-06-01T00:00:00Z",
    },
    position: "Concession Staff",
    department: "Food & Beverage",
    salary: 700,
    hireDate: "2025-06-01",
    status: "active",
    attendance: [
      { date: today, checkIn: "09:00", checkOut: "18:00", status: "present" },
      { date: addDays(today, -1), checkIn: "08:45", checkOut: "17:45", status: "present" },
      { date: addDays(today, -2), checkIn: "09:00", checkOut: "18:00", status: "present" },
    ],
  },
  {
    id: "staff-005",
    userId: "none",
    user: {
      id: "user-009",
      email: "visal@cinepremium.com",
      name: "Visal Sok",
      phone: "+855 12 777 003",
      avatar: null,
      role: "staff",
      loyaltyPoints: 2000,
      loyaltyTier: "bronze",
      createdAt: "2025-05-15T00:00:00Z",
    },
    position: "Projectionist",
    department: "Technical",
    salary: 900,
    hireDate: "2025-05-15",
    status: "active",
    attendance: [
      { date: today, checkIn: "07:30", checkOut: "16:30", status: "present" },
      { date: addDays(today, -1), checkIn: "07:45", checkOut: "16:45", status: "present" },
    ],
  },
]

export const dashboardStats: DashboardStats = {
  totalRevenue: 45850000,
  totalTickets: 3840,
  totalCustomers: 1526,
  occupancyRate: 68.5,
  revenueGrowth: 12.3,
  ticketsGrowth: 8.7,
  customersGrowth: 15.2,
  occupancyGrowth: 3.1,
}

export const revenueChartData: RevenueData[] = Array.from({ length: 30 }, (_, i) => ({
  date: addDays(today, -29 + i),
  revenue: Math.floor(Math.random() * 3000000) + 1000000,
  tickets: Math.floor(Math.random() * 150) + 50,
}))

export const occupancyData: OccupancyData[] = [
  { date: today, rate: 72, showtime: "09:00" },
  { date: today, rate: 58, showtime: "11:30" },
  { date: today, rate: 81, showtime: "14:00" },
  { date: today, rate: 65, showtime: "16:30" },
  { date: today, rate: 92, showtime: "19:00" },
  { date: today, rate: 88, showtime: "21:30" },
]

export const ticketSalesData: TicketSalesData[] = movies
  .filter((m) => m.isNowShowing)
  .map((m) => ({
    movieId: m.id,
    movieTitle: m.title,
    ticketsSold: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 3000000) + 500000,
    occupancyRate: Math.floor(Math.random() * 40) + 50,
  }))

export { getAllHalls, getMovie, getHall, getCinema, getShowtimeById, addDays }
