from django.db.models.signals import post_save
from django.dispatch import receiver
from . models import *

@receiver(post_save, sender=Complaint)
def reprocess_complaint_priority(sender, instance, **kwargs):
    # Re-process the priority of the complaint only if it's not already processed
    if not instance.is_processed:
        if instance.file and instance.file_type() == 'image':
            image_processor = ImageProcessor(device=device, processor_name=processor_name, model_name=model_name)
            category, score, priority, response = image_processor.process_image(instance.file, instance.description)

            ai_description = response.get('analysis', 'No description provided')
            sentiment = response.get('sentiment', 'No sentiment provided')
            category = response.get('category', 'No category provided')

            metadataEx = InfoExtractor(instance.file.path)
            metadata = metadataEx.extract_metadata()

            instance.priority = priority
            instance.analysis = ai_description
            instance.sentiment = sentiment
            instance.category = category
            instance.is_processed = True  # Mark as processed
            instance.metadata = metadata
            instance.save(update_fields=['priority', 'is_processed', 'category', 'analysis', 'sentiment', 'metadata'])  # Update only the priority and is_processed fields

        elif instance.file and instance.file_type() == 'video':
            vid_processor = GeminiProcessor(model=gemini_model)
            result = vid_processor.processVideo(file=instance.file.path, description=instance.description)

            priority = result.get('priority', 'No priority provided')
            ai_description = result.get('actions', 'No description provided')
            sentiment = result.get('sentiment', 'No sentiment provided')
            category = result.get('category', 'No category provided')

            metadataEx = InfoExtractor(instance.file.path)
            metadata = metadataEx.extract_metadata()

            instance.priority = priority
            instance.analysis = ai_description
            instance.sentiment = sentiment
            instance.category = category
            instance.metadata = metadata
            instance.is_processed = True  # Mark as processed
            instance.save(update_fields=['priority', 'is_processed', 'category', 'analysis', 'sentiment', 'metadata'])  # Update only the priority and is_processed fields
