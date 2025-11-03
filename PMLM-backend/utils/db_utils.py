
import pandas as pd
from sqlalchemy import create_engine, text
import os

def excel_to_sqlite(excel_file, table_name, db_path='medical.db'):
    file_path = os.path.join('excel_data', excel_file)
    df = pd.read_excel(file_path)
    engine = create_engine(f'sqlite:///{db_path}')
    df.to_sql(table_name, engine, index=False, if_exists='replace')
    return True

def query_sqlite(sql, params=None, db_path='medical.db'):
    """
    执行只读查询，支持可选参数化（推荐传 params 防注入）。
    返回字典列表。
    """
    engine = create_engine(f'sqlite:///{db_path}')
    with engine.connect() as conn:
        if params:
            result = conn.execute(text(sql), params)
        else:
            result = conn.execute(text(sql))
        return [dict(row._mapping) for row in result]
    
def execute_sql(sql, params=None, db_path='medical.db'):
    """
    执行无返回值的 SQL(如建表、插入、更新等)。
    """
    engine = create_engine(f'sqlite:///{db_path}')
    with engine.begin() as conn:
        if params:
            conn.execute(text(sql), params)
        else:
            conn.execute(text(sql))
