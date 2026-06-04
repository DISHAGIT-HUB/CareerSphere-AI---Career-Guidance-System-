career_map = {

    "Science": {
        "AI": {
            "career": "AI Engineer",
            "skills": [
                "Python",
                "Machine Learning",
                "Deep Learning",
                "Statistics"
            ],
            "roadmap": [
                "Learn Python",
                "Learn Data Structures",
                "Study Machine Learning",
                "Build AI Projects",
                "Apply for AI internships"
            ]
        }
    },

    "Commerce": {
        "Finance": {
            "career": "Financial Analyst",
            "skills": [
                "Accounting",
                "Financial Modeling",
                "Excel"
            ],
            "roadmap": [
                "Learn Accounting",
                "Study Finance",
                "Learn Excel",
                "Work in finance companies"
            ]
        }
    },

    "Arts": {
        "Design": {
            "career": "UI/UX Designer",
            "skills": [
                "Figma",
                "Design Thinking",
                "User Research"
            ],
            "roadmap": [
                "Learn design basics",
                "Learn Figma",
                "Build portfolio",
                "Apply for internships"
            ]
        }
    }

}

# ============================================
#  CAREERSPHERE - Career Fallback Data
#  Add to your backend folder as career_data.py
# ============================================

CAREER_FALLBACK = {
    "Science": [
        {
            "title": "Software Engineer",
            "description": "Design and build software applications across web, mobile and enterprise systems.",
            "degree": "B.Tech CSE / BCA",
            "entrance_exams": ["JEE Main", "BITSAT"],
            "salary_range": "₹6–35 LPA",
            "salaryPct": 80
        },
        {
            "title": "Data Scientist",
            "description": "Analyse large datasets to extract insights using Python, ML and statistics.",
            "degree": "B.Tech CSE / B.Sc. Statistics",
            "entrance_exams": ["JEE Main", "CUET"],
            "salary_range": "₹8–40 LPA",
            "salaryPct": 88
        },
        {
            "title": "AI / ML Engineer",
            "description": "Build artificial intelligence systems that power modern applications globally.",
            "degree": "B.Tech CSE (AI/ML)",
            "entrance_exams": ["JEE Main", "JEE Advanced"],
            "salary_range": "₹10–50 LPA",
            "salaryPct": 95
        }
    ],
    "Commerce": [
        {
            "title": "Chartered Accountant",
            "description": "Manage financial accounts, audit businesses, and provide tax advice.",
            "degree": "B.Com + CA Programme",
            "entrance_exams": ["CA Foundation", "CUET"],
            "salary_range": "₹8–40 LPA",
            "salaryPct": 85
        },
        {
            "title": "Investment Banker",
            "description": "Help companies raise capital and manage mergers and acquisitions.",
            "degree": "BBA Finance / MBA",
            "entrance_exams": ["CAT", "GMAT"],
            "salary_range": "₹12–60 LPA",
            "salaryPct": 95
        },
        {
            "title": "Business Analyst",
            "description": "Bridge IT and business by identifying needs and recommending solutions.",
            "degree": "BBA / MBA",
            "entrance_exams": ["CAT", "CUET"],
            "salary_range": "₹6–28 LPA",
            "salaryPct": 72
        }
    ],
    "Arts": [
        {
            "title": "Lawyer",
            "description": "Represent clients, draft legal documents, and advise on legal matters.",
            "degree": "BA LLB / BBA LLB",
            "entrance_exams": ["CLAT", "AILET"],
            "salary_range": "₹5–30 LPA",
            "salaryPct": 70
        },
        {
            "title": "Psychologist",
            "description": "Study human behaviour and help people overcome emotional challenges.",
            "degree": "BA/BSc Psychology",
            "entrance_exams": ["CUET", "University Exams"],
            "salary_range": "₹4–20 LPA",
            "salaryPct": 60
        },
        {
            "title": "Journalist",
            "description": "Research and report news stories across print, digital, and TV media.",
            "degree": "BA Journalism / BMC",
            "entrance_exams": ["CUET", "IIMC Entrance"],
            "salary_range": "₹4–25 LPA",
            "salaryPct": 65
        }
    ]
}