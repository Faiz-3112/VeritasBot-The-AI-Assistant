import os
import json
import time
import datetime
import requests
from typing import Dict, List, Any
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass
class UserFeedback:
    function_type: str
    query: str
    response: str
    rating: int
    timestamp: str
    suggestions: str = ""


class AIAssistantConfig:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")

        if not self.gemini_api_key:
            print("❌ Error: GEMINI_API_KEY not found in .env file!")
            print("Please create .env file with: GEMINI_API_KEY=your-actual-api-key")
            exit(1)

        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        self.max_tokens = 2000
        self.temperature = 0.7
        self.feedback_file = "user_feedback.json"
        self.session_log = "session_log.json"


class AdvancedPromptEngine:
    def __init__(self):
        self.prompt_templates = {
            "question_answering": {
                "factual": """You are a knowledgeable research assistant with expertise across multiple domains. 
                When answering questions, provide accurate, well-structured information with clear explanations.
                
                Question: {query}
                
                Please provide a comprehensive answer that includes:
                1. Direct answer to the question
                2. Relevant context or background information
                3. Any important related facts or considerations
                
                Respond in a professional yet conversational tone.""",
                "analytical": """You are an analytical expert who breaks down complex questions into digestible insights.
                
                Query: {query}
                
                Analyze this question and provide:
                - Core facts and direct answers
                - Supporting evidence or reasoning
                - Multiple perspectives if applicable
                - Practical implications or applications
                
                Keep your response clear, logical, and well-organized.""",
                "educational": """You are an educational mentor helping someone learn. Explain concepts clearly and thoroughly.
                
                Student's Question: {query}
                
                Provide an educational response that:
                - Explains the concept from basics to advanced
                - Uses examples and analogies where helpful
                - Highlights key takeaways
                - Suggests further learning directions if relevant
                
                Make it engaging and easy to understand.""",
            },
            "text_summarization": {
                "concise": """You are a professional content summarizer. Create clear, concise summaries that capture essential information.
                
                Text to summarize: {query}
                
                Provide a well-structured summary that includes:
                - Main points and key arguments
                - Important details and data
                - Logical flow and conclusions
                
                Keep it comprehensive yet concise, maintaining the original context and meaning.""",
                "bullet_points": """You are a content analyst specializing in bullet-point summaries for quick comprehension.
                
                Content: {query}
                
                Create a structured summary with:
                • Key Points (3-5 main ideas)
                • Important Details (supporting facts/data)
                • Conclusions/Outcomes
                • Action Items (if applicable)
                
                Format in clear bullet points for easy scanning and understanding.""",
                "executive": """You are an executive briefing specialist. Create summaries for decision-makers who need quick, actionable insights.
                
                Document: {query}
                
                Provide an executive summary with:
                1. Executive Overview (2-3 sentences)
                2. Key Findings
                3. Strategic Implications
                4. Recommended Actions
                
                Focus on business impact and decision-relevant information.""",
            },
            "creative_generation": {
                "storytelling": """You are a creative storytelling expert with a talent for engaging narratives.
                
                Creative Brief: {query}
                
                Create compelling content that includes:
                - Rich, vivid descriptions
                - Well-developed characters or concepts
                - Engaging plot or structure
                - Emotional resonance and impact
                
                Make it creative, original, and captivating while staying true to the request.""",
                "professional": """You are a professional content creator skilled in various writing formats.
                
                Content Request: {query}
                
                Generate high-quality content with:
                - Clear structure and organization
                - Appropriate tone for the intended audience
                - Compelling and informative content
                - Professional polish and refinement
                
                Ensure the content meets professional standards and serves its intended purpose.""",
                "innovative": """You are an innovative content strategist who creates unique, fresh perspectives.
                
                Creative Challenge: {query}
                
                Develop innovative content featuring:
                - Original ideas and unique angles
                - Creative problem-solving approaches
                - Fresh perspectives on familiar topics
                - Engaging and memorable presentation
                
                Push creative boundaries while maintaining practical value.""",
            },
        }

    def get_prompt(self, function_type: str, style: str, query: str) -> str:
        try:
            template = self.prompt_templates[function_type][style]
            return template.format(query=query)
        except KeyError:
            return f"Please help me with the following: {query}"


class FeedbackManager:
    def __init__(self, config: AIAssistantConfig):
        self.config = config
        self.feedback_data = self.load_feedback()

    def load_feedback(self) -> List[Dict]:
        try:
            if os.path.exists(self.config.feedback_file):
                with open(self.config.feedback_file, "r") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load feedback data: {e}")
        return []

    def save_feedback(self):
        try:
            with open(self.config.feedback_file, "w") as f:
                json.dump(self.feedback_data, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save feedback: {e}")

    def collect_feedback(
        self, function_type: str, query: str, response: str
    ) -> UserFeedback:
        print("\n" + "=" * 60)
        print("📊 FEEDBACK COLLECTION")
        print("=" * 60)

        while True:
            try:
                rating = int(input("Rate this response (1-5): "))
                if 1 <= rating <= 5:
                    break
                print("Please enter a number between 1 and 5.")
            except ValueError:
                print("Please enter a valid number.")

        suggestions = input("Any suggestions for improvement? (optional): ").strip()

        feedback = UserFeedback(
            function_type=function_type,
            query=query,
            response=response,
            rating=rating,
            timestamp=datetime.datetime.now().isoformat(),
            suggestions=suggestions,
        )

        self.feedback_data.append(
            {
                "function_type": feedback.function_type,
                "query": feedback.query,
                "response": feedback.response,
                "rating": feedback.rating,
                "timestamp": feedback.timestamp,
                "suggestions": feedback.suggestions,
            }
        )

        self.save_feedback()
        print(f"✅ Thank you for your feedback! (Rating: {rating}/5)")
        return feedback

    def get_feedback_stats(self) -> Dict[str, Any]:
        if not self.feedback_data:
            return {"message": "No feedback data available yet."}

        total_feedback = len(self.feedback_data)
        avg_rating = sum(item["rating"] for item in self.feedback_data) / total_feedback

        function_stats = {}
        for item in self.feedback_data:
            func = item["function_type"]
            if func not in function_stats:
                function_stats[func] = {"count": 0, "total_rating": 0}
            function_stats[func]["count"] += 1
            function_stats[func]["total_rating"] += item["rating"]

        for func in function_stats:
            function_stats[func]["avg_rating"] = (
                function_stats[func]["total_rating"] / function_stats[func]["count"]
            )

        return {
            "total_feedback": total_feedback,
            "average_rating": round(avg_rating, 2),
            "function_stats": function_stats,
        }


class AIAssistant:
    def __init__(self):
        self.config = AIAssistantConfig()
        self.prompt_engine = AdvancedPromptEngine()
        self.feedback_manager = FeedbackManager(self.config)
        self.session_history = []

    def display_banner(self):
        print("\n" + "=" * 80)
        print("🤖 ADVANCED AI ASSISTANT v2.0 (Powered by Gemini-2.0-Flash)")
        print("=" * 80)
        print("💡 Intelligent • 🎯 Precise • 🔧 Customizable • 🆓 Free")
        print("-" * 80)
        print("Your personal AI assistant with advanced prompt engineering")
        print("=" * 80)

    def display_menu(self):
        print("\n📋 MAIN FUNCTIONS:")
        print("  1️⃣  Question Answering    - Get factual information and explanations")
        print("  2️⃣  Text Summarization   - Summarize articles, documents, or content")
        print(
            "  3️⃣  Creative Generation  - Generate stories, essays, and creative content"
        )
        print("  4️⃣  Feedback Analytics   - View performance statistics")
        print("  5️⃣  Session History      - Review current session interactions")
        print("  6️⃣  Exit Assistant       - End session and save data")
        print("-" * 80)

    def get_style_preference(self, function_type: str) -> str:
        styles = {
            "question_answering": {
                "1": ("factual", "Factual & Direct"),
                "2": ("analytical", "Analytical & Detailed"),
                "3": ("educational", "Educational & Teaching"),
            },
            "text_summarization": {
                "1": ("concise", "Concise Paragraph"),
                "2": ("bullet_points", "Bullet Points"),
                "3": ("executive", "Executive Summary"),
            },
            "creative_generation": {
                "1": ("storytelling", "Creative Storytelling"),
                "2": ("professional", "Professional Content"),
                "3": ("innovative", "Innovative & Unique"),
            },
        }

        print(f"\n🎨 SELECT RESPONSE STYLE:")
        for key, (style_key, description) in styles[function_type].items():
            print(f"  {key}. {description}")

        while True:
            choice = input("\nChoose style (1-3): ").strip()
            if choice in styles[function_type]:
                return styles[function_type][choice][0]
            print("Invalid choice. Please select 1, 2, or 3.")

    def make_api_request(self, prompt: str) -> str:
        try:
            headers = {
                "Content-Type": "application/json",
                "X-goog-api-key": self.config.gemini_api_key,
            }

            request_body = {"contents": [{"parts": [{"text": prompt}]}]}

            response = requests.post(
                self.config.api_url, headers=headers, json=request_body, timeout=30
            )

            if response.status_code == 200:
                response_data = response.json()
                try:
                    return response_data["candidates"][0]["content"]["parts"][0][
                        "text"
                    ].strip()
                except (KeyError, IndexError):
                    return "Sorry, I couldn't process the response properly."
            else:
                return f"API Error {response.status_code}: {response.text}"

        except requests.exceptions.RequestException as e:
            return f"Connection Error: {str(e)}\nPlease check your internet connection."
        except Exception as e:
            return (
                f"Unexpected Error: {str(e)}\nPlease check your API key and try again."
            )

    def process_query(self, function_type: str, style: str, query: str) -> str:
        print("\n🔄 Processing your request...")

        prompt = self.prompt_engine.get_prompt(function_type, style, query)
        response = self.make_api_request(prompt)

        interaction = {
            "timestamp": datetime.datetime.now().isoformat(),
            "function": function_type,
            "style": style,
            "query": query,
            "response": response,
        }
        self.session_history.append(interaction)

        return response

    def handle_question_answering(self):
        print("\n❓ QUESTION ANSWERING MODE")
        print("-" * 40)

        style = self.get_style_preference("question_answering")

        query = input("\n💭 What would you like to know? ").strip()
        if not query:
            print("❌ Please enter a valid question.")
            return

        response = self.process_query("question_answering", style, query)

        print("\n" + "=" * 60)
        print("🤖 AI RESPONSE:")
        print("=" * 60)
        print(response)
        print("=" * 60)

        self.feedback_manager.collect_feedback("question_answering", query, response)

    def handle_text_summarization(self):
        print("\n📝 TEXT SUMMARIZATION MODE")
        print("-" * 40)

        style = self.get_style_preference("text_summarization")

        print("\n📄 Enter the text you want summarized:")
        print("(Type 'END' on a new line when finished)")

        lines = []
        while True:
            line = input()
            if line.strip().upper() == "END":
                break
            lines.append(line)

        text = "\n".join(lines).strip()
        if not text:
            print("❌ Please enter some text to summarize.")
            return

        response = self.process_query("text_summarization", style, text)

        print("\n" + "=" * 60)
        print("📋 SUMMARY:")
        print("=" * 60)
        print(response)
        print("=" * 60)

        self.feedback_manager.collect_feedback(
            "text_summarization", text[:100] + "...", response
        )

    def handle_creative_generation(self):
        print("\n🎨 CREATIVE GENERATION MODE")
        print("-" * 40)

        style = self.get_style_preference("creative_generation")

        query = input("\n✨ Describe what you'd like me to create: ").strip()
        if not query:
            print("❌ Please enter a valid creative request.")
            return

        response = self.process_query("creative_generation", style, query)

        print("\n" + "=" * 60)
        print("🎭 CREATIVE CONTENT:")
        print("=" * 60)
        print(response)
        print("=" * 60)

        self.feedback_manager.collect_feedback("creative_generation", query, response)

    def show_feedback_analytics(self):
        print("\n📊 FEEDBACK ANALYTICS")
        print("=" * 60)

        stats = self.feedback_manager.get_feedback_stats()

        if "message" in stats:
            print(stats["message"])
            return

        print(f"📈 Total Feedback Received: {stats['total_feedback']}")
        print(f"⭐ Average Rating: {stats['average_rating']}/5.0")
        print("\n📋 Function Performance:")

        for func, data in stats["function_stats"].items():
            print(
                f"  • {func.replace('_', ' ').title()}: {data['avg_rating']:.1f}/5.0 ({data['count']} responses)"
            )

        print("=" * 60)

    def show_session_history(self):
        print("\n📚 SESSION HISTORY")
        print("=" * 60)

        if not self.session_history:
            print("No interactions in this session yet.")
            return

        for i, interaction in enumerate(self.session_history, 1):
            timestamp = datetime.datetime.fromisoformat(
                interaction["timestamp"]
            ).strftime("%H:%M:%S")
            print(
                f"\n{i}. [{timestamp}] {interaction['function'].replace('_', ' ').title()} ({interaction['style']})"
            )
            print(
                f"   Query: {interaction['query'][:60]}{'...' if len(interaction['query']) > 60 else ''}"
            )
            print("-" * 40)

    def run(self):
        self.display_banner()

        while True:
            self.display_menu()

            choice = input("\n🎯 Select function (1-6): ").strip()

            if choice == "1":
                self.handle_question_answering()
            elif choice == "2":
                self.handle_text_summarization()
            elif choice == "3":
                self.handle_creative_generation()
            elif choice == "4":
                self.show_feedback_analytics()
            elif choice == "5":
                self.show_session_history()
            elif choice == "6":
                print("\n👋 Thank you for using Advanced AI Assistant!")
                print("💾 Session data has been saved.")
                print("🔄 Come back anytime!")
                break
            else:
                print("❌ Invalid choice. Please select 1-6.")

            input("\n⏸️  Press Enter to continue...")


def main():
    try:
        assistant = AIAssistant()
        assistant.run()
    except KeyboardInterrupt:
        print("\n\n👋 Session interrupted. Goodbye!")
    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {e}")
        print("Please check your setup and try again.")


if __name__ == "__main__":
    main()
