---
title: "Teaching My Smart Companion Robot to Listen: Building a Custom Offline KWS Pipeline from 1,200+ Audio Samples"
date: "2026-07-09"
excerpt: "Discover how to build a custom offline Keyword Spotting (KWS) pipeline for a smart companion robot, ensuring real-time edge execution without cloud dependencies."
tags: ["robotics", "edge-computing", "machine-learning", "embedded-systems", "esp32"]
coverImage: "/images/blog/kws-pipeline/cover.png"
---
Building a smart companion robot comes with a unique set of edge computing challenges. While cloud-based voice assistants are powerful, they require constant internet connectivity, introduce latency, and raise privacy concerns. For a truly responsive robot, execution needs to happen completely on the edge.

To give my robot local listening capabilities, I built an offline Keyword Spotting (KWS) pipeline. Instead of using generic datasets, I recorded over 1,200 custom audio samples from scratch to train a model that recognizes three distinct operational commands.

Here is the technical breakdown of how I designed the dataset, processed the audio over I2S, and implemented the inference loop directly inside the robot's main firmware.

## 1. The Design: 3 Commands & 1,200+ Samples

A robust voice-activated robot requires more than a simple wake word; it needs contextual intent recognition. I designed the architecture to look for three custom phrases, supported by two control classes to filter out false positives:

* **wake_word ("Hey two point one"):** Wakes the robot up and transitions it to an active emotional state.
* **cmd_sleep ("Go to sleep"):** Puts the robot into a low-power, sleeping state.
* **cmd_guard ("Guard my desk"):** Triggers a security monitoring routine using onboard sensors.
* **unknown:** Random conversational phrases to ensure it doesn't trigger on similar-sounding words.
* **noise:** Ambient room hum, fan noise, and mechanical sounds from the robot's own servos.

To train the model effectively, I captured over 1,200 individual 1 second samples at a 16 kHz sampling rate. This volume of data provided the network with enough variance in distance, pitch, and background environments to achieve industrial-grade reliability.

## 2. Hardware Architecture & Signal Processing

The robot captures raw audio via a high performance I2S digital microphone. Unlike older analog microphones that are highly susceptible to electromagnetic interference from nearby motors, digital I2S streams clean, uncorrupted PCM data directly to the microcontroller.

The hardware pins are bound directly via the ESP32 I2S peripheral configuration:

* **I2S_WS (Word Select):** Pin 15
* **I2S_SD (Serial Data):** Pin 7
* **I2S_SCK (Continuous Serial Clock):** Pin 16

### The Feature Extraction Pipeline

Raw audio waveforms take up a massive footprint and contain too much raw variance for a micro-neural network to calculate in real time. To compress this data without losing critical voice features, the system utilizes MFCC (Mel-Frequency Cepstral Coefficients).

MFCC windows the 1-second audio frame, performs a Fast Fourier Transform (FFT), and warps the spectrum onto the Mel scale mirroring how human ears actually perceive pitch. This transforms the 16 kHz audio chunk into a dense 2D features image (a spectrogram) perfectly optimized for a Convolutional Neural Network (CNN).

## 3. Deep Dive into the Robot's Microcontroller Architecture

The implementation brings everything together by feeding the audio pipeline directly into the robot's state machine, emotional rendering engine (LovyanGFX), and communication buses (BleManager and MqttManager).

### Real-Time Inference Firmware Integration

The actual production code running inside the robot processes audio through a high-speed ring buffer, continuous inference window, and strict confidence filters.

```cpp
#include <Arduino.h>
#include <driver/i2s.h>
#include "edge-impulse-sdk/classifier/ei_run_classifier.h"
#include "RobotEyes.h"

// --- EDGE IMPULSE CONFIGURATION ---
#define SAMPLE_RATE 16000
#define AUDIO_CHUNK_SIZE 160

// Strict confidence thresholding to prevent false activations
const float CONFIDENCE_THRESHOLD = 0.60;

void loop() {
    // 1. Gather audio signals into the Edge Impulse signal structure
    signal_t signal;
    signal.total_length = EI_CLASSIFIER_RAW_SAMPLE_COUNT;
    signal.get_data = &fn_get_audio_signal_data; // Points to our I2S ring buffer

    // 2. Run the offline classification engine
    ei_impulse_result_t result = { 0 };
    EI_IMPULSE_ERROR r = run_classifier(&signal, &result, false);
    if (r != EI_IMPULSE_OK) return;

    // 3. Evaluate classifications against the 60% threshold
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
        float confidence = result.classification[ix].value;
        const char* label = result.classification[ix].label;

        if (confidence > CONFIDENCE_THRESHOLD) {
            if (strcmp(label, "wake_word") == 0) {
                Serial.println("🤖 Trigger: Hey Two Point One detected!");
                setRobotEmotion(ACTIVE);
            } 
            else if (strcmp(label, "cmd_sleep") == 0) {
                Serial.println("💤 Trigger: Transitioning to sleep mode.");
                setRobotEmotion(ASLEEP);
            }
            else if (strcmp(label, "cmd_guard") == 0) {
                Serial.println("🛡️ Trigger: Desk guard routine armed.");
                setRobotEmotion(ALERT);
            }
        }
    }
}
```

## 4. Real-World Validation & Diagnostic Performance

A clean compile is only half the battle. To verify the performance of the model against unexpected audio anomalies, I built an active diagnostic logger into the serial pipeline. This allows me to track live peak volumes alongside specific class percentages.

Here are two distinct real world samples captured during bench testing:

### Case A: Valid Intent Verification

When the keyword "Hey two point one" is spoken within radius of the robot, the DSP block immediately transforms the sample, and the CNN evaluates the features:

* **wake_word confidence:** 75.0%
* **noise confidence:** 20.1%

Because the wake_word successfully clears our 60% threshold limit, the system instantly logs a valid trigger, flashes the visualizer, and shifts the robot's expression matrix to an active state.

### Case B: Handling External Audio Spikes

Edge environments are loud and chaotic. During testing, a sudden non vocal audio spike occurred near the workbench, hitting a massive Peak Volume of 5,031.

Without robust dataset training, a sudden spike like this could easily cause a false trigger. However, because the training dataset included hundreds of custom noise variations, the model correctly classified the anomaly:

* **noise confidence:** 93.4%
* **wake_word confidence:** 0.4%

The robot completely ignored the sound spike, confirming that the custom-curated background noise samples successfully prevented an accidental trigger.

## 5. Key Takeaways

Building this listening capability taught me two critical lessons about embedded machine learning:

* **Data Quality Trumps Architecture:** Spending the hours necessary to capture 1,200+ distinct real-world audio samples directly on the target microphone platform is what made this system viable. Clean, hardware-specific datasets beat generic cloud data every single time.
* **Thresholding is Essential:** Raw output probabilities float constantly. By enforcing a hard 60% boundary filter, the robot acts only when it is mathematically certain of an explicit intent, keeping operations reliable and smooth.

With the listening pipeline fully optimized, the next step is connecting these trigger states directly to the robot's physical movement mechanics and sensory arrays!

---

Kavishka Dulshan
