from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import RegisterSerializer, UserSerializer

# Create your views here.


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
