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

* **Target IP:** The IP address of the computer running Cider. If Cider and Companion are running on the same machine, use `127.0.0.1`.
* **Target Port:** The port configured in Cider (Default: `10767`).
* **Cider API Token:** Paste the token you copied from the Cider settings here.

Click "Save" or apply the settings. The module status should change to `OK` (green).

---

## Supported Features

### Actions
This module currently supports the following playback controls:
* **Play:** Starts or resumes playback.
* **Pause:** Pauses the current track.
* **Play / Pause (Toggle):** Toggles between play and pause states.
* **Stop Music:** Stops playback entirely.
* **Next Track:** Skips to the next track in the queue.
* **Previous Track:** Returns to the previous track or restarts the current one.

### Feedbacks
* **Playback Status Color:** Allows you to dynamically change the background and text color of a button based on whether Cider is currently *Playing* or *Paused/Stopped*.

### Variables
*Currently, this module focuses on playback control and state feedback. Dynamic variables (like current song title or artist) might be added in future updates.*

---

## Troubleshooting
* **Status "Connection Failure" or "Disconnected":** Double-check if Cider is running and if the WebSockets API is enabled in the Cider settings.
* **Status "Bad Config":** Ensure that you have entered both a valid IP address and your specific API Token in the Companion module settings.
* **Commands not working but status is OK:** Verify that the API token is exactly the same as shown in the Cider client (no leading or trailing spaces) and that the token has the correct permissions (Queue and Playback).