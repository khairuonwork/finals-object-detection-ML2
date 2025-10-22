"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
// Import socket.io-client
import { io } from "socket.io-client";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState("Connecting to server...");
  const [imageSrc, setImageSrc] = useState("");

  // WebSocket connection logic
  useEffect(() => {
    const socket = io("ws://localhost:5000");

    // When connected to WebSocket server
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setStatus("Status: Connected");
    });

    // When receiving live frames from the WebSocket server
    socket.on("live_frame", (data: string) => {
      setImageSrc(data); // Set the live stream image (base64 data)
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setStatus("Status: Disconnected. Please refresh.");
    });

    // Handle connection errors
    socket.on("connect_error", (err: Error) => {
      console.error("Connection failed:", err.message);
      setStatus("Status: Failed to connect to server.");
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

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

      {/* Section for YOLO Camera Stream */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">
            YOLO Camera Stream
          </h2>

          {/* Live Stream Display */}
          <div className="flex items-center justify-center">
            {/* Check if imageSrc is available before rendering the image */}
            {imageSrc ? (
              <img
                id="stream"
                src={imageSrc}
                alt="Live stream will appear here..."
                className="border-2 border-black rounded-lg max-w-full h-auto"
                style={{ maxWidth: "640px", minHeight: "480px" }}
              />
            ) : (
              <p>Waiting for live stream...</p>
            )}
          </div>

          <p id="status" className="text-lg mt-4">
            {status}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
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

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">YOLO Detection</h4>
              <p className="text-primary-foreground/70">
                Ultralytics YOLO Model Detection Technology.
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
