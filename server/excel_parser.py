import sys
import json
import pandas as pd
import re

def parse_excel(file_path):
    try:
        # Read the Excel file, skipping any potential initial header junk
        df = pd.read_excel(file_path, header=None)
        
        general_topic = "Excel Import"
        weeks_dict = {}
        
        # Pattern for week: "1. Topic" (looking for number followed by dot)
        week_pattern = re.compile(r'^(\d+)\.\s*(.*)')
        
        # Default starting week
        current_week = 1
        
        for index, row in df.iterrows():
            # Most data is in Column 1 (index 1)
            val_col1 = str(row[1]).strip() if not pd.isna(row[1]) else ""
            
            if not val_col1:
                continue
                
            # Check if this row is a Week marker like "1. Introductory Topic"
            match = week_pattern.match(val_col1)
            if match:
                current_week = int(match.group(1))
                # Maybe the topic name is in the marker too
                if match.group(2).strip():
                    general_topic = match.group(2).strip()
                continue
                
            # Skip header rows
            if val_col1.lower() == "otázka" or val_col1.lower() == "nan":
                continue
                
            question_text = val_col1
            
            # Answers are in columns 2 to 6 (A-D, NEVIEM)
            answers = []
            letters = ["A", "B", "C", "D", "NEVIEM"]
            for i in range(2, 7):
                if i < len(row) and not pd.isna(row[i]):
                    ans_text = str(row[i]).strip()
                    if ans_text:
                        answers.append({
                            "text": ans_text,
                            "letter": letters[i-2]
                        })
            
            # Correct answer letters are in column 7 (A, B, C, AB etc.)
            correct_answers = ""
            if 7 < len(row) and not pd.isna(row[7]):
                correct_answers = str(row[7]).strip().upper()
                
            question_data = {
                "questionText": question_text,
                "answers": answers,
                "correctAnswers": correct_answers
            }
            
            if current_week not in weeks_dict:
                weeks_dict[current_week] = {
                    "weekNumber": current_week,
                    "questions": []
                }
            
            weeks_dict[current_week]["questions"].append(question_data)
            
        result = {
            "topic": general_topic,
            "weeks": list(weeks_dict.values())
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        sys.stderr.write(f"Error parsing Excel: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python3 excel_parser.py <file_path>\n")
        sys.exit(1)
        
    parse_excel(sys.argv[1])
