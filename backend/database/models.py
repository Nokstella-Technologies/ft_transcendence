from django.db import models
import uuid

class User(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.TextField()
    email = models.TextField()
    password_hash = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_auth = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Tournament(models.Model):
    tournament_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.TextField()

    def __str__(self):
        return self.name

class Game(models.Model):
    game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player1_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1_games')
    player2_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player2_games')
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.TextField()

    def __str__(self):
        return f"Game {self.game_id}"

class PlayerStats(models.Model):
    stats_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    games_played = models.IntegerField()
    games_won = models.IntegerField()
    games_lost = models.IntegerField()
    total_score = models.IntegerField()

    def __str__(self):
        return f"Stats for {self.user_id}"

class GameAppearance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    player1_color = models.TextField()
    player2_color = models.TextField()
    ball_color = models.TextField()
    background_color = models.TextField()
    net_color = models.TextField()

    def __str__(self):
        return f"Appearance for {self.user_id}"

class TournamentGame(models.Model):
    tournament_game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game_id = models.ForeignKey(Game, on_delete=models.CASCADE)
    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    round = models.IntegerField()

    def __str__(self):
        return f"TournamentGame {self.tournament_game_id}"

class TournamentParticipant(models.Model):
    tournament_participant_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Participant {self.user_id} in Tournament {self.tournament_id}"