import pyodbc
import pandas as pd
from openpyxl import load_workbook
import time

# Configurações da conexão com o banco de dados
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=URTON_DESK\PDVNET;DATABASE=FINANCAS;UID=sa;PWD=inter#system')
cursor = conn.cursor()

# Função para puxar dados do banco de dados
def get_data_from_db():
    cursor.execute('SELECT * FROM Gastos')
    rows = cursor.fetchall()
    columns = [column[0] for column in cursor.description]
    data = pd.DataFrame.from_records(rows, columns=columns)
    return data

# Função para atualizar o arquivo Excel existente
def update_excel(file_path, data, sheet_name='Sheet1'):
    book = load_workbook(file_path)
    writer = pd.ExcelWriter(file_path, engine='openpyxl')
    writer.book = book
    writer.sheets = {ws.title: ws for ws in book.worksheets}

    data.to_excel(writer, sheet_name=sheet_name, index=False)

    writer.save()
    writer.close()

# Loop infinito para consultar e atualizar dados a cada 60 segundos
file_path = 'dados.xlsx'
while True:
    data = get_data_from_db()
    update_excel(file_path, data)
    print('Arquivo Excel atualizado com sucesso!')
    time.sleep(60)  # Espera 60 segundos antes de consultar novamente
