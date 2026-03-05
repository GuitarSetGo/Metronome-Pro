# ⏱️ [Metronome Pro — Precision Timing Engine](https://guitarsetgo.github.io/Metronome-Pro/)

![Version](https://img.shields.io/badge/version-2.0.0-blueviolet)
![Technology](https://img.shields.io/badge/tech-Web_Audio_API-yellow)

> **A professional-grade metronome built for musicians who demand perfect timing.** 🎸🥁

## 📖 Description

**Metronome Pro** is a standalone web application designed to solve the common problem of "drift" in web-based metronomes. 

Unlike standard tools that rely on `setInterval` (which can be inaccurate), this engine is built entirely on the **Web Audio API**. It schedules audio events ahead of time, ensuring **sample-accurate timing** regardless of system load or visual lag.

Wrapped in a sleek **Cyber-Metal interface**, it combines high-performance engineering with an intuitive user experience.

## ✨ Key Features

*   **⚡ Rock-Solid Precision:** Powered by the Web Audio API clock for zero-latency timing.
*   **👁️ Visual Feedback:**
    *   **Animated Pendulum:** Smooth physics-based swing animation.
    *   **Beat Visualizer:** LED-style indicators that flash on every beat (with accents on the first beat).
*   **🎛️ Advanced Controls:**
    *   **BPM Slider:** Smooth adjustment from 30 to 240 BPM.
    *   **Tap Tempo:** Tap the 'T' key or button to instantly set the tempo.
    *   **Time Signatures:** Support for 2/4, 3/4, 4/4, 5/4, 6/8, 7/8, etc.
    *   **Volume Control:** Independent master volume slider.
*   **⌨️ Keyboard Shortcuts:** Control everything without touching the mouse.

## 🛠️ Technologies Used

*   **HTML5**
*   **CSS3** (Flexbox, CSS Variables, Animations)
*   **JavaScript (ES6+)**
*   **Web Audio API** (Oscillators, Gain Nodes, Scheduling)

## 🎮 How to Use

1.  **Start/Stop:** Click the big Play button or press **SPACE**.
2.  **Change Tempo:**
    *   Drag the slider.
    *   Use the `+` / `-` buttons.
    *   Press **Up/Down** arrows for ±1 BPM.
    *   Press **Left/Right** arrows for ±10 BPM.
3.  **Tap Tempo:** Click the "TAP TEMPO" button or press **T** repeatedly to the beat of a song.
4.  **Change Time Signature:** Click the number buttons (2, 3, 4...) to change beats per bar.

## ⌨️ Shortcuts Reference

| Key | Action |
| :--- | :--- |
| **SPACE** | Start / Stop |
| **T** | Tap Tempo |
| **↑ / ↓** | Increase / Decrease BPM by 1 |
| **← / →** | Increase / Decrease BPM by 10 |

## 👨‍💻 Author

**Joshua Gonzalez**

*   [GitHub Profile](https://github.com/GuitarSetGo)
*   [LinkedIn](https://www.linkedin.com/in/josh4dev)

---
*© 2026 - Metronome Pro*
