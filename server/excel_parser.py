import sys
import json
import pandas as pd
import re

def parse_excel(file_path):
    try:
        # Read the Excel file
        df = pd.read_excel(file_path, header=None)
        
        weeks_dict = {}
        week_pattern = re.compile(r'^(\d+)\.\s*(.*)')
        current_week = 1
        general_topic = "Excel Import"
        
        # Columns mapping to hold indices
        idx = {
            "q": -1, "a": -1, "b": -1, "c": -1, "d": -1, "n": -1, "corr": -1
        }
        
        header_found = False
        
        for index, row in df.iterrows():
            row_list = [str(x).strip().lower() if not pd.isna(x) else "" for x in row]
            
            # Match week marker even before header is found (often above the questions table)
            # Check most likely column for marker (often 0 or 1)
            for col_val in row_list[:3]:
                match = week_pattern.match(col_val)
                if match:
                    current_week = int(match.group(1))
                    if match.group(2): 
                        general_topic = match.group(2).strip()
                    break

            # 1. Search for Header Row
            if not header_found:
                # Check if this row contains "otázka" or "otazka"
                if any("otázka" in x or "otazka" in x for x in row_list):
                    for i, col_name in enumerate(row_list):
                        if "otázka" in col_name or "otazka" in col_name: idx["q"] = i
                        elif col_name == "a": idx["a"] = i
                        elif col_name == "b": idx["b"] = i
                        elif col_name == "c": idx["c"] = i
                        elif col_name == "d": idx["d"] = i
                        elif "neviem" in col_name: idx["n"] = i
                        elif "správna" in col_name or "spravna" in col_name: idx["corr"] = i
                    
                    # Verify we found the critical columns
                    if idx["q"] != -1 and idx["corr"] != -1:
                        header_found = True
                    continue # Skip the header row itself from processing as a question
                continue # Keep skipping until header is found
            
            # 2. Process Data Rows (if header found)
            q_text = str(row[idx["q"]]).strip() if not pd.isna(row[idx["q"]]) else ""
            if not q_text or q_text.lower() == "nan":
                continue
            
            # Map answers based on identified columns
            answers = []
            ltr_map = {idx["a"]: "A", idx["b"]: "B", idx["c"]: "C", idx["d"]: "D", idx["n"]: "NEVIEM"}
            
            for col_idx, letter in ltr_map.items():
                if col_idx != -1 and col_idx < len(row) and not pd.isna(row[col_idx]):
                    ans_val = str(row[col_idx]).strip()
                    if ans_val:
                        answers.append({"text": ans_val, "letter": letter})
            
            # Correct answer letters from its specific column
            correct_raw = str(row[idx["corr"]]).strip().upper() if idx["corr"] != -1 else ""
            
            question_data = {
                "questionText": q_text,
                "answers": answers,
                "correctAnswers": correct_raw
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
