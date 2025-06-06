"""
Templates de prompts para la generación de flashcards
"""

EXTRACT_QA_PAIRS_PROMPT = """
Eres un experto en educación y generación de contenido educativo. Tu tarea es extraer {num_pairs} pares de pregunta-respuesta (Q&A) del siguiente texto para crear flashcards efectivas.

INSTRUCCIONES:
1. Las preguntas deben ser claras, específicas y educativamente valiosas
2. Las respuestas deben ser concisas pero completas
3. Cubre los conceptos más importantes del texto
4. Varía el tipo de preguntas (definiciones, conceptos, ejemplos, aplicaciones)
5. Asegúrate de que las flashcards sean útiles para el aprendizaje

FORMATO DE RESPUESTA:
Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{{
  "flashcards": [
    {{
      "question": "¿Pregunta aquí?",
      "answer": "Respuesta aquí"
    }},
    {{
      "question": "¿Otra pregunta?",
      "answer": "Otra respuesta"
    }}
  ]
}}

TEXTO A PROCESAR:
{text}

Extrae exactamente {num_pairs} pares de Q&A del texto anterior:
"""

IMPROVE_FLASHCARD_PROMPT = """
Eres un experto en pedagogía. Mejora la siguiente flashcard para hacerla más efectiva educativamente.

FLASHCARD ORIGINAL:
Pregunta: {question}
Respuesta: {answer}

INSTRUCCIONES:
1. Haz la pregunta más clara y específica
2. Mejora la respuesta para que sea más concisa y memorable
3. Asegúrate de que la flashcard sea educativamente efectiva

FORMATO DE RESPUESTA (JSON):
{{
  "improved_flashcard": {{
    "question": "Pregunta mejorada",
    "answer": "Respuesta mejorada"
  }}
}}
"""

VALIDATE_FLASHCARD_PROMPT = """
Evalúa la calidad de esta flashcard según criterios educativos.

FLASHCARD:
Pregunta: {question}
Respuesta: {answer}

CRITERIOS DE EVALUACIÓN:
1. Claridad de la pregunta (1-10)
2. Precisión de la respuesta (1-10)
3. Utilidad educativa (1-10)
4. Nivel de dificultad apropiado (1-10)

FORMATO DE RESPUESTA (JSON):
{{
  "evaluation": {{
    "clarity": 8,
    "accuracy": 9,
    "educational_value": 7,
    "difficulty_level": 6,
    "overall_score": 7.5,
    "suggestions": "Sugerencias para mejorar..."
  }}
}}
""" 