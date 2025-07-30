import requests
import time
from django.conf import settings
from typing import Dict, Any

class GeminiClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.api_url = settings.GEMINI_API_URL
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in settings")
    
    def generate_content(self, prompt: str) -> Dict[str, Any]:
        """Send request to Gemini API"""
        start_time = time.time()
        
        try:
            headers = {
                'Content-Type': 'application/json',
                'X-goog-api-key': self.api_key
            }
            
            request_body = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            }
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=request_body,
                timeout=30
            )
            
            processing_time = time.time() - start_time
            
            if response.status_code == 200:
                response_data = response.json()
                try:
                    content = response_data['candidates'][0]['content']['parts'][0]['text'].strip()
                    return {
                        'success': True,
                        'content': content,
                        'processing_time': processing_time
                    }
                except (KeyError, IndexError):
                    return {
                        'success': False,
                        'error': 'Failed to parse Gemini response',
                        'processing_time': processing_time
                    }
            else:
                return {
                    'success': False,
                    'error': f'API Error {response.status_code}: {response.text}',
                    'processing_time': processing_time
                }
                
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'Connection Error: {str(e)}',
                'processing_time': time.time() - start_time
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected Error: {str(e)}',
                'processing_time': time.time() - start_time
            }

class AdvancedPromptEngine:
    """Advanced prompt engineering system"""
    
    PROMPT_TEMPLATES = {
        'question_answering': {
            'factual': """You are a knowledgeable research assistant with expertise across multiple domains. 
            When answering questions, provide accurate, well-structured information with clear explanations.
            
            Question: {query}
            
            Please provide a comprehensive answer that includes:
            1. Direct answer to the question
            2. Relevant context or background information
            3. Any important related facts or considerations
            
            Respond in a professional yet conversational tone.""",
            
            'analytical': """You are an analytical expert who breaks down complex questions into digestible insights.
            
            Query: {query}
            
            Analyze this question and provide:
            - Core facts and direct answers
            - Supporting evidence or reasoning
            - Multiple perspectives if applicable
            - Practical implications or applications
            
            Keep your response clear, logical, and well-organized.""",
            
            'educational': """You are an educational mentor helping someone learn. Explain concepts clearly and thoroughly.
            
            Student's Question: {query}
            
            Provide an educational response that:
            - Explains the concept from basics to advanced
            - Uses examples and analogies where helpful
            - Highlights key takeaways
            - Suggests further learning directions if relevant
            
            Make it engaging and easy to understand."""
        },
        
        'text_summarization': {
            'concise': """You are a professional content summarizer. Create clear, concise summaries that capture essential information.
            
            Text to summarize: {query}
            
            Provide a well-structured summary that includes:
            - Main points and key arguments
            - Important details and data
            - Logical flow and conclusions
            
            Keep it comprehensive yet concise, maintaining the original context and meaning.""",
            
            'bullet_points': """You are a content analyst specializing in bullet-point summaries for quick comprehension.
            
            Content: {query}
            
            Create a structured summary with:
            • Key Points (3-5 main ideas)
            • Important Details (supporting facts/data)
            • Conclusions/Outcomes
            • Action Items (if applicable)
            
            Format in clear bullet points for easy scanning and understanding.""",
            
            'executive': """You are an executive briefing specialist. Create summaries for decision-makers who need quick, actionable insights.
            
            Document: {query}
            
            Provide an executive summary with:
            1. Executive Overview (2-3 sentences)
            2. Key Findings
            3. Strategic Implications
            4. Recommended Actions
            
            Focus on business impact and decision-relevant information."""
        },
        
        'creative_generation': {
            'storytelling': """You are a creative storytelling expert with a talent for engaging narratives.
            
            Creative Brief: {query}
            
            Create compelling content that includes:
            - Rich, vivid descriptions
            - Well-developed characters or concepts
            - Engaging plot or structure
            - Emotional resonance and impact
            
            Make it creative, original, and captivating while staying true to the request.""",
            
            'professional': """You are a professional content creator skilled in various writing formats.
            
            Content Request: {query}
            
            Generate high-quality content with:
            - Clear structure and organization
            - Appropriate tone for the intended audience
            - Compelling and informative content
            - Professional polish and refinement
            
            Ensure the content meets professional standards and serves its intended purpose.""",
            
            'innovative': """You are an innovative content strategist who creates unique, fresh perspectives.
            
            Creative Challenge: {query}
            
            Develop innovative content featuring:
            - Original ideas and unique angles
            - Creative problem-solving approaches
            - Fresh perspectives on familiar topics
            - Engaging and memorable presentation
            
            Push creative boundaries while maintaining practical value."""
        }
    }
    
    @classmethod
    def get_prompt(cls, function_type: str, style: str, query: str) -> str:
        """Get optimized prompt based on function type and style"""
        try:
            template = cls.PROMPT_TEMPLATES[function_type][style]
            return template.format(query=query)
        except KeyError:
            return f"Please help me with the following: {query}"
    
    @classmethod
    def get_available_styles(cls, function_type: str) -> list:
        """Get available styles for a function type"""
        styles_map = {
            'question_answering': [
                {'id': 'factual', 'name': 'Factual & Direct', 'description': 'Clear, direct answers with facts'},
                {'id': 'analytical', 'name': 'Analytical & Detailed', 'description': 'In-depth analysis with reasoning'},
                {'id': 'educational', 'name': 'Educational & Teaching', 'description': 'Learning-focused explanations'}
            ],
            'text_summarization': [
                {'id': 'concise', 'name': 'Concise Paragraph', 'description': 'Brief, well-structured summary'},
                {'id': 'bullet_points', 'name': 'Bullet Points', 'description': 'Key points in bullet format'},
                {'id': 'executive', 'name': 'Executive Summary', 'description': 'Business-focused summary'}
            ],
            'creative_generation': [
                {'id': 'storytelling', 'name': 'Creative Storytelling', 'description': 'Engaging narratives and stories'},
                {'id': 'professional', 'name': 'Professional Content', 'description': 'Business and formal writing'},
                {'id': 'innovative', 'name': 'Innovative & Unique', 'description': 'Creative and original approaches'}
            ]
        }
        return styles_map.get(function_type, [])
