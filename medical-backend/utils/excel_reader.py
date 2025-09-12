import pandas as pd
import os

def read_excel(file_name, sheet_index=0):
    file_path = os.path.join('excel_data', file_name)
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_index)
        return df.to_dict(orient='records')
    except Exception as e:
        return {'error': str(e)}
