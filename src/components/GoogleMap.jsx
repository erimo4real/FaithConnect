import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const GoogleMap = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Visit Us</h2>
          <p className="text-gray-600">We'd love to see you in person</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
             src="https://www.google.com/maps?q=Bethel+Church+Ilaje+Bus+Stop+Ajah+Lagos&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Church Location"
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-primary mb-6">Church Location</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-secondary text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-primary">Address</h4>
                  <p className="text-gray-600">Bethel Church ilaje Bus Stop Ajah Lagos <br />Lagos State Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhone className="text-secondary text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-primary">Phone</h4>
                  <p className="text-gray-600">+234 934 720 201</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaEnvelope className="text-secondary text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-primary">Email</h4>
                  <p className="text-gray-600">bethelministriesinc01@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaClock className="text-secondary text-xl mt-1" />
                <div>
                  <h4 className="font-bold text-primary">Office Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            <a
             href="https://www.google.com/maps?q=Bethel+Church+Ilaje+Bus+Stop+Ajah+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleMap;
