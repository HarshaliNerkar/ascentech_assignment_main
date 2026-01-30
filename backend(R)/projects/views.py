from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # PDF 3.2: Auto-assign owner
        print(f"DEBUG: User: {self.request.user}, Auth: {self.request.user.is_authenticated}")
        serializer.save(owner=self.request.user)
