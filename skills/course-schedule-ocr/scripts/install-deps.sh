#!/bin/bash

# Course Schedule OCR Skill - Dependency Installer
# Installs system and Python dependencies for OCR processing

set -e

echo "📦 Installing Course Schedule OCR dependencies..."

# Detect operating system
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "❌ Cannot detect operating system"
    exit 1
fi

# Install system dependencies
echo "🔧 Installing system packages..."
case $OS in
    ubuntu|debian)
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr tesseract-ocr-chi-sim python3-pip python3-pil
        ;;
    fedora|centos|rhel)
        sudo dnf install -y tesseract tesseract-langpack-chi_sim python3-pip python3-pillow
        ;;
    arch|manjaro)
        sudo pacman -S --noconfirm tesseract tesseract-data-chi_sim python-pip python-pillow
        ;;
    *)
        echo "⚠️  Unsupported OS: $OS"
        echo "Please install manually:"
        echo "  - tesseract-ocr"
        echo "  - tesseract-ocr-chi-sim (Chinese language pack)"
        echo "  - python3-pip"
        echo "  - python3-pillow or python3-pil"
        ;;
esac

# Install Python dependencies
echo "🐍 Installing Python packages..."
pip3 install --user pytesseract

# Verify installation
echo "✅ Verifying installations..."
if command -v tesseract &> /dev/null; then
    tesseract --version | head -1
else
    echo "❌ tesseract not found"
fi

if python3 -c "import pytesseract; print('pytesseract available')" &> /dev/null; then
    echo "✅ pytesseract installed successfully"
else
    echo "❌ pytesseract installation failed"
fi

if python3 -c "from PIL import Image; print('PIL/Pillow available')" &> /dev/null; then
    echo "✅ PIL/Pillow installed successfully"
else
    echo "❌ PIL/Pillow installation failed"
fi

echo ""
echo "🎉 Dependency installation complete!"
echo ""
echo "Usage examples:"
echo "  python3 scripts/course-ocr.py /path/to/timetable.jpg"
echo "  python3 scripts/setup-reminders.py --input timetable.jpg"
