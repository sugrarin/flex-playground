from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
from fontTools import ttLib
from fontTools.varLib import instancer
import io
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

FONT_PATH = 'Roboto-Flex-Variable.ttf'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/generate-font', methods=['POST'])
def generate_font():
    try:
        data = request.json
        axes = data.get('axes', {})
        font_filename = data.get('font')
        
        if not font_filename:
             return jsonify({'error': 'No font specified'}), 400
             
        # Security check: ensure only filename is passed, no paths
        font_filename = os.path.basename(font_filename)
        
        if not os.path.exists(font_filename):
            return jsonify({'error': f'Font file {font_filename} not found'}), 404
        
        # Load the variable font
        font = ttLib.TTFont(font_filename)
        
        # Create instance with specified axis values
        # Convert axis values to the format expected by instancer
        axis_limits = {axis: value for axis, value in axes.items()}
        
        # Create a static instance
        instance_font = instancer.instantiateVariableFont(font, axis_limits)
        
        # Save to BytesIO buffer
        buffer = io.BytesIO()
        instance_font.save(buffer)
        buffer.seek(0)
        
        # Close fonts
        font.close()
        instance_font.close()
        
        base_name = os.path.splitext(font_filename)[0]
        download_name = f'{base_name}-Custom.ttf'
        
        return send_file(
            buffer,
            mimetype='font/ttf',
            as_attachment=True,
            download_name=download_name
        )
    
    except Exception as e:
        print(f"Error generating font: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate-font-woff2', methods=['POST'])
def generate_font_woff2():
    try:
        data = request.json
        axes = data.get('axes', {})
        font_filename = data.get('font')
        
        if not font_filename:
             return jsonify({'error': 'No font specified'}), 400
             
        # Security check: ensure only filename is passed, no paths
        font_filename = os.path.basename(font_filename)
        
        if not os.path.exists(font_filename):
            return jsonify({'error': f'Font file {font_filename} not found'}), 404
        
        # Load the variable font
        font = ttLib.TTFont(font_filename)
        
        # Create instance with specified axis values
        axis_limits = {axis: value for axis, value in axes.items()}
        
        # Create a static instance
        instance_font = instancer.instantiateVariableFont(font, axis_limits)
        
        # Save to BytesIO buffer as WOFF2
        buffer = io.BytesIO()
        instance_font.flavor = 'woff2'
        instance_font.save(buffer)
        buffer.seek(0)
        
        # Close fonts
        font.close()
        instance_font.close()
        
        base_name = os.path.splitext(font_filename)[0]
        download_name = f'{base_name}-Custom.woff2'
        
        return send_file(
            buffer,
            mimetype='font/woff2',
            as_attachment=True,
            download_name=download_name
        )
    
    except Exception as e:
        print(f"Error generating WOFF2: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))
    if not os.path.exists(FONT_PATH):
        print(f"Error: {FONT_PATH} not found!")
        exit(1)
    
    print(f"Starting font generation server on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
