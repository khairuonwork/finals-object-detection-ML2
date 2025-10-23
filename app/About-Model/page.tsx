"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";

import model_details from "@/src/img/about-model/model.png";
import system_architecture from "@/src/img/about-model/system.png";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Slide 1",
      image: model_details,
    },
    {
      id: 2,
      title: "Slide 2",
      image: system_architecture,
    },
  ];

  useEffect(() => {
    return () => {};
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight">
            <span className="font-bold italic">YOLO</span>
            <span className="text-muted-foreground ml-1">Detection</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="hover:text-muted-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/Yolo-Detection"
              className="hover:text-muted-foreground transition-colors"
            >
              YOLO Detection
            </Link>
            <Link
              href="/About-Model"
              className="hover:text-muted-foreground transition-colors"
            >
              About Model
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="/"
                className="hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/Yolo-Detection"
                className="hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                YOLO Detection
              </Link>
              <Link
                href="/About-Model"
                className="hover:text-muted-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Model
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative w-full h-[600px] md:h-[800px] bg-transparent overflow-hidden">
        {/* Slideshow Container */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image} // Gunakan variabel statis yang diimpor
                alt={slide.title}
                className="w-full h-full object-contain scale-100" // Zoom out effect by scaling
                placeholder="blur" // Efek blur saat loading
                priority={index === 0} // Prioritaskan gambar pertama
              />
              {/* <div className="absolute inset-0 bg-black/40" /> */}
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">
            Model Training <br />
            Label Studio + YOLO11
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-justify">
            <b>1. Unlabeled Data</b>: The initial dataset consists of images of
            various fruits (like pears, oranges, and apples) without any labels.{" "}
            <br />
            <b>2. Labeling Tool</b> (Label Studio): To train the model, the data
            needs to be labeled. In this case, the Label Studio tool is used to
            manually annotate the objects in the images. This tool helps in
            drawing bounding boxes around the objects (e.g., pears, oranges,
            apples) and assigning them appropriate labels. The output is labeled
            data with images tagged with the correct object names. <br />{" "}
            <b>3. YOLO Model Training</b>: Once the data is labeled, it is fed
            into the YOLO model for training. YOLO (You Only Look Once) is an
            object detection algorithm that processes the labeled data to learn
            to detect the objects within images. The model is trained using the
            labeled dataset, improving its accuracy in object identification
            over time. <br /> <b>4. Prediction</b>: After training, the YOLO
            model is able to make predictions. It takes new, unseen images (test
            data) and applies what it has learned to identify objects, in this
            case, pears, oranges, and apples. The model draws bounding boxes
            around the predicted objects and labels them correctly. <br />{" "}
            <b>5. Test Data</b>
            : Finally, the model is tested using new images that were not part
            of the training data. The model should be able to identify the
            fruits accurately in the test data based on the patterns and
            features it learned during training.
            <br />
          </p>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-balance">
              System Architecture
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-justify">
              <b>1. Web Interface (Hosted on Vercel) </b>: The frontend is built
              using Next.js, which is deployed on Vercel. The web interface
              serves as the user interface where users can request object
              detection tasks. It provides an interactive platform for users to
              communicate with the backend. <br />{" "}
              <b> 2. WebSockets for Real-Time Communication</b>: WebSockets are
              used to establish a persistent connection between the Next.js
              frontend and the Python backend. This enables real-time,
              bidirectional communication, meaning the frontend can send image
              data / camera streaming to the backend and receive processing
              results without needing to refresh the page.
              <br /> <b> 3. Python Server with OpenCV</b>: The backend is
              written in Python, and it uses OpenCV for image processing. The
              Python server listens for WebSocket connections from the frontend.
              When an image is received, OpenCV is used to perform various image
              processing tasks, such as object detection, feature extraction, or
              applying filters. OpenCV handles the heavy lifting for computer
              vision tasks like detecting and classifying objects within images.{" "}
              <br /> <b>4. WebSocket Communication Flow </b>: The flow begins
              when the user uploads an image through the Next.js frontend. This
              image is sent to the backend via a WebSocket connection. The
              backend, using OpenCV, processes the image in real-time. For
              example, it could identify objects in the image, based on the
              user's input camera. Once the input has been processed, the Python
              server sends the results back to the Next.js frontend over the
              WebSocket connection. The frontend then updates the UI to show the
              results to the user.
              <br /> <b> 5. Containerization with Docker</b>: To ensure the
              Python server runs in any environment without compatibility
              issues, the server can be containerized using Docker. Docker
              allows the entire Python environment (with OpenCV) and its
              dependencies to be packaged into a container.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
            <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">YOLO Detection</h3>
              <p className="text-muted-foreground mb-4">
                Fruit detection with high accuracy.
              </p>
              <Link
                href="/Yolo-Detection"
                className="inline-block text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Learn More →
              </Link>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Home</h3>
              <p className="text-muted-foreground mb-4">
                Introduction of our project.
              </p>
              <Link
                href="/"
                className="inline-block text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">YOLO Detection</h4>
              <p className="text-primary-foreground/70">
                Ultralytics YOLO11 Model Detection Technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Yolo-Detection"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    YOLO Detection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/About-Model"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    About Model
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-primary-foreground/70">
                Daffa Khairul Ammar 223443007 |{" "}
                <b>
                  <a
                    href="https://instagram.com/mrkhairu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @mrkhairu
                  </a>
                </b>
              </p>

              <p className="text-primary-foreground/70">
                I Gusti Made Kresna Wijaya 223443012 |{" "}
                <b>
                  <a
                    href="https://instagram.com/kresna_wijaya12"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @kresna_wijaya12
                  </a>
                </b>
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/70">
            <p>
              &copy; 2025 YOLO Detection ML #2. Politeknik Manufaktur Bandung.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
