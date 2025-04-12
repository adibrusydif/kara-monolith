export default function LocationSection() {
  return (
    <section id="location" className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">
          Our Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="order-2 md:order-1">
            <h3 className="text-xl font-bold mb-4">Find Us Here</h3>
            <div className="space-y-4">
              <p className="text-gray-500">
                Kara Akademi Indonesia<br />
                Jalan Pendidikan No. 123<br />
                Jakarta, Indonesia 12345
              </p>
              <div className="space-y-2">
                <p className="text-gray-500"><strong>Phone:</strong> +62 813 9999 8092</p>
                <p className="text-gray-500"><strong>Email:</strong> info@karaakademi.id</p>
                <p className="text-gray-500"><strong>WhatsApp:</strong> +62 813 9999 8092</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.2795789514584!2d105.28815939999999!3d-5.1328978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40b92ad31943df%3A0x9a02dbfd7d947e77!2sKara%20Akademi%20Indonesia!5e0!3m2!1sen!2sid!4v1710300175651!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
} 