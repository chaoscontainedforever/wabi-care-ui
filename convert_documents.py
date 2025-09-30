#!/usr/bin/env python3
"""
Document Conversion Script
Converts Excel and Word documents to text-based formats that can be read by AI assistants.
"""

import pandas as pd
import docx
import os
from pathlib import Path

def convert_excel_to_csv(excel_path, output_dir):
    """Convert Excel file to CSV format"""
    try:
        # Read all sheets from the Excel file
        excel_file = pd.ExcelFile(excel_path)
        
        print(f"Found {len(excel_file.sheet_names)} sheets: {excel_file.sheet_names}")
        
        for sheet_name in excel_file.sheet_names:
            # Read each sheet
            df = pd.read_excel(excel_path, sheet_name=sheet_name)
            
            # Create output filename
            safe_sheet_name = sheet_name.replace(' ', '_').replace('/', '_')
            csv_filename = f"{Path(excel_path).stem}_{safe_sheet_name}.csv"
            csv_path = os.path.join(output_dir, csv_filename)
            
            # Save as CSV
            df.to_csv(csv_path, index=False)
            print(f"Converted sheet '{sheet_name}' to {csv_filename}")
            
            # Also create a summary text file
            summary_filename = f"{Path(excel_path).stem}_{safe_sheet_name}_summary.txt"
            summary_path = os.path.join(output_dir, summary_filename)
            
            with open(summary_path, 'w', encoding='utf-8') as f:
                f.write(f"Sheet: {sheet_name}\n")
                f.write(f"Rows: {len(df)}\n")
                f.write(f"Columns: {len(df.columns)}\n")
                f.write(f"Column names: {list(df.columns)}\n\n")
                f.write("First 10 rows:\n")
                f.write(df.head(10).to_string())
                f.write("\n\nData types:\n")
                f.write(df.dtypes.to_string())
            
            print(f"Created summary file: {summary_filename}")
            
    except Exception as e:
        print(f"Error converting Excel file: {e}")

def convert_word_to_text(docx_path, output_dir):
    """Convert Word document to text format"""
    try:
        doc = docx.Document(docx_path)
        
        # Extract text content
        full_text = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                full_text.append(paragraph.text)
        
        # Create output filename
        text_filename = f"{Path(docx_path).stem}.txt"
        text_path = os.path.join(output_dir, text_filename)
        
        # Save as text file
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(full_text))
        
        print(f"Converted Word document to {text_filename}")
        
        # Also create a structured version with paragraph numbers
        structured_filename = f"{Path(docx_path).stem}_structured.txt"
        structured_path = os.path.join(output_dir, structured_filename)
        
        with open(structured_path, 'w', encoding='utf-8') as f:
            f.write(f"Document: {Path(docx_path).name}\n")
            f.write(f"Total paragraphs: {len(full_text)}\n")
            f.write("=" * 50 + "\n\n")
            
            for i, paragraph in enumerate(full_text, 1):
                f.write(f"Paragraph {i}:\n")
                f.write(paragraph)
                f.write("\n" + "-" * 30 + "\n\n")
        
        print(f"Created structured version: {structured_filename}")
        
    except Exception as e:
        print(f"Error converting Word document: {e}")

def main():
    # Set up paths
    current_dir = Path(__file__).parent
    output_dir = current_dir / "converted_documents"
    
    # Create output directory
    output_dir.mkdir(exist_ok=True)
    
    print("Starting document conversion...")
    print(f"Output directory: {output_dir}")
    
    # Convert Excel file
    excel_file = "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1.xlsx"
    excel_path = current_dir / excel_file
    
    if excel_path.exists():
        print(f"\nConverting Excel file: {excel_file}")
        convert_excel_to_csv(excel_path, output_dir)
    else:
        print(f"Excel file not found: {excel_file}")
    
    # Convert Word documents
    word_files = [
        "Watson L.I.F.E Curriculum.docx",
        "Preference Assessment Data Sheets.docx"
    ]
    
    for word_file in word_files:
        word_path = current_dir / word_file
        if word_path.exists():
            print(f"\nConverting Word document: {word_file}")
            convert_word_to_text(word_path, output_dir)
        else:
            print(f"Word file not found: {word_file}")
    
    print(f"\nConversion complete! Check the '{output_dir}' folder for converted files.")

if __name__ == "__main__":
    main()
