"""
Role-to-Skill mapping data for Salary-Sense Skill Gap & Career Path modules.
All weights are 0-100 representing importance for the role.
"""
from typing import Dict, List

# ── Master skill pool ────────────────────────────────────────────────
ALL_SKILLS: List[str] = sorted([
    "Python", "JavaScript", "TypeScript", "Java", "C#", "C++", "Go", "Rust", "Kotlin", "Swift",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB",
    "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express.js", "FastAPI", "Django", "Flask", "Spring Boot",
    "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "ArgoCD",
    "AWS", "Google Cloud (GCP)", "Azure", "Cloud Architecture",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "XGBoost",
    "NLP", "Computer Vision", "LLM/GenAI", "MLOps", "Feature Engineering", "Model Deployment",
    "Data Analysis", "Pandas", "NumPy", "Statistics", "Data Visualization", "Power BI", "Tableau",
    "Apache Spark", "Kafka", "Airflow", "dbt", "ETL Pipelines", "Data Warehousing", "Snowflake",
    "System Design", "Microservices", "REST APIs", "GraphQL", "gRPC", "Event-Driven Architecture",
    "Linux/Unix", "Shell Scripting", "CI/CD", "Git", "Agile/Scrum",
    "Cybersecurity", "Penetration Testing", "SIEM", "Zero Trust", "OWASP",
    "Leadership", "Technical Roadmap", "Stakeholder Management", "Team Management", "Mentorship",
    "iOS Development", "Android Development", "React Native", "Flutter",
    "Unity", "Unreal Engine", "C++ (Game Dev)",
    "Figma", "UI/UX Design", "Prototyping", "User Research",
])

# ── Role definitions ─────────────────────────────────────────────────
# Each role: required skills (weight), nice-to-have, salary range, YoY growth, demand
ROLES: Dict[str, dict] = {
    "Backend Engineer": {
        "required": {
            "Python": 80, "Node.js": 70, "SQL": 85, "REST APIs": 90,
            "Docker": 75, "System Design": 80, "PostgreSQL": 70, "Git": 85,
            "Linux/Unix": 65, "Microservices": 70, "Redis": 60,
        },
        "nice_to_have": ["Kubernetes", "Kafka", "Go", "AWS", "GraphQL", "gRPC"],
        "salary_range": [80000, 145000],
        "growth": "+18%",
        "demand": "Very High",
        "description": "Designs and builds server-side logic, APIs, and database architectures.",
    },
    "Frontend Engineer": {
        "required": {
            "JavaScript": 90, "TypeScript": 80, "React": 85, "Next.js": 70,
            "CSS/HTML": 85, "Git": 80, "REST APIs": 75, "UI/UX Design": 55,
        },
        "nice_to_have": ["Vue.js", "Angular", "GraphQL", "Testing (Jest)", "Webpack/Vite", "Figma"],
        "salary_range": [72000, 130000],
        "growth": "+15%",
        "demand": "High",
        "description": "Builds user interfaces and client-side experiences for web applications.",
    },
    "Full Stack Engineer": {
        "required": {
            "JavaScript": 85, "TypeScript": 75, "React": 80, "Node.js": 80,
            "SQL": 75, "REST APIs": 85, "Docker": 65, "Git": 85,
            "System Design": 65, "PostgreSQL": 65,
        },
        "nice_to_have": ["Next.js", "AWS", "Kubernetes", "GraphQL", "MongoDB", "Redis"],
        "salary_range": [78000, 140000],
        "growth": "+16%",
        "demand": "Very High",
        "description": "Works across the full web stack — frontend, backend, and infrastructure.",
    },
    "Data Scientist": {
        "required": {
            "Python": 90, "Machine Learning": 90, "Statistics": 85, "SQL": 80,
            "Pandas": 85, "NumPy": 80, "Scikit-learn": 80, "Data Visualization": 75,
            "Feature Engineering": 80, "Jupyter/Notebooks": 70,
        },
        "nice_to_have": ["TensorFlow", "PyTorch", "NLP", "Deep Learning", "Apache Spark", "MLOps", "Tableau"],
        "salary_range": [95000, 165000],
        "growth": "+22%",
        "demand": "Very High",
        "description": "Extracts insights from data using statistical modeling and machine learning.",
    },
    "ML Engineer": {
        "required": {
            "Python": 90, "Machine Learning": 90, "TensorFlow": 75, "PyTorch": 75,
            "MLOps": 80, "Docker": 80, "SQL": 70, "Feature Engineering": 85,
            "Model Deployment": 85, "Git": 80, "Cloud Architecture": 70,
        },
        "nice_to_have": ["Kubernetes", "Kafka", "Spark", "AWS/GCP/Azure", "Deep Learning", "LLM/GenAI", "Airflow"],
        "salary_range": [105000, 180000],
        "growth": "+28%",
        "demand": "Extremely High",
        "description": "Builds and deploys production ML systems and pipelines at scale.",
    },
    "Data Engineer": {
        "required": {
            "Python": 85, "SQL": 90, "Apache Spark": 80, "Airflow": 75,
            "ETL Pipelines": 90, "Data Warehousing": 80, "dbt": 70,
            "Kafka": 70, "Docker": 70, "Git": 80,
        },
        "nice_to_have": ["Snowflake", "AWS", "GCP", "Scala", "Elasticsearch", "MongoDB", "Kubernetes"],
        "salary_range": [90000, 160000],
        "growth": "+24%",
        "demand": "Very High",
        "description": "Designs and maintains data infrastructure, pipelines, and warehouses.",
    },
    "DevOps / SRE Engineer": {
        "required": {
            "Docker": 90, "Kubernetes": 90, "Terraform": 85, "CI/CD": 90,
            "Linux/Unix": 85, "AWS": 80, "Shell Scripting": 80,
            "Ansible": 70, "GitHub Actions": 75, "Git": 85,
        },
        "nice_to_have": ["ArgoCD", "Jenkins", "Python", "Go", "Prometheus/Grafana", "Service Mesh", "Azure", "GCP"],
        "salary_range": [95000, 160000],
        "growth": "+20%",
        "demand": "High",
        "description": "Manages infrastructure automation, CI/CD pipelines, and system reliability.",
    },
    "Cloud Architect": {
        "required": {
            "Cloud Architecture": 95, "AWS": 85, "Kubernetes": 80, "Terraform": 80,
            "System Design": 90, "Microservices": 85, "Docker": 80,
            "Networking": 75, "Security": 70, "CI/CD": 70,
        },
        "nice_to_have": ["Google Cloud (GCP)", "Azure", "Service Mesh", "Event-Driven Architecture", "FinOps", "Zero Trust"],
        "salary_range": [130000, 210000],
        "growth": "+25%",
        "demand": "Very High",
        "description": "Designs large-scale cloud infrastructure and migration strategies.",
    },
    "Security Engineer": {
        "required": {
            "Cybersecurity": 95, "Penetration Testing": 80, "OWASP": 85,
            "Python": 70, "Linux/Unix": 80, "SIEM": 75,
            "Zero Trust": 70, "Networking": 80, "Risk Assessment": 75,
        },
        "nice_to_have": ["Cloud Architecture", "Docker", "CISSP", "SOC Analysis", "IDS/IPS", "Kubernetes Security"],
        "salary_range": [90000, 165000],
        "growth": "+19%",
        "demand": "High",
        "description": "Protects systems and data by identifying and mitigating security risks.",
    },
    "Engineering Manager": {
        "required": {
            "Leadership": 95, "Technical Roadmap": 90, "Stakeholder Management": 90,
            "Team Management": 95, "Mentorship": 85, "Agile/Scrum": 85,
            "System Design": 70, "Git": 65, "CI/CD": 60,
        },
        "nice_to_have": ["Python", "AWS", "OKR Frameworks", "Budgeting", "Hiring Strategy"],
        "salary_range": [140000, 230000],
        "growth": "+16%",
        "demand": "High",
        "description": "Leads engineering teams, sets technical direction, and manages delivery.",
    },
    "LLM / GenAI Engineer": {
        "required": {
            "Python": 90, "LLM/GenAI": 95, "Machine Learning": 80,
            "NLP": 85, "PyTorch": 75, "REST APIs": 80,
            "Docker": 70, "Model Deployment": 80, "Feature Engineering": 70,
        },
        "nice_to_have": ["MLOps", "LangChain/LlamaIndex", "Vector Databases", "AWS/GCP", "Fine-tuning", "RLHF"],
        "salary_range": [120000, 200000],
        "growth": "+89%",
        "demand": "Extremely High",
        "description": "Builds production LLM-powered applications, RAG systems, and GenAI features.",
    },
    "Mobile Developer": {
        "required": {
            "iOS Development": 60, "Android Development": 60, "React Native": 75,
            "JavaScript": 80, "TypeScript": 70, "REST APIs": 80,
            "Git": 80, "UI/UX Design": 60,
        },
        "nice_to_have": ["Flutter", "Swift", "Kotlin", "Firebase", "App Store Optimization", "Testing"],
        "salary_range": [75000, 140000],
        "growth": "+14%",
        "demand": "Medium-High",
        "description": "Develops native and cross-platform mobile applications.",
    },
    "Staff / Principal Engineer": {
        "required": {
            "System Design": 95, "Microservices": 90, "Mentorship": 85,
            "Technical Roadmap": 88, "Python": 70, "AWS": 75,
            "Kubernetes": 75, "Leadership": 80, "Architecture": 90,
        },
        "nice_to_have": ["Multiple Languages", "Research Skills", "Patent Filing", "Tech Writing", "Public Speaking"],
        "salary_range": [160000, 270000],
        "growth": "+21%",
        "demand": "High",
        "description": "Senior IC role driving technical architecture and cross-team engineering strategy.",
    },
}

# ── Role transition difficulty matrix ────────────────────────────────
# Levels: Easy (1-3), Moderate (4-6), Hard (7-9)
TRANSITION_DIFFICULTY: Dict[str, Dict[str, int]] = {
    "Backend Engineer":       {"Frontend Engineer": 6, "Full Stack Engineer": 4, "Data Scientist": 7, "ML Engineer": 8, "Data Engineer": 6, "DevOps / SRE Engineer": 6, "Cloud Architect": 7, "Security Engineer": 7, "Engineering Manager": 6, "LLM / GenAI Engineer": 7, "Staff / Principal Engineer": 7},
    "Frontend Engineer":      {"Backend Engineer": 6, "Full Stack Engineer": 3, "Mobile Developer": 5, "Data Scientist": 8, "ML Engineer": 9, "Engineering Manager": 7, "LLM / GenAI Engineer": 8, "Staff / Principal Engineer": 8},
    "Full Stack Engineer":    {"Backend Engineer": 3, "Frontend Engineer": 3, "Data Engineer": 6, "DevOps / SRE Engineer": 6, "Cloud Architect": 7, "Engineering Manager": 6, "LLM / GenAI Engineer": 7},
    "Data Scientist":         {"ML Engineer": 4, "Data Engineer": 5, "LLM / GenAI Engineer": 5, "Engineering Manager": 7, "Staff / Principal Engineer": 8, "Backend Engineer": 7},
    "ML Engineer":            {"Data Scientist": 3, "LLM / GenAI Engineer": 4, "Data Engineer": 5, "Cloud Architect": 6, "Staff / Principal Engineer": 6, "Engineering Manager": 7},
    "Data Engineer":          {"Data Scientist": 5, "ML Engineer": 6, "Backend Engineer": 5, "DevOps / SRE Engineer": 5, "Cloud Architect": 6},
    "DevOps / SRE Engineer":  {"Cloud Architect": 4, "Security Engineer": 5, "Staff / Principal Engineer": 6, "Engineering Manager": 7, "Backend Engineer": 6},
    "Cloud Architect":        {"Engineering Manager": 5, "Staff / Principal Engineer": 5, "Security Engineer": 5, "DevOps / SRE Engineer": 3},
    "Security Engineer":      {"Cloud Architect": 6, "DevOps / SRE Engineer": 5, "Engineering Manager": 7},
    "Engineering Manager":    {"Staff / Principal Engineer": 5, "Cloud Architect": 6},
    "Mobile Developer":       {"Frontend Engineer": 4, "Full Stack Engineer": 5, "Backend Engineer": 6},
    "LLM / GenAI Engineer":   {"ML Engineer": 3, "Data Scientist": 4, "Staff / Principal Engineer": 6},
    "Staff / Principal Engineer": {"Engineering Manager": 4},
}

# ── Timeline estimates (months) ──────────────────────────────────────
TRANSITION_TIMELINE: Dict[int, str] = {
    1: "1–2 months",
    2: "2–3 months",
    3: "3–4 months",
    4: "4–6 months",
    5: "6–9 months",
    6: "9–12 months",
    7: "12–18 months",
    8: "18–24 months",
    9: "24–30 months",
}

def get_roles() -> List[str]:
    return sorted(ROLES.keys())

def get_role_skills(role: str) -> dict:
    return ROLES.get(role, {})

def analyze_skill_gap(role: str, user_skills: List[str]) -> dict:
    if role not in ROLES:
        return {"error": f"Role '{role}' not found"}

    role_data = ROLES[role]
    required = role_data["required"]
    nice_to_have = role_data.get("nice_to_have", [])

    user_set = set(user_skills)
    required_set = set(required.keys())

    # Matched required skills
    matched = user_set & required_set
    missing_required = required_set - user_set

    # Weighted match score (weighted by skill importance)
    total_weight = sum(required.values())
    matched_weight = sum(required[s] for s in matched)
    match_pct = round((matched_weight / total_weight) * 100, 1) if total_weight > 0 else 0

    # Industry readiness (slightly different — also credits nice-to-haves)
    nh_matched = len(user_set & set(nice_to_have))
    nh_bonus = min(10, nh_matched * 2)
    readiness = min(100, round(match_pct * 0.9 + nh_bonus, 1))

    # Top missing skills sorted by importance
    missing_sorted = sorted(missing_required, key=lambda s: required.get(s, 0), reverse=True)

    # Suggested learning (top missing + nice-to-haves not yet known)
    suggested = missing_sorted[:5] + [s for s in nice_to_have if s not in user_set][:3]

    # AI message
    if match_pct >= 85:
        ai_msg = f"Excellent! You are {match_pct}% ready for {role} roles — you are highly competitive in the current market."
    elif match_pct >= 65:
        ai_msg = f"You are {match_pct}% ready for {role} roles. A focused 3-6 month upskilling plan will make you highly competitive."
    elif match_pct >= 40:
        ai_msg = f"You are {match_pct}% ready for {role} roles. Consider a structured 9-12 month learning roadmap to bridge the gap."
    else:
        ai_msg = f"You are {match_pct}% ready for {role} roles. This is a significant transition — plan 12-18 months of focused learning."

    # Radar data for chart
    radar_skills = list(required.keys())[:8]
    radar_data = [
        {
            "skill": s,
            "required": required[s],
            "yours": 85 if s in user_set else 15,
        }
        for s in radar_skills
    ]

    return {
        "role": role,
        "match_percentage": match_pct,
        "readiness_score": readiness,
        "matched_skills": sorted(matched),
        "missing_skills": missing_sorted,
        "suggested_skills": suggested,
        "ai_message": ai_msg,
        "radar_data": radar_data,
        "salary_range": role_data.get("salary_range", []),
        "demand": role_data.get("demand", ""),
        "description": role_data.get("description", ""),
    }

def analyze_career_transition(current_role: str, target_role: str) -> dict:
    if current_role not in ROLES or target_role not in ROLES:
        return {"error": "Invalid role"}

    current_data = ROLES[current_role]
    target_data = ROLES[target_role]

    current_skills = set(current_data["required"].keys())
    target_skills = set(target_data["required"].keys())
    target_nice = set(target_data.get("nice_to_have", []))

    transferable = current_skills & target_skills
    missing = target_skills - current_skills
    bonus = target_nice & current_skills

    difficulty = TRANSITION_DIFFICULTY.get(current_role, {}).get(target_role, 6)
    timeline = TRANSITION_TIMELINE.get(difficulty, "12–18 months")

    # Priority-sorted missing skills
    missing_sorted = sorted(missing, key=lambda s: target_data["required"].get(s, 0), reverse=True)

    # Roadmap phases
    roadmap = _build_roadmap(current_role, target_role, missing_sorted, difficulty)

    salary_gain = target_data["salary_range"][0] - current_data["salary_range"][0]
    salary_pct = round((salary_gain / max(current_data["salary_range"][0], 1)) * 100, 1)

    return {
        "current_role": current_role,
        "target_role": target_role,
        "difficulty": difficulty,
        "difficulty_label": _difficulty_label(difficulty),
        "timeline": timeline,
        "transferable_skills": sorted(transferable),
        "missing_skills": missing_sorted,
        "bonus_skills": sorted(bonus),
        "roadmap": roadmap,
        "current_salary_range": current_data["salary_range"],
        "target_salary_range": target_data["salary_range"],
        "salary_gain": salary_gain,
        "salary_pct_gain": salary_pct,
        "target_demand": target_data.get("demand", ""),
        "target_growth": target_data.get("growth", ""),
        "target_description": target_data.get("description", ""),
    }

def _difficulty_label(d: int) -> str:
    if d <= 3: return "Easy"
    if d <= 5: return "Moderate"
    if d <= 7: return "Challenging"
    return "Hard"

def _build_roadmap(current: str, target: str, missing: list, difficulty: int) -> list:
    n = len(missing)
    if difficulty <= 3:
        phases = [
            {"phase": "Phase 1 — Quick Wins", "duration": "1–2 months", "skills": missing[:3], "action": "Build on transferable skills and fill immediate gaps with short courses."},
            {"phase": "Phase 2 — Portfolio Projects", "duration": "1–2 months", "skills": missing[3:] if n > 3 else [], "action": "Build 2 portfolio projects demonstrating the target role's core skills."},
        ]
    elif difficulty <= 6:
        phases = [
            {"phase": "Phase 1 — Foundation", "duration": "2–3 months", "skills": missing[:3], "action": "Complete structured courses for the top missing skills. Focus on hands-on practice."},
            {"phase": "Phase 2 — Applied Projects", "duration": "2–3 months", "skills": missing[3:6] if n > 3 else [], "action": "Build 3 real-world projects using target role technologies. Contribute to open source."},
            {"phase": "Phase 3 — Job Preparation", "duration": "1–2 months", "skills": missing[6:] if n > 6 else [], "action": "Refine portfolio, prepare for interviews, network with professionals in target role."},
        ]
    else:
        phases = [
            {"phase": "Phase 1 — Core Foundation", "duration": "3–5 months", "skills": missing[:3], "action": "Deep-dive into fundamentals of the target domain. Take structured courses and certifications."},
            {"phase": "Phase 2 — Skill Building", "duration": "4–6 months", "skills": missing[3:6] if n > 3 else [], "action": "Build proficiency through projects and practical exercises. Join communities and study groups."},
            {"phase": "Phase 3 — Domain Expertise", "duration": "3–4 months", "skills": missing[6:9] if n > 6 else [], "action": "Take on freelance projects or internal initiatives. Build a strong domain portfolio."},
            {"phase": "Phase 4 — Transition", "duration": "2–4 months", "skills": [], "action": "Target applications, prepare case studies, and leverage your network for referrals."},
        ]
    return [p for p in phases if p["skills"] or p["action"]]
