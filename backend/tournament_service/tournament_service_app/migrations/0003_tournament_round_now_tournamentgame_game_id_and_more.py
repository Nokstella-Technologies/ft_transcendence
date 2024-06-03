# Generated by Django 4.2.13 on 2024-06-03 02:02

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('tournament_service_app', '0002_alter_tournamentgame_tournament_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='round_now',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='tournamentgame',
            name='game_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        migrations.AlterField(
            model_name='tournamentgame',
            name='player1_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='tournament_service_app.tournamentparticipant'),
        ),
        migrations.AlterField(
            model_name='tournamentgame',
            name='player2_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='tournament_service_app.tournamentparticipant'),
        ),
    ]
