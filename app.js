// Font configurations with axes and ranges for each font
const fontConfigurations = {
    'roboto-flex': {
        name: 'Roboto Flex',
        fontFamily: 'Roboto Flex',
        filename: 'Roboto-Flex-Variable.ttf',
        axes: {
            opsz: { min: 8, max: 144, default: 14, step: 1 },
            wght: { min: 100, max: 1000, default: 400, step: 1 },
            GRAD: { min: -200, max: 150, default: 0, step: 1 },
            wdth: { min: 25, max: 151, default: 100, step: 1 },
            slnt: { min: -10, max: 0, default: 0, step: 0.1 },
            XOPQ: { min: 27, max: 175, default: 96, step: 1 },
            YOPQ: { min: 25, max: 135, default: 79, step: 1 },
            XTRA: { min: 323, max: 603, default: 468, step: 1 },
            YTUC: { min: 528, max: 760, default: 712, step: 1 },
            YTLC: { min: 416, max: 570, default: 514, step: 1 },
            YTAS: { min: 649, max: 854, default: 750, step: 1 },
            YTDE: { min: -305, max: -98, default: -203, step: 1 },
            YTFI: { min: 560, max: 788, default: 738, step: 1 }
        }
    },
    'google-sans-flex': {
        name: 'Google Sans Flex',
        fontFamily: 'Google Sans Flex',
        filename: 'Google-Sans-Flex-Variable.ttf',
        axes: {
            opsz: { min: 6, max: 144, default: 18, step: 1 },
            wght: { min: 1, max: 1000, default: 400, step: 1 },
            wdth: { min: 25, max: 151, default: 100, step: 1 },
            GRAD: { min: 0, max: 100, default: 0, step: 1 },
            slnt: { min: -10, max: 0, default: 0, step: 0.1 },
            ROND: { min: 0, max: 100, default: 0, step: 1 }
        }
    },
    'martian-grotesk': {
        name: 'Martian Grotesk',
        fontFamily: 'Martian Grotesk',
        filename: 'Martian-Grotesk-Variable.ttf',
        axes: {
            wght: { min: 100, max: 1000, default: 400, step: 1 },
            wdth: { min: 75, max: 200, default: 100, step: 1 }
        }
    }
};

// Default values for axes (font variations) - will be set dynamically
let axisDefaults = {};

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

// Current selected font
let currentFont = localStorage.getItem('selectedFont');
if (!currentFont || !fontConfigurations[currentFont]) {
    currentFont = 'google-sans-flex';
}

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
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('previewText', previewElement.value);
    localStorage.setItem('opszAuto', opszAuto);
    localStorage.setItem('selectedFont', currentFont);
}
// [SKIPPED SOME LINES, RESUMING FROM generateFilename]

// Download button handler (only sends axes, NOT CSS params!)
document.getElementById('download-btn').addEventListener('click', async () => {
    const button = document.getElementById('download-btn');
    button.disabled = true;
    button.classList.add('loading');

    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    button.appendChild(spinner);

    try {
        const config = fontConfigurations[currentFont];

        // Only send axes (font variations), NOT CSS parameters!
        const response = await fetch('/generate-font', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                axes,
                font: config.filename  // Send current font filename
            })
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

        // specific timeout to allow download to start
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);

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
        const config = fontConfigurations[currentFont];

        // Send request for WOFF2 format
        const response = await fetch('/generate-font-woff2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                axes,
                font: config.filename  // Send current font filename
            })
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

        // specific timeout to allow download to start
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);

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

// Initialize axis defaults based on current font
function initializeAxisDefaults() {
    const config = fontConfigurations[currentFont];
    axisDefaults = {};
    Object.keys(config.axes).forEach(axis => {
        axisDefaults[axis] = config.axes[axis].default;
    });
}

initializeAxisDefaults();

// Font variation axes (these go into the generated font file)
const settings = loadSettings();
let axes = settings.axes;

// CSS-only parameters (for preview only, NOT in font file)
let cssParams = settings.css;

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
    const config = fontConfigurations[currentFont];
    const variationSettings = Object.entries(axes)
        .filter(([axis]) => config.axes[axis])  // Only include axes supported by current font
        .map(([axis, value]) => `'${axis}' ${value}`)
        .join(', ');

    previewElement.style.fontVariationSettings = variationSettings;
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

    if (!opszSlider || !opszInput) return;  // opsz may not exist for all fonts

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

// Show/hide axis controls based on current font
function updateAxisVisibility() {
    const config = fontConfigurations[currentFont];

    // Get all control groups
    const allAxes = ['opsz', 'wght', 'GRAD', 'wdth', 'slnt', 'XOPQ', 'YOPQ', 'XTRA', 'YTUC', 'YTLC', 'YTAS', 'YTDE', 'YTFI'];

    allAxes.forEach(axis => {
        const controlGroup = document.getElementById(axis)?.closest('.control-group');
        if (controlGroup) {
            if (config.axes[axis]) {
                controlGroup.style.display = 'block';

                // Update min, max, step, and default values
                const slider = document.getElementById(axis);
                const input = document.getElementById(`${axis}-value`);
                const resetBtn = document.querySelector(`.reset-btn[data-param="${axis}"]`);

                if (slider && input) {
                    slider.min = config.axes[axis].min;
                    slider.max = config.axes[axis].max;
                    slider.step = config.axes[axis].step;
                    input.min = config.axes[axis].min;
                    input.max = config.axes[axis].max;
                    input.step = config.axes[axis].step;
                }

                if (resetBtn) {
                    resetBtn.dataset.default = config.axes[axis].default;
                }
            } else {
                controlGroup.style.display = 'none';
            }
        }
    });
}

// Switch font
function switchFont(fontId, savedAxes = null) {
    currentFont = fontId;
    const config = fontConfigurations[fontId];

    // Update preview font family
    previewElement.style.fontFamily = `'${config.fontFamily}', sans-serif`;

    // Reset axes to new font's defaults or use saved values
    initializeAxisDefaults();

    // If savedAxes are provided and match the current font (basic check), use them
    // Otherwise use defaults
    if (savedAxes) {
        axes = { ...axisDefaults, ...savedAxes };
    } else {
        axes = { ...axisDefaults };
    }

    // Update UI
    updateAxisVisibility();

    // Reset all sliders and inputs to new values
    Object.keys(config.axes).forEach(axis => {
        const slider = document.getElementById(axis);
        const input = document.getElementById(`${axis}-value`);

        if (slider && input) {
            // Use current value from axes object (which is either saved or default)
            const currentValue = axes[axis];
            slider.value = currentValue;
            input.value = currentValue;
        }
    });

    // Update opsz auto if applicable
    if (config.axes.opsz) {
        updateOpszAuto();
    }

    updateFontVariations();
    saveSettings();
}

// Font selector change
const fontSelector = document.getElementById('font-selector');
if (fontSelector) {
    fontSelector.value = currentFont;

    fontSelector.addEventListener('change', (e) => {
        switchFont(e.target.value);
    });
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
        if (opszAuto && fontConfigurations[currentFont].axes.opsz) updateOpszAuto();
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
        if (opszAuto && fontConfigurations[currentFont].axes.opsz) updateOpszAuto();
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
Object.keys(fontConfigurations[currentFont].axes).forEach(param => {
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
            if (param === 'size' && opszAuto && fontConfigurations[currentFont].axes.opsz) updateOpszAuto();
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
    const config = fontConfigurations[currentFont];

    // Reset all axes for current font
    Object.keys(config.axes).forEach(param => {
        axes[param] = config.axes[param].default;
        const slider = document.getElementById(param);
        const input = document.getElementById(`${param}-value`);
        if (slider) slider.value = config.axes[param].default;
        if (input) input.value = config.axes[param].default;
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
    if (config.axes.opsz) updateOpszAuto();
});

// Generate filename based on modified axes (only axes, not CSS params!)
function generateFilename() {
    const config = fontConfigurations[currentFont];
    const modified = [];

    Object.entries(axes).forEach(([axis, value]) => {
        if (config.axes[axis] && value !== config.axes[axis].default) {
            const shortName = axisShortNames[axis] || axis.toLowerCase();
            modified.push(`${shortName}${Math.round(value)}`);
        }
    });

    const baseName = config.name.replace(/\s+/g, '');

    if (modified.length === 0) {
        return `${baseName}-Custom.ttf`;
    }

    return `${baseName}-${modified.join('-')}.ttf`;
}


// Initialize with saved/default values
// Initialize with saved/default values
switchFont(currentFont, settings.axes);  // This will set up everything
updateTheme(currentTheme);
updateCSSProperties();

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
