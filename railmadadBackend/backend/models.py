from django.db import models
from django.core.files.storage import FileSystemStorage
from django.db.models.signals import post_save
from django.dispatch import receiver

from transformers import ViltProcessor, ViltForImageAndTextRetrieval
from PIL import Image, ExifTags
from pathlib import Path
import torch
import os
import google.generativeai as genai
import json
import environ
from moviepy.editor import VideoFileClip

# Load environment variables
env = environ.Env()
environ.Env.read_env()

# Define custom file storage location for complaints
complaint_file_storage = FileSystemStorage(location='complaint_files')

# Configure Gemini
genai.configure(api_key=env("gemini_api_key"))
gemini_model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"response_mime_type": "application/json"})

# Define processor and model globally for reuse
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
processor_name = "dandelin/vilt-b32-finetuned-coco"
model_name = "dandelin/vilt-b32-finetuned-coco"

processor = ViltProcessor.from_pretrained(processor_name)
print("Loading model")
model = ViltForImageAndTextRetrieval.from_pretrained(model_name).to(device)
print("model loaded")


class InfoExtractor:
    def __init__(self, file_path):
        self.file_path = file_path

    def extract_metadata(self):
        metadata = {}
        try:
            file_path = self.file_path
            metadata['absolute_file_path'] = os.path.abspath(file_path)
            metadata['file_name'] = os.path.basename(file_path)
            metadata['file_size'] = f"{os.path.getsize(file_path)} bytes"
            _, file_extension = os.path.splitext(file_path)
            metadata['file_type'] = file_extension.lower()

            if file_extension.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                with Image.open(file_path) as img:
                    metadata.update({
                        'image_format': img.format,
                        'image_size': f"{img.width}x{img.height}",
                        'color_mode': img.mode,
                    })
                    exif_data = img._getexif()
                    if exif_data:
                        gps_info = {ExifTags.GPSTAGS.get(k, k): v for k, v in exif_data.get(ExifTags.TAGS['GPSInfo'], {}).items()}
                        metadata['geolocation'] = self.extract_geolocation(gps_info)
            elif file_extension.lower() in ['.mp4', '.avi', '.mov']:
                with VideoFileClip(file_path) as video:
                    metadata.update({
                        'duration': video.duration,
                        'resolution': f"{video.size[0]}x{video.size[1]}",
                        'fps': video.fps,
                    })
            return metadata
        except Exception as e:
            print(f"Error extracting metadata: {e}")
            return {}

    def extract_geolocation(self, gps_info):
        if not gps_info:
            return "No GPS data available"
        lat = self.convert_to_degrees(gps_info.get('GPSLatitude'))
        lon = self.convert_to_degrees(gps_info.get('GPSLongitude'))
        lat_ref = gps_info.get('GPSLatitudeRef', 'N')
        lon_ref = gps_info.get('GPSLongitudeRef', 'E')
        if lat and lon:
            if lat_ref != 'N':
                lat = -lat
            if lon_ref != 'E':
                lon = -lon
            return f"Latitude: {lat:.6f}, Longitude: {lon:.6f}"
        return "No GPS data available"

    @staticmethod
    def convert_to_degrees(value):
        if not value:
            return None
        d, m, s = value
        return d + (m / 60.0) + (s / 3600.0)


class ImageProcessor:
    # def __init__(self, device, processor, model):
    #     self.device = device
    #     self.processor = processor
    #     self.model = model

    def process_image(self, file, description):
        # image = Image.open(file).convert("RGB")
        # texts = ["Violence", "Argument", "Disability", "Gun", "Food", "Train coach", "Seat", "Window",
        #          "Overcrowded platform", "Unattended luggage", "Safety hazards", "Unclean waiting area",
        #          "Missing signage", "Accessibility issues", "Dirty restrooms"]

        # scores = self.upload_and_check_scores(image, texts)
        # highest_category, highest_score, priority = self.get_highest_positive_category(scores)

        BASE_DIR = Path(__file__).resolve().parent.parent
        file_path = os.path.join(BASE_DIR, 'complaint_files', file.name)
        response = self.process_image_gemini(file_path, description)

        return response

    def process_image_gemini(self, file, description):
        try:
            uploaded_file = genai.upload_file(file)
            prompt = f"""
                        Based on the following description given by the passenger determine most appropriat priority.

                        Description given by passenger:
                        {description}

                        Priority levels: high, medium, low
                        Give priority in above format strictly (i.e. all small letters and no extra characters except for priority)
                        Give low priority to food, catering, dirty place or furniture, bedroll, punctuality related things or miscellaneous things
                        Give medium priority to electrical equipment, divyangjan(disabled) facilities, water availability, staff behaviour, corruption/bribery related things
                        Give high priority to medical, security.

                        Always determine the urgency of the situation then decide the prioirity instead of assigning priority just based on category.
                        
                        Assign the most accurate priority based on the description and scores.
                        Choose one category among these: [Medical Assistance, Security, Divyangjan(disabled) Facilities, Facilities for women with special needs, 
                        Electrical Equipment, Coach - Cleanliness, Punctuality, Water Availability, Coach - Maintenance, Catering & Vending Services, 
                        Staff Behaviour, Corruption / Bribery, Bed Roll, Miscellaneous].
                        Give a short analysis on what's the complaint and what's going on in the image. Dont write very long analysis, just enough for understanding the situation.
                        Give sentiment too if the situation suggests.
                        """
            result = gemini_model.generate_content([uploaded_file, "\n\n", prompt])
            if result.text:
                response = json.loads(result.text)
                return response
            return "error"
        except Exception as e:
            print(f"Error in Gemini processing: {e}")
            return {}

    # def upload_and_check_scores(self, image, texts):
    #     scores = {}
    #     for text in texts:
    #         encoding = self.processor(images=image, text=text, return_tensors="pt").to(self.device)
    #         outputs = self.model(**encoding)
    #         scores[text] = outputs.logits[:, 0].item()
    #     return scores

    # def get_highest_positive_category(self, scores):
    #     positive_scores = {k: v for k, v in scores.items() if v > 0}
    #     if not positive_scores:
    #         return "No positive scores", None, "Uncategorized"
    #     highest_category = max(positive_scores, key=positive_scores.get)
    #     highest_score = positive_scores[highest_category]
    #     priority = self.get_priority(highest_category)
    #     return highest_category, highest_score, priority

    # @staticmethod
    # def get_priority(category):
    #     priority_map = {
    #         "Violence": "high", "Disability": "high", "Gun": "high", "Safety hazards": "high",
    #         "Unattended luggage": "medium", "Accessibility issues": "medium", "Overcrowded platform": "medium",
    #         "Dirty restrooms": "low", "Food": "low", "Argument": "low", "Train coach": "low", "Seat": "low"
    #     }
    #     return priority_map.get(category, "low")


class GeminiProcessor:
    def process_video(self, file, description):
        try:
            uploaded_file = genai.upload_file(file)
            prompt = f"""
                    Summarize the actions done in this video. Do sentiment analysis by analyzing the visuals and also voices. 
                    Also assign priority for the railway department to resolve the issue like this: high, medium, low. 
                    Give priority in above format strictly (i.e. all small char and no extra characters except for priority)
                    Give one category among this: [Medical Assistance, Security, Divyangjan(disabled) Facilities, Facilities for women with special needs, 
                    Electrical Equipment, Coach - Cleanliness, Punctuality, Water Availability, Coach - Maintenance, Catering & Vending Services, 
                    Staff Behaviour, Corruption / Bribery, Bed Roll, Miscellaneous]

                    This is a description given by our passenger:
                    {description}
                    """
            result = gemini_model.generate_content([uploaded_file, "\n\n", prompt])
            if result.text:
                return json.loads(result.text)
            return "error"
        except Exception as e:
            print(f"Error processing video: {e}")
            return "error"

image_processor = ImageProcessor()

class Complaint(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    mobile = models.CharField(max_length=10)
    PNR = models.CharField(max_length=10, unique=True)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, blank=True)
    is_processed = models.BooleanField(default=False)
    analysis = models.TextField(blank=True)
    sentiment = models.TextField(blank=True)
    category = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    file = models.FileField(upload_to='complaints/', storage=complaint_file_storage)

    def file_type(self):
        ext = os.path.splitext(self.file.name)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.webp']:
            return 'image'
        elif ext in ['.mp4', '.mov', '.avi']:
            return 'video'
        elif ext in ['.mp3', '.wav']:
            return 'audio'
        elif ext == '.pdf':
            return 'pdf'
        else:
            return 'unknown'


    def __str__(self):
        return f"Complaint {self.PNR} - {self.priority}"
