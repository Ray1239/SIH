from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Complaint
from .serializers import ComplaintSerializer

@api_view(['GET', 'POST'])
def complaint_list(request):
    """
    List all complaints, or create a new complaint.
    """
    if request.method == 'GET':
        complaints = Complaint.objects.all()
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def complaint_detail(request, pnr):
    """
    Retrieve, update, or delete a complaint by PNR.
    """
    try:
        complaint = Complaint.objects.get(PNR=pnr)
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ComplaintSerializer(complaint)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ComplaintSerializer(complaint, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        complaint.delete()
        return Response({"message": "Complaint deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

