import Link from 'next/link';
import BannerSlider from '@/components/landing/BannerSlider';
import FacilitiesSection from '@/components/landing/FacilitiesSection';
import ServicesSection from '@/components/landing/ServicesSection';
import LocationSection from '@/components/landing/LocationSection';
import InstagramFeed from '@/components/landing/InstagramFeed';
import PartnerSection from '@/components/landing/PartnerSection';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <BannerSlider />

        <section id="about" className="py-8 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-yellow-500">
              Welcome to Kara Akademi Indonesia
            </h2>
            <p className="text-base md:text-lg text-center max-w-3xl mx-auto px-4 text-black">
              Kara Akademi Indonesia provides world-class education in hospitality management, 
              preparing students for successful careers in the hotel industry with 
              hands-on training and industry-relevant curriculum.
            </p>
            <div className="mt-8 text-center">
              <a
                href="https://wa.me/6281399998092?text=Hi,%20I'm%20interested%20in%20registering%20at%20Kara%20Akademi%20Indonesia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm6.379 17.381c-.22.637-.947 1.465-1.936 1.562-.516.053-.997.076-1.493-.078-.496-.154-1.14-.35-1.95-.684-3.43-1.487-5.666-4.952-5.839-5.177-.173-.225-1.424-1.887-1.424-3.599 0-1.711.895-2.538 1.253-2.897.358-.358.771-.422 1.033-.422.262 0 .524 0 .745.019.221.019.519-.082.81.617.292.699 1.006 2.422 1.093 2.596.087.174.149.379.037.602-.111.223-.186.335-.372.534-.186.199-.39.447-.558.602-.186.174-.301.298-.111.584.189.286.842 1.223 1.812 1.812 1.983.967.76 1.782 1.045 2.068 1.159.286.114.457.076.631-.089.174-.165.744-.857.944-1.152.199-.295.398-.247.671-.148.272.099 1.734.818 2.031.967.298.149.496.223.571.347.075.124.075.719-.173 1.412z"/>
                </svg>
                Register via WhatsApp
              </a>
            </div>
          </div>
        </section>

        <FacilitiesSection />
        <ServicesSection />
        <PartnerSection />
        <InstagramFeed />
        <LocationSection />

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold mb-4 text-yellow-500">Kara Akademi Indonesia</h3>
                <p>Providing quality education in hospitality since 2000.</p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <p>Email: info@karaakademi.id</p>
                <p>Phone: +62 123 4567 890</p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex justify-center sm:justify-start space-x-4">
                  <a href="#" className="hover:text-blue-400">Facebook</a>
                  <a href="#" className="hover:text-blue-400">Twitter</a>
                  <a href="#" className="hover:text-blue-400">Instagram</a>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Kara Akademi Indonesia. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
