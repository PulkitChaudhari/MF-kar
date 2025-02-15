import json
import re
from allMfData import mf_data

# Load data (replace with file read logic if needed)
mf_data = [mf for mf in mf_data ]  # Placeholder: Insert provided JSON here

# Keywords for categorization
categories = {
    "Equity": ["Equity", "Large Cap", "Mid Cap", "Small Cap", "Bluechip", "Flexi Cap", "Growth"],
    "Debt": ["Income", "Bond", "Gilt", "Debt", "Duration", "Savings"],
    "Hybrid": ["Hybrid", "Balanced", "Advantage", "Multi Asset"],
    "Liquid": ["Liquid", "Money Market", "Ultra Short"],
    "Tax-Saving": ["Tax", "ELSS"],
    "Thematic": ["Technology", "Healthcare", "Consumption", "Infrastructure", "FMCG", "Thematic", "Sectoral", "Opportunities", "MNC"]
}

# Suffix patterns to remove
suffixes = [
    r"-?\s?(Growth|Dividend|IDCW|Bonus|Plan|Option|Regular|Institutional|Retail|Direct|Income Distribution cum Capital Withdrawal)\s?-?\s?",
    r"\(.*\)",
    r"\s{2,}"
]

def clean_name(name: str) -> str:
    # Remove suffixes
    for pattern in suffixes:
        name = re.sub(pattern, "", name, flags=re.IGNORECASE)
    # Correct casing and strip spaces
    return name.title().strip()

def categorize(name: str) -> str:
    for category, keywords in categories.items():
        if any(keyword.lower() in name.lower() for keyword in keywords):
            return category
    return "Uncategorized"

# Process data
cleaned_data = []
count = 0
for fund in mf_data:
    cleaned_name = clean_name(fund["instrumentName"])
    category = categorize(cleaned_name)
    if category == "Uncategorized":
        count += 1
    cleaned_data.append({
        "instrumentCode": fund["instrumentCode"],
        "instrumentName": cleaned_name,
        "category": category
    })

# Save output
with open("cleaned_mf_data.json", "w") as f:
    json.dump(cleaned_data, f, indent=2)

print("Processing complete. Check cleaned_mf_data.json")
print("Uncategorized count is :",count)

