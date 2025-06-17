"""
Servicio para procesar diferentes tipos de documentos
"""

import logging
from io import BytesIO
from typing import Dict, Any
import PyPDF2

logger = logging.getLogger(__name__)


class DocumentService:
    """Servicio para procesar y extraer texto de documentos"""
    
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        """
        Extrae texto de un archivo PDF
        
        Args:
            file_content: Contenido del archivo PDF en bytes
            
        Returns:
            Texto extraído del PDF
        """
        try:
            pdf_file = BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            logger.info(f"Successfully extracted text from PDF ({len(text)} characters)")
            return text.strip()
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise Exception(f"Error procesando PDF: {str(e)}")
    
    @staticmethod
    def extract_text_from_txt(file_content: bytes, encoding: str = 'utf-8') -> str:
        """
        Extrae texto de un archivo TXT
        
        Args:
            file_content: Contenido del archivo en bytes
            encoding: Codificación del archivo
            
        Returns:
            Texto del archivo
        """
        try:
            text = file_content.decode(encoding)
            logger.info(f"Successfully extracted text from TXT ({len(text)} characters)")
            return text.strip()
        except UnicodeDecodeError:
            # Intentar con latin-1 si UTF-8 falla
            try:
                text = file_content.decode('latin-1')
                logger.info(f"Successfully extracted text from TXT with latin-1 ({len(text)} characters)")
                return text.strip()
            except Exception as e:
                logger.error(f"Error extracting text from TXT: {str(e)}")
                raise Exception(f"Error procesando archivo TXT: {str(e)}")
    
    @staticmethod
    def get_file_type(filename: str, content_type: str) -> str:
        """
        Determina el tipo de archivo basado en el nombre y content-type
        
        Args:
            filename: Nombre del archivo
            content_type: Content-Type del archivo
            
        Returns:
            Tipo de archivo ('pdf', 'txt', 'unknown')
        """
        filename_lower = filename.lower()
        
        if filename_lower.endswith('.pdf') or content_type == 'application/pdf':
            return 'pdf'
        elif filename_lower.endswith('.txt') or content_type == 'text/plain':
            return 'txt'
        else:
            return 'unknown'
    
    @classmethod
    def process_document(cls, file_content: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        """
        Procesa un documento y extrae su texto
        
        Args:
            file_content: Contenido del archivo en bytes
            filename: Nombre del archivo
            content_type: Content-Type del archivo
            
        Returns:
            Dict con el texto extraído y metadatos
        """
        file_type = cls.get_file_type(filename, content_type)
        
        if file_type == 'pdf':
            text = cls.extract_text_from_pdf(file_content)
        elif file_type == 'txt':
            text = cls.extract_text_from_txt(file_content)
        else:
            raise Exception(f"Tipo de archivo no soportado: {filename}")
        
        return {
            'text': text,
            'file_type': file_type,
            'filename': filename,
            'text_length': len(text)
        }


# Instancia global del servicio
document_service = DocumentService() 