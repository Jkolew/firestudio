# CarNeRF - AI Used Car Platform (v3)

## Overview

This project is a landing page for the "CarNeRF" AI-powered used car platform. The primary goal is to immediately showcase the app's core AI scanning technology to visitors on the first screen without requiring them to scroll.

## Design and Features

*   **Single-Screen Hero Animation:** The entire first viewport is a dynamic hero section featuring the AI scan animation. This immediately communicates the app's main function.
*   **Automated Animation:** The Genesis GV80 scan animation starts automatically on page load, providing an engaging experience without user interaction.
*   **Integrated Call-to-Action:** A clear headline and App Store download buttons are integrated directly into the hero/scan section, prompting users to act.
*   **Clean Navigation:** A simple, clean navigation bar at the top provides essential links, retaining the 'CarNeRF' branding.

## Current Plan: Merge AI Scan into an Auto-Playing Hero Section

1.  **Consolidate into a Single Hero Section (`index.html`):**
    *   Remove the `hero-v2` (hey dealer style) and `msg-sec` sections.
    *   Elevate the `scan-sec` to be the primary, full-screen (`100vh`) hero section.
    *   Add a compelling headline and the App Store buttons directly inside this new hero section.

2.  **Enable Auto-Play Animation (`index.html` - script):**
    *   Remove the Intersection Observer that triggers the animation on scroll.
    *   Modify the JavaScript to call the `runScanAnimation()` function automatically when the page loads.

3.  **Update Styles for New Layout (`custom.css`):**
    *   Delete styles related to `hero-v2`.
    *   Modify `scan-sec` and `scan-stage` to function as a full-viewport hero section.
    *   Revert the navigation bar and logo to the original 'CarNeRF' branding and style.
    *   Adjust the layout and positioning of the scan HUD, markers, and report to fit aesthetically within the new full-screen context.
