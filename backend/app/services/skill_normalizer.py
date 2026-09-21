def normalize_skill(skill_name: str) -> str:
    """
    Lightweight rule-based skill normalization.
    Converts skill names to a consistent format, removes unnecessary whitespace,
    and maps common synonyms to canonical skill names.
    """
    if not skill_name:
        return ""
        
    normalized = " ".join(skill_name.strip().lower().split())
    
    synonyms = {
        "ac service": "ac repair",
        "air conditioner repair": "ac repair",
        "ac maintenance": "ac repair",
        "electrical wiring": "electrician",
        "electrical work": "electrician",
        "wireman": "electrician",
        "plumbing": "plumber",
        "pipe fitting": "plumber",
        "cleaning": "cleaner",
        "house cleaning": "cleaner",
        "painting": "painter",
        "house painting": "painter"
    }
    
    return synonyms.get(normalized, normalized)
