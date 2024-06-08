import { Clock9, Mail, Map, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <div id="contact" className="bg-white">
      <div className="container pb-32 pt-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-center">
          <div className="flex-full md:w-1/2">
            <iframe
              title="Google Maps"
              width="100%"
              height="400"
              className="rounded-lg shadow-md"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.3627374576136!2d-122.41969268469451!3d37.774929879754376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adc7!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1621462999950!5m2!1sen!2sus"
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-1/2">
            <div>
              <h2 className="text-4xl font-bold text-primary">Contact Us</h2>
              <p className="mt-0.5 text-gray-600">
                Have questions or need assistance? Reach out to us today.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Map className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600">
                1234 Main Street, San Francisco, CA 94123
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600">+(123) 456-7890</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600">support@vitaclinic.com</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Clock9 className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600">Mon - Fri: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
