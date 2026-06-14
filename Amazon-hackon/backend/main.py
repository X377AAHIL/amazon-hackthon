import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Local module imports
from gemini_service import analyze_returned_product
from database import save_return_record, get_all_returns

app = FastAPI(title="Intelligent Bridge API", version="1.0")

# Enable CORS so your local frontend can communicate with your local backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In local dev, allow any local origin (Streamlit/React)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Expose the uploads folder statically so the frontend can display uploaded images via URL
app.mount("/static_uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.post("/api/grade")
async def grade_return(
    file: UploadFile = File(...), 
    return_reason: str = Form("Item broken or unwanted")
):
    """
    Endpoint that handles the image upload, saves it locally, 
    sends it to Gemini 2.5 Flash, and logs it to SQLite.
    """
    # 1. Save the file locally
    file_extension = os.path.splitext(file.filename)[1]
    local_filename = f"return_{os.urandom(4).hex()}{file_extension}"
    save_path = os.path.join(UPLOAD_DIR, local_filename)
    
    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Call our Gemini Core Service
        ai_analysis = analyze_returned_product(save_path, return_reason=return_reason)
        
        # 3. Store in Local Database
        relative_image_url = f"/static_uploads/{local_filename}"
        save_return_record(ai_analysis, relative_image_url)
        
        # 4. Return structured JSON back to your frontend
        return {
            "success": True,
            "image_url": relative_image_url,
            "data": ai_analysis
        }
        
    except Exception as e:
        # Prevent crashes during a live demo; return a readable error
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history():
    """Returns historical records of graded items to populate dashboard analytics."""
    try:
        data = get_all_returns()
        return {"success": True, "count": len(data), "history": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting local API server...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)