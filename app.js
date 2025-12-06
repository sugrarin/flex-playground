// Default values for axes (font variations)
const axisDefaults = {
    opsz: 14,
    wght: 400,
    GRAD: 0,
    wdth: 100,
    slnt: 0,
    XOPQ: 96,
    YOPQ: 79,
    XTRA: 468,
    YTUC: 712,
    YTLC: 514,
    YTAS: 750,
    YTDE: -203,
    YTFI: 738
};

// Default values for CSS-only parameters (not in font file)
const cssDefaults = {
    size: 22,
    letterSpacing: 0,
    lineHeight: 120
};

// Axis name mapping for filename generation
const axisShortNames = {
    wght: 'wt',
    wdth: 'w',
    opsz: 'o',
    GRAD: 'g',
    slnt: 's',
    XOPQ: 'xo',
    YOPQ: 'yo',
    XTRA: 'xt',
    YTUC: 'yuc',
    YTLC: 'ylc',
    YTAS: 'yas',
    YTDE: 'yde',
    YTFI: 'yfi'
};

// Load settings from localStorage
function loadSettings() {
    const savedAxes = localStorage.getItem('fontAxes');
    const savedCSS = localStorage.getItem('fontCSS');

    return {
        axes: savedAxes ? JSON.parse(savedAxes) : { ...axisDefaults },
        css: savedCSS ? JSON.parse(savedCSS) : { ...cssDefaults }
    };
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('fontAxes', JSON.stringify(axes));
    localStorage.setItem('fontCSS', JSON.stringify(cssParams));
    localStorage.setItem('fontFeatures', JSON.stringify(features));
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('previewText', previewElement.value);
    localStorage.setItem('opszAuto', opszAuto);
}

// Font variation axes (these go into the generated font file)
const settings = loadSettings();
let axes = settings.axes;

// CSS-only parameters (for preview only, NOT in font file)
let cssParams = settings.css;

// OpenType features
const savedFeatures = localStorage.getItem('fontFeatures');
let features = savedFeatures ? JSON.parse(savedFeatures) : {
    liga: true,
    locl: false,
    pnum: false,
    rvrn: true
};

// Optical size auto mode
let opszAuto = localStorage.getItem('opszAuto') === 'true' || localStorage.getItem('opszAuto') === null;

// Current theme
let currentTheme = localStorage.getItem('theme') || 'dark';

// Get preview element
const previewElement = document.getElementById('preview-text');

// Load saved preview text
const savedText = localStorage.getItem('previewText');
if (savedText) {
    previewElement.value = savedText;
}

// Save preview text on change
previewElement.addEventListener('input', () => {
    saveSettings();
});

// Update font variation settings
function updateFontVariations() {
    const variationSettings = Object.entries(axes)
        .map(([axis, value]) => `'${axis}' ${value}`)
        .join(', ');

    previewElement.style.fontVariationSettings = variationSettings;
    saveSettings();
}

// Update OpenType features
function updateFontFeatures() {
    const featureSettings = Object.entries(features)
        .filter(([, enabled]) => enabled)
        .map(([feature]) => `'${feature}'`)
        .join(', ');

    previewElement.style.fontFeatureSettings = featureSettings || 'normal';
    saveSettings();
}

// Update CSS properties
function updateCSSProperties() {
    previewElement.style.fontSize = cssParams.size + 'px';
    previewElement.style.letterSpacing = (cssParams.letterSpacing / 100) + 'em';
    previewElement.style.lineHeight = (cssParams.lineHeight / 100);
    saveSettings();
}

// Update optical size auto mode
function updateOpszAuto() {
    const opszSlider = document.getElementById('opsz');
    const opszInput = document.getElementById('opsz-value');

    if (opszAuto) {
        // Set opsz to current font size
        axes.opsz = Math.max(8, Math.min(144, cssParams.size));
        opszSlider.value = axes.opsz;
        opszInput.value = axes.opsz;
        opszSlider.disabled = true;
        opszInput.disabled = true;
    } else {
        opszSlider.disabled = false;
        opszInput.disabled = false;
    }

    updateFontVariations();
}

// Update theme
function updateTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);

    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    saveSettings();
}

// Theme switcher
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        updateTheme(btn.dataset.theme);
    });
});

// Optical size auto checkbox
const opszAutoCheckbox = document.getElementById('opsz-auto');
if (opszAutoCheckbox) {
    opszAutoCheckbox.checked = opszAuto;

    opszAutoCheckbox.addEventListener('change', (e) => {
        opszAuto = e.target.checked;
        updateOpszAuto();
    });
}

// Initialize size (CSS-only parameter)
const sizeSlider = document.getElementById('size');
const sizeInput = document.getElementById('size-value');

if (sizeSlider && sizeInput) {
    sizeSlider.value = cssParams.size;
    sizeInput.value = cssParams.size;

    sizeSlider.addEventListener('input', (e) => {
        cssParams.size = parseInt(e.target.value);
        sizeInput.value = cssParams.size;
        updateCSSProperties();
        if (opszAuto) updateOpszAuto();
    });

    sizeInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        const min = parseInt(sizeInput.min);
        const max = parseInt(sizeInput.max);

        if (value < min) value = min;
        if (value > max) value = max;

        cssParams.size = value;
        sizeSlider.value = value;
        updateCSSProperties();
        if (opszAuto) updateOpszAuto();
    });
}

// Initialize letter-spacing (CSS-only parameter)
const letterSpacingSlider = document.getElementById('letter-spacing');
const letterSpacingInput = document.getElementById('letter-spacing-value');

if (letterSpacingSlider && letterSpacingInput) {
    letterSpacingSlider.value = cssParams.letterSpacing;
    letterSpacingInput.value = cssParams.letterSpacing;

    letterSpacingSlider.addEventListener('input', (e) => {
        cssParams.letterSpacing = parseFloat(e.target.value);
        letterSpacingInput.value = cssParams.letterSpacing;
        updateCSSProperties();
    });

    letterSpacingInput.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        const min = parseFloat(letterSpacingInput.min);
        const max = parseFloat(letterSpacingInput.max);

        if (value < min) value = min;
        if (value > max) value = max;

        cssParams.letterSpacing = value;
        letterSpacingSlider.value = value;
        updateCSSProperties();
    });
}

// Initialize line-height (CSS-only parameter)
const lineHeightSlider = document.getElementById('line-height');
const lineHeightInput = document.getElementById('line-height-value');

if (lineHeightSlider && lineHeightInput) {
    lineHeightSlider.value = cssParams.lineHeight;
    lineHeightInput.value = cssParams.lineHeight;

    lineHeightSlider.addEventListener('input', (e) => {
        cssParams.lineHeight = parseInt(e.target.value);
        lineHeightInput.value = cssParams.lineHeight;
        updateCSSProperties();
    });

    lineHeightInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        const min = parseInt(lineHeightInput.min);
        const max = parseInt(lineHeightInput.max);

        if (value < min) value = min;
        if (value > max) value = max;

        cssParams.lineHeight = value;
        lineHeightSlider.value = value;
        updateCSSProperties();
    });
}

// Initialize variation axes sliders and inputs
Object.keys(axisDefaults).forEach(param => {
    const slider = document.getElementById(param);
    const input = document.getElementById(`${param}-value`);

    if (slider && input) {
        // Set initial values
        const value = axes[param] !== undefined ? axes[param] : axisDefaults[param];
        slider.value = value;
        input.value = value;
        axes[param] = value;

        // Slider change
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            axes[param] = value;
            input.value = value;
            updateFontVariations();
        });

        // Input change
        input.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);

            if (value < min) value = min;
            if (value > max) value = max;

            axes[param] = value;
            slider.value = value;
            updateFontVariations();
        });
    }
});

// Reset buttons for individual parameters
document.querySelectorAll('.reset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const param = btn.dataset.param;
        const defaultValue = parseFloat(btn.dataset.default);

        if (param === 'size' || param === 'letter-spacing' || param === 'line-height') {
            // CSS parameters
            const cssParamName = param === 'letter-spacing' ? 'letterSpacing' :
                param === 'line-height' ? 'lineHeight' : param;
            cssParams[cssParamName] = defaultValue;
            const slider = document.getElementById(param);
            const input = document.getElementById(`${param}-value`);
            slider.value = defaultValue;
            input.value = defaultValue;
            updateCSSProperties();
            if (param === 'size' && opszAuto) updateOpszAuto();
        } else {
            // Font variation axes
            axes[param] = defaultValue;
            const slider = document.getElementById(param);
            const input = document.getElementById(`${param}-value`);
            slider.value = defaultValue;
            input.value = defaultValue;
            updateFontVariations();
        }
    });
});

// Global Reset All button
document.getElementById('reset-all-btn').addEventListener('click', () => {
    // Reset all axes
    Object.keys(axisDefaults).forEach(param => {
        axes[param] = axisDefaults[param];
        const slider = document.getElementById(param);
        const input = document.getElementById(`${param}-value`);
        if (slider) slider.value = axisDefaults[param];
        if (input) input.value = axisDefaults[param];
    });

    // Reset all CSS parameters
    Object.keys(cssDefaults).forEach(param => {
        const key = param === 'letterSpacing' ? 'letter-spacing' :
            param === 'lineHeight' ? 'line-height' : param;
        cssParams[param] = cssDefaults[param];
        const slider = document.getElementById(key);
        const input = document.getElementById(`${key}-value`);
        if (slider) slider.value = cssDefaults[param];
        if (input) input.value = cssDefaults[param];
    });

    // Reset opsz auto
    opszAuto = false;
    if (opszAutoCheckbox) opszAutoCheckbox.checked = false;

    updateFontVariations();
    updateCSSProperties();
    updateOpszAuto();
});

// Initialize checkboxes
Object.keys(features).forEach(feature => {
    const checkbox = document.getElementById(feature);

    if (checkbox) {
        checkbox.checked = features[feature];

        checkbox.addEventListener('change', (e) => {
            features[feature] = e.target.checked;
            updateFontFeatures();
        });
    }
});

// Generate filename based on modified axes (only axes, not CSS params!)
function generateFilename() {
    const modified = [];

    Object.entries(axes).forEach(([axis, value]) => {
        if (value !== axisDefaults[axis]) {
            const shortName = axisShortNames[axis] || axis.toLowerCase();
            modified.push(`${shortName}${Math.round(value)}`);
        }
    });

    if (modified.length === 0) {
        return 'RobotoFlex-Custom.ttf';
    }

    return `RobotoFlex-${modified.join('-')}.ttf`;
}

// Download button handler (only sends axes, NOT CSS params!)
document.getElementById('download-btn').addEventListener('click', async () => {
    const button = document.getElementById('download-btn');
    button.disabled = true;
    button.classList.add('loading');

    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    button.appendChild(spinner);

    try {
        // Only send axes (font variations), NOT CSS parameters!
        const response = await fetch('/generate-font', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ axes, features })
        });

        if (!response.ok) {
            throw new Error('Font generation failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFilename();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        button.classList.remove('loading');
        spinner.remove();
        button.disabled = false;
    } catch (error) {
        console.error('Error generating font:', error);
        alert('Error generating font. Make sure the server is running on port 8000.');
        button.classList.remove('loading');
        spinner.remove();
        button.disabled = false;
    }
});

// WOFF2 Download button handler
document.getElementById('download-woff2-btn').addEventListener('click', async () => {
    const button = document.getElementById('download-woff2-btn');
    button.disabled = true;
    button.classList.add('loading');

    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    button.appendChild(spinner);

    try {
        // Send request for WOFF2 format
        const response = await fetch('/generate-font-woff2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ axes, features })
        });

        if (!response.ok) {
            throw new Error('WOFF2 generation failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFilename().replace('.ttf', '.woff2');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        button.classList.remove('loading');
        spinner.remove();
        button.disabled = false;
    } catch (error) {
        console.error('Error generating WOFF2:', error);
        alert('Error generating WOFF2. Make sure the server is running on port 8000.');
        button.classList.remove('loading');
        spinner.remove();
        button.disabled = false;
    }
});

// Initialize with saved/default values
updateTheme(currentTheme);
updateCSSProperties();
updateFontVariations();
updateFontFeatures();
updateOpszAuto();

// Arrow key handling for all number inputs
document.addEventListener('keydown', (e) => {
    if (e.target.type === 'number' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();

        const input = e.target;
        const step = e.shiftKey ? 10 : 1;
        const currentValue = parseFloat(input.value) || 0;
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);

        let newValue;
        if (e.key === 'ArrowUp') {
            newValue = Math.min(currentValue + step, max);
        } else {
            newValue = Math.max(currentValue - step, min);
        }

        // Update value and trigger input event
        input.value = newValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
});
