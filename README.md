# Variable Fonts Playground

Interactive web application for creating static font instances from variable font files. Support for multiple variable fonts including Roboto Flex, Google Sans Flex, and Martian Grotesk. Adjust variation axes in real-time, then download your custom .ttf and .woff2 files.

![](demo.gif)

![Preview](https://img.shields.io/badge/Status-Ready-success)

## Features

- ✨ **Multiple Fonts** - Switch between Roboto Flex, Google Sans Flex, and Martian Grotesk
- 🎛️ **Dynamic Axes** - Controls automatically adjust based on the selected font's capabilities
- 🎨 **Real-time Preview** - See font changes instantly as you adjust sliders
- ⬇️ **Download Static Fonts** - Generate and download custom .ttf and .woff2 files

## Quick Start

### 1. Install Dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Start the Server

```bash
python3 server.py
```

The server will start on `http://localhost:8000`

### 3. Open in Browser

Open `http://localhost:8000` or open `index.html` directly (though server is needed for downloads).

## Supported Fonts & Axes

The playground supports the following variable fonts, each with their own set of axes:

### Roboto Flex
- **opsz** (Optical Size)
- **wght** (Weight)
- **wdth** (Width)
- **GRAD** (Grade)
- **slnt** (Slant)
- And many parametric axes (XOPQ, YOPQ, XTRA, etc.)

### Google Sans Flex
- **opsz** (Optical Size)
- **wght** (Weight)
- **wdth** (Width)
- **GRAD** (Grade)
- **slnt** (Slant)
- **ROND** (Roundness)

### Martian Grotesk
- **wght** (Weight)
- **wdth** (Width)

## Files

- `index.html` - Main application interface
- `style.css` - Premium dark mode styling
- `app.js` - Real-time interaction logic
- `server.py` - Flask backend for font generation
- `requirements.txt` - Python dependencies
- Font files (`*.ttf`)

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python Flask with CORS support
- **Font Processing**: fontTools library

## How It Works

1. **Real-time Preview**: CSS `font-variation-settings` updates as you adjust sliders
2. **Font Generation**: Python backend uses `fontTools.varLib.instancer` to create static instances
3. **Download**: Generated .ttf/.woff2 file sent to browser via Flask endpoint

## To-Do
- [ ] **Smart Settings History**: Save used settings (axes values) into the generated font metadata (e.g. `Description` or `Copyright` fields).  Allow drag-and-dropping the generated font back into the playground to restore those exact settings.

## License

Built for font design and typography exploration.