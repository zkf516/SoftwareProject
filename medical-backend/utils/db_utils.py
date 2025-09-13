import pandas as pd
from sqlalchemy import create_engine
import os

def excel_to_sqlite(excel_file, table_name, db_path='medical.db'):
    file_path = os.path.join('excel_data', excel_file)
    df = pd.read_excel(file_path)
    engine = create_engine(f'sqlite:///{db_path}')
    df.to_sql(table_name, engine, index=False, if_exists='replace')
    return True

def query_sqlite(sql, db_path='medical.db'):
    engine = create_engine(f'sqlite:///{db_path}')
    with engine.connect() as conn:
        result = conn.execute(sql)
        return [dict(row) for row in result]
