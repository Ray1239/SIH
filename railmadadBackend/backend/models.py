from django.db import models
from django.core.files.storage import FileSystemStorage
from django.db.models.signals import post_save
from django.dispatch import receiver

from transformers import ViltProcessor, ViltForImageAndTextRetrieval
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from pathlib import Path
import torch
import os
import google.generativeai as genai
import json
import environ

env = environ.Env()
environ.Env.read_env()

# Define a custom file storage location for complaints
complaint_file_storage = FileSystemStorage(location='complaint_files')

# Gemini setting
genai.configure(api_key=env("gemini_api_key"))
gemini_model = genai.GenerativeModel(
    "gemini-1.5-flash",
    generation_config={"response_mime_type": "application/json"}
)

# Define processor and model globally for reuse
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
processor_name = "dandelin/vilt-b32-finetuned-coco"
model_name = "dandelin/vilt-b32-finetuned-coco"

import os
from moviepy.editor import VideoFileClip
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

class InfoExtractor:
    def __init__(self, file_path):
        self.file_path = file_path

    def extract_metadata(self):
        file_path = self.file_path
        try:
            metadata = {}
            
            # Absolute file path
            metadata['absolute_file_path'] = os.path.abspath(file_path)
            
            # File name
            metadata['file_name'] = os.path.basename(file_path)
            
            # File size
            metadata['file_size'] = f"{os.path.getsize(file_path)} bytes"
            
            # File type
            _, file_extension = os.path.splitext(file_path)
            metadata['file_type'] = file_extension.lower()

            # Check if the file is an image
            if file_extension.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
                with Image.open(file_path) as img:
                    # Image-specific metadata
                    metadata['image_format'] = img.format
                    metadata['image_size'] = f"{img.width}x{img.height}"
                    metadata['color_mode'] = img.mode

                    # Extract EXIF data for geolocation
                    exif_data = img._getexif()
                    if exif_data:
                        gps_info = {}
                        for tag_id, value in exif_data.items():
                            tag = TAGS.get(tag_id, tag_id)
                            if tag == 'GPSInfo':
                                for key in value:
                                    gps_info[GPSTAGS.get(key, key)] = value[key]

                        geolocation = self.extract_geolocation(gps_info)
                        if geolocation != "No GPS data available":
                            metadata['geolocation'] = geolocation

            # Check if the file is a video
            elif file_extension.lower() in ['.mp4', '.avi', '.mov']:
                with VideoFileClip(file_path) as video:
                    # Video-specific metadata
                    metadata['duration'] = video.duration
                    metadata['resolution'] = f"{video.size[0]}x{video.size[1]}"
                    metadata['fps'] = video.fps

            print(f"Extracted metadata: {metadata}")
            return metadata
        except Exception as e:
            print(f"An error occurred while extracting metadata: {e}")
            return {}

    def extract_geolocation(self, gps_info):
        if not gps_info:
            return "No GPS data available"

        lat_data = gps_info.get('GPSLatitude')
        lon_data = gps_info.get('GPSLongitude')
        lat_ref = gps_info.get('GPSLatitudeRef', 'N')
        lon_ref = gps_info.get('GPSLongitudeRef', 'E')

        if lat_data and lon_data:
            lat = self.convert_to_degrees(lat_data)
            lon = self.convert_to_degrees(lon_data)
            if lat_ref != 'N':
                lat = -lat
            if lon_ref != 'E':
                lon = -lon
            return f"Latitude: {lat:.6f}, Longitude: {lon:.6f}"
        return "No GPS data available"

    def convert_to_degrees(self, value):
        d, m, s = value
        return d + (m / 60.0) + (s / 3600.0)

    

class ImageProcessor:
    def __init__(self, device, processor_name, model_name):
        self.device = device
        self.processor = ViltProcessor.from_pretrained(processor_name)
        self.model = ViltForImageAndTextRetrieval.from_pretrained(model_name).to(self.device)

    def process_image(self, file, description):
        image = Image.open(file).convert("RGB")

        # Define the texts you want to compare against
        texts = [
            "Violence", "Argument", "Disability", "Gun", "Food", "Train coach",
            "Seat", "Window", "Overcrowded platform", "Unattended luggage", "Safety hazards",
            "Unclean waiting area", "Missing signage", "Accessibility issues",
            "Dirty restrooms"
        ]

        # Call the function to analyze the image and get the scores
        scores = self.upload_and_check_scores(image, texts)

        highest_category, highest_score, priority = self.get_highest_positive_category(scores)

        # Optionally, save the result in another model (e.g., `ProcessedResult`)
        print(f"Most likely category is: {highest_category}. It's score is: {highest_score}. Our priority is: {priority}")

        # Re-process the image
        BASE_Dir = Path(__file__).resolve().parent.parent
        file_path = os.path.join(BASE_Dir, 'complaint_files', file.name)
        response = self.process_image_gemini(file=file_path, description=description, scores=scores)    

        return highest_category, highest_score, response.get('priority'), response
    
    def process_image_gemini(self, file, scores, description):
            try:
                # print(file.path)
                uploadedFile = genai.upload_file(file)
                response = gemini_model.generate_content(
                    [uploadedFile, "\n\n", "Describe the image"]
                )

                if response.text:
                    description_text = json.loads(response.text)
                    prompt = f"""
                        Based on the following description and initial category scores from an image analysis, determine the most appropriate priority for a complaint. Don't rely too much on the scores. They might be somewhat incorrect.

                        Image Description done by computer vision:
                        {description_text}

                        Description given by passenger:
                        {description}

                        Initial Category Scores:
                        {json.dumps(scores)}

                        Priority levels: High, Low, Medium
                        Give low priority to food, catering, dirty place or furniture, bedroll, punctuality related things or miscellaneous things
                        Give medium priority to electrical equipment, divyangjan(disabled) facilities, water availability, staff behaviour, corruption/bribery related things
                        Give high priority to medical, security.

                        Assign the most accurate priority based on the description and scores.
                        Choose one category among these: [Medical Assistance, Security, Divyangjan(disabled) Facilities, Facilities for women with special needs, 
                        Electrical Equipment, Coach - Cleanliness, Punctuality, Water Availability, Coach - Maintenance, Catering & Vending Services, 
                        Staff Behaviour, Corruption / Bribery, Bed Roll, Miscellaneous].
                        Give a short analysis on what's the complaint and what's going on in the image.
                        Give sentiment too if the situation suggests.
                        """
                    
                    result = gemini_model.generate_content(prompt)

                    # Check if the response contains valid JSON
                    if result.text:
                        response = json.loads(result.text)
                        print(f"Re-evalution result: {response}")
                        return response
                    else:
                        print("Response does not contain valid JSON. Full response:", result)
                        return "error"
                else:
                    print("Response does not contain valid JSON. Full response:", result)
                    return "error"
            except Exception as e:
                print(f"An error occurred: {e}")


    def upload_and_check_scores(self, image, texts):
        scores = {}

        # Use the instance's self.processor and self.model
        for text in texts:
            encoding = self.processor(images=image, text=text, return_tensors="pt").to(self.device)
            outputs = self.model(**encoding)
            score = outputs.logits[:, 0].item()
            scores[text] = score

        return scores

    def get_highest_positive_category(self, scores):
        # Filter out categories with non-positive scores
        positive_scores = {category: score for category, score in scores.items() if score > 0}

        # Check if there are any positive scores
        if not positive_scores:
            return "No positive scores found", None, "Uncategorized"

        # Find the category with the highest positive score
        highest_category = max(positive_scores, key=positive_scores.get)
        highest_score = positive_scores[highest_category]
        priority = self.get_priority(highest_category)

        return highest_category, highest_score, priority

    def get_priority(self, category):
        priority_map = {
            "Violence": "high",
            "Disability": "high",
            "Gun": "high",
            "Safety hazards": "high",
            "Unattended luggage": "medium",
            "Accessibility issues": "medium",
            "Overcrowded platform": "medium",
            "Train coach": "low",
            "Dirty restrooms": "low",
            "Seat": "low",
            "Window": "low",
            "Unclean waiting area": "low",
            "Missing signage": "low",
            "Food": "low",
            "Argument": "low",
        }

        priority = priority_map.get(category)
        return priority

class GeminiProcessor:
    def __init__(self, model):
        self.model = model

    def processVideo(self, file, description):
        try:
            video = genai.upload_file(file)

            prompt = f"""
                    Summarize the actions done in this video. Do sentiment analysis by analyzing the visuals and also voices. 
                    Also assign priority for the railway department to resolve the issue like this: [High, Medium, Low]. 
                    Give one category among this: [Medical Assistance, Security, Divyangjan(disabled) Facilities, Facilities for women with special needs, 
                    Electrical Equipment, Coach - Cleanliness, Punctuality, Water Availability, Coach - Maintenance, Catering & Vending Services, 
                    Staff Behaviour, Corruption / Bribery, Bed Roll, Miscellaneous]

                    This is a description given by our passenger:
                    {description}
                    """

            response = gemini_model.generate_content(
                [video, "\n\n", prompt]
            )

            if response.text:
                description_text = json.loads(response.text)
                print(f"Description Text: {description_text}")
                
                # Extract and print priority and reason
                priority = description_text.get('priority', 'No priority provided')
                description = description_text.get('actions', 'No description provided')
                sentiment = description_text.get('sentiment', 'No sentiment provided')
                category = description_text.get('category', 'No category provided')

                print(f"Priority: {priority}")
                print(f"Description: {description}")
                print(f"Sentiment: {sentiment}")
                print(f"Category: {category}")
            else:
                print("Response does not contain valid text. Full response:", response)
        except Exception as e:
            print(f"an error occured: {e}")

        return description_text


class Complaint(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    mobile = models.TextField(max_length=10)
    PNR = models.TextField(max_length=10, unique=True)
    date = models.DateTimeField(auto_now_add=True, blank=True)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, blank=True)
    is_processed = models.BooleanField(default=False)
    analysis = models.TextField(blank=True)
    sentiment = models.TextField(blank=True)
    category = models.TextField(blank=True)
    metadata = models.JSONField(blank=True, null=True)

    file = models.FileField(upload_to='complaints/', storage=complaint_file_storage, blank=True)

    def file_type(self):
        ext = os.path.splitext(self.file.name)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png']:
            return 'image'
        elif ext in ['.mp4', '.mov', '.avi']:
            return 'video'
        elif ext in ['.mp3', '.wav']:
            return 'audio'
        elif ext == '.pdf':
            return 'pdf'
        else:
            return 'unknown'

    def process_file(self):
        file_type = self.file_type()
        if file_type == 'image':
            self.process_image_file()
        elif file_type == 'video':
            self.process_video_file()

    def process_image_file(self):
        # Initialize the ImageProcessor and process the image
        image_processor = ImageProcessor(device=device, processor_name=processor_name, model_name=model_name)
        category, score, priority, response = image_processor.process_image(self.file, self.description)
        self.priority = priority

    def process_video_file(self):
        vid_processor = GeminiProcessor(model=gemini_model)
        vid_processor.processVideo(file=self.file.path, description=self.description)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Complaint {self.id} - {self.priority.capitalize()}"
