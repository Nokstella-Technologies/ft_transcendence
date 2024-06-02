from django.db import models
import uuid

class Tournament(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50)

    __str__ = lambda self: f"{self.id} - {self.status}"

class TournamentParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="participants")
    user_id = models.UUIDField()
    score = models.IntegerField(default=0)
    registered_at = models.DateTimeField(auto_now_add=True)


class TournamentGame(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="tornament")
    player1_id = models.UUIDField()
    player2_id = models.UUIDField(null=True, blank=True)  # Para casos de "bye"
    status = models.CharField(max_length=50, default='pending')
    round_number = models.IntegerField()
