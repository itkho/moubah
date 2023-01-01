<h1 align="center">
    Moubah</br>
    🚧 (WIP) 🚧 </br>
</h1>
</br>


Desktop application built with Electron to play YouTube videos without background music

Download the app : 🍏 ~~Apple~~ | 🪟 ~~Windows~~ | 🐧 ~~Linux~~


</br>

## ℹ️ Why this? Let's dive in...

> Desktop application ...

A web page would have been more convenient for the end user, but the processing of the video requires a high CPU and/or GPU consumption combined with non-javascript dependencies that cannot take place in a browser (client side).
A solution could have been to place this processing on the server side, but this would have had a considerable cost and the primary objective of this service is to be 100% free. This could happen in the future in cha Allah with the financial support of the community, but not now. 

"What about a mobile app?"
Here, the problem with doing client-side processing is that the machine learning model trained to separate voice from audio is not currently compatible to run on a phone (as far as I know, this [PR](https://github.com/deezer/spleeter/issues/477) is still opened, this [project](https://github.com/FaceOnLive/Spleeter-Android-iOS) doesn't seem to work, and the processing time would have been to slow anyway).
As for the problem of server-side processing, it's the same as for the web version: not impossible, but it's not free

> ... built with Electron ...

A GUI built with a Python framework would have been technically simpler, but I turned to Electron to deepen my knowledge of the front end stack: JS / TS / React / HTML / CSS

> ... to play YouTube videos without background music

For the moment, only youtube videos are supported, but in the future, audios/videos can also be imported directly from the computer to have the background music removed, bi idhni Allah.
The app is centred around youtube as there is a lot of useful (e.g. tutorials) and/or entertaining (e.g. documentaries) content available on this platform with music in the background. This being haram in Islam, this app makes it... Moubah

</br>

## 💻 Tech Stack:

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)


### Supported OS

| Windows | Mac (Intel) | Mac (Apple silicon) | Linux |
| :-----: | :---------: | :-----------------: | :---: |
|   ✅    |     📆      | ✅ ([Python 3.8.10](https://www.python.org/downloads/release/python-3810/) required) |  ❌   |

> ✅ Supported | 📆 Not tested yet | ❌ Not support plannned yet

</br>

### 📥 Download the source code

Use the `--recursive` option because of the git submodule:

```bash
git clone git@github.com:karim-bouchez/moubah.git --recursive
```

### 🔗 Install dependencies

> **_For Windows users:_** use PowerShell

<!-- [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) -->

```bash
npm install -–save-dev
```

### ☄️ Run

```bash
npm run prod
```

### 📦 Create an executable file

```bash
npm run make
```

## 🛠 Troubleshooting

`no such file or directory ... protobuf/main.proto` on `npm run dev/prod` -> run: `git submodule update --init`

</br>

## 🎯 To-do list

-   [x] 🧼 Use ffmpeg-static for binaries
-   [ ] 🆕 Add a "delete" button
-   [ ] 🆕 Add a "log" button (that also open dev console) 
-   [ ] 🆕 Add a "github" button
-   [ ] 🆕 Add a "music remover server" availability status
-   [ ] 🆕 Run "music-remover" automatically from "moubah" (has to be compatible on Windows/Mac/Mac M1)
-   [ ] 🆕 Don't allow to download the same video twice
-   [ ] 🆕 Add more infos about the video on the search view
-   [ ] 🆕 Add a refresh button to the library view
-   [ ] 🆕 Improve UI/UX
-   [ ] 🆕 Support multi-languages (at least french and english)
-   [ ] 🧼 Use Hexagonal architecture
-   [ ] 🧼 Use TS instead of JS
-   [ ] 🧼 Use React framework
-   [ ] 🆕 Add e2e tests
-   [ ] 🆕 improve logs (time + separate music-remover logs from moubah.log) and add several level of logs (like logging in Python) 
-   [ ] 🆕 Setup CI/CD
-   [ ] 🪲 Latency on UI on FFmpeg calls (splitting audio + merge)
-   [ ] 🪲 Audio result isn't smooth, find why
-   [ ] 🆕 Add an uninstaller
-   [ ] 🆕 Notification system on new release
-   [ ] 🆕 Preview videos (without sound) on hover
-   [ ] 🆕 Be able to see "directly" the video (and don't have to wait until the whole video is processed)
-   [ ] 🆕 Be able to open Moubah from YouTube (see [here](https://docs.freetubeapp.io/usage/browser-extension/))
-   [ ] 🆕 Add an ML filter on thumbnail that blur women

> 🪲 Fix bug | 🆕 Add new feature | 🧼 Refactoring code
