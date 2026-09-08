# Cider Companion Module

This module allows you to control the **Cider** Apple Music client directly from Bitfocus Companion. It uses the native Cider REST API to send playback commands and a Socket.io connection to receive real-time playback status updates.

## Setup Guide

To allow Companion to communicate with Cider, you need to enable the API endpoints inside the Cider client and retrieve your API token.

### 1. Enable the API in Cider
1. Open the **Cider** application.
2. Navigate to **Settings** (usually the gear icon).
3. Go to the **Connections** tab.
4. Scroll down and ensure that **WebSockets API** is toggled **ON**.
5. Note down the port (Default is usually `10767`).

### 2. Retrieve your API Token
1. In the same **Connections** settings tab in Cider, click on **Manage**. 
2. Ensure that **Require API Tokens** is toggled **ON**. 
3. Create a new Device via the Button, and give it the right to **Control your Queue** and your **Playback**. Name it whatever you like. 
4. Copy the created token to your clipboard. You will need it for the Companion configuration.

### 3. Configure the Companion Module
Add the Cider connection in your Companion web interface and fill in the configuration fields:

* **Target Host (Host/IP:Port):** The hostname or IP address of the computer running Cider, plus the port, separated by a colon (e.g. `127.0.0.1:10767`). If Cider and Companion are running on the same machine, use `127.0.0.1:10767`.
* **Cider API Token:** Paste the token you copied from the Cider settings here.

Click "Save" or apply the settings. The module status should change to `OK` (green).

---

## Supported Features

### Actions
* **Playback Control:** A single action with a dropdown to choose the playback command to send: Play, Pause, Play / Pause (Toggle), Stop, Next Track, or Previous Track.

### Feedbacks
* **Playback State:** A boolean feedback that is true when the target playback state (*Playing* or *Paused*) matches Cider's current state. Combine it with your own style (color, text, etc.) as needed.

### Variables
* **Current Song Title (`song_title`):** The title of the currently playing track.

### Presets
* **Play / Pause Toggle:** A ready-to-use button combining the Playback Control action with the Playback State feedback.

---

## Troubleshooting
* **Status "Connection Failure" or "Disconnected":** Double-check if Cider is running and if the WebSockets API is enabled in the Cider settings.
* **Status "Bad Config":** Ensure that you have entered both a valid host (and port) and your specific API Token in the Companion module settings.
* **Commands not working but status is OK:** Verify that the API token is exactly the same as shown in the Cider client (no leading or trailing spaces) and that the token has the correct permissions (Queue and Playback).