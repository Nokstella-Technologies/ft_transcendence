# Generated by Django 4.2.2 on 2024-05-19 20:12

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('game_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('score_player1', models.IntegerField()),
                ('score_player2', models.IntegerField()),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('status', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('tournament_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('username', models.TextField()),
                ('email', models.TextField()),
                ('password_hash', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_auth', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='TournamentParticipant',
            fields=[
                ('tournament_participant_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('score', models.IntegerField()),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('tournament_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.tournament')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.user')),
            ],
        ),
        migrations.CreateModel(
            name='TournamentGame',
            fields=[
                ('tournament_game_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('round', models.IntegerField()),
                ('game_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.game')),
                ('tournament_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.tournament')),
            ],
        ),
        migrations.CreateModel(
            name='PlayerStats',
            fields=[
                ('stats_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('games_played', models.IntegerField()),
                ('games_won', models.IntegerField()),
                ('games_lost', models.IntegerField()),
                ('total_score', models.IntegerField()),
                ('user_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='database.user')),
            ],
        ),
        migrations.CreateModel(
            name='GameAppearance',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('player1_color', models.TextField()),
                ('player2_color', models.TextField()),
                ('ball_color', models.TextField()),
                ('background_color', models.TextField()),
                ('net_color', models.TextField()),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.user')),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='player1_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1_games', to='database.user'),
        ),
        migrations.AddField(
            model_name='game',
            name='player2_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2_games', to='database.user'),
        ),
    ]