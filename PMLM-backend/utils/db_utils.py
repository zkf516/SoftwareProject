
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
    执行 SQL 语句，根据操作类型返回适当的结果
    - INSERT: 返回 lastrowid
    - UPDATE/DELETE: 返回受影响的行数 (rowcount)
    - 其他操作 (CREATE等): 返回 True 表示成功
    """
    try:
        engine = create_engine(f'sqlite:///{db_path}')
        with engine.begin() as conn:
            if params:
                result = conn.execute(text(sql), params)
            else:
                result = conn.execute(text(sql))
            
            # 判断 SQL 类型并返回相应结果
            sql_upper = sql.strip().upper()
            
            if sql_upper.startswith('INSERT'):
                return result.lastrowid  # 返回新插入记录的ID
            elif sql_upper.startswith('UPDATE') or sql_upper.startswith('DELETE'):
                return result.rowcount   # 返回受影响的行数
            else:
                return True              # 其他操作返回成功标志
                
    except Exception as e:
        print(f"数据库执行错误: {e}")
        # 根据操作类型返回适当的失败值
        sql_upper = sql.strip().upper() if sql else ""
        if sql_upper.startswith('INSERT'):
            return None
        elif sql_upper.startswith('UPDATE') or sql_upper.startswith('DELETE'):
            return 0
        else:
            return False