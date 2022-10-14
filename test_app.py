from unittest import TestCase

from app import app, games

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BoggleAppTestCase(TestCase):
    """Test flask app of Boggle."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client as client:
            response = client.get('/')
            html = response.get_data(as_text=True)

            self.assertEqual(response.status_code,200)
            self.assertIn("<!-- BASE TEMPLATE FOR TESTING PURPOSES -->",html)
            # test that you're getting a template

    def test_api_new_game(self):
        """Test starting a new game."""

        with self.client as client:
            response = client.post("/api/new-game")
            json_response = response.get_json()
            game_id = json_response["gameId"]

            self.assertEqual(response.status_code,200)
            self.assertIn(game_id, games)
            # write a test for this route

    def test_api_score_word(self):
        """Test scoring a word if valid."""

        with self.client as client:
            response = client.post("/api/new-game")
            game_id = response.get_json()["gameId"]
            self.assertEqual(response.status_code,200)

            game = games[game_id]
            game.board[0] = ["A", "B", "C", "D", "E"]
            game.board[1] = ["P", "R", "A", "X", "X"]
            game.board[2] = ["P", "A", "T", "X", "T"]
            game.board[3] = ["L", "T", "X", "X", "N"]
            game.board[4] = ["E", "X", "X", "X", "A"]


            response = client.post(
                "/api/score-word",
                json = {"word": "APPLE", "gameId": game_id}
                )
            self.assertEqual(response.get_json(), {"result": "ok"})

            response = client.post(
                "/api/score-word",
                json = {"word": "BRAT", "gameId": game_id}
                )
            self.assertEqual(response.get_json(), {"result": "ok"})

            response = client.post(
                "/api/score-word",
                json = {"word": "ANT", "gameId": game_id}
                )
            self.assertEqual(response.get_json(), {"result": "ok"})

            response = client.post(
                "/api/score-word",
                json = {"word": "POPCORN", "gameId": game_id})
            self.assertEqual(response.get_json(), {"result": "not-on-board"})

            response = client.post(
                "/api/score-word",
                json = {"word": "ADSFLOL", "gameId": game_id})
            self.assertEqual(response.get_json(), {"result": "not-word"})
