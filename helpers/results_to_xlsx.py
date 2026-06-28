#!/usr/bin/env python3
import csv,sys,openpyxl
from collections import Counter
inp=sys.argv[1] if len(sys.argv)>1 else "test-results/results.csv"
rows=list(csv.reader(open(inp,encoding="utf-8-sig")))
wb=openpyxl.Workbook(); ws=wb.active; ws.title="results"
[ws.append(r) for r in rows]
st=wb.create_sheet("summary"); c=Counter(r[3] for r in rows[1:])
st.append(["狀態","數量"]); [st.append([k,v]) for k,v in c.items()]
out=inp.replace(".csv",".xlsx"); wb.save(out); print("→",out,dict(c))
