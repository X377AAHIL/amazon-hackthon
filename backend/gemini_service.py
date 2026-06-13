import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Load local environment variables
load_dotenv()

# Initialize the Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("CRITICAL: GEMINI_API_KEY is not set in your .env file.")

client = genai.Client(api_key=api_key)

# ---------------------------------------------------------
# Define the Structure Output Schema using Pydantic
# ---------------------------------------------------------
class GradingAndRoutingResult(BaseModel):
    product_name: str = Field(description="Identified or clean name of the product.")
    detected_category: str = Field(description="Product category, e.g., Electronics, Apparel, Home.")
    grade: str = Field(description="Must be strictly one of: Grade A (Like New), Grade B (Light Use), Grade C (Damaged/Refurbish), Grade D (Scrap/Recycle).")
    confidence_score: float = Field(description="Confidence score between 0.00 and 1.00 for the grading logic.")
    is_fraud_suspected: bool = Field(description="True if the item appears to be a fraudulent swap or completely missing its parts.")
    grading_justification: str = Field(description="A concise sentence explaining why this grade was assigned based on visual cues.")
    
    # Smart Routing
    recommended_route: str = Field(description="Strictly one of: Amazon Warehouse, Amazon Renewed, Liquidation, Recycle.")
    estimated_value_recovery_percentage: int = Field(description="Estimated resale value recovery from 0 to 100 based on condition and route.")
    routing_reasoning: str = Field(description="Brief explanation of why this specific route saves costs or prevents landfill waste.")

# ---------------------------------------------------------
# Core Service Logic
# ---------------------------------------------------------
def analyze_returned_product(image_path: str, return_reason: str = "Unknown") -> GradingAndRoutingResult:
    """
    Takes a local image path and user return notes, passes them to Gemini 2.5 Flash,
    and returns a clean structured object with grading and routing insight.
    """
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found at path: {image_path}")
        
    # Read image bytes natively
    image_bytes = path.read_bytes()
    
    # System instructions to lock down behavior
    system_instruction = (
        "You are an expert automated warehouse inspector for Amazon. "
        "Your task is to review the image of a returned item, assess its condition against "
        "the stated reason for return, run a fraud check, and calculate the smartest downstream routing "
        "to optimize financial recovery and minimize carbon footprint."
    )
    
    # Prompt context engineering
    prompt = f"""
    Analyze this returned item. 
    Stated Return Reason from Customer: "{return_reason}"
    
    Perform these checks:
    1. Inspect visually for scuffs, open packaging, or missing pieces. Assign Grade A, B, C, or D.
    2. Check if the item matches typical merchant descriptions or if a fraud item swap happened.
    3. Determine the optimal downstream target destination based on the grade.
    """
    
    # Construct contents payload combining text and the raw image bytes
    contents = [
        prompt,
        types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/jpeg" # Handles png or jpeg transparently 
        )
    ]
    
    # Call Gemini with strict JSON enforcement matching our Pydantic schema
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=GradingAndRoutingResult,
            temperature=0.2, # Low temperature ensures consistent, programmatic grading
        ),
    )
    
    # The SDK automatically binds and validates JSON to the schema inside response.parsed
    return response.parsed

# ---------------------------------------------------------
# Quick Local Verification (To test your file independently)
# ---------------------------------------------------------
if __name__ == "__main__":
    print("Testing gemini_service.py logic...")
    # To run this test: place a dummy image at 'backend/uploads/test.jpg' 
    # and execute: python backend/gemini_service.py
    test_image = "backend/uploads/test.jpg"
    
    if os.path.exists(test_image):
        try:
            result = analyze_returned_product(test_image, return_reason="Box was opened, didn't like color")
            print("\n Successfully parsed structured response from Gemini AI Studio:")
            print(result.model_dump_json(indent=2))
        except Exception as e:
            print(f"Error during execution: {e}")
    else:
        print(f"\n[Skipped execution test]: Drop a test image at '{test_image}' to check your live API connectivity.")