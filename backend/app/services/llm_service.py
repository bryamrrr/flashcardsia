"""
Servicio genérico para interacciones con LLM (OpenAI)
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional

import openai
from ..config import settings

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMService:
    """Wrapper genérico para llamadas a LLM"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = openai.OpenAI(
            api_key=api_key or settings.OPENAI_API_KEY
        )
    
    def _extract_json_from_response(self, content: str) -> str:
        """
        Extrae JSON puro de una respuesta que puede estar envuelta en markdown.
        
        Args:
            content: Contenido crudo de la respuesta
            
        Returns:
            JSON string limpio
        """
        if not content:
            return ""
        
        # Buscar JSON envuelto en bloques de código markdown
        json_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
        match = re.search(json_pattern, content, re.DOTALL)
        
        if match:
            logger.info("JSON encontrado en bloque de código markdown")
            return match.group(1).strip()
        
        # Si no hay markdown, buscar JSON directo
        json_pattern_direct = r'(\{.*\})'
        match_direct = re.search(json_pattern_direct, content, re.DOTALL)
        
        if match_direct:
            logger.info("JSON encontrado directamente")
            return match_direct.group(1).strip()
        
        # Si no se encuentra JSON, devolver el contenido original
        logger.warning("No se pudo extraer JSON de la respuesta")
        return content.strip()
        
    async def generate_completion(
        self,
        prompt: str,
        model: str = settings.DEFAULT_MODEL,
        max_tokens: int = settings.MAX_TOKENS,
        temperature: float = settings.TEMPERATURE,
        system_message: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Genera una respuesta del LLM basada en el prompt proporcionado.
        
        Args:
            prompt: El prompt principal para el LLM
            model: Modelo a usar (default: gpt-3.5-turbo)
            max_tokens: Máximo número de tokens en la respuesta
            temperature: Creatividad de la respuesta (0.0 - 1.0)
            system_message: Mensaje del sistema opcional
            
        Returns:
            Dict con la respuesta cruda y metadatos
        """
        try:
            messages = []
            
            if system_message:
                messages.append({"role": "system", "content": system_message})
                
            messages.append({"role": "user", "content": prompt})
            
            logger.info(f"Enviando request a OpenAI - Model: {model}")
            logger.info(f"Prompt length: {len(prompt)} characters")
            
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            
            result = {
                "content": response.choices[0].message.content,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                },
                "finish_reason": response.choices[0].finish_reason,
            }
            
            logger.info(f"OpenAI response received - Tokens used: {result['usage']['total_tokens']}")
            logger.info(f"Raw response: {result['content'][:200]}...")  # Log primeros 200 chars
            
            return result
            
        except Exception as e:
            logger.error(f"Error en llamada a OpenAI: {str(e)}")
            raise Exception(f"Error generando respuesta del LLM: {str(e)}")
    
    async def extract_flashcards(
        self,
        text: str,
        num_pairs: int = 5,
        prompt_template: str = None,
    ) -> Dict[str, Any]:
        """
        Extrae pares de Q&A del texto para crear flashcards.
        
        Args:
            text: Texto del cual extraer las flashcards
            num_pairs: Número de pares Q&A a extraer
            prompt_template: Template del prompt personalizado
            
        Returns:
            Dict con las flashcards extraídas y metadatos
        """
        if not prompt_template:
            from ..prompts.flashcard_prompts import EXTRACT_QA_PAIRS_PROMPT
            prompt_template = EXTRACT_QA_PAIRS_PROMPT
            
        formatted_prompt = prompt_template.format(
            num_pairs=num_pairs,
            text=text
        )
        
        system_message = "Eres un asistente experto en educación que crea flashcards efectivas. Responde ÚNICAMENTE con JSON válido, sin markdown ni texto adicional."
        
        result = await self.generate_completion(
            prompt=formatted_prompt,
            system_message=system_message,
            temperature=0.3,  # Menos creatividad para más consistencia
        )
        
        try:
            # Extraer JSON limpio de la respuesta
            clean_json = self._extract_json_from_response(result["content"])
            logger.info(f"JSON extraído: {clean_json[:200]}...")
            
            # Intentar parsear la respuesta JSON
            parsed_content = json.loads(clean_json)
            result["parsed_flashcards"] = parsed_content
            
            flashcards_count = len(parsed_content.get('flashcards', []))
            logger.info(f"Successfully extracted {flashcards_count} flashcards")
            
            if flashcards_count == 0:
                logger.warning("No flashcards found in parsed response")
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw content: {result['content']}")
            result["parsing_error"] = str(e)
            result["parsed_flashcards"] = None
            
        except Exception as e:
            logger.error(f"Unexpected error parsing flashcards: {e}")
            result["parsing_error"] = str(e)
            result["parsed_flashcards"] = None
            
        return result
    
    def log_response(self, response: Dict[str, Any], context: str = ""):
        """
        Loguea la respuesta cruda del LLM para debugging.
        
        Args:
            response: Respuesta del LLM
            context: Contexto adicional para el log
        """
        logger.info(f"=== LLM RESPONSE LOG {context} ===")
        logger.info(f"Model: {response.get('model', 'unknown')}")
        logger.info(f"Finish reason: {response.get('finish_reason', 'unknown')}")
        logger.info(f"Tokens used: {response.get('usage', {}).get('total_tokens', 'unknown')}")
        logger.info(f"Raw content:\n{response.get('content', 'No content')}")
        logger.info("=== END LLM RESPONSE LOG ===")


# Instancia global del servicio
llm_service = LLMService() 