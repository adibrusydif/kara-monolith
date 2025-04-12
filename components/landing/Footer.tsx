export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p>WhatsApp: +62 813-9999-8092</p>
              <a 
                href="https://wa.me/6281399998092"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-500 hover:text-green-400"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          
          {/* Other footer content */}
        </div>
      </div>
    </footer>
  );
} 