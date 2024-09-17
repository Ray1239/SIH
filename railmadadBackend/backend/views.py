from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Complaint
from .serializers import ComplaintSerializer
from django.db.utils import IntegrityError

class ComplaintView(APIView):
    serializer_class = ComplaintSerializer

    def get(self, request):
        complaints = Complaint.objects.all()
        serializer = self.serializer_class(complaints, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            try:
                serializer.save()
            except IntegrityError as e:
                return Response({'error': 'A record with this PNR already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Example for handling PUT requests
    def put(self, request, pk=None):
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.serializer_class(complaint, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Example for handling DELETE requests
    def delete(self, request, pk=None):
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        complaint.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ComplaintDetailByPNR(APIView):
    def get(self, request, PNR):
        try:
            # Fetch the complaint based on the PNR
            complaint = Complaint.objects.get(PNR=PNR)
            serializer = ComplaintSerializer(complaint)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

