import zipfile
import xml.etree.ElementTree as ET
import sys
import traceback

def extract_text(docx_path):
    try:
        doc = zipfile.ZipFile(docx_path)
        xml_content = doc.read('word/document.xml')
        doc.close()
        tree = ET.XML(xml_content)
        prefix = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        texts = []
        for paragraph in tree.iter(prefix + 'p'):
            para_texts = []
            for run in paragraph.iter(prefix + 'r'):
                for text in run.iter(prefix + 't'):
                    if text.text:
                        para_texts.append(text.text)
            if para_texts:
                texts.append(''.join(para_texts))
        return '\n'.join(texts)
    except Exception as e:
        return 'Exception: ' + str(e) + '\n' + traceback.format_exc()

if __name__ == '__main__':
    with open('output_extract_py.txt', 'w', encoding='utf-8') as f:
        f.write(extract_text(sys.argv[1]))
    print("DONE extractor")
