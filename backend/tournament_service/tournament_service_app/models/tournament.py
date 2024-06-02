from django.db import models
import uuid

class Tournament(models.Model):
    tournament_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50)

class TournamentParticipant(models.Model):
    tournament_participant_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="tournament_id")
    user_id = models.UUIDField()
    score = models.IntegerField(default=0)
    registered_at = models.DateTimeField(auto_now_add=True)


class TournamentGame(models.Model):
    game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="tournament_id")
    player1_id = models.UUIDField()
    player2_id = models.UUIDField(null=True, blank=True)  # Para casos de "bye"
    status = models.CharField(max_length=50, default='pending')
    round_number = models.IntegerField()
