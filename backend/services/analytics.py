import user_agents

def parse_user_agent(ua_string: str) -> str:
    if not ua_string:
        return "Unknown"
    ua = user_agents.parse(ua_string)
    if ua.is_mobile:
        return "Mobile"
    elif ua.is_tablet:
        return "Tablet"
    elif ua.is_pc:
        return "Desktop"
    else:
        return "Unknown"
