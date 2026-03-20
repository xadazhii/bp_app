import sys
import json
import pandas as pd
import re

def parse_excel(file_path):
    try:
        # Read the Excel file, skipping any potential initial header junk
        # Typical structure: Week number/Topic in column 0, Question in 1, Answers in 2-6, Correct in 7
        df = pd.read_excel(file_path, header=None)
        
        # Start looking for data from row 0
        general_topic = "Importovaný test"
        weeks_dict = {}
        
        # Pattern for week: "1. Topic" or just "1"
        week_pattern = re.compile(r'^(\d+)\.\s*(.*)')
        
        current_week = 1
        
        for index, row in df.iterrows():
            if pd.isna(row[1]) or str(row[1]).strip() == "":
                # Check if column 0 has a week marker
                if not pd.isna(row[0]):
                    val = str(row[0]).strip()
                    match = week_pattern.match(val)
                    if match:
                        current_week = int(match.group(1))
                        general_topic = match.group(2) if match.group(2) else general_topic
                continue
                
            # Skip header row if it contains "otázka"
            if "otázka" in str(row[1]).lower():
                continue
                
            question_text = str(row[1]).strip()
            
            # Answers are in columns 2 to 6 (A, B, C, D, NEVIEM)
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
            
            # Correct answer letters are in column 7
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
