# OCR Best Practices for Course Schedules

Based on practical experience processing university course timetables.

## Image Quality Requirements

### Minimum Specifications
- **Resolution**: 300 DPI minimum, 600 DPI recommended
- **Format**: JPEG, PNG, or TIFF (lossless preferred)
- **Size**: At least 1000x1000 pixels for readable text
- **Color**: Grayscale or color with good contrast

### Common Issues and Solutions
1. **Blurry Images**
   - Use image sharpening filters before OCR
   - Resize to 2x original size, then apply OCR

2. **Low Contrast**
   - Convert to grayscale
   - Apply histogram equalization
   - Use adaptive thresholding

3. **Complex Backgrounds**
   - Remove background noise with median filtering
   - Use color separation for colored tables

## Chinese Text Recognition

### Tesseract Configuration for Chinese
```bash
# Install Chinese language pack
sudo apt-get install tesseract-ocr-chi-sim

# Usage with Chinese
tesseract image.jpg stdout -l chi_sim --psm 6
```

### Common OCR Errors in Chinese

| Original Character | Common OCR Error | Correction Method |
|-------------------|------------------|-------------------|
| 五 (five)         | 划 (scratch)     | Context analysis (星期"五") |
| 班 (class)        | 隐 (hidden)      | Dictionary lookup |
| 3班 (class 3)     | 33E              | Pattern matching |
| 2班 (class 2)     | 23E              | Pattern matching |
| 人数 (people)     | 人玫             | Dictionary lookup |

### Post-Processing Strategies
1. **Dictionary Matching**: Maintain list of expected course names
2. **Context Correction**: Use surrounding text for disambiguation
3. **Pattern Validation**: Verify week numbers, classroom formats

## Table Structure Analysis

### Typical Chinese Course Table Layout
```
星期一      星期二      星期三      星期四      星期五      星期六      星期日
[Course]   [Course]   [Course]   [Course]   [Course]   [Course]   [Course]
Details    Details    Details    Details    Details    Details    Details
```

### Parsing Strategies
1. **Column Detection**: Find day headers, align vertically
2. **Row Grouping**: Identify course blocks within columns
3. **Spatial Mapping**: Use coordinates to relate items

### Handling Multi-Day Courses
Some courses span multiple days with different times:
- Map by coordinates, not just text order
- Use relative positioning within table cells

## Week Number Parsing

### Chinese University Week Formats
1. **Continuous Ranges**: "1-18周" (weeks 1-18)
2. **Multiple Ranges**: "1-57-9.11-18周" (weeks 1-5, 7-9, 11-18)
3. **Single Weeks**: "1,3,5,7,9周" (odd weeks only)
4. **With Breaks**: "1-8周，10-15周" (week 9 is break)

### Parsing Algorithm
```python
def parse_week_ranges(week_str):
    """
    Parse Chinese week range strings like "1-57-9.11-18周"
    Returns list of week numbers
    """
    # Remove "周" character
    week_str = week_str.replace("周", "")
    
    # Split by common separators
    parts = re.split(r'[,.，、]', week_str)
    
    weeks = []
    for part in parts:
        if '-' in part:
            start, end = map(int, part.split('-'))
            weeks.extend(range(start, end + 1))
        else:
            weeks.append(int(part))
    
    return weeks
```

## Classroom Number Formats

### Common Patterns
1. **Standard**: "10-501" (Building 10, Room 501)
2. **Abbreviated**: "10.501" or "10-." (OCR errors)
3. **Complex**: "理科楼101" or "实验楼A201"

### Normalization Rules
- Replace "10-." with "10-501"
- Convert "10.501" to "10-501"
- Keep specialized building names unchanged

## Integration with Reminder Systems

### Cron Expression Generation
Based on parsed schedule:
- **Days**: Monday=1, Tuesday=2, etc.
- **Times**: Convert "01-02节" to actual times (e.g., 08:00-09:40)
- **Weeks**: Only activate during teaching weeks

### Reminder Message Templates
```
Basic: "今日有Java高级编程课（24计算机1班，10-501教室）"
Detailed: "今日课程：Java高级编程，时间：01-02节，地点：10-501，班级：24计算机1班（44人）"
End of Course: "本学期Java高级编程课程已全部结束"
```

## Performance Optimization

### Caching Strategies
1. **Image Cache**: Store preprocessed images
2. **OCR Cache**: Cache OCR results for identical images
3. **Schedule Cache**: Store parsed schedules

### Batch Processing
- Process multiple timetables in parallel
- Use multiprocessing for large batches
- Queue system for high-volume processing

## Testing and Validation

### Test Dataset
- Collect sample timetables from different universities
- Include various formats and quality levels
- Manually verify extraction accuracy

### Accuracy Metrics
- Character-level accuracy
- Course extraction completeness
- Schedule correctness (days, times, locations)

### Continuous Improvement
1. **Error Logging**: Record OCR failures
2. **Pattern Learning**: Adapt to new timetable formats
3. **User Feedback**: Incorporate correction data

## Resources and Tools

### OCR Tools
- **Tesseract**: Primary OCR engine
- **EasyOCR**: Alternative for Chinese text
- **PaddleOCR**: Baidu's OCR with good Chinese support

### Image Processing
- **OpenCV**: Advanced image preprocessing
- **PIL/Pillow**: Basic image manipulation
- **scikit-image**: Scientific image processing

### Chinese NLP
- **Jieba**: Chinese text segmentation
- **Pinyin**: Convert characters to pinyin for matching
- **Synonyms**: Handle variant terminology

## License and Attribution
This document based on practical experience with university course schedule processing.
