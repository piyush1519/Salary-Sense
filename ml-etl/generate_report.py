# ml-etl/generate_report.py
import sys
import json
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import os

def generate_report(trend_data, summary_text):
    output_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "salary-report.pdf")

    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    y = height - 50

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, y, "📄 Developer Salary Trends Report")
    y -= 30

    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Summary Insights:")
    y -= 20
    c.setFont("Helvetica", 10)

    for line in summary_text.split("\n"):
        c.drawString(60, y, line.strip())
        y -= 14
        if y < 50:
            c.showPage()
            y = height - 50

    y -= 20

    for title, items in trend_data.items():
        if y < 80:
            c.showPage()
            y = height - 50

        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, title)
        y -= 18

        c.setFont("Helvetica", 10)
        for item in items:
            c.drawString(60, y, f"{item['label']}: ${item['avgSalary']}")
            y -= 14
            if y < 50:
                c.showPage()
                y = height - 50

        y -= 10

    c.save()
    print("✅ Report generated successfully.")

if __name__ == "__main__":
    input = json.loads(sys.stdin.read())
    generate_report(input["trendData"], input["summaryText"])
