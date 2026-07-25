from pathlib import Path
import sys

import pdfplumber


for raw_path in sys.argv[1:]:
    pdf_path = Path(raw_path)
    print(f"=== {pdf_path.name} ===")
    with pdfplumber.open(pdf_path) as document:
        for page_number, page in enumerate(document.pages, start=1):
            print(f"--- page {page_number} ---")
            print(page.extract_text(layout=True) or "")
