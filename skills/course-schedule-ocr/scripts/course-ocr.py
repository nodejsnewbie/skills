#!/usr/bin/env python3
"""
Course Schedule OCR Processor
Extracts structured course information from timetable images.
"""

import pytesseract
from PIL import Image
import re
import json
import argparse
import sys
from pathlib import Path

def preprocess_image(image_path):
    """Preprocess image for better OCR recognition."""
    try:
        img = Image.open(image_path)
        
        # Convert to grayscale
        img_gray = img.convert('L')
        
        # Enhance contrast (adjust based on image quality)
        # Simple thresholding - can be adjusted per image
        img_enhanced = img_gray.point(lambda x: 0 if x < 150 else 255)
        
        return img, img_gray, img_enhanced
    except Exception as e:
        print(f"❌ Error loading image: {e}", file=sys.stderr)
        return None, None, None

def extract_text_from_image(img, lang='chi_sim'):
    """Extract text from image using OCR."""
    try:
        # Try different page segmentation modes for tables
        configs = [
            '--psm 3',  # Fully automatic page segmentation, no OSD (default)
            '--psm 6',  # Assume a single uniform block of text
            '--psm 11'  # Sparse text. Find as much text as possible in no particular order
        ]
        
        best_text = ""
        for config in configs:
            text = pytesseract.image_to_string(img, lang=lang, config=config)
            if len(text.strip()) > len(best_text.strip()):
                best_text = text
        
        return best_text
    except Exception as e:
        print(f"❌ OCR extraction failed: {e}", file=sys.stderr)
        return ""

def parse_course_schedule(ocr_text):
    """Parse OCR text into structured course schedule."""
    
    # Days of week in Chinese
    days_chinese = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
    days_map = {day: [] for day in days_chinese}
    
    lines = ocr_text.split('\n')
    current_day = None
    course_block = []
    
    for line in lines:
        line = line.strip()
        if not line:
            if course_block and current_day:
                course_info = parse_course_block(course_block)
                if course_info:
                    days_map[current_day].append(course_info)
                course_block = []
            continue
        
        # Check if this line starts a new day
        for day in days_chinese:
            if day in line:
                if course_block and current_day:
                    course_info = parse_course_block(course_block)
                    if course_info:
                        days_map[current_day].append(course_info)
                current_day = day
                course_block = [line]
                break
        else:
            if current_day:
                course_block.append(line)
    
    # Process the last course block
    if course_block and current_day:
        course_info = parse_course_block(course_block)
        if course_info:
            days_map[current_day].append(course_info)
    
    return days_map

def parse_course_block(block_lines):
    """Parse individual course block lines into structured data."""
    if not block_lines:
        return None
    
    course_info = {
        "raw_text": "\n".join(block_lines),
        "course_name": "",
        "class_info": "",
        "student_count": 0,
        "weeks": "",
        "time_slot": "",
        "location": "",
        "exam_type": ""
    }
    
    # Look for common patterns
    for line in block_lines:
        line = line.strip()
        
        # Course name (often contains subject keywords)
        if "Java" in line or "编程" in line or "高级" in line:
            course_info["course_name"] = line
            # Clean up common OCR errors
            course_info["course_name"] = course_info["course_name"].replace("高豚六径", "高级编程")
            course_info["course_name"] = course_info["course_name"].replace("高县闹杏", "高级编程")
            course_info["course_name"] = course_info["course_name"].replace("高级六径", "高级编程")
        
        # Class information
        if "计算机" in line and ("班" in line or any(char.isdigit() for char in line)):
            course_info["class_info"] = line
            # Clean up OCR errors
            course_info["class_info"] = course_info["class_info"].replace("隐", "班")
            course_info["class_info"] = course_info["class_info"].replace("3E", "3班")
            course_info["class_info"] = course_info["class_info"].replace("2E", "2班")
        
        # Student count
        if "总人数" in line:
            # Extract numbers
            numbers = re.findall(r'\d+', line)
            if numbers:
                course_info["student_count"] = int(numbers[0])
        
        # Weeks and time slot
        if "周[" in line or "周 [" in line:
            # Extract week range and time
            week_match = re.search(r'([\d\-\.]+周)\[(\d+-\d+)节\]', line)
            if week_match:
                course_info["weeks"] = week_match.group(1)
                course_info["time_slot"] = week_match.group(2)
        
        # Location
        if "10-501" in line or "10-." in line or "10." in line:
            course_info["location"] = "10-501"  # Normalize
        
        # Exam type
        if "考查" in line or "考试" in line:
            course_info["exam_type"] = line
    
    return course_info

def generate_reminder_message(schedule):
    """Generate human-readable reminder message from schedule."""
    days_with_classes = []
    
    for day, courses in schedule.items():
        if courses:
            days_with_classes.append(day)
    
    if not days_with_classes:
        return "本周无课程安排"
    
    message = "本周课程安排：\n"
    for day in ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]:
        if day in schedule and schedule[day]:
            message += f"\n{day}："
            for course in schedule[day]:
                message += f"{course['course_name']}（{course['class_info']}，{course['student_count']}人）"
                if course['time_slot']:
                    message += f" {course['time_slot']}节"
                if course['location']:
                    message += f" @{course['location']}"
    
    return message

def main():
    parser = argparse.ArgumentParser(description='Extract course schedule from timetable image.')
    parser.add_argument('image_path', help='Path to timetable image')
    parser.add_argument('--output', '-o', help='Output JSON file path')
    parser.add_argument('--format', '-f', choices=['json', 'text', 'reminder'], default='json',
                       help='Output format (default: json)')
    
    args = parser.parse_args()
    
    # Check if image exists
    if not Path(args.image_path).exists():
        print(f"❌ Image not found: {args.image_path}", file=sys.stderr)
        sys.exit(1)
    
    print(f"📷 Processing image: {args.image_path}")
    
    # Preprocess image
    img, img_gray, img_enhanced = preprocess_image(args.image_path)
    if not img:
        sys.exit(1)
    
    # Try OCR with different preprocessing
    print("🔍 Performing OCR...")
    text_original = extract_text_from_image(img)
    text_gray = extract_text_from_image(img_gray)
    text_enhanced = extract_text_from_image(img_enhanced)
    
    # Use the text with most content
    texts = [text_original, text_gray, text_enhanced]
    best_text = max(texts, key=lambda x: len(x.strip()))
    
    if not best_text.strip():
        print("❌ No text extracted from image", file=sys.stderr)
        sys.exit(1)
    
    # Parse schedule
    print("📊 Parsing course schedule...")
    schedule = parse_course_schedule(best_text)
    
    # Generate output
    if args.format == 'json':
        output = json.dumps(schedule, ensure_ascii=False, indent=2)
    elif args.format == 'reminder':
        output = generate_reminder_message(schedule)
    else:  # text format
        output = best_text
    
    # Output to file or stdout
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"✅ Output saved to: {args.output}")
    else:
        print(output)
    
    # Print summary
    days_with_classes = sum(1 for day in schedule if schedule[day])
    total_courses = sum(len(courses) for courses in schedule.values())
    print(f"\n📈 Summary: {days_with_classes} days with classes, {total_courses} total courses")

if __name__ == "__main__":
    main()
