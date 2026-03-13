import os
import json
import anthropic
import httpx
from dotenv import load_dotenv

load_dotenv()

MOCK_RESPONSE = {
  "company_name": "Stripe",
  "industry": "Financial Services, Payment Processing",
  "size": "7000+",
  "location": "San Francisco, CA / Dublin, Ireland",
  "main_product": "Payment processing software and APIs for e-commerce businesses and mobile applications.",
  "pain_points": [
    "High costs and delays in settling cross-border merchant payouts",
    "Fragmented banking relationships to support international expansion",
    "Liquidity traps due to slow international wire rails (SWIFT)"
  ],
  "fit_score": 95,
  "fit_justification": "Stripe handles immense volumes of international transactions. Their merchants demand fast payouts globally. A new, instant cross-border payments network built from scratch without legacy tech debt (SWIFT) perfectly aligns with their need to move money instantly and cheaply across borders.",
  "outreach_emails": {
    "ceo": {
      "subject": "Rewiring global payouts for Stripe",
      "body": "Hi Patrick,\n\nI know Stripe is constantly pushing the boundaries of global commerce, but moving money across borders is still tied to slow, expensive, and fragmented legacy rails.\n\nWe are a London-based stealth startup building a completely new instant cross-border payments network from scratch. No legacy tech debt, just instant settlement.\n\nCould we explore if our new infrastructure could accelerate Stripe's global merchant payouts?"
    },
    "cfo": {
      "subject": "Unlocking liquidity trapped in cross-border transit",
      "body": "Hi Steffan,\n\nManaging liquidity across international operations means dealing with the friction and delays of legacy correspondent banking. \n\nWe're building a new global payments infrastructure from a clean slate to make instant cross-border payments a reality, eliminating the capital inefficiency of slow transit times.\n\nAre you open to a brief chat to see how our network could optimize Stripe's treasury flows?"
    },
    "head_of_finance": {
      "subject": "Eliminating friction in international settlement",
      "body": "Hi there,\n\nSupporting Stripe's global merchant base likely involves juggling fragmented cross-border payment rails that are expensive and slow to settle.\n\nWe are an early-stage startup engineering a new global payments network designed specifically for instant cross-border transfers. \n\nCould we connect next week to discuss how this could streamline your international settlement operations?"
    }
  }
}

def enrich_lead_with_ai(domain: str) -> dict:
    claude_key = os.getenv("ANTHROPIC_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    prompt = f"""You are the founding AI SDR for a fintech startup based in London.
Your startup is re-wiring the global payments infrastructure. You believe that today, sending money across borders is slow, expensive, and fragmented. Your mission is to fix that by making instant cross-border payments a reality. You are building a new kind of payments network from scratch with no legacy systems.

Your job is an AI-native go-to-market engine that finds the right companies, understands them, and reaches out intelligently at scale.

Given the domain {domain}, research the company and evaluate their potential as a customer for your instant cross-border payments network. 
Return ONLY a valid JSON object with this exact structure:
{{
  "company_name": "",
  "industry": "",
  "size": "",
  "location": "",
  "main_product": "",
  "pain_points": [], // Focus purely on pain points they might have regarding international/cross-border payments, slow settlement, or legacy financial tech.
  "fit_score": 0, // 0 to 100 based on how badly they need instant cross-border payments (e.g., global commerce=high, local bakery=low)
  "fit_justification": "", // Explain specifically why they need your cross-border network
  "outreach_emails": {{ // Write 3 personalized cold emails offering your instant, legacy-free cross-border infrastructure. Keep them short, punchy, and confident.
    "ceo": {{"subject": "", "body": ""}},
    "cfo": {{"subject": "", "body": ""}},
    "head_of_finance": {{"subject": "", "body": ""}}
  }}
}}
Return ONLY the JSON, no additional text."""

    try:
        if claude_key:
            client = anthropic.Anthropic(api_key=claude_key)
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.2,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            content = response.content[0].text
        elif gemini_key:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            headers = {'Content-Type': 'application/json'}
            data = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }
            res = httpx.post(url, headers=headers, json=data, timeout=30.0)
            res.raise_for_status()
            content = res.json()['candidates'][0]['content']['parts'][0]['text']
        else:
            print("No API keys found. Using Mock Mode.")
            return MOCK_RESPONSE

        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"Error calling AI API: {e}")
        return MOCK_RESPONSE
