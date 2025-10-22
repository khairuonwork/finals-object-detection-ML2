"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";

import slide1 from "@/src/img/slideshows/slide-1.jpg";
import slide2 from "@/src/img/slideshows/slide-2.jpg";
import slide3 from "@/src/img/slideshows/slide-3.jpg";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Slide 1",
      image: slide1,
    },
    {
      id: 2,
      title: "Slide 2",
      image: slide2,
    },
    {
      id: 3,
      title: "Slide 3",
      image: slide3,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

      <section className="relative w-full h-[600px] bg-muted overflow-hidden">
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
                className="w-full h-full object-cover"
                placeholder="blur" // Efek blur saat loading
                priority={index === 0} // Prioritaskan gambar pertama
              />
              <div className="absolute inset-0 bg-black/40" />
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
            Machine Learning #2 <br />
            YOLO Detection Model Course Completion
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-justify">
            In this project, we are tasked with fulfilling the requirements of
            the Machine Learning Practical Course, under the guidance of our
            lecturer, <b>Ega Mardoyo S.Ap., M.Kom.</b> The course is designed to
            provide students with hands-on experience in applying machine
            learning techniques to real-world problems. Throughout this course,
            we have explored various aspects of machine learning, ranging from
            data preprocessing, model selection, training, and evaluation, to
            the deployment of machine learning solutions. Our main focus is to
            develop a fully functional machine learning application that
            integrates these principles into a cohesive project.
            <br />
            <br />
            In this specific website project, we will be implementing a
            user-friendly interface that showcases the concepts and algorithms
            we've learned, with the ability to run and test machine learning
            models in a practical setting. The website will allow users to
            interact with our <b> YOLO </b> models, visualize results, and
            understand the underlying processes of machine learning through a
            real-time experience.
            <br />
            <br />
            By the end of this project, we aim to demonstrate not only our
            technical proficiency in machine learning but also our ability to
            create accessible, practical applications that can be utilized in
            various fields. This hands-on project allows us to bridge the gap
            between theoretical knowledge and real-world application, making
            machine learning more understandable and engaging for students and
            professionals alike.
          </p>
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
              <h3 className="text-xl font-semibold mb-3">About Model</h3>
              <p className="text-muted-foreground mb-4">
                Understand the architecture and capabilities of our detection
                model.
              </p>
              <Link
                href="/About-Model"
                className="inline-block text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Learn More →
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
                Ultralytics YOLO 11 Model Detection Technology.
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
                    Detection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/About-Model"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    About
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
