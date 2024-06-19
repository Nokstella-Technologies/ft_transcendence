from django.db import models
import uuid

class GameStats(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game_id = models.UUIDField()
    player1_id = models.UUIDField()
    player2_id = models.UUIDField()
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"GameStats {self.game_id}"

class TournamentStats(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament_id = models.UUIDField()
    player1_id = models.UUIDField()
    player2_id = models.UUIDField()
    winner_id = models.UUIDField()
    score = models.IntegerField()
    round_number = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TournamentStats {self.tournament_id}"
