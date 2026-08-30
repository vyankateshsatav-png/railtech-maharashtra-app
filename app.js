import React, { useState } from 'react';
import { MapPin, Zap, Utensils, HelpCircle, AlertCircle, Home, Menu, X } from 'lucide-react';

const RailTechMaharashtra = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Maharashtra Railway Stations Database
  const stations = [
    { id: 1, name: 'Mumbai Central', city: 'Mumbai', zone: 'Western' },
    { id: 2, name: 'Pune Junction', city: 'Pune', zone: 'Central' },
    { id: 3, name: 'Nagpur Junction', city: 'Nagpur', zone: 'South Eastern' },
    { id: 4, name: 'Aurangabad Junction', city: 'Aurangabad', zone: 'Central' },
    { id: 5, name: 'Nashik Road', city: 'Nashik', zone: 'Central' },
    { id: 6, name: 'Akola Junction', city: 'Akola', zone: 'South Eastern' },
    { id: 7, name: 'Amravati Junction', city: 'Amravati', zone: 'South Eastern' },
    { id: 8, name: 'Thane', city: 'Mumbai Region', zone: 'Western' },
    { id: 9, name: 'Kolhapur Junction', city: 'Kolhapur', zone: 'Western' },
    { id: 10, name: 'Solapur Junction', city: 'Solapur', zone: 'South Central' },
  ];

  // Maharashtra Train Routes
  const trains = [
    { id: 1, name: 'Deccan Queen', source: 'Mumbai Central', destination: 'Pune Junction', time: '4:30 hrs', price: 500 },
    { id: 2, name: 'Vidarbha Express', source: 'Mumbai Central', destination: 'Nagpur Junction', time: '15 hrs', price: 1200 },
    { id: 3, name: 'Aurangabad Express', source: 'Mumbai Central', destination: 'Aurangabad Junction', time: '8 hrs', price: 800 },
    { id: 4, name: 'Punatarai Express', source: 'Pune Junction', destination: 'Nagpur Junction', time: '11 hrs', price: 900 },
    { id: 5, name: 'Konkan Railway', source: 'Mumbai Central', destination: 'Kolhapur Junction', time: '10 hrs', price: 950 },
    { id: 6, name: 'Solapur Express', source: 'Pune Junction', destination: 'Solapur Junction', time: '5 hrs', price: 600 },
    { id: 7, name: 'Local Rapid', source: 'Thane', destination: 'Mumbai Central', time: '1 hr', price: 50 },
    { id: 8, name: 'Devagiri Express', source: 'Aurangabad Junction', destination: 'Pune Junction', time: '6 hrs', price: 700 },
  ];

  // Food Menu
  const foodMenu = [
    { id: 1, name: 'Vada Pav', price: 50, category: 'Snacks' },
    { id: 2, name: 'Misal Pav', price: 80, category: 'Snacks' },
    { id: 3, name: 'Biryani (Hyderabadi)', price: 250, category: 'Main Course' },
    { id: 4, name: 'Dal Rice', price: 150, category: 'Main Course' },
    { id: 5, name: 'Samosa', price: 30, category: 'Snacks' },
    { id: 6, name: 'Tea/Coffee', price: 40, category: 'Beverages' },
    { id: 7, name: 'Paneer Curry', price: 200, category: 'Main Course' },
    { id: 8, name: 'Juice', price: 60, category: 'Beverages' },
  ];

  // State Management
  const [bookingForm, setBookingForm] = useState({ source: '', destination: '', date: '', passengers: 1 });
  const [bookedTickets, setBookedTickets] = useState([]);
  const [foodOrder, setFoodOrder] = useState([]);
  const [complaintForm, setComplaintForm] = useState({ trainName: '', complaintType: '', description: '', email: '' });
  const [complaints, setComplaints] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);

  // Route Optimizer (Simple Dijkstra's inspired)
  const optimizeRoute = (source, destination) => {
    const sourceStation = stations.find(s => s.name === source);
    const destStation = stations.find(s => s.name === destination);

    if (!sourceStation || !destStation) {
      setOptimizedRoute({ error: 'Invalid stations selected' });
      return;
    }

    const availableTrains = trains.filter(t => t.source === source && t.destination === destination);

    if (availableTrains.length === 0) {
      setOptimizedRoute({ error: 'No direct trains available. Try different route.' });
      return;
    }

    // Sort by time (optimize for fastest route)
    const bestRoute = availableTrains.reduce((best, current) => {
      const currentTime = parseInt(current.time);
      const bestTime = parseInt(best.time);
      return currentTime < bestTime ? current : best;
    });

    setOptimizedRoute({
      train: bestRoute.name,
      source: bestRoute.source,
      destination: bestRoute.destination,
      time: bestRoute.time,
      price: bestRoute.price,
      segments: [
        { segment: 1, from: source, to: destination, status: 'Direct' }
      ]
    });
  };

  // Book Ticket
  const handleBookTicket = (e) => {
    e.preventDefault();
    if (!bookingForm.source || !bookingForm.destination || !bookingForm.date) {
      alert('Please fill all fields');
      return;
    }

    if (selectedTrain) {
      const ticket = {
        id: Math.random().toString(36).substr(2, 9),
        trainName: selectedTrain.name,
        source: bookingForm.source,
        destination: bookingForm.destination,
        date: bookingForm.date,
        passengers: bookingForm.passengers,
        price: selectedTrain.price * bookingForm.passengers,
        status: 'Confirmed'
      };
      setBookedTickets([...bookedTickets, ticket]);
      alert('✅ Ticket booked successfully!');
      setBookingForm({ source: '', destination: '', date: '', passengers: 1 });
      setSelectedTrain(null);
    } else {
      alert('Please select a train first');
    }
  };

  // Add Food Order
  const addFoodOrder = (food) => {
    const existing = foodOrder.find(f => f.id === food.id);
    if (existing) {
      setFoodOrder(foodOrder.map(f => f.id === food.id ? { ...f, qty: f.qty + 1 } : f));
    } else {
      setFoodOrder([...foodOrder, { ...food, qty: 1 }]);
    }
  };

  // Submit Complaint
  const handleComplaint = (e) => {
    e.preventDefault();
    if (!complaintForm.trainName || !complaintForm.complaintType || !complaintForm.description) {
      alert('Please fill all fields');
      return;
    }

    const complaint = {
      id: Math.random().toString(36).substr(2, 9),
      ...complaintForm,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setComplaints([...complaints, complaint]);
    alert('✅ Complaint registered. Ticket: ' + complaint.id);
    setComplaintForm({ trainName: '', complaintType: '', description: '', email: '' });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8" />
            <h1 className="text-2xl font-bold">RailTech Maharashtra</h1>
          </div>
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block bg-slate-800 border-b border-slate-700`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-2 md:gap-0">
          {[
            { id: 'home', label: '🏠 Home', icon: Home },
            { id: 'optimizer', label: '⚡ Route Optimizer' },
            { id: 'booking', label: '🎫 Tickets' },
            { id: 'food', label: '🍲 Food' },
            { id: 'help', label: '❓ Help Desk' },
            { id: 'complaints', label: '⚠️ Complaints' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-3 font-medium transition ${
                activeTab === tab.id
                  ? 'bg-orange-600 border-b-2 border-yellow-400'
                  : 'hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-8 text-center shadow-xl">
              <h2 className="text-4xl font-bold mb-2">Welcome to RailTech Maharashtra</h2>
              <p className="text-lg text-slate-800">Book trains, optimize routes, and enjoy your journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Route Optimizer', desc: 'Find the fastest route segment-wise', stats: `${trains.length} Routes` },
                { icon: MapPin, title: 'Book Tickets', desc: 'Easy ticket booking system', stats: `${stations.length} Stations` },
                { icon: Utensils, title: 'Food Ordering', desc: 'Quality food on board', stats: `${foodMenu.length} Items` }
              ].map((card, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition border border-slate-700">
                  <card.icon className="w-10 h-10 text-orange-500 mb-3" />
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-slate-300 mb-3">{card.desc}</p>
                  <p className="text-orange-400 font-bold">{card.stats}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">🚆 Maharashtra Railway Network</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-orange-400 mb-2">Major Cities:</p>
                  <p className="text-slate-300">Mumbai • Pune • Nagpur • Aurangabad • Nashik • Kolhapur • Solapur</p>
                </div>
                <div>
                  <p className="font-bold text-orange-400 mb-2">Railway Zones:</p>
                  <p className="text-slate-300">Western • Central • South Eastern • South Central</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROUTE OPTIMIZER */}
        {activeTab === 'optimizer' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">⚡ Route Optimizer</h2>
            
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Source Station</label>
                    <select
                      value={bookingForm.source}
                      onChange={(e) => setBookingForm({...bookingForm, source: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select source...</option>
                      {stations.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.city})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Destination Station</label>
                    <select
                      value={bookingForm.destination}
                      onChange={(e) => setBookingForm({...bookingForm, destination: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select destination...</option>
                      {stations.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.city})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => optimizeRoute(bookingForm.source, bookingForm.destination)}
                  className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-2 rounded transition"
                >
                  🔍 Find Optimal Route
                </button>
              </form>
            </div>

            {optimizedRoute && (
              <div className="bg-slate-800 rounded-lg p-6 border-2 border-orange-500">
                {optimizedRoute.error ? (
                  <p className="text-red-400">❌ {optimizedRoute.error}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-600 to-yellow-500 rounded p-4">
                      <h3 className="text-2xl font-bold text-slate-900">{optimizedRoute.train}</h3>
                      <p className="text-slate-900">Optimized Route</p>
                    </div>
                    
                    {optimizedRoute.segments.map((seg, i) => (
                      <div key={i} className="bg-slate-700 rounded p-4">
                        <p className="font-bold">Segment {seg.segment}: {seg.from} → {seg.to}</p>
                        <p className="text-sm text-slate-300">Status: {seg.status}</p>
                      </div>
                    ))}

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-700 rounded p-4">
                        <p className="text-sm text-slate-400">Journey Time</p>
                        <p className="text-2xl font-bold text-orange-400">{optimizedRoute.time}</p>
                      </div>
                      <div className="bg-slate-700 rounded p-4">
                        <p className="text-sm text-slate-400">Base Price</p>
                        <p className="text-2xl font-bold text-green-400">₹{optimizedRoute.price}</p>
                      </div>
                      <button
                        onClick={() => setSelectedTrain(trains.find(t => t.name === optimizedRoute.train))}
                        className="bg-green-600 hover:bg-green-700 font-bold py-2 rounded transition"
                      >
                        Select Train
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TICKET BOOKING */}
        {activeTab === 'booking' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">🎫 Ticket Booking</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">Book Your Ticket</h3>
                <form onSubmit={handleBookTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">From</label>
                    <select
                      value={bookingForm.source}
                      onChange={(e) => setBookingForm({...bookingForm, source: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select source...</option>
                      {stations.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">To</label>
                    <select
                      value={bookingForm.destination}
                      onChange={(e) => setBookingForm({...bookingForm, destination: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select destination...</option>
                      {stations.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Date</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Passengers</label>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={bookingForm.passengers}
                      onChange={(e) => setBookingForm({...bookingForm, passengers: parseInt(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 font-bold py-2 rounded transition"
                  >
                    ✓ Book Ticket
                  </button>
                </form>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">Select Train</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {trains.slice(0, 8).map(train => (
                    <button
                      key={train.id}
                      onClick={() => setSelectedTrain(train)}
                      className={`w-full p-3 rounded transition text-left ${
                        selectedTrain?.id === train.id
                          ? 'bg-orange-600 border-2 border-yellow-400'
                          : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                      }`}
                    >
                      <p className="font-bold">{train.name}</p>
                      <p className="text-sm">{train.source} → {train.destination}</p>
                      <p className="text-sm">₹{train.price} • {train.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {bookedTickets.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">✅ Your Bookings ({bookedTickets.length})</h3>
                <div className="space-y-3">
                  {bookedTickets.map(ticket => (
                    <div key={ticket.id} className="bg-gradient-to-r from-green-600 to-green-700 rounded p-4">
                      <p className="font-bold">{ticket.trainName}</p>
                      <p className="text-sm">{ticket.source} → {ticket.destination}</p>
                      <p className="text-sm">Date: {ticket.date} | Passengers: {ticket.passengers} | ₹{ticket.price}</p>
                      <p className="text-xs mt-2 font-bold">PNR: {ticket.id.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOOD ORDERING */}
        {activeTab === 'food' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">🍲 Food Ordering</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Menu</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {foodMenu.map(food => (
                      <button
                        key={food.id}
                        onClick={() => addFoodOrder(food)}
                        className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded p-3 transition text-left"
                      >
                        <p className="font-bold">{food.name}</p>
                        <p className="text-sm text-slate-300">{food.category}</p>
                        <p className="text-orange-400 font-bold mt-1">₹{food.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border-2 border-orange-500 h-fit">
                <h3 className="text-xl font-bold mb-4">🛒 Cart ({foodOrder.length})</h3>
                {foodOrder.length === 0 ? (
                  <p className="text-slate-400">No items in cart</p>
                ) : (
                  <div className="space-y-3">
                    {foodOrder.map(item => (
                      <div key={item.id} className="bg-slate-700 rounded p-2 text-sm">
                        <p className="font-bold">{item.name}</p>
                        <p>Qty: {item.qty} × ₹{item.price} = ₹{item.qty * item.price}</p>
                      </div>
                    ))}
                    <div className="border-t border-slate-600 pt-3 mt-3">
                      <p className="font-bold text-green-400">
                        Total: ₹{foodOrder.reduce((sum, f) => sum + f.price * f.qty, 0)}
                      </p>
                      <button className="w-full mt-2 bg-green-600 hover:bg-green-700 font-bold py-2 rounded transition">
                        Order Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HELP DESK */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">❓ Help Desk</h2>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 text-orange-400">📞 Contact Us</h3>
                  <div className="space-y-3">
                    <p><strong>Toll Free:</strong> 1800-RAILTECH</p>
                    <p><strong>Email:</strong> support@railtech.com</p>
                    <p><strong>WhatsApp:</strong> +91-XXXXX-XXXXX</p>
                    <p><strong>Hours:</strong> 24/7 Support</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-orange-400">❔ FAQs</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Q: How to book tickets?</strong> Use Ticket Booking tab</p>
                    <p><strong>Q: Can I cancel?</strong> 24hrs before departure</p>
                    <p><strong>Q: Food delivery?</strong> Available on all trains</p>
                    <p><strong>Q: Refund policy?</strong> Full refund within 7 days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Book 30 days in advance for best prices</li>
                <li>✓ Use Route Optimizer to find fastest paths</li>
                <li>✓ Set up alerts for price drops</li>
                <li>✓ Check complaint status anytime</li>
              </ul>
            </div>
          </div>
        )}

        {/* COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">⚠️ Report Issues</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4">File Complaint</h3>
                <form onSubmit={handleComplaint} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Train Name</label>
                    <select
                      value={complaintForm.trainName}
                      onChange={(e) => setComplaintForm({...complaintForm, trainName: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select train...</option>
                      {trains.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Complaint Type</label>
                    <select
                      value={complaintForm.complaintType}
                      onChange={(e) => setComplaintForm({...complaintForm, complaintType: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    >
                      <option value="">Select type...</option>
                      <option value="Theft">🚨 Theft/Security</option>
                      <option value="Food Quality">🍲 Food Quality</option>
                      <option value="Cleanliness">🧹 Cleanliness</option>
                      <option value="Delay">⏰ Delay</option>
                      <option value="Staff Behavior">👤 Staff Behavior</option>
                      <option value="Facility">🔧 Facility Issue</option>
                      <option value="Other">📝 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Description</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                      placeholder="Describe your issue in detail..."
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      value={complaintForm.email}
                      onChange={(e) => setComplaintForm({...complaintForm, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 font-bold py-2 rounded transition"
                  >
                    📤 Submit Complaint
                  </button>
                </form>
              </div>

              {complaints.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">📋 Your Complaints</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {complaints.map(complaint => (
                      <div key={complaint.id} className="bg-slate-700 rounded p-3 border-l-4 border-red-500">
                        <p className="font-bold text-sm">{complaint.complaintType} - {complaint.trainName}</p>
                        <p className="text-xs text-slate-300 mt-1">{complaint.description}</p>
                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-slate-400">ID: {complaint.id}</span>
                          <span className={`px-2 py-1 rounded ${
                            complaint.status === 'Pending' ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>🚆 RailTech Maharashtra © 2024 | Transforming Railway Travel</p>
          <p className="mt-2">Your journey, Our priority</p>
        </div>
      </footer>
    </div>
  );
};

export default RailTechMaharashtra;
