from django.db import models
import uuid

class Tournament(models.Model):
    tournament_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50)

class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    user_id = models.UUIDField()
    score = models.IntegerField(default=0)
    registered_at = models.DateTimeField(auto_now_add=True)

class TournamentGame(models.Model):
    game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    round = models.IntegerField()
    player1_id = models.UUIDField()
    player2_id = models.UUIDField(null=True, blank=True)  # Para casos de "bye"
    status = models.CharField(max_length=50, default='pending')
