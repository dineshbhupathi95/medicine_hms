# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from google.cloud import speech

class TranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        print(text_data)
        if text_data is not None:
            audio_data = json.loads(text_data)
            print(audio_data,'au')
            await self.transcribe_and_send(audio_data)

    async def transcribe_and_send(self, audio_data):
        client = speech.SpeechClient()

        audio = {"content": audio_data}  # Assuming audio data is sent in base64 format
        config = {
            "encoding": "LINEAR16",
            "sample_rate_hertz": 16000,
            "language_code": "en-US",
        }
        streaming_config = {"config": config, "single_utterance": True}

        stream = client.streaming_recognize(streaming_config, audio)

        async for response in stream:
            for result in response.results:
                transcription = result.alternatives[0].transcript
                await self.send_transcription(transcription)

    async def send_transcription(self, transcription):
        await self.send(text_data=json.dumps({"transcription": transcription}))
