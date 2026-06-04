career_rules = {
    "AI Engineer": ["programming", "math", "ai"],
    "UI/UX Designer": ["design", "creativity", "ui"],
    "Financial Analyst": ["finance", "numbers", "business"]
}


def recommend_career_from_interests(user_interests):

    scores = {}

    for career, skills in career_rules.items():

        score = 0

        for interest in user_interests:
            if interest.lower() in skills:
                score += 1

        scores[career] = score

    best_career = max(scores, key=scores.get)

    return best_career, scores[best_career]