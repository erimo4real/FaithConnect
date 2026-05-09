import { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const SmallGroups = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const categories = [
    { id: 'all', label: 'All Groups' },
    { id: 'bible-study', label: 'Bible Study' },
    { id: 'youth', label: 'Youth' },
    { id: 'women', label: "Women's" },
    { id: 'men', label: "Men's" },
    { id: 'families', label: 'Families' },
    { id: 'young-adults', label: 'Young Adults' },
    { id: 'seniors', label: 'Seniors' }
  ];

  const groups = [
    {
      id: 1,
      name: 'Romans Bible Study',
      category: 'bible-study',
      day: 'Wednesday',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      leader: 'Pastor John Smith',
      description: 'Deep dive into the book of Romans with discussion and fellowship.',
      members: 15,
      maxMembers: 25,
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      name: 'Youth Group',
      category: 'youth',
      day: 'Saturday',
      time: '6:30 PM',
      location: 'Youth Center',
      leader: 'Pastor Michael Brown',
      description: 'Games, worship, and biblical teaching for students grades 6-12.',
      members: 30,
      maxMembers: 50,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      name: "Women's Fellowship",
      category: 'women',
      day: 'Tuesday',
      time: '10:00 AM',
      location: 'Room 201',
      leader: 'Sarah Johnson',
      description: "Bible study and fellowship for women of all ages.",
      members: 12,
      maxMembers: 20,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      name: "Men's Ministry",
      category: 'men',
      day: 'Saturday',
      time: '7:00 AM',
      location: 'Main Sanctuary',
      leader: 'David Wilson',
      description: 'Breakfast and Bible study for men. Strong fellowship and accountability.',
      members: 18,
      maxMembers: 30,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      name: 'Young Adults (20s-30s)',
      category: 'young-adults',
      day: 'Friday',
      time: '7:30 PM',
      location: 'Coffee Shop',
      leader: 'Lisa Martinez',
      description: 'Modern Bible study and social activities for young adults.',
      members: 22,
      maxMembers: 35,
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      name: 'Family Bible Time',
      category: 'families',
      day: 'Sunday',
      time: '4:00 PM',
      location: 'Family Center',
      leader: 'Robert & Amy Chen',
      description: 'Family-friendly Bible study with activities for children.',
      members: 14,
      maxMembers: 25,
      image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=250&fit=crop'
    },
    {
      id: 7,
      name: 'Senior Saints',
      category: 'seniors',
      day: 'Thursday',
      time: '2:00 PM',
      location: 'Room 105',
      leader: 'Margaret Johnson',
      description: 'Bible study and fellowship for seniors.',
      members: 10,
      maxMembers: 20,
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop'
    },
    {
      id: 8,
      name: 'Prayer Warriors',
      category: 'bible-study',
      day: 'Monday',
      time: '6:00 AM',
      location: 'Prayer Room',
      leader: 'Eleanor Davis',
      description: 'Early morning prayer group for intercession.',
      members: 8,
      maxMembers: 15,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
    }
  ];

  const filteredGroups = selectedCategory === 'all'
    ? groups
    : groups.filter(g => g.category === selectedCategory);

  const handleJoinClick = (group) => {
    setSelectedGroup(group);
    setShowJoinForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Request sent to join "${selectedGroup.name}"! We will contact you soon.`);
    setShowJoinForm(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Small Groups</h1>
          <p className="text-xl">Connect, grow, and fellowship in a smaller community</p>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-secondary text-primary'
                    : 'bg-white text-gray-700 hover:bg-secondary hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                    {categories.find(c => c.id === group.category)?.label}
                  </span>
                  <h3 className="text-xl font-bold text-primary mt-2 mb-1">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <p className="flex items-center gap-2"><FaCalendarAlt className="text-secondary" /> {group.day} at {group.time}</p>
                    <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-secondary" /> {group.location}</p>
                    <p className="flex items-center gap-2"><FaUsers className="text-secondary" /> Leader: {group.leader}</p>
                    <p className="flex items-center gap-2"><FaUsers className="text-secondary" /> {group.members}/{group.maxMembers} members</p>
                  </div>

                  <button
                    onClick={() => handleJoinClick(group)}
                    disabled={group.members >= group.maxMembers}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      group.members >= group.maxMembers
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-secondary text-primary hover:bg-yellow-400'
                    }`}
                  >
                    {group.members >= group.maxMembers ? 'Group Full' : 'Join Group'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showJoinForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Join "{selectedGroup?.name}"</h2>
              <button onClick={() => setShowJoinForm(false)} className="text-gray-500 hover:text-primary">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-yellow-400"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Start a New Group</h2>
          <p className="text-gray-600 mb-6">Feel called to lead? We provide training and support for new small group leaders.</p>
          <a href="/contact" className="inline-block bg-secondary text-primary font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default SmallGroups;
