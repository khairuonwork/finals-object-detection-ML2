"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Camera, StopCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";

export default function YoloDetection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [processedImage, setProcessedImage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //SocketURL nya
  const socketURL = process.env.NEXT_PUBLIC_NGROKWEBSOCKET_URL;

  // Initialize WebSocket
  useEffect(() => {
    socketRef.current = io(socketURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      setStatus("Connected to server. Ready to start camera.");
      setIsConnected(true);
    });

    socketRef.current.on("processed_frame", (data: string) => {
      console.log("Received processed frame from backend");
      setProcessedImage(data);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setStatus("Disconnected from server.");
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (err: Error) => {
      console.error("Connection error:", err.message);
      setStatus(
        "Failed to connect to backend. Please check if server is running."
      );
      setIsConnected(false);
    });

    return () => {
      stopCamera();
      socketRef.current?.disconnect();
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setStatus("Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      console.log("Camera access granted!");
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          console.log(
            `📹 Video ready: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`
          );
        };

        videoRef.current.onplay = () => {
          console.log("Video playing");
          setStatus("Camera active. Streaming to YOLO model...");
          setIsStreaming(true);
        };

        await videoRef.current.play();
      }

      // Start capturing and sending frames every 100ms (10 FPS)
      intervalRef.current = setInterval(() => {
        captureAndSendFrame();
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setStatus("Camera access denied. Please allow camera permission.");
        } else if (err.name === "NotFoundError") {
          setStatus("No camera found on this device.");
        } else if (err.name === "NotReadableError") {
          setStatus("Camera is already in use by another application.");
        } else {
          setStatus(`Camera error: ${err.message}`);
        }
      }
    }
  };

  // Capture frame and send to backend
  const captureAndSendFrame = () => {
    if (!videoRef.current || !canvasRef.current || !socketRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          socketRef.current?.emit("video_frame", base64data);
        };
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.8
    );
  };

  // Stop camera
  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setProcessedImage("");
    setStatus(
      isConnected
        ? "Camera stopped. Ready to start again."
        : "Disconnected from server."
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">
            <span className="font-bold italic">YOLO</span>
            <span className="text-muted-foreground ml-1">Detection</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="hover:text-muted-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/Yolo-Detection"
              className="hover:text-muted-foreground transition-colors font-semibold"
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

          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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
                className="hover:text-muted-foreground transition-colors font-semibold"
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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Real-Time YOLO Detection
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Use your camera for live object detection powered by YOLO
          </p>

          {/* Status */}
          <div className="mb-6 p-4 bg-card border border-border rounded-lg text-center">
            <p className="text-lg">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  isConnected
                    ? isStreaming
                      ? "text-green-500"
                      : "text-blue-500"
                    : "text-red-500"
                }
              >
                {status}
              </span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={startCamera}
              disabled={!isConnected || isStreaming}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={20} />
              Start Camera
            </button>
            <button
              onClick={stopCamera}
              disabled={!isStreaming}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <StopCircle size={20} />
              Stop Camera
            </button>
          </div>

          {/* Video Display */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Your Camera */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="bg-secondary p-3 border-b border-border">
                <h3 className="text-center font-semibold">Your Camera</h3>
              </div>
              <div className="relative bg-black flex items-center justify-center aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                  style={{ display: isStreaming ? "block" : "none" }}
                />
                {!isStreaming && (
                  <div className="absolute text-center text-muted-foreground">
                    <Camera size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* YOLO Detection Result */}
            <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
              <div className="bg-secondary p-3 border-b border-border">
                <h3 className="text-center font-semibold">
                  YOLO Detection Result
                </h3>
              </div>
              <div className="relative bg-black flex items-center justify-center aspect-video">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed with YOLO"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute text-center text-muted-foreground">
                    {isStreaming ? (
                      <>
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Processing frames...</p>
                        <p className="text-sm mt-2">
                          Waiting for detection results
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 border-4 border-gray-600 rounded-full mx-auto mb-4 opacity-30"></div>
                        <p>Detection results will appear here</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">How It Works</h3>
              <p className="text-muted-foreground">
                Your camera captures frames which are sent to our YOLO model for
                real-time object detection.
              </p>
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
            <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">About Model</h3>
              <p className="text-muted-foreground mb-4">
                Learn more about the YOLO architecture and detection
                capabilities.
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
              <p className="text-primary-foreground/70 mt-2">
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
