import { useState } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const StaffDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const staff = [
    { id: 1, name: "Pastor John Smith", role: "Senior Pastor", department: "Pastoral", email: "pastorjohn@faithconnect.org", phone: "(555) 123-4567", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    { id: 2, name: "Pastor Sarah Johnson", role: "Associate Pastor", department: "Pastoral", email: "pastorsarah@faithconnect.org", phone: "(555) 123-4568", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
    { id: 3, name: "Pastor Michael Brown", role: "Youth Pastor", department: "Youth", email: "pastormichael@faithconnect.org", phone: "(555) 123-4569", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
    { id: 4, name: "Lisa Martinez", role: "Worship Leader", department: "Worship", email: "lisa@faithconnect.org", phone: "(555) 123-4570", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" },
    { id: 5, name: "David Wilson", role: "Children's Pastor", department: "Children", email: "david@faithconnect.org", phone: "(555) 123-4571", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop" },
    { id: 6, name: "Rebecca Taylor", role: "Outreach Director", department: "Outreach", email: "rebecca@faithconnect.org", phone: "(555) 123-4572", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop" },
    { id: 7, name: "Jennifer Lee", role: "Office Manager", department: "Administration", email: "jennifer@faithconnect.org", phone: "(555) 123-4573", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" },
    { id: 8, name: "Mark Anderson", role: "Facilities Manager", department: "Facilities", email: "mark@faithconnect.org", phone: "(555) 123-4574", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
    { id: 9, name: "Amanda Garcia", role: "Administrative Secretary", department: "Administration", email: "amanda@faithconnect.org", phone: "(555) 123-4575", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    { id: 10, name: "Chris Martin", role: "Media Director", department: "Media", email: "chris@faithconnect.org", phone: "(555) 123-4576", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop" },
    { id: 11, name: "Emily Davis", role: "Nursery Coordinator", department: "Children", email: "emily@faithconnect.org", phone: "(555) 123-4577", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
    { id: 12, name: "Robert Chen", role: "Small Groups Coordinator", department: "Discipleship", email: "robert@faithconnect.org", phone: "(555) 123-4578", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" }
  ];

  const departments = ['all', ...new Set(staff.map(s => s.department))];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Staff Directory</h1>
          <p className="text-xl">Meet our dedicated team</p>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-gray-500">
              Showing {filteredStaff.length} staff members
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStaff.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {member.department}
                  </span>
                  <h3 className="font-bold text-primary mt-2">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                  <div className="mt-3 pt-3 border-t space-y-1 text-sm">
                    <p className="flex items-center gap-2"><FaEnvelope className="text-secondary" /> <a href={`mailto:${member.email}`} className="text-secondary hover:underline">{member.email}</a></p>
                    <p className="flex items-center gap-2"><FaPhone className="text-secondary" /> <a href={`tel:${member.phone}`} className="text-secondary hover:underline">{member.phone}</a></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaffDirectory;
